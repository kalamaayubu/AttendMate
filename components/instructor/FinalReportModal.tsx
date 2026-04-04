import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { printToFileAsync } from "expo-print";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface FinalReportModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

function escapeHtml(s: string | undefined | null) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReportPdfHtml(data: any): string {
  const { enrollments, attendance } = data;
  const schedules = [
    ...new Map(
      (attendance || []).map((a: any) => [a.schedule_id, a.schedule]),
    ).values(),
  ].sort((a: unknown, b: unknown) => {
    const sa = a as { start_time: string };
    const sb = b as { start_time: string };
    return (
      new Date(sa.start_time).getTime() - new Date(sb.start_time).getTime()
    );
  });

  const denom = Math.max(1, schedules.length);

  const rows =
    (enrollments || []).map((enrollment: any, index: number) => {
      const student = enrollment.students;
      const attendedCount = (attendance || []).filter(
        (a: any) => a.student_id === student?.id,
      ).length;
      const attendanceRate = Math.round((attendedCount / denom) * 100);
      const name = student?.profiles?.full_name ?? "—";
      const reg = student?.reg_no ?? "—";
      return `<tr>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;">${index + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;">${escapeHtml(name)}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;">${escapeHtml(reg)}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;font-weight:600;">${attendanceRate}%</td>
      </tr>`;
    }) ?? [];

  const instructorName =
    enrollments?.[0]?.course?.instructor_courses?.[0]?.instructor?.profiles
      ?.full_name ?? "—";
  const courseName = enrollments?.[0]?.course?.course_name ?? "—";
  const courseCode = enrollments?.[0]?.course?.course_code ?? "—";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
    .meta { margin-bottom: 20px; line-height: 1.6; }
    .meta strong { color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f1f5f9; font-weight: 700; font-size: 13px; }
    td, th { border: 1px solid #cbd5e1; padding: 10px; }
  </style>
</head>
<body>
  <div class="meta">
    <div><strong>INSTRUCTOR:</strong> ${escapeHtml(instructorName)}</div>
    <div><strong>COURSE NAME:</strong> ${escapeHtml(courseName)}</div>
    <div><strong>COURSE CODE:</strong> ${escapeHtml(courseCode)}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:56px;">S/NO</th>
        <th>Student</th>
        <th>Reg No</th>
        <th style="width:100px;">Attendance</th>
      </tr>
    </thead>
    <tbody>${rows.join("")}</tbody>
  </table>
</body>
</html>`;
}

function suggestedPdfBaseName(data: any): string {
  const code = data?.enrollments?.[0]?.course?.course_code ?? "report";
  const safe = String(code).replace(/[^a-zA-Z0-9_-]+/g, "_");
  return `FinalReport_${safe}_${Date.now()}`;
}

async function savePdfToDevice(pdfUri: string, data: any): Promise<void> {
  const base = suggestedPdfBaseName(data);

  if (Platform.OS === "android") {
    try {
      const perm =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (perm.granted && perm.directoryUri) {
        const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
          perm.directoryUri,
          base,
          "application/pdf",
        );
        try {
          await FileSystem.copyAsync({ from: pdfUri, to: destUri });
        } catch {
          const b64 = await FileSystem.readAsStringAsync(pdfUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.writeAsStringAsync(destUri, b64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }
        Toast.show({
          type: "success",
          text1: "PDF saved",
          text2: "Saved to the folder you selected.",
        });
        return;
      }
    } catch {
      /* fall through to app storage */
    }
    if (FileSystem.documentDirectory) {
      const dest = `${FileSystem.documentDirectory}${base}.pdf`;
      await FileSystem.copyAsync({ from: pdfUri, to: dest });
      Toast.show({
        type: "success",
        text1: "PDF saved",
        text2: "Stored in app documents.",
      });
      return;
    }
  } else if (FileSystem.documentDirectory) {
    const dest = `${FileSystem.documentDirectory}${base}.pdf`;
    await FileSystem.copyAsync({ from: pdfUri, to: dest });
    Toast.show({
      type: "success",
      text1: "PDF saved",
      text2:
        "Stored in this app's documents (Files app on iOS if sharing is enabled).",
    });
    return;
  }

  throw new Error("No writable location for PDF.");
}

const COL = {
  border: "#cbd5e1",
  headerBg: "#f1f5f9",
};

const HEADER_SECTION = 56;
const META_SECTION = 72;
const PADDING_V = 24;
const MAX_ROW = 36;
/** Visible scrim between top of screen (below safe area) and the white sheet */
const TOP_SHEET_GAP = 10;

const FinalReportModal: React.FC<FinalReportModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [downloading, setDownloading] = React.useState(false);

  const tableModel = useMemo(() => {
    if (!data) return null;
    const { enrollments, attendance } = data;
    const schedules = [
      ...new Map(
        (attendance || []).map((a: any) => [a.schedule_id, a.schedule]),
      ).values(),
    ].sort((a: unknown, b: unknown) => {
      const sa = a as { start_time: string };
      const sb = b as { start_time: string };
      return (
        new Date(sa.start_time).getTime() - new Date(sb.start_time).getTime()
      );
    });
    const denom = Math.max(1, schedules.length);
    const list = (enrollments || []).filter(
      (e: any) => e?.students?.id != null,
    );
    return {
      enrollments: list,
      attendance: attendance || [],
      denom,
    };
  }, [data]);

  const layout = useMemo(() => {
    if (!tableModel)
      return { rowPadV: 10, fontBody: 14, fontMeta: 15, rowH: 24 };
    const rowCount = tableModel.enrollments.length + 1;
    const sheetTopMargin = insets.top + TOP_SHEET_GAP;
    const bottomPad = Math.max(insets.bottom, 16);
    const bodyBudget =
      windowHeight -
      sheetTopMargin -
      bottomPad -
      HEADER_SECTION -
      META_SECTION -
      PADDING_V * 2;
    let rowH = Math.floor(bodyBudget / Math.max(1, rowCount));
    rowH = Math.min(MAX_ROW, Math.max(1, rowH));
    const rowPadV = Math.max(2, Math.floor(rowH / 5));
    const fontBody = Math.max(9, Math.min(14, Math.floor(rowH * 0.48)));
    const fontMeta = Math.max(10, Math.min(15, fontBody + 1));
    return { rowPadV, fontBody, fontMeta, rowH };
  }, [tableModel, windowHeight, insets.top, insets.bottom]);

  const handleDownloadPdf = async () => {
    if (!data) return;
    try {
      setDownloading(true);
      const html = buildReportPdfHtml(data);
      const { uri } = await printToFileAsync({
        html,
        base64: false,
      });
      await savePdfToDevice(uri, data);
      onClose();
    } catch (e) {
      console.error("PDF export failed:", e);
      const msg = String(e);
      Toast.show({
        type: "error",
        text1: "Could not create PDF",
        text2:
          msg.includes("ExpoPrint") || msg.includes("native module")
            ? "Rebuild the app (expo run:android / ios) so expo-print is linked."
            : msg,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (!data || !tableModel) return null;

  const { enrollments, attendance, denom } = tableModel;
  const { rowPadV, fontBody, fontMeta } = layout;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={onClose}
    >
      <View className="flex-1 w-full bg-black/45">
        <View
          style={{
            flex: 1,
            width: "100%",
            marginTop: insets.top + TOP_SHEET_GAP,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: "hidden",
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View className="flex-row px-5 pt-3 pb-3 items-center justify-between border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              Final Report
            </Text>
            <View className="flex-row items-center gap-1">
              <TouchableOpacity
                onPress={handleDownloadPdf}
                disabled={downloading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ padding: 8, opacity: downloading ? 0.6 : 1 }}
                accessibilityLabel="Download PDF"
              >
                {downloading ? (
                  <ActivityIndicator color="#4f46e5" size="small" />
                ) : (
                  <Ionicons name="download-outline" size={26} color="#4f46e5" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-200/80 p-2 rounded-full"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
            <View style={[styles.metaBlock, { gap: 4 }]}>
              <Text style={[styles.metaLine, { fontSize: fontMeta }]}>
                <Text style={styles.metaBold}>INSTRUCTOR: </Text>
                {enrollments?.[0]?.course?.instructor_courses?.[0]?.instructor
                  ?.profiles?.full_name ?? "—"}
              </Text>
              <Text style={[styles.metaLine, { fontSize: fontMeta }]}>
                <Text style={styles.metaBold}>COURSE NAME: </Text>
                {enrollments?.[0]?.course?.course_name ?? "—"}
              </Text>
              <Text style={[styles.metaLine, { fontSize: fontMeta }]}>
                <Text style={styles.metaBold}>COURSE CODE: </Text>
                {enrollments?.[0]?.course?.course_code ?? "—"}
              </Text>
            </View>

            <View style={styles.tableOuter}>
              <View style={[styles.row, styles.headerRow]}>
                <Text
                  style={[
                    styles.cell,
                    styles.cellSno,
                    styles.headerText,
                    { paddingVertical: rowPadV, fontSize: fontBody - 1 },
                  ]}
                >
                  S/NO
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellStudent,
                    styles.headerText,
                    { paddingVertical: rowPadV, fontSize: fontBody - 1 },
                  ]}
                >
                  Student
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellReg,
                    styles.headerText,
                    { paddingVertical: rowPadV, fontSize: fontBody - 1 },
                  ]}
                >
                  Reg No
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellAtt,
                    styles.headerText,
                    { paddingVertical: rowPadV, fontSize: fontBody - 1 },
                  ]}
                >
                  Attendance
                </Text>
              </View>

              {enrollments.map((enrollment: any, index: number) => {
                const student = enrollment.students;
                const attendedCount = attendance.filter(
                  (a: any) => a.student_id === student.id,
                ).length;
                const attendanceRate = Math.round(
                  (attendedCount / denom) * 100,
                );
                const rateColor = attendanceRate >= 75 ? "#15803d" : "#b91c1c";

                return (
                  <View
                    key={student.id}
                    style={[
                      styles.row,
                      index % 2 === 1 ? styles.rowAlt : undefined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cell,
                        styles.cellSno,
                        styles.bodyText,
                        {
                          paddingVertical: rowPadV,
                          fontSize: fontBody,
                        },
                      ]}
                    >
                      {index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellStudent,
                        styles.bodyText,
                        {
                          paddingVertical: rowPadV,
                          fontSize: fontBody,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {student?.profiles?.full_name ?? "—"}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellReg,
                        styles.bodyText,
                        {
                          paddingVertical: rowPadV,
                          fontSize: fontBody,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {student?.reg_no ?? "—"}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellAtt,
                        styles.bodyText,
                        {
                          paddingVertical: rowPadV,
                          fontSize: fontBody,
                          color: rateColor,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {attendanceRate}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  metaBlock: {
    marginBottom: 12,
  },
  metaLine: {
    color: "#334155",
    lineHeight: 20,
  },
  metaBold: {
    fontWeight: "700",
    color: "#0f172a",
  },
  tableOuter: {
    borderWidth: 1,
    borderColor: COL.border,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: COL.border,
  },
  headerRow: {
    backgroundColor: COL.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: COL.border,
  },
  rowAlt: {
    backgroundColor: "#f8fafc",
  },
  cell: {
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: COL.border,
    justifyContent: "center",
  },
  cellSno: {
    width: 44,
    textAlign: "center",
  },
  cellStudent: {
    flex: 1,
    minWidth: 72,
  },
  cellReg: {
    width: 88,
  },
  cellAtt: {
    width: 84,
    borderRightWidth: 0,
    textAlign: "center",
  },
  headerText: {
    fontWeight: "700",
    color: "#334155",
  },
  bodyText: {
    color: "#334155",
  },
});

export default FinalReportModal;

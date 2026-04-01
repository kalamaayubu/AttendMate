import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Platform, Text, TouchableOpacity, View } from "react-native";

function coerceToDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function pickerSafeDate(d: Date | null | undefined): Date {
  if (d instanceof Date && !Number.isNaN(d.getTime())) return d;
  return new Date();
}

interface DateTimeFieldProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
  timeOnly?: boolean;
  /** When `timeOnly`, form field to copy the calendar day from (e.g. `"startTime"` for end time). */
  timeBaseFieldName?: string;
}

export default function DateTimeField({
  control,
  name,
  label,
  rules,
  timeOnly = false, // default to full date-time
  timeBaseFieldName,
}: DateTimeFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const baseForTimeOnly = useWatch({
    control,
    name: timeBaseFieldName ?? name,
    disabled: !timeOnly || !timeBaseFieldName,
  });

  const minimumDate = useMemo(() => new Date(), []);

  return (
    <View className="mb-5">
      <Text className="mb-1 font-semibold text-gray-700">{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange } }) => {
          const asDate = coerceToDate(value);

          return (
            <>
              <TouchableOpacity
                onPress={() =>
                  timeOnly ? setShowTimePicker(true) : setShowDatePicker(true)
                }
                className="flex-row items-center justify-between rounded-xl border border-gray-300 p-4 bg-gray-50"
              >
                <Text className={asDate ? "text-gray-700" : "text-gray-400"}>
                  {asDate
                    ? timeOnly
                      ? asDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : asDate.toLocaleString()
                    : `Select ${label.toLowerCase()}`}
                </Text>
                <Ionicons name="time-outline" size={20} color="#6366f1" />
              </TouchableOpacity>

              {/* --- Date Picker (only if not timeOnly) --- */}
              {!timeOnly && showDatePicker && (
                <DateTimePicker
                  value={pickerSafeDate(asDate ?? tempDate)}
                  mode="date"
                  display="default"
                  minimumDate={minimumDate}
                  onChange={(event, selectedDate) => {
                    const type = event?.type;
                    if (type === "dismissed") {
                      setShowDatePicker(false);
                      return;
                    }

                    if (type !== "set" || !selectedDate) {
                      if (Platform.OS === "android" && selectedDate == null) {
                        setShowDatePicker(false);
                      }
                      return;
                    }

                    if (Platform.OS === "android") {
                      setShowDatePicker(false);
                      setTempDate(selectedDate);
                      // Defer second picker so Android does not tear down + show dialog in one frame (native crash).
                      setTimeout(() => setShowTimePicker(true), 120);
                    } else {
                      setTempDate(selectedDate);
                      setShowDatePicker(false);
                      setShowTimePicker(true);
                    }
                  }}
                />
              )}

              {/* --- Time Picker (used for both modes) --- */}
              {showTimePicker ? (
                <DateTimePicker
                  testID={`${name}-time-picker`}
                  value={pickerSafeDate(
                    timeOnly
                      ? coerceToDate(baseForTimeOnly) ?? asDate ?? tempDate
                      : tempDate ?? asDate ?? null,
                  )}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  is24Hour={false}
                  onChange={(event, selectedTime) => {
                    const type = event?.type;
                    if (type === "dismissed") {
                      setShowTimePicker(false);
                      return;
                    }
                    // Android must dismiss the dialog immediately; iOS spinner may emit many "set" events.
                    if (Platform.OS === "android") {
                      setShowTimePicker(false);
                    }

                    if (type !== "set" || !selectedTime) return;

                    if (timeOnly) {
                      const base =
                        coerceToDate(baseForTimeOnly) ?? new Date();
                      const merged = new Date(base);
                      merged.setHours(selectedTime.getHours());
                      merged.setMinutes(selectedTime.getMinutes());
                      merged.setSeconds(0);
                      merged.setMilliseconds(0);
                      onChange(merged);
                    } else if (tempDate) {
                      const finalDate = new Date(tempDate);
                      finalDate.setHours(selectedTime.getHours());
                      finalDate.setMinutes(selectedTime.getMinutes());
                      finalDate.setSeconds(0);
                      finalDate.setMilliseconds(0);
                      onChange(finalDate);
                      setTempDate(null);
                    }
                  }}
                />
              ) : null}
            </>
          );
        }}
      />
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Tone = "indigo" | "green" | "orange" | "gray";

type AdminStatCardProps = {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  tone?: Tone;
};

const toneStyles: Record<
  Tone,
  { badgeBg: string; badgeBorder: string; value: string }
> = {
  indigo: {
    badgeBg: "rgba(99,102,241,0.12)",
    badgeBorder: "rgba(99,102,241,0.25)",
    value: "#3730a3",
  },
  green: {
    badgeBg: "rgba(34,197,94,0.12)",
    badgeBorder: "rgba(34,197,94,0.25)",
    value: "#15803d",
  },
  orange: {
    badgeBg: "rgba(249,115,22,0.12)",
    badgeBorder: "rgba(249,115,22,0.25)",
    value: "#c2410c",
  },
  gray: {
    badgeBg: "rgba(99,102,241,0.12)",
    badgeBorder: "rgba(148,163,184,0.30)",
    value: "#3730a3",
  },
};

export default function AdminStatCard({
  title,
  value,
  iconName,
  tone = "indigo",
}: AdminStatCardProps) {
  const t = toneStyles[tone];

  return (
    <View
      className="bg-white flex flex-col items-center justify-center rounded-xl p-5"
      style={{ width: 120, marginRight: 20 }}
    >
      <View className="flex-row items-start justify-between">
        <View
          style={{
            backgroundColor: t.badgeBg,
            borderColor: t.badgeBorder,
          }}
          className="w-11 h-11 rounded-xl border items-center justify-center"
        >
          <Ionicons name={iconName} size={20} color={t.value} />
        </View>
      </View>

      <Text className="mt-4 text-gray-500 text-xs font-semibold">{title}</Text>
      <Text className="mt-2 text-gray-900 text-3xl">{value}</Text>
    </View>
  );
}

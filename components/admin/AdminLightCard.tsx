import React from "react";
import { View } from "react-native";

export default function AdminLightCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: any;
}) {
  return (
    <View
      className={`bg-white rounded-2xl shadow-sm ${className}`}
      style={[{ elevation: 1, borderWidth: 1, borderColor: "#EEF2FF" }, style]}
    >
      {children}
    </View>
  );
}


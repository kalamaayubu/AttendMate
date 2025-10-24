/**
 * A reusable pull-to-refresh component
 * Accepts refreshing and onRefresh props directly
 */

import React from "react";
import { RefreshControl, RefreshControlProps } from "react-native";

export default function CustomRefreshControl({
  refreshing,
  onRefresh,
  ...rest
}: RefreshControlProps) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#6366f1"]} // Android spinner color (indigo-500)
      tintColor="#6366f1" // iOS spinner color
      progressViewOffset={10} // spinner position offset
      {...rest}
    />
  );
}

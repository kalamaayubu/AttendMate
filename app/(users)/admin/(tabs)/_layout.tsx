import { ProtectedLayout } from "@/components/general/ProtectedLayout";
import React from "react";
import { Text, View } from "react-native";

export default function AdminLayout() {
  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <View>
        <Text>AdminLayout</Text>
      </View>
    </ProtectedLayout>
  );
}

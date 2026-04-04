import { logout } from "@/utils/auth/logout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function StudentMoreMenuModal({ visible, onClose }: Props) {
  const router = useRouter();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View className="absolute bottom-[45px] w-full bg-white rounded-t-2xl shadow-lg pb-6 pt-3">
        <View className="w-12 h-1.5 bg-gray-300 self-center rounded-full mb-3" />

        <Pressable
          className="flex-row items-center px-5 py-3"
          onPress={() => {
            onClose();
            router.push("/student/notifications");
          }}
        >
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text className="ml-3 text-base text-gray-800">Profile</Text>
        </Pressable>

        <Pressable
          className="flex-row items-center px-5 py-3"
          onPress={() => {
            onClose();
            router.push("/student/schedules");
          }}
        >
          <Ionicons name="settings-outline" size={20} color="#333" />
          <Text className="ml-3 text-base text-gray-800">Settings</Text>
        </Pressable>

        <View className="h-px bg-gray-200 my-2" />

        <Pressable
          className="flex-row items-center px-5 py-3"
          onPress={() => {
            onClose();
            logout();
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#e11d48" />
          <Text className="ml-3 text-base text-red-600">Logout</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

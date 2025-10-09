import { logout } from "@/utils/auth/logout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HEADER_HEIGHT = 48;

interface CustomHeaderProps {
  title: string;
  backButton?: boolean; // <-- optional prop
}

export default function CustomHeader({ title, backButton }: CustomHeaderProps) {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <>
      {/* Top Header */}
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          height:
            (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) +
            HEADER_HEIGHT,
        }}
        className="bg-indigo-500 flex-row items-center px-4"
      >
        {/* Back button */}
        {backButton && (
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text className="text-white font-bold text-xl">{title}</Text>

        {/* Right: dropdown */}
        <View className="flex-1 items-end">
          <TouchableOpacity onPress={() => setDropdownVisible((prev) => !prev)}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <>
          <Pressable
            onPress={() => setDropdownVisible(false)}
            className="absolute inset-0 z-10"
          />
          <View
            className="absolute right-3 z-20 w-44 bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-2xl shadow-black py-1"
            style={{ top: HEADER_HEIGHT + 32 }}
          >
            <Pressable
              className="flex-row items-center px-3 py-2"
              onPress={() => {
                setDropdownVisible(false);
                router.push("/student/notifications");
              }}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color="#333"
                className="mr-2"
              />
              <Text className="text-sm text-gray-800">Profile</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center px-3 py-2"
              onPress={() => {
                setDropdownVisible(false);
                router.push("/student/schedules");
              }}
            >
              <Ionicons
                name="settings-outline"
                size={18}
                color="#333"
                className="mr-2"
              />
              <Text className="text-sm text-gray-800">Settings</Text>
            </Pressable>

            <View className="h-px bg-gray-200 my-1" />

            <Pressable
              className="flex-row items-center px-3 py-2"
              onPress={() => {
                setDropdownVisible(false);
                logout();
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color="#e11d48"
                className="mr-2"
              />
              <Text className="text-sm text-red-600">Logout</Text>
            </Pressable>
          </View>
        </>
      )}
    </>
  );
}

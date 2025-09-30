import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import "../global.css";
export default function RootLayout() {
  return (
    <View className="flex-1">
      {/* Top view */}
      <View className="text-2xl pt-32 bg-green-600 elevation-sm p-12 rounded-b-full scale-150 flex flex-col gap-8">
        <View className="flex px-6 gap-4 items-center justify-center mt-10">
          <View className="w-12 h-12 bg-gray-300 rounded-full relative">
            <View className="absolute bg-orange-500/85 size-10 top-1/4 left-1/4 rounded-full" />
          </View>
          <Text className="text-xl font-bold">AttendMate</Text>
          <Text
            className="text-gray-100 text-center text-xs leading-snug flex-wrap"
            style={{ letterSpacing: 1 }}
          >
            Designed for institutions and organizations that value accuracy,
            accountability, and efficiency.
          </Text>
        </View>
        <View className="flex flex-row gap-8 mb-4 m-auto">
          <FontAwesome5 name="graduation-cap" size={16} color="magenta" />
          <MaterialCommunityIcons
            name="account-group-outline"
            size={16}
            color="white"
          />
          <Feather name="clock" size={16} color="orange" />
        </View>
      </View>

      {/* Bottom view */}
      <View className="flex-1 justify-end p-6">
        <View className="gap-6 mb-20">
          <Text className="text-lg text-center text-gray-500">
            Get started and enjoy the experience
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            className="px-6 active:scale-95 transition-all duration-300 rounded-full bg-green-600 py-4"
          >
            <Text className="text-white text-center">Log in Here</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(auth)/signup")}
            className="active:scale-95 transition-all outline-none duration-300 bg-orange-500/15 rounded-full px-6 py-4"
          >
            <Text className="text-orange-500 text-center">
              Create a New Account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

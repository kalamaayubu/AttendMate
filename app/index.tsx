import { router } from "expo-router";
import React from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import "../global.css";
export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <View className="flex-1">
        {/* Top view */}
        <View className="text-2xl elevation-none flex flex-col gap-8">
          <View className="flex px-6 gap-4 items-center justify-center mt-10">
            <View className="w-10 h-10 bg-green-600 self-center mb-2 rounded-full relative">
              <View className="absolute bg-indigo-600/80 size-12 top-1/4 left-1/4 rounded-full" />
            </View>
            <Text className="text-2xl font-bold">AttendMate</Text>
            {/* <Text
              className="text-gray-500 text-xl text-center leading-snug flex-wrap"
              style={{ letterSpacing: 1 }}
            >
              Designed for institutions and organizations that value accuracy,
              accountability, and efficiency.
            </Text> */}
          </View>
        </View>

        {/* Bottom view */}
        <View className="flex-1 justify-end p-6 pb-0">
          <View className="gap-4 mb-20">
            <Text className="text-lg text-center text-gray-500">
              Get started and enjoy the experience
            </Text>
            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="px-6 active:scale-95 transition-all duration-300 rounded-full bg-green-600 py-4"
            >
              <Text className="text-white text-center">Log in Here</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/(auth)/signup")}
              className="active:scale-95 transition-all outline-none duration-300 bg-indigo-500/20 rounded-full px-6 py-4"
            >
              <Text className="text-indigo-500 text-center">
                Create a New Account
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

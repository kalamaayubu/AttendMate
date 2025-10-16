import { router } from "expo-router";
import LottieView from "lottie-react-native";
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
          <View className="flex px-6 gap-4 items-center justify-center mb-10 mt-20">
            <View className="w-10 h-10 bg-green-600 self-center mb-2 rounded-full relative">
              <View className="absolute bg-indigo-600/80 size-12 top-1/4 left-1/4 rounded-full" />
            </View>
            <Text className="text-2xl font-bold">AttendMate</Text>
          </View>
          {/* Simple illustration */}
          <LottieView
            source={require("../assets/home.json")}
            autoPlay={false}
            loop={false}
            style={{
              width: 320,
              height: 320,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
        </View>

        {/* Bottom view */}
        <View className="flex-1 justify-end p-6 pb-0">
          <View className="gap-4 mb-20">
            <Text className="text-lg text-center text-gray-500">
              Accurate • Timely • Modern • Efficient
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

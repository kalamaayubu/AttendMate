import StudentMoreMenuModal from "@/components/general/StudentMoreMenuModal";
import { useOptionalMoreMenu } from "@/components/general/MoreMenuContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HEADER_HEIGHT = 48;

interface CustomHeaderProps {
  title: string;
  backButton?: boolean;
}

export default function CustomHeader({ title, backButton }: CustomHeaderProps) {
  const router = useRouter();
  const moreMenu = useOptionalMoreMenu();
  const [sheetVisible, setSheetVisible] = useState(false);

  const openSheet = () => {
    if (moreMenu) {
      moreMenu.open();
    } else {
      setSheetVisible(true);
    }
  };

  return (
    <>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          height:
            (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) +
            HEADER_HEIGHT,
        }}
        className="bg-indigo-500 z-10 flex-row items-center px-4"
      >
        {backButton && (
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <Text className="text-white font-bold text-xl">{title}</Text>

        <View className="flex-1 items-end">
          <TouchableOpacity onPress={openSheet}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {!moreMenu && (
        <StudentMoreMenuModal
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
        />
      )}
    </>
  );
}

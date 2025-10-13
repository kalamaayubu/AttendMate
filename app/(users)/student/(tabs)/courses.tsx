import CustomHeader from "@/components/general/CustomHeader";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100 relative"
    >
      {/* ===== Header ===== */}
      <CustomHeader title="Courses" />

      <ScrollView contentContainerClassName="pb-10"></ScrollView>
    </SafeAreaView>
  );
}

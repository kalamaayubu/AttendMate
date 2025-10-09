import CustomHeader from "@/components/general/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

// Dummy schedule data
const schedules = {
  upcoming: [
    { id: "u1", title: "Yoga Class", datetime: "2025-10-05 • 09:00 AM" },
    {
      id: "u2",
      title: "Meditation Session",
      datetime: "2025-10-06 • 06:00 PM",
    },
  ],
  current: [
    { id: "c1", title: "Pilates", datetime: "2025-10-01 • 10:00 AM" },
    { id: "c2", title: "Zumba", datetime: "2025-09-25 • 05:00 PM" },
  ],
  past: [
    { id: "p1", title: "Spin Class", datetime: "2025-09-20 • 07:00 AM" },
    { id: "p2", title: "Cardio Blast", datetime: "2025-09-10 • 08:00 AM" },
  ],
};

// Reusable section
function ScheduleSection({
  title,
  data,
  color,
}: {
  title: string;
  data: { id: string; title: string; datetime: string }[];
  color: string;
}) {
  return (
    <View className="px-5 mb-8">
      <Text className="text-[16px] mb-3 font-semibold text-gray-700 tracking-wide">
        {title}
      </Text>

      {data.length === 0 ? (
        <Text className="text-gray-400 italic">No schedules</Text>
      ) : (
        data.map(({ id, title, datetime }) => (
          <View
            key={id}
            className="flex-row items-center rounded-2xl bg-white p-4 mb-3 shadow-sm border border-gray-100"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
          >
            <View
              className="rounded-full p-3 mr-3"
              style={{ backgroundColor: color + "20" }}
            >
              <Ionicons name="calendar-outline" size={20} color={color} />
            </View>

            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base">
                {title}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">{datetime}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        ))
      )}
    </View>
  );
}

// Top highlight card
function ScheduleSummary() {
  return (
    <View
      className="mx-5 mt-6 mb-8 p-5 rounded-2xl"
      style={{
        backgroundColor: "#ecfdf5",
        borderWidth: 1,
        borderColor: "#bbf7d0",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center mb-2">
        <Ionicons name="sparkles-outline" size={30} color="#16a34a" />
        <Text className="text-gray-800 text-lg font-semibold ml-3">
          Manage your schedules
        </Text>
      </View>
      <Text className="text-gray-600 leading-relaxed">
        Tap the <Text className="text-green-600 font-bold text-xl">＋</Text>{" "}
        button on the bottom right to create a new class schedule.
      </Text>
    </View>
  );
}

export default function Schedules() {
  return (
    <SafeAreaView edges={["left", "right"]} className="bg-gray-50 flex-1">
      {/* Header */}
      <CustomHeader title="Schedules" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ScheduleSummary />

        <ScheduleSection
          title="Upcoming"
          data={schedules.upcoming}
          color="#34D399"
        />
        <ScheduleSection
          title="Current"
          data={schedules.current}
          color="#6366F1"
        />
        <ScheduleSection title="Past" data={schedules.past} color="#9CA3AF" />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/instructor/addSchedules")}
        activeOpacity={0.7}
        className="absolute items-center z-30 justify-center w-14 h-14 bg-indigo-500/90 shadow-2xl shadow-green-600 bottom-8 right-6 rounded-full"
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

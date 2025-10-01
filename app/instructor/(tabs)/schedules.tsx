import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy schedule data
const schedules = {
  upcoming: [
    { id: "u1", title: "Yoga Class", datetime: "2025-10-05 09:00 AM" },
    { id: "u2", title: "Meditation Session", datetime: "2025-10-06 06:00 PM" },
  ],
  current: [
    { id: "c1", title: "Pilates", datetime: "2025-10-01 10:00 AM" },
    { id: "p1", title: "Zumba", datetime: "2025-09-25 05:00 PM" },
    { id: "p2", title: "Spin Class", datetime: "2025-09-20 07:00 AM" },
  ],
  past: [
    { id: "p1", title: "Zumba", datetime: "2025-09-25 05:00 PM" },
    { id: "p2", title: "Spin Class", datetime: "2025-09-20 07:00 AM" },
    { id: "c1", title: "Pilates", datetime: "2025-10-01 10:00 AM" },
    { id: "p7", title: "Zumba", datetime: "2025-09-25 05:00 PM" },
  ],
};

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
    <View className="px-4 py-8">
      <Text className="text-[15px] mb-3 font-semibold text-gray-600">
        {title}
      </Text>
      {data.length === 0 ? (
        <Text className="text-gray-400 italic">No schedules</Text>
      ) : (
        data.map(({ id, title, datetime }) => (
          <View
            key={id}
            className="flex-row bg-gray-50 rounded-xl p-4 mb-3 shadow-sm border-l-4"
            style={{ borderColor: color }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={color}
              className="mr-3"
            />
            <View>
              <Text className="font-semibold text-gray-800">{title}</Text>
              <Text className="text-gray-500 mt-1">{datetime}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// Fancy section
function ScheduleSummary() {
  return (
    <View className="mx-4 my-6 p-5 bg-green-100 rounded-xl shadow-xl border border-green-200">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="help-circle-outline"
          size={32}
          color="green"
          className="mr-3"
        />
        <Text className="text-gray-700 text-xl font-semibold">
          Want to add new schedule
        </Text>
      </View>
      <Text className="text-gray-600 text-base">
        Click the<Text className=" text-green-600 px-4"> + </Text>
        button on the top right conner to add a schedule.
      </Text>
    </View>
  );
}

export default function Schedules() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white flex-1">
      <View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 0,
            marginBottom: 0,
          }}
          stickyHeaderIndices={[0]}
        >
          {/* Header */}
          <View className="flex p-2 px-4 top-0 flex-row bg-white items-center justify-between">
            <Text className="font-semibold text-2xl text-gray-700">
              Schedules
            </Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => {
                  router.push("/instructor/addSchedules");
                  setDropdownVisible(!dropdownVisible);
                }}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={"green"}
                  className="rounded-full p-3 bg-green-100"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fancy Summary Card */}
          <ScheduleSummary />

          {/* The schedule sections */}
          <ScheduleSection
            title="Upcoming Schedules"
            data={schedules.upcoming}
            color="#34D399"
          />
          <ScheduleSection
            title="Current Schedules"
            data={schedules.current}
            color="#60A5FA"
          />
          <ScheduleSection
            title="Past Schedules"
            data={schedules.past}
            color="#9CA3AF"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

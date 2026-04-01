import { Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

type InstructorLineChartProps = {
  data: any;
  width: number;
  height?: number;
  title?: string;
};

export default function InstructorLineChart({
  data,
  width,
  height = 220,
  title = "Attendance Over the Year",
}: InstructorLineChartProps) {
  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-700 font-bold mb-2">{title}</Text>
      <View className="bg-white rounded-xl p-2 shadow">
        <LineChart
          data={data}
          width={width}
          height={height}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(22,163,74,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            propsForDots: { r: "4", strokeWidth: "0", stroke: "#16a34a" },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </View>
  );
}


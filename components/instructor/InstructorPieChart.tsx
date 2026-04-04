import { Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

type InstructorPieChartProps = {
  data: any[];
  width: number;
  height?: number;
  title?: string;
};

export default function InstructorPieChart({
  data,
  width,
  height = 200,
  title = "Attendance Distribution",
}: InstructorPieChartProps) {
  console.log("INSTRUCTOR DASHBOARD DAATA:", data);

  return (
    <View className="px-4 mt-4">
      <Text className="text-gray-700 font-bold mb-2">{title}</Text>
      <View className="bg-white rounded-xl p-2 shadow items-center">
        <PieChart
          data={data}
          width={width}
          height={height}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </View>
  );
}

import { Text, View } from "react-native";
import { ToastConfigParams, ToastType } from "react-native-toast-message";

const CustomToast = ({ text1, text2, type }: ToastConfigParams<any>) => {
  const typeStyles: Record<ToastType | string, string> = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <View
      className={`mx-auto px-4 py-2 w-5/6 rounded-md shadow-sm border border-white/50 ${style.replace(
        /text-[^ ]+/,
        ""
      )}`}
    >
      <Text className={`font-semibold ${style.split(" ")[1]} text-base`}>
        {text1}
      </Text>
      {text2 ? (
        <Text className={`${style.split(" ")[1]} text-sm mt-1`}>{text2}</Text>
      ) : null}
    </View>
  );
};

export default CustomToast;

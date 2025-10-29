import { useAuthDeepLink } from "@/utils/auth/useAuthDeepLink";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AuthCallbackScreen() {
  // 👇 Starts the exchange as soon as we land here
  useAuthDeepLink();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // light, clean background
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#4B5563", // subtle gray
    fontWeight: "500",
  },
});

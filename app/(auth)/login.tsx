import { LoginForm } from "@/types";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    // TODO: integrate with Supabase or backend
    alert(`Logged in as ${data.email}`);
    router.replace("/instructor/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center p-6 bg-white">
            <View className="w-12 h-12 bg-gray-300 self-center mb-4 rounded-full relative">
              <View className="absolute bg-orange-500/85 size-10 top-1/4 left-1/4 rounded-full" />
            </View>
            <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
              Log In
            </Text>

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Email"
                    value={value}
                    keyboardType="email-address"
                    onChangeText={onChange}
                    className={`${
                      errors.email && "border-red-500"
                    } border border-gray-300 rounded-full px-6 py-3 mb-2`}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-sm translate-x-2 -translate-y-1 mb-2">
                      {errors.email.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    value={value}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={onChange}
                    className={`${
                      errors.password && "border-red-500"
                    } border border-gray-300 rounded-full px-6 py-3 mb-2`}
                  />
                  {errors.password && (
                    <Text className="text-red-500 text-sm translate-x-2 -translate-y-1 mb-2">
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Submit */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-green-600 rounded-full py-4 active:scale-95 mt-4"
            >
              <Text className="text-center text-white font-semibold">
                Log In
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/signup")}
              className="mt-4"
            >
              <Text className="text-center">
                Don’t have an account?{" "}
                <Text className="text-green-600">Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

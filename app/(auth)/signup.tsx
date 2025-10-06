import { supabase } from "@/lib/supabase";
import { SignupForm } from "@/types";
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

export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Function to log sign up
  const onSubmit = async (data: SignupForm) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: "attendmate://callback",
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!session) {
      alert("Please check your inbox for email verification!");
    } else {
      router.replace("/instructor/home");
    }
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
          <View className="p-6 bg-white">
            <View className="w-12 h-12 bg-gray-300 self-center mb-4 rounded-full relative">
              <View className="absolute bg-orange-500/85 size-10 top-1/4 left-1/4 rounded-full" />
            </View>
            <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
              Create Account
            </Text>

            {/* Full name */}
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Full name"
                    value={value}
                    onChangeText={onChange}
                    className={` ${
                      errors.name && "border-red-500"
                    } border border-gray-300 rounded-full px-6 py-3 mb-2`}
                  />
                  {errors.name && (
                    <Text className="text-red-500 text-sm translate-x-2 -translate-y-1 mb-2">
                      {errors.name.message}
                    </Text>
                  )}
                </>
              )}
            />

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
                    className={` ${
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
                    onChangeText={onChange}
                    secureTextEntry
                    className={` ${
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

            {/* Submit button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting} // disables press while submitting
              className={`bg-green-600 rounded-full py-4 active:scale-95 ${
                isSubmitting ? "opacity-70" : ""
              }`}
            >
              {isSubmitting ? (
                <Text className="text-center text-white font-semibold">
                  Submitting...
                </Text>
              ) : (
                // OR use a spinner:
                // <ActivityIndicator color="#fff" />
                <Text className="text-center text-white font-semibold">
                  Sign Up
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/login")}
              className="mt-4"
            >
              <Text className="text-center">
                Already have an account?{" "}
                <Text className="text-green-600">Log in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

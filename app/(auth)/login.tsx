import { supabase } from "@/lib/supabase";
import { setUser } from "@/redux/userSlice";
import { LoginForm } from "@/types";
import { redirectBasedOnRole } from "@/utils/auth/redirectBasedOnRole";
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
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();

  // Function to log in
  const onSubmit = async (data: LoginForm) => {
    const { data: userData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
      console.log("Login error:", error.message);
      return; // Stop here if login failed
    }
    console.log("USERDATA::", userData.session.user.email);

    if (userData.session?.user) {
      const user = userData.session.user;

      dispatch(
        setUser({
          id: user.id,
          email: user.email || "", // Ensure email is a string
          role: user.user_metadata?.role || "member", // Default to 'member' if role is missing
          full_name: user.user_metadata.full_name || null,
        })
      ); // Set the user in Redux
      await redirectBasedOnRole(); // Redirect based on the role
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
          <View className="flex-1 justify-center p-6 bg-white">
            {/* Logo */}
            <View className="w-10 h-10 bg-green-600 self-center mb-8 rounded-full relative">
              <View className="absolute bg-indigo-600/80 size-12 top-1/4 left-1/4 rounded-full" />
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
                    placeholder="Enter your email"
                    placeholderTextColor={"#6B7280"}
                    importantForAutofill="no" // for Android to suppress the overlay
                    textContentType="emailAddress" // helps iOS autofill but keeps your style
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
                    placeholder="Enter your password"
                    placeholderTextColor={"#6B7280"}
                    secureTextEntry
                    onChangeText={onChange}
                    className={`${
                      errors.password && "border-red-500"
                    } border border-gray-300 text-gray-800 outline-none rounded-full px-6 py-3 mb-2`}
                  />
                  {errors.password && (
                    <Text className="text-red-500 text-sm translate-x-2 -translate-y-1 mb-2">
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Submit button*/}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting} // prevent pressing while submitting
              className={`bg-green-600 rounded-full py-4 active:scale-95 mt-4 ${
                isSubmitting ? "opacity-70" : ""
              }`}
            >
              {isSubmitting ? (
                <Text className="text-center text-white font-semibold">
                  Logging In...
                </Text>
              ) : (
                // Or show a spinner instead:
                // <ActivityIndicator color="#fff" />
                <Text className="text-center text-white font-semibold">
                  Log In
                </Text>
              )}
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

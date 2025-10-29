import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface DateTimeFieldProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
  timeOnly?: boolean;
}

export default function DateTimeField({
  control,
  name,
  label,
  rules,
  timeOnly = false, // default to full date-time
}: DateTimeFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  return (
    <View className="mb-5">
      <Text className="mb-1 font-semibold text-gray-700">{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <>
            <TouchableOpacity
              onPress={() =>
                timeOnly ? setShowTimePicker(true) : setShowDatePicker(true)
              }
              className="flex-row items-center justify-between rounded-xl border border-gray-300 p-4 bg-gray-50"
            >
              <Text className={value ? "text-gray-700" : "text-gray-400"}>
                {value
                  ? timeOnly
                    ? value.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : value.toLocaleString()
                  : `Select ${label.toLowerCase()}`}
              </Text>
              <Ionicons name="time-outline" size={20} color="#6366f1" />
            </TouchableOpacity>

            {/* --- Date Picker (only if not timeOnly) --- */}
            {!timeOnly && showDatePicker && (
              <DateTimePicker
                value={value instanceof Date ? value : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  // Only proceed if the user pressed "OK" (set), not canceled
                  if (event.type === "dismissed") {
                    setShowDatePicker(false);
                    return;
                  }

                  if (event.type === "set" && selectedDate) {
                    if (Platform.OS === "android") {
                      setShowDatePicker(false);
                      setTempDate(selectedDate);
                      setShowTimePicker(true); // Chain time selection
                    } else {
                      setTempDate(selectedDate);
                    }
                  }
                }}
              />
            )}

            {/* --- Time Picker (used for both modes) --- */}
            {showTimePicker &&
              (() => {
                const safeDateValue =
                  value instanceof Date
                    ? value
                    : tempDate instanceof Date
                    ? tempDate
                    : new Date();

                try {
                  return (
                    <DateTimePicker
                      testID={`${name}-time-picker`}
                      value={safeDateValue}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      is24Hour={false}
                      onChange={(event, selectedTime) => {
                        if (!event) return;
                        if (Platform.OS === "android") setShowTimePicker(false);

                        if (event?.type !== "set" || !selectedTime) return;

                        if (timeOnly) {
                          const startTime = control._formValues?.startTime;
                          const baseDate =
                            startTime instanceof Date
                              ? new Date(startTime)
                              : new Date();
                          baseDate.setHours(selectedTime.getHours());
                          baseDate.setMinutes(selectedTime.getMinutes());
                          onChange(baseDate);
                        } else if (tempDate) {
                          const finalDate = new Date(tempDate);
                          finalDate.setHours(selectedTime.getHours());
                          finalDate.setMinutes(selectedTime.getMinutes());
                          onChange(finalDate);
                        }
                      }}
                    />
                  );
                } catch (err) {
                  console.error("⚠️ DateTimePicker crashed:", err);
                  return null;
                }
              })()}
          </>
        )}
      />
    </View>
  );
}

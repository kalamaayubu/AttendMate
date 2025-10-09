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
  timeOnly?: boolean; // 👈 new prop
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
              <Ionicons name="time-outline" size={20} color="#16a34a" />
            </TouchableOpacity>

            {/* --- Date Picker (only if not timeOnly) --- */}
            {!timeOnly && showDatePicker && (
              <DateTimePicker
                value={value ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowDatePicker(false);
                    if (event.type === "set" && selectedDate) {
                      setTempDate(selectedDate);
                      setShowTimePicker(true); // Chain with time selection
                    }
                  } else if (selectedDate) {
                    setTempDate(selectedDate);
                  }
                }}
              />
            )}

            {/* --- Time Picker (used for both modes) --- */}
            {showTimePicker && (
              <DateTimePicker
                value={tempDate ?? value ?? new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour={false}
                onChange={(event, selectedTime) => {
                  if (Platform.OS === "android") setShowTimePicker(false);

                  if (event.type === "set" && selectedTime) {
                    if (timeOnly) {
                      onChange(selectedTime);
                    } else if (tempDate) {
                      // Concatenate selected date and time
                      const finalDate = new Date(tempDate);
                      finalDate.setHours(selectedTime.getHours());
                      finalDate.setMinutes(selectedTime.getMinutes());
                      onChange(finalDate);
                    }
                  }
                }}
              />
            )}
          </>
        )}
      />
    </View>
  );
}

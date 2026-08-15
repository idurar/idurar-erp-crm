import React from "react";
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, radius, shadow } from "./theme";

const SIZES = {
  sm: { paddingVertical: 9, paddingHorizontal: 14, fontSize: 13 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 },
} as const;

export function Button({
  title,
  onPress,
  color = colors.navy,
  variant = "solid",
  size = "md",
  loading = false,
  disabled = false,
}: {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  color?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}) {
  const isOutline = variant === "outline";
  const sizeStyle = SIZES[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { paddingVertical: sizeStyle.paddingVertical, paddingHorizontal: sizeStyle.paddingHorizontal },
        isOutline
          ? { backgroundColor: "transparent", borderWidth: 1.5, borderColor: color }
          : { backgroundColor: color, ...shadow.raised, shadowColor: color },
        (disabled || loading) && { opacity: 0.6, shadowOpacity: 0 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? color : colors.white} />
      ) : (
        <Text style={[styles.text, { fontSize: sizeStyle.fontSize, color: isOutline ? color : colors.white }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: { fontWeight: "700" },
});

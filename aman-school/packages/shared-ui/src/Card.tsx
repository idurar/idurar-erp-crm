import React, { PropsWithChildren } from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { colors, radius, shadow } from "./theme";

/** Elevated, softly-rounded surface used everywhere as the base building
 * block for lists/cards. Pass `onPress` to make the whole card tappable
 * (renders as a Pressable-style TouchableOpacity) without changing how any
 * existing call site that only passes `children`/`accentColor`/`style` looks. */
export function Card({
  children,
  accentColor,
  style,
  onPress,
  padding = 16,
}: PropsWithChildren<{
  accentColor?: string;
  style?: ViewStyle;
  onPress?: (e: GestureResponderEvent) => void;
  padding?: number;
}>) {
  const content = (
    <View
      style={[
        styles.card,
        { padding },
        accentColor ? { borderRightWidth: 4, borderRightColor: accentColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray100,
    marginBottom: 10,
    ...shadow.card,
  },
});

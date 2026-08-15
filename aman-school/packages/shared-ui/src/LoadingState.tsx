import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

/** Consistent centered spinner + label, replacing the ad hoc "جاري التحميل..."
 * text scattered across screens. */
export function LoadingState({ label = "جاري التحميل...", color = colors.navy }: { label?: string; color?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="small" color={color} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 32, gap: 10 },
  label: { fontSize: 12, color: colors.gray600 },
});

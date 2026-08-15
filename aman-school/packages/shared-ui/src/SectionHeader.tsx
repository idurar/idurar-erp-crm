import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "./theme";

export function SectionHeader({
  title,
  accentColor = colors.navy,
  right,
}: {
  title: string;
  accentColor?: string;
  /** Optional right-aligned slot (e.g. a "عرض الكل" link or a count badge). */
  right?: ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <View style={[styles.bar, { backgroundColor: accentColor }]} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, marginTop: 4 },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  bar: { width: 4, height: 16, borderRadius: radius.sm / 4 },
  title: { fontSize: 13, fontWeight: "700", color: colors.gray900 },
});

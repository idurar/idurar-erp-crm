import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "./theme";

/** Dark, rounded-bottom hero header used at the top of every role's home/
 * dashboard screen — an avatar/icon block, title, subtitle, and an optional
 * right-side action (usually the logout button), over a two-stop gradient. */
export function GradientHeader({
  gradient,
  title,
  subtitle,
  icon,
  right,
  children,
}: {
  gradient: readonly [string, string];
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {right}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 56,
    paddingBottom: 40,
    paddingHorizontal: 22,
    borderBottomLeftRadius: radius.hero,
    borderBottomRightRadius: radius.hero,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 36, height: 36, borderRadius: radius.md, backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.white },
  subtitle: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: "700" },
});

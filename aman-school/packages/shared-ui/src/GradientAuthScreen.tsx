import React, { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from "lucide-react-native";
import { colors, radius } from "./theme";

/** Full-gradient auth-flow screen shell (login step 1/step 2, PIN pad, OTP)
 * shared by every role's custom multi-step auth flow (parent OTP, supervisor
 * PIN, driver PIN) — matches EmailPasswordLoginScreen's visual language so
 * every login path in the app, regardless of auth method, reads as one
 * consistent gradient-hero design. */
export function GradientAuthScreen({
  gradient,
  icon,
  title,
  subtitle,
  onBack,
  children,
}: PropsWithChildren<{
  gradient: readonly [string, string];
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}>) {
  const router = useRouter();
  return (
    <LinearGradient colors={gradient} style={styles.wrap}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack ?? (() => router.back())} hitSlop={10}>
        <ChevronLeft size={24} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.center}>
        <View style={styles.iconBadge}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    </LinearGradient>
  );
}

export const gradientAuthStyles = StyleSheet.create({
  input: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: radius.lg, paddingHorizontal: 18,
    paddingVertical: 16, fontSize: 15, backgroundColor: "rgba(0,0,0,0.2)", color: colors.white, marginBottom: 16,
  },
  error: { color: "#FCA5A5", fontSize: 12, marginBottom: 14, textAlign: "center", fontWeight: "700" },
});

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, paddingTop: 60 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  center: { flex: 1, justifyContent: "center" },
  iconBadge: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 24,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.white, textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 12, color: "rgba(255,255,255,0.65)", textAlign: "center", marginBottom: 30, fontWeight: "700" },
});

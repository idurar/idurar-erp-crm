import { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bus } from "lucide-react-native";
import { colors } from "@aman-school/shared-ui";

const TODAY_AR = new Date().toLocaleDateString("ar-YE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 450, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, delay]);
  return <Animated.View style={[styles.dot, { opacity }]} />;
}

/** auth/splash: app's first frame — shown briefly by `index.tsx` before it
 * redirects to role-select or straight into a restored session's home. */
export function SplashScreen() {
  return (
    <LinearGradient colors={["#020617", "#172554", "#0F172A"]} locations={[0, 0.5, 1]} style={styles.wrap}>
      <View style={styles.badge}>
        <Bus size={40} color={colors.navy} />
      </View>
      <Text style={styles.title}>أمان سكول</Text>
      <Text style={styles.subtitle}>سلامة أبنائك، رحلة بعد رحلة</Text>
      <View style={styles.dotsRow}>
        <LoadingDot delay={0} />
        <LoadingDot delay={150} />
        <LoadingDot delay={300} />
      </View>
      <Text style={styles.date}>{TODAY_AR}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  badge: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: "#F39C12",
    alignItems: "center", justifyContent: "center", marginBottom: 18,
    shadowColor: "#F39C12", shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  title: { fontSize: 32, fontWeight: "800", color: colors.white, letterSpacing: 0.5 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: "600", marginBottom: 28 },
  dotsRow: { flexDirection: "row", gap: 8, marginBottom: 40 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#F39C12" },
  date: { position: "absolute", bottom: 36, fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: "600" },
});

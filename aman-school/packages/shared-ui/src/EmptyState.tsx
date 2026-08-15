import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

export function EmptyState({ icon = "📭", title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/** For screens marked "قيد التصميم" (in design) in the product spec — keeps navigation
 *  complete/crash-free while the full UI for that screen is still being finalized. */
export function ComingSoonScreen({ screenId, title }: { screenId: string; title: string }) {
  return (
    <EmptyState
      icon="🚧"
      title={title}
      subtitle={`${screenId} — هذه الشاشة قيد التصميم وسيتم استكمالها في تحديث لاحق`}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: 32, gap: 8 },
  icon: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 15, fontWeight: "700", color: colors.gray900, textAlign: "center" },
  subtitle: { fontSize: 12, color: colors.gray600, textAlign: "center" },
});

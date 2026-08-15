import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors } from "./theme";

/** Consistent "something went wrong" block with an optional retry action —
 * used for query error states instead of a screen silently showing nothing. */
export function ErrorState({
  title = "تعذّر تحميل البيانات",
  subtitle = "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onRetry ? (
        <View style={styles.retryWrap}>
          <Button title="إعادة المحاولة" variant="outline" size="sm" onPress={onRetry} color={colors.red} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: 32, gap: 6 },
  icon: { fontSize: 32, marginBottom: 4 },
  title: { fontSize: 14, fontWeight: "700", color: colors.gray900, textAlign: "center" },
  subtitle: { fontSize: 12, color: colors.gray600, textAlign: "center" },
  retryWrap: { marginTop: 10, minWidth: 160 },
});

import React, { PropsWithChildren } from "react";
import { I18nManager, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";

/** Aman School is RTL Arabic-first; call I18nManager.forceRTL(true) once at app boot. */
export function ScreenContainer({
  children,
  scroll = true,
  backgroundColor = colors.gray100,
  refreshing,
  onRefresh,
  refreshTintColor,
}: PropsWithChildren<{
  scroll?: boolean;
  backgroundColor?: string;
  /** Pass both refreshing+onRefresh to enable pull-to-refresh with no other changes. */
  refreshing?: boolean;
  onRefresh?: () => void;
  refreshTintColor?: string;
}>) {
  const Wrapper = scroll ? ScrollView : View;
  const refreshControl =
    scroll && onRefresh ? (
      <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={refreshTintColor ?? colors.navy} colors={[refreshTintColor ?? colors.navy]} />
    ) : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <Wrapper
        style={styles.flex}
        contentContainerStyle={scroll ? styles.content : undefined}
        refreshControl={refreshControl}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

export const isRTL = I18nManager.isRTL;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 16 },
});

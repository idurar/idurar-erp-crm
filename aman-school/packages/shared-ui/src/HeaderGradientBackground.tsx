import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/** Drop-in for a Stack screen's `headerBackground` option — paints the
 * native header bar with the same two-stop gradient used by that role's
 * hero dashboard header, so every sub-screen in the group reads as part of
 * the same gradient family instead of a flat solid color. */
export function HeaderGradientBackground({ gradient }: { gradient: readonly [string, string] }) {
  return <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />;
}

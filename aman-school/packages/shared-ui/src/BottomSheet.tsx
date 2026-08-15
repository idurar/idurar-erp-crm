import React, { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { colors, radius } from "./theme";

/** Slide-up sheet for confirmation/entry flows (e.g. reporting an absence,
 * confirming a delegate) — replaces full-screen navigation for short,
 * single-purpose interactions. Tapping the dimmed backdrop dismisses it. */
export function BottomSheet({ visible, onClose, children }: PropsWithChildren<{ visible: boolean; onClose: () => void }>) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.6)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: radius.hero, borderTopRightRadius: radius.hero,
    paddingTop: 12, paddingHorizontal: 24, paddingBottom: 36, maxHeight: "88%",
  },
  handle: { width: 48, height: 5, borderRadius: radius.pill, backgroundColor: colors.gray200, alignSelf: "center", marginBottom: 20 },
});

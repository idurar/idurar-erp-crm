import React, { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow } from "./theme";

type ToastType = "success" | "error";
interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {});

/** Global toast notification system — wrap the app root once with
 * <ToastProvider>, then call useToast() anywhere to surface a transient
 * slide-in confirmation instead of a blocking native Alert. */
export function ToastProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ToastState>({ visible: false, message: "", type: "success" });
  const translateY = useRef(new Animated.Value(-80)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setState({ visible: true, message, type });
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 9 }).start();
    hideTimer.current = setTimeout(() => {
      Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }).start(() => {
        setState((s) => ({ ...s, visible: false }));
      });
    }, 3000);
  }, [translateY]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {state.visible ? (
        <Animated.View pointerEvents="none" style={[styles.wrap, { transform: [{ translateY }] }]}>
          <View style={[styles.toast, state.type === "success" ? styles.success : styles.error]}>
            <Text style={styles.icon}>{state.type === "success" ? "✅" : "⚠️"}</Text>
            <Text style={styles.message}>{state.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 50, left: 16, right: 16, zIndex: 999 },
  toast: {
    flexDirection: "row", alignItems: "center", gap: 10, borderRadius: radius.xl,
    paddingVertical: 14, paddingHorizontal: 18, ...shadow.floating,
  },
  success: { backgroundColor: colors.greenMid },
  error: { backgroundColor: colors.red },
  icon: { fontSize: 18 },
  message: { color: colors.white, fontWeight: "700", fontSize: 13, flex: 1 },
});

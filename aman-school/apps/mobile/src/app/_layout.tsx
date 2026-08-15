import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "@aman-school/shared-ui";
import { queryClient } from "../lib/queryClient";
import { useSessionStore } from "../store/session";
import { ImpersonationBanner } from "../features/shared/ImpersonationBanner";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrate = useSessionStore((s) => s.hydrate);
  const hydrated = useSessionStore((s) => s.hydrated);

  useEffect(() => {
    hydrate().finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [hydrate]);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ImpersonationBanner />
          <Slot />
        </ToastProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

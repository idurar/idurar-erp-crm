import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useSessionStore } from "../store/session";
import { ROLE_HOME } from "../features/shared/roleHome";
import { SplashScreen } from "../features/shared/SplashScreen";

const SPLASH_DURATION_MS = 1200;

export default function Index() {
  const user = useSessionStore((s) => s.user);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;
  if (!user) return <Redirect href="/(auth)/role-select" />;
  return <Redirect href={(ROLE_HOME[user.role] ?? "/(auth)/role-select") as never} />;
}

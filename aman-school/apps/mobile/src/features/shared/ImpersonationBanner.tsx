import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import { colors } from "@aman-school/shared-ui";
import { useSessionStore } from "../../store/session";

/** owner-impersonate (§13): a persistent, unmissable banner rendered above
 * every screen while an impersonation session is active, so it's never
 * ambiguous that the current session isn't really the owner's own account. */
export function ImpersonationBanner() {
  const router = useRouter();
  const backup = useSessionStore((s) => s.impersonationBackup);
  const expiresAt = useSessionStore((s) => s.impersonationExpiresAt);
  const endImpersonation = useSessionStore((s) => s.endImpersonation);
  const targetName = useSessionStore((s) => s.user?.name);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!backup) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [backup]);

  useEffect(() => {
    if (backup && expiresAt && new Date(expiresAt).getTime() <= now) endImpersonation();
  }, [backup, expiresAt, now, endImpersonation]);

  if (!backup) return null;

  const remainingMs = expiresAt ? Math.max(0, new Date(expiresAt).getTime() - now) : 0;
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);

  function endAndReturn() {
    endImpersonation();
    router.replace("/(owner)/dashboard");
  }

  return (
    <View style={styles.wrap}>
      <ShieldAlert size={16} color={colors.white} />
      <Text style={styles.text} numberOfLines={1}>
        وضع الدعم الفني: {targetName ?? "..."} — {remainingMin}:{String(remainingSec).padStart(2, "0")}
      </Text>
      <TouchableOpacity style={styles.endBtn} onPress={endAndReturn}>
        <Text style={styles.endText}>إنهاء</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 999,
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.red, paddingHorizontal: 14, paddingVertical: 8,
  },
  text: { flex: 1, color: colors.white, fontSize: 12, fontWeight: "700" },
  endBtn: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  endText: { color: colors.white, fontSize: 12, fontWeight: "800" },
});

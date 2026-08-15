import { ReactNode, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Shield } from "lucide-react-native";
import { Button, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { HttpError } from "@aman-school/api-client";

type LoginFn = (email: string, password: string) => ReturnType<typeof api.auth.schoolAdminLogin>;

/** Shared full-gradient login screen for every email+password role
 * (school_admin, ops_room, owner, sysadmin, partner) — matches the
 * reference design's AdvancedLoginScreen (gradient backdrop, glass icon
 * badge, glass input fields, white pill submit button). */
export function EmailPasswordLoginScreen({
  title,
  subtitle,
  login,
  homeHref,
  gradient,
  icon,
}: {
  title: string;
  subtitle: string;
  login: LoginFn;
  homeHref: string;
  gradient: readonly [string, string];
  icon: ReactNode;
}) {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      await setSession(res);
      router.replace(homeHref as never);
    } catch (e) {
      setError(e instanceof HttpError ? String((e.body as { error?: string })?.error ?? "بيانات خاطئة") : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={gradient} style={styles.wrap}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
        <ChevronLeft size={24} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.center}>
        <View style={styles.iconBadge}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          <Shield size={12} color="rgba(255,255,255,0.6)" /> {subtitle}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="admin@amanschool.ye"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="دخول" onPress={onSubmit} loading={loading} disabled={!email || !password} size="lg" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, paddingTop: 60 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  center: { flex: 1, justifyContent: "center" },
  iconBadge: {
    width: 84, height: 84, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 24,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  title: { fontSize: 24, fontWeight: "800", color: colors.white, textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 12, color: "rgba(255,255,255,0.65)", textAlign: "center", marginBottom: 36, fontWeight: "700" },
  field: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: "800", color: "rgba(255,255,255,0.7)", marginBottom: 8, textTransform: "uppercase" },
  input: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: 16, paddingHorizontal: 18,
    paddingVertical: 16, fontSize: 15, backgroundColor: "rgba(0,0,0,0.2)", color: colors.white,
  },
  error: { color: "#FCA5A5", fontSize: 12, marginBottom: 14, textAlign: "center", fontWeight: "700" },
});

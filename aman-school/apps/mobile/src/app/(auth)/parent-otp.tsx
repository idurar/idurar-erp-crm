import { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { HttpError } from "@aman-school/api-client";

/** P-03: OTP verification. `devOtp` is only ever present outside production
 * (see backend auth.routes.ts) — pre-filled here purely to speed up demoing
 * without a real SMS gateway. */
export default function ParentOtpScreen() {
  const { phone, devOtp } = useLocalSearchParams<{ phone: string; devOtp?: string }>();
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const [code, setCode] = useState(devOtp ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.parentVerifyOtp(phone, code);
      await setSession(res);
      router.replace("/(parent)/home");
    } catch (e) {
      setError(e instanceof HttpError ? "رمز خاطئ أو منتهي الصلاحية" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.parent}
      icon={<ShieldAlert size={40} color={colors.white} />}
      title="التحقق الأمني"
      subtitle={`أرسلنا رمزاً إلى ${phone}`}
    >
      {devOtp ? <Text style={styles.devNote}>وضع التطوير: تم تعبئة الرمز تلقائياً ({devOtp})</Text> : null}
      <TextInput
        style={[gradientAuthStyles.input, styles.input]}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        placeholderTextColor="rgba(255,255,255,0.3)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="تأكيد" onPress={onSubmit} loading={loading} disabled={code.length !== 6} size="lg" />
    </GradientAuthScreen>
  );
}

const styles = StyleSheet.create({
  devNote: { fontSize: 11, color: "#FCD34D", textAlign: "center", marginBottom: 12, fontWeight: "700" },
  input: { textAlign: "center", fontSize: 26, letterSpacing: 10 },
});

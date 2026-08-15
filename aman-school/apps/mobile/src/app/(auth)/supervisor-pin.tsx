import { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { HttpError } from "@aman-school/api-client";

/** S-01 step 2: local PIN pad. */
export default function SupervisorPinScreen() {
  const { employeeCode } = useLocalSearchParams<{ employeeCode: string }>();
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.supervisorPinVerify(employeeCode, pin);
      await setSession(res);
      router.replace("/(supervisor)/trip-select");
    } catch (e) {
      setError(e instanceof HttpError ? "PIN خاطئ" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.supervisor}
      icon={<ShieldAlert size={40} color={colors.white} />}
      title="أدخل رمز PIN"
      subtitle={`الموظف: ${employeeCode}`}
    >
      <TextInput
        style={[gradientAuthStyles.input, styles.input]}
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        placeholder="••••"
        placeholderTextColor="rgba(255,255,255,0.3)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="دخول" onPress={onSubmit} loading={loading} disabled={pin.length < 4} size="lg" />
    </GradientAuthScreen>
  );
}

const styles = StyleSheet.create({
  input: { textAlign: "center", fontSize: 26, letterSpacing: 10 },
});

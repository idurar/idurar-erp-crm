import { useState } from "react";
import { Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Server } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { HttpError } from "@aman-school/api-client";

/** sa-login step 1: email + password, then routes to the mandatory 2FA step
 * (sysadmin is the one role with a hard 2FA requirement). */
export default function SysadminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.sysadminLogin(email.trim(), password);
      router.push({ pathname: "/(auth)/sysadmin-2fa", params: { email: res.email, devOtp: res.devOtp ?? "" } });
    } catch (e) {
      setError(e instanceof HttpError ? "بيانات خاطئة" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.sysadmin}
      icon={<Server size={40} color={colors.white} />}
      title="دخول مدير النظام"
      subtitle="أدخل بيانات حساب مدير النظام"
    >
      <TextInput
        style={[gradientAuthStyles.input, { marginBottom: 12 }]}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="sysadmin@amanschool.ye"
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      <TextInput
        style={[gradientAuthStyles.input, { marginBottom: 12 }]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="متابعة" onPress={onSubmit} loading={loading} disabled={!email || !password} size="lg" />
    </GradientAuthScreen>
  );
}

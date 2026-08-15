import { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

/** P-02: phone-only login, no password — requests an OTP then routes to P-03. */
export default function ParentLoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("+9677");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.parentRequestOtp(phone.trim());
      router.push({
        pathname: "/(auth)/parent-otp",
        params: { phone: phone.trim(), devOtp: (res as { devOtp?: string }).devOtp ?? "" },
      });
    } catch {
      setError("تعذر إرسال الرمز — تحقق من رقم الجوال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.parent}
      icon={<User size={40} color={colors.white} />}
      title="دخول ولي الأمر"
      subtitle="أدخل رقم جوالك (اليمن)"
    >
      <TextInput
        style={[gradientAuthStyles.input, styles.input]}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+967712345671"
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="متابعة" onPress={onSubmit} loading={loading} disabled={phone.length < 8} size="lg" />
    </GradientAuthScreen>
  );
}

const styles = StyleSheet.create({
  input: { textAlign: "center", fontSize: 17 },
});

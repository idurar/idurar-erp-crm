import { useState } from "react";
import { Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Smartphone } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { HttpError } from "@aman-school/api-client";

/** S-01 step 1: employee code lookup, then routes to the PIN pad. */
export default function SupervisorLoginScreen() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await api.auth.supervisorLogin(employeeCode.trim());
      router.push({ pathname: "/(auth)/supervisor-pin", params: { employeeCode: employeeCode.trim() } });
    } catch (e) {
      setError(e instanceof HttpError ? "رمز موظف غير صحيح" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.supervisor}
      icon={<Smartphone size={40} color={colors.white} />}
      title="دخول المشرف"
      subtitle="أدخل رمز الموظف"
    >
      <TextInput
        style={gradientAuthStyles.input}
        value={employeeCode}
        onChangeText={setEmployeeCode}
        autoCapitalize="characters"
        placeholder="EMP-1001"
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="متابعة" onPress={onSubmit} loading={loading} disabled={!employeeCode} size="lg" />
    </GradientAuthScreen>
  );
}

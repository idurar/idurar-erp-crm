import { useState } from "react";
import { Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Truck } from "lucide-react-native";
import { Button, GradientAuthScreen, colors, gradientAuthStyles, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { HttpError } from "@aman-school/api-client";

/* ---- D-01 step 1: driver employee code lookup, then routes to the PIN pad ---- */
export default function DriverLoginScreen() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await api.auth.driverLogin(employeeCode.trim());
      router.push({ pathname: "/(auth)/driver-pin", params: { employeeCode: employeeCode.trim() } });
    } catch (e) {
      setError(e instanceof HttpError ? "رمز موظف غير صحيح" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientAuthScreen
      gradient={roleGradients.driver}
      icon={<Truck size={40} color={colors.white} />}
      title="دخول السائق"
      subtitle="أدخل رمز الموظف"
    >
      <TextInput
        style={gradientAuthStyles.input}
        value={employeeCode}
        onChangeText={setEmployeeCode}
        autoCapitalize="characters"
        placeholder="DRV-1001"
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      {error ? <Text style={gradientAuthStyles.error}>{error}</Text> : null}
      <Button title="متابعة" onPress={onSubmit} loading={loading} disabled={!employeeCode} size="lg" />
    </GradientAuthScreen>
  );
}

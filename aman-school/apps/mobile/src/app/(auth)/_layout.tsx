import { Stack } from "expo-router";
import { colors } from "@aman-school/shared-ui";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="role-select" options={{ title: "أمان سكول", headerShown: false }} />
      <Stack.Screen name="consent" options={{ title: "الموافقة على الخصوصية", headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="supervisor-login" options={{ title: "دخول المشرف" }} />
      <Stack.Screen name="supervisor-pin" options={{ title: "رمز الدخول" }} />
      <Stack.Screen name="driver-login" options={{ title: "دخول السائق" }} />
      <Stack.Screen name="driver-pin" options={{ title: "رمز الدخول" }} />
      <Stack.Screen name="parent-login" options={{ title: "دخول ولي الأمر" }} />
      <Stack.Screen name="parent-otp" options={{ title: "التحقق" }} />
      <Stack.Screen name="school-login" options={{ title: "دخول مدير المدرسة" }} />
      <Stack.Screen name="ops-login" options={{ title: "دخول غرفة العمليات" }} />
      <Stack.Screen name="owner-login" options={{ title: "دخول مالك النظام" }} />
      <Stack.Screen name="sysadmin-login" options={{ title: "دخول مدير النظام" }} />
      <Stack.Screen name="sysadmin-2fa" options={{ title: "التحقق بخطوتين" }} />
      <Stack.Screen name="partner-login" options={{ title: "دخول الشريك" }} />
    </Stack>
  );
}

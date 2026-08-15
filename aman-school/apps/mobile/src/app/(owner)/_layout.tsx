import { Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout, useLogout } from "../../features/shared/RoleGuardLayout";

function LogoutHeaderButton() {
  const router = useRouter();
  const logout = useLogout();
  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={async () => {
        await logout();
        router.replace("/(auth)/role-select");
      }}
    >
      <Text style={{ color: colors.white, fontSize: 13, fontWeight: "700" }}>خروج</Text>
    </TouchableOpacity>
  );
}

export default function OwnerLayout() {
  return (
    <RoleGuardLayout allow={["owner"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.owner} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="schools" options={{ title: "إدارة المدارس" }} />
        <Stack.Screen name="onboarding" options={{ title: "معالج إطلاق مدرسة جديدة" }} />
        <Stack.Screen name="school/[id]" options={{ title: "تفاصيل المدرسة" }} />
        <Stack.Screen name="partners" options={{ title: "إدارة الشركاء" }} />
        <Stack.Screen name="packages" options={{ title: "الباقات والاشتراكات" }} />
        <Stack.Screen name="revenue" options={{ title: "الإيرادات والفوترة" }} />
        <Stack.Screen name="sub-lifecycle" options={{ title: "سياسة دورة حياة الاشتراك" }} />
        <Stack.Screen name="refunds" options={{ title: "طلبات الاسترداد" }} />
        <Stack.Screen name="partner-tiers" options={{ title: "مستويات عمولة الشركاء" }} />
        <Stack.Screen name="analytics" options={{ title: "تحليلات المنصة" }} />
        <Stack.Screen name="features" options={{ title: "الميزات التجريبية" }} />
        <Stack.Screen name="impersonate" options={{ title: "الدخول بحساب مدرسة" }} />
        <Stack.Screen name="settings" options={{ title: "إعدادات النظام", headerRight: LogoutHeaderButton }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
        <Stack.Screen name="users" options={{ title: "مستخدمو المنصة" }} />
        <Stack.Screen name="notifications" options={{ title: "الإشعارات التنفيذية" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

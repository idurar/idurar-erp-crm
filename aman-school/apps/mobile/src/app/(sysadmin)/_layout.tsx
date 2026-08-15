import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function SysadminLayout() {
  return (
    <RoleGuardLayout allow={["sysadmin", "owner"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.sysadmin} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="users" options={{ title: "إدارة المستخدمين" }} />
        <Stack.Screen name="roles" options={{ title: "الأدوار والصلاحيات" }} />
        <Stack.Screen name="servers" options={{ title: "حالة الخوادم" }} />
        <Stack.Screen name="logs" options={{ title: "سجلات النظام" }} />
        <Stack.Screen name="backup" options={{ title: "النسخ الاحتياطي" }} />
        <Stack.Screen name="security" options={{ title: "إعدادات الأمان" }} />
        <Stack.Screen name="config" options={{ title: "الإعدادات التقنية" }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

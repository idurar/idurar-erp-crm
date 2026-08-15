import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function OperationsLayout() {
  return (
    <RoleGuardLayout allow={["ops_room", "school_admin", "owner", "partner"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.ops_room} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="control-room" options={{ headerShown: false }} />
        <Stack.Screen name="map" options={{ title: "الخريطة المباشرة" }} />
        <Stack.Screen name="alerts" options={{ title: "إدارة التنبيهات" }} />
        <Stack.Screen name="incidents" options={{ title: "سجل الحوادث" }} />
        <Stack.Screen name="incident/[id]" options={{ title: "تفاصيل الحادثة" }} />
        <Stack.Screen name="not-collected" options={{ title: "حالات عدم استلام الطلاب" }} />
        <Stack.Screen name="communications" options={{ title: "التواصل" }} />
        <Stack.Screen name="daily-report" options={{ title: "تقرير اليوم" }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
        <Stack.Screen name="settings" options={{ title: "الإعدادات" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

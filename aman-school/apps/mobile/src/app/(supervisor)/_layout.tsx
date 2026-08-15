import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function SupervisorLayout() {
  return (
    <RoleGuardLayout allow={["supervisor"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.supervisor} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="trip-select" options={{ headerShown: false }} />
        <Stack.Screen name="student-list" options={{ title: "قائمة الطلاب" }} />
        <Stack.Screen name="scan" options={{ title: "مسح الطلاب", headerBackVisible: false }} />
        <Stack.Screen name="manual-entry" options={{ title: "إدخال يدوي" }} />
        <Stack.Screen name="live-status" options={{ title: "حالة الرحلة" }} />
        <Stack.Screen name="exception" options={{ title: "تسجيل حالة استثنائية" }} />
        <Stack.Screen name="end-trip" options={{ title: "إنهاء الرحلة" }} />
        <Stack.Screen name="report" options={{ title: "تقرير الرحلة" }} />
        <Stack.Screen name="history" options={{ title: "سجل الرحلات" }} />
        <Stack.Screen name="sos" options={{ title: "طوارئ", presentation: "modal" }} />
        <Stack.Screen name="notifications" options={{ title: "الإشعارات" }} />
        <Stack.Screen name="settings" options={{ title: "الإعدادات" }} />
        <Stack.Screen name="verify-pickup/[studentId]" options={{ title: "تأكيد هوية المستلم" }} />
        <Stack.Screen name="not-collected/[studentId]" options={{ title: "لم يُستلم الطالب", headerBackVisible: false }} />
        <Stack.Screen name="medical-alert/[studentId]" options={{ title: "طوارئ طبية" }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function SchoolLayout() {
  return (
    <RoleGuardLayout allow={["school_admin"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.school_admin} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="students" options={{ title: "إدارة الطلاب" }} />
        <Stack.Screen name="student/[id]" options={{ title: "تفاصيل الطالب" }} />
        <Stack.Screen name="import-students" options={{ title: "استيراد الطلاب من Excel" }} />
        <Stack.Screen name="invoices" options={{ title: "الفواتير" }} />
        <Stack.Screen name="payment-status" options={{ title: "حالة وسائل الدفع" }} />
        <Stack.Screen name="parents" options={{ title: "أولياء الأمور" }} />
        <Stack.Screen name="buses" options={{ title: "إدارة الباصات" }} />
        <Stack.Screen name="bus/[id]" options={{ title: "تفاصيل الباص" }} />
        <Stack.Screen name="bus-maintenance/[id]" options={{ title: "سجل الصيانة" }} />
        <Stack.Screen name="maintenance" options={{ title: "صيانة الأسطول" }} />
        <Stack.Screen name="drivers" options={{ title: "إدارة السائقين" }} />
        <Stack.Screen name="calendar" options={{ title: "التقويم الدراسي والعطل" }} />
        <Stack.Screen name="supervisors" options={{ title: "إدارة المشرفين" }} />
        <Stack.Screen name="supervisor/[id]" options={{ title: "تفاصيل المشرف" }} />
        <Stack.Screen name="routes" options={{ title: "إدارة المسارات" }} />
        <Stack.Screen name="live-trips" options={{ title: "متابعة الرحلات المباشرة" }} />
        <Stack.Screen name="reports" options={{ title: "التقارير والإحصائيات" }} />
        <Stack.Screen name="alerts" options={{ title: "التنبيهات والإشعارات" }} />
        <Stack.Screen name="settings" options={{ title: "إعدادات المدرسة" }} />
        <Stack.Screen name="profile" options={{ title: "ملف المدرسة" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

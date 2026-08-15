import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function ParentLayout() {
  return (
    <RoleGuardLayout allow={["parent"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.parent} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="add-student" options={{ title: "إضافة ابن" }} />
        <Stack.Screen name="child/[id]" options={{ title: "تفاصيل الابن" }} />
        <Stack.Screen name="medical/[id]" options={{ title: "الملف الطبي" }} />
        <Stack.Screen name="delegate/[id]" options={{ title: "تفويض استلام" }} />
        <Stack.Screen name="lost-nfc/[id]" options={{ title: "الإبلاغ عن فقدان السوار" }} />
        <Stack.Screen name="absence/[id]" options={{ title: "إبلاغ غياب" }} />
        <Stack.Screen name="tracking/[busId]" options={{ title: "التتبع المباشر" }} />
        <Stack.Screen name="trip-history/[id]" options={{ title: "سجل الرحلات" }} />
        <Stack.Screen name="notifications" options={{ title: "الإشعارات" }} />
        <Stack.Screen name="notification-settings" options={{ title: "إعدادات الإشعارات" }} />
        <Stack.Screen name="settings" options={{ title: "الإعدادات" }} />
        <Stack.Screen name="contact" options={{ title: "التواصل والدعم" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
        <Stack.Screen name="subscription" options={{ title: "الاشتراك والدفع" }} />
        <Stack.Screen name="invoices" options={{ title: "الفواتير" }} />
        <Stack.Screen name="payment-status" options={{ title: "حالة وسائل الدفع" }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

import { Stack } from "expo-router";
import { colors, HeaderGradientBackground, roleGradients } from "@aman-school/shared-ui";
import { RoleGuardLayout } from "../../features/shared/RoleGuardLayout";

export default function PartnerLayout() {
  return (
    <RoleGuardLayout allow={["partner"]}>
      <Stack
        screenOptions={{
          headerBackground: () => <HeaderGradientBackground gradient={roleGradients.partner} />,
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="schools" options={{ title: "مدارسي المُحالة" }} />
        <Stack.Screen name="commissions" options={{ title: "العمولات والأرباح" }} />
        <Stack.Screen name="leads" options={{ title: "العملاء المحتملون" }} />
        <Stack.Screen name="marketing" options={{ title: "حقيبة التسويق" }} />
        <Stack.Screen name="profile" options={{ title: "حسابي" }} />
        <Stack.Screen name="contact" options={{ title: "الدعم الفني" }} />
        <Stack.Screen name="about" options={{ title: "عن النظام" }} />
      </Stack>
    </RoleGuardLayout>
  );
}

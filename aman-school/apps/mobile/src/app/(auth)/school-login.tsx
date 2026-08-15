import { ShieldCheck } from "lucide-react-native";
import { colors, roleGradients } from "@aman-school/shared-ui";
import { EmailPasswordLoginScreen } from "../../features/auth/EmailPasswordLoginScreen";
import { api } from "../../lib/api";

export default function SchoolLoginScreen() {
  return (
    <EmailPasswordLoginScreen
      title="دخول مدير المدرسة"
      subtitle="أدخل بيانات حساب المدرسة"
      login={(email, password) => api.auth.schoolAdminLogin(email, password)}
      homeHref="/(school)/dashboard"
      gradient={roleGradients.school_admin}
      icon={<ShieldCheck size={40} color={colors.white} />}
    />
  );
}

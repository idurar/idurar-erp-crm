import { DollarSign } from "lucide-react-native";
import { colors, roleGradients } from "@aman-school/shared-ui";
import { EmailPasswordLoginScreen } from "../../features/auth/EmailPasswordLoginScreen";
import { api } from "../../lib/api";

export default function OwnerLoginScreen() {
  return (
    <EmailPasswordLoginScreen
      title="دخول مالك النظام"
      subtitle="أدخل بيانات حساب المالك"
      login={(email, password) => api.auth.ownerLogin(email, password)}
      homeHref="/(owner)/dashboard"
      gradient={roleGradients.owner}
      icon={<DollarSign size={40} color={colors.white} />}
    />
  );
}

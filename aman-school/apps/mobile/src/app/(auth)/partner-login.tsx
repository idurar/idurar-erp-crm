import { Handshake } from "lucide-react-native";
import { colors, roleGradients } from "@aman-school/shared-ui";
import { EmailPasswordLoginScreen } from "../../features/auth/EmailPasswordLoginScreen";
import { api } from "../../lib/api";

export default function PartnerLoginScreen() {
  return (
    <EmailPasswordLoginScreen
      title="دخول الشريك"
      subtitle="أدخل بيانات حساب الشريك"
      login={(email, password) => api.auth.partnerLogin(email, password)}
      homeHref="/(partner)/dashboard"
      gradient={roleGradients.partner}
      icon={<Handshake size={40} color={colors.white} />}
    />
  );
}

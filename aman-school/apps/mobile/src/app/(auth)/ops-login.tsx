import { Activity } from "lucide-react-native";
import { colors, roleGradients } from "@aman-school/shared-ui";
import { EmailPasswordLoginScreen } from "../../features/auth/EmailPasswordLoginScreen";
import { api } from "../../lib/api";

export default function OpsLoginScreen() {
  return (
    <EmailPasswordLoginScreen
      title="دخول غرفة العمليات"
      subtitle="أدخل بيانات حساب غرفة العمليات"
      login={(email, password) => api.auth.opsRoomLogin(email, password)}
      homeHref="/(operations)/control-room"
      gradient={roleGradients.ops_room}
      icon={<Activity size={40} color={colors.white} />}
    />
  );
}

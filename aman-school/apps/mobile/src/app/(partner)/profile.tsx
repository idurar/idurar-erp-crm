import { ProfileScreen } from "../../features/shared/ProfileScreen";
import { roleGradients } from "@aman-school/shared-ui";

export default function PartnerProfileScreen() {
  return <ProfileScreen accentColor={roleGradients.partner[0]} />;
}

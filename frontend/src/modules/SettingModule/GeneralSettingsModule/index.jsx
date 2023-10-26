import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import GeneralSettingForm from './forms/GeneralSettingForm';

export default function GeneralSettingsModule({ config }) {
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection title="Company" description="Update your company name and logo">
        <GeneralSettingForm />
      </SetingsSection>

      {/* <SetingsSection title="information" description="Update your company Email, phone and adress">
        <GeneralSettingForm />
      </SetingsSection>

      <SetingsSection title="Other details" description="Add your website and other links">
        <GeneralSettingForm />
      </SetingsSection> */}
    </UpdateSettingModule>
  );
}

import SetingsSection from '../components/SetingsSection';
import SettingModuleLayout from '../components/SettingModuleLayout';
import GeneralSettingForm from './forms/GeneralSettingForm';

export default function GeneralSettingsModule({ config }) {
  return (
    <SettingModuleLayout config={config}>
      <SetingsSection title="Company" description="Update your company name and logo">
        <GeneralSettingForm />
      </SetingsSection>

      {/* <SetingsSection title="information" description="Update your company Email, phone and adress">
        <GeneralSettingForm />
      </SetingsSection>

      <SetingsSection title="Other details" description="Add your website and other links">
        <GeneralSettingForm />
      </SetingsSection> */}
    </SettingModuleLayout>
  );
}

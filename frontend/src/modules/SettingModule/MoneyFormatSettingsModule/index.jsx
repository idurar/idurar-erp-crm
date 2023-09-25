import SetingsSection from '../components/SetingsSection';
import SettingModuleLayout from '../components/SettingModuleLayout';
import MoneyFormSettingForm from './forms/MoneyFormSettingForm';

export default function MoneyFormatSettingsModule({ config }) {
  return (
    <SettingModuleLayout config={config}>
      <SetingsSection title="Money Format" description="Update your money format">
        <MoneyFormSettingForm />
      </SetingsSection>
    </SettingModuleLayout>
  );
}

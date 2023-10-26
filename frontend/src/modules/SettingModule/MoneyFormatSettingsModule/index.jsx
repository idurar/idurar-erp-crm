import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import MoneyFormSettingForm from './forms/MoneyFormSettingForm';

export default function MoneyFormatSettingsModule({ config }) {
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection title="Money Format" description="Update your money format">
        <MoneyFormSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}

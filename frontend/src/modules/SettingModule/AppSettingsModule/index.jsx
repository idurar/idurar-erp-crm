import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import AppSettingForm from './forms/AppSettingForm';

export default function AppSettingsModule({ config }) {
  return (
    <UpdateSettingModule config={config} uploadSettingKey="app_logo" withUpload>
      <SetingsSection title="App logo" description="Update App logo">
        <AppSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}

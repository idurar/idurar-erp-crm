import UploadSection from '../components/UploadSection';
import UploadSettingModule from '../components/UploadSettingModule';
import AppSettingForm from './forms/AppSettingForm';

export default function AppSettingsModule({ config }) {
  return (
    <UploadSettingModule config={config}>
      <UploadSection
        config={config}
        title="App logo"
        settingKey="app_logo"
        description="Update App logo"
      >
        <AppSettingForm />
      </UploadSection>
    </UploadSettingModule>
  );
}

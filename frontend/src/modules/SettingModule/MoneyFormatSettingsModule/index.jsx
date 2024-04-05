import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import SettingsForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

export default function MoneyFormatSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Default Currency')}
        description={translate('Select Default Currency')}
      >
        <SettingsForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}

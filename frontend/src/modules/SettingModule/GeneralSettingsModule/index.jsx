import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import GeneralSettingForm from './forms/GeneralSettingForm';
import useLanguage from '@/locale/useLanguage';

export default function GeneralSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Company')}
        description={translate('Update your company informations')}
      >
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

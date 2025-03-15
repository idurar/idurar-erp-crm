import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import PdfSettingForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

export default function PdfSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('PDF Settings')}
        description={translate('Update PDF Settings')}
      >
        <PdfSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}

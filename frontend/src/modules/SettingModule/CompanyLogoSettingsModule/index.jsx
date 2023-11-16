import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import AppSettingForm from './forms/AppSettingForm';

import useLanguage from '@/locale/useLanguage';

export default function CompanyLogoSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config} uploadSettingKey="company_logo" withUpload>
      <SetingsSection
        title={translate('Company Logo')}
        description={translate('Update Company logo')}
      >
        <AppSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}

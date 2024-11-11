import { Avatar, Popover, Button, Badge, Col, List } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function UpgradeButton() {
  const translate = useLanguage();

  const Content = () => {
    return (
      <>
        <p>{translate('Do you need help customizing this app?')}</p>
        <Button
          type="primary"
          onClick={() => {
            window.open(`https://www.idurarapp.com/contact-us/`);
          }}
        >
          {translate('Contact us')}
        </Button>
      </>
    );
  };


console.log(
  '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
);

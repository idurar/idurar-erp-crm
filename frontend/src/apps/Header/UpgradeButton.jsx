import { Avatar, Badge, Button, Popover } from 'antd';

import { RocketOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

// import Notifications from '@/components/Notification';





export default function UpgradeButton() {
  const translate = useLanguage();
  const Content = () => {
    return (
      <>
        <p>{translate('Do you need help on customize of this app')}</p>
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

  return (
    <Popover content={<Content />} title={translate('Customize this application')} trigger="click">
      <Badge count={1} size="small">
        <Avatar
          icon={<RocketOutlined />}
          style={{
            color: '#f56a00',
            backgroundColor: '#FFF',
            float: 'right',
            marginTop: '5px',
            cursor: 'pointer',
          }}
        />
      </Badge>
    </Popover>
  );
}

//  console.log(
//    '🚀 Welcome to CIGNITI ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );

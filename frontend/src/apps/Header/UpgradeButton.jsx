import { Avatar, Popover, Button, Badge, Col, List } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

const SelfHostedPlan = () => {
  const features = [
    'Self-Hosted Premium Version',
    'ulimited Users',
    'Multi-Currency - ulimited currency',
    'Multi-Branch - ulimited branch',
    'Free 1 year update',
    '24/7 priority support',
  ];

  return (
    <List
      size="large"
      footer={
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            window.open('https://cloud.idurarapp.com/pricing');
          }}
        >
          Purchase Now
        </Button>
      }
      // bordered
      dataSource={features}
      renderItem={(item) => <List.Item style={{ textAlign: 'center' }}>{item}</List.Item>}
    />
  );
};

export default function UpgradeButton() {
  const translate = useLanguage();
  const Content = () => {
    return (
      <SelfHostedPlan />
      //   <p>{translate('Do you need help on customize of this app')}</p>
      //   <Button
      //     type="primary"
      //     onClick={() => {
      //       window.open(`https://www.idurarapp.com/contact-us/`);
      //     }}
      //   >
      //     {translate('Contact us')}
      //   </Button>
      // </>
    );
  };

  return (
    <Popover content={<Content />} trigger="click">
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

console.log(
  '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
);

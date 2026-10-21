import { Button, Badge } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

export default function UpgradeButton() {
  return (
    <Badge count={1} size="small">
      <Button
        type="primary"
        style={{
          float: 'right',
          marginTop: '5px',
          cursor: 'pointer',
          background: '#12559B',
          boxShadow: '0 2px 0 rgb(82 196 26 / 20%)',
        }}
        icon={<RocketOutlined />}
        onClick={() => {
          window.open('https://www.wiedesign.at', '_blank', 'noopener,noreferrer');
        }}
      >
        WIEpilot Support
      </Button>
    </Badge>
  );
}

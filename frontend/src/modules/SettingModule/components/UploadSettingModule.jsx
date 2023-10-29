import uniqueId from '@/utils/uinqueId';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Upload } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UploadSettingForm from './UploadSettingForm';

export default function UploadSettingModule({ config, children }) {
  return (
    <>
      <PageHeader
        title={config.SETTINGS_TITLE}
        ghost={false}
        extra={[
          <Button key={`${uniqueId()}`} type="primary" disabled icon={<SyncOutlined />}>
            Update
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Divider></Divider>
      {children}
    </>
  );
}

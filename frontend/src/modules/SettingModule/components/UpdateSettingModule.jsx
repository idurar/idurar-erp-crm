import uniqueId from '@/utils/uinqueId';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, PageHeader, Upload } from 'antd';
import UpdateSettingForm from './UpdateSettingForm';

export default function UpdateSettingModule({ config, children }) {
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
      <UpdateSettingForm config={config}>{children}</UpdateSettingForm>
    </>
  );
}

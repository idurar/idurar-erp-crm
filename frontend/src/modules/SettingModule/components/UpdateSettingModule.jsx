import { generate as uniqueId } from 'shortid';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Upload } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
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

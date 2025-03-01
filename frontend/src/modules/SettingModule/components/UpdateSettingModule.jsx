// import { generate as uniqueId } from 'shortid';
// import { SyncOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UpdateSettingForm from './UpdateSettingForm';

export default function UpdateSettingModule({
  config,
  children,
  withUpload = false,
  uploadSettingKey = null,
}) {
  return (
    <>
      <PageHeader
        title={config.SETTINGS_TITLE}
        ghost={false}
        // extra={[
        //   <Button key={`${uniqueId()}`} type="primary" disabled icon={<SyncOutlined />}>
        //     Update
        //   </Button>,
        // ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Divider></Divider>
      <UpdateSettingForm
        config={config}
        withUpload={withUpload}
        uploadSettingKey={uploadSettingKey}
      >
        {children}
      </UpdateSettingForm>
    </>
  );
}

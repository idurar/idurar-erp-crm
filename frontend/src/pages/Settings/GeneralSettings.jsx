import uniqueId from '@/utils/uinqueId';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, PageHeader, Upload } from 'antd';
import SetingsSection from './components/SetingsSection';
import GeneralSettingForm from './components/GeneralSettingForm';

export default function GeneralSettings() {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="General Settings"
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
      <Form labelCol={{ span: 6 }}  labelAlign="left"
    labelWrap wrapperCol={{ span: 18 }}>
        <SetingsSection title="Company" description="Update your company name and logo">
          <GeneralSettingForm />
        </SetingsSection>

        <SetingsSection
          title="information"
          description="Update your company Email, phone and adress"
        >
          <Form.Item label="Email">
            <Input placeholder="Company Email" />
          </Form.Item>
          <Form.Item label="Phone">
            <Input placeholder="Company Phone" />
          </Form.Item>
          <Form.Item label="Adress">
            <Input placeholder="Company Adress" />
          </Form.Item>
          <Form.Item label="Country">
            <Input placeholder="Country" />
          </Form.Item>
        </SetingsSection>

        <SetingsSection title="Other details" description="Add your website and other links">
          <Form.Item label="Wesite">
            <Input placeholder="Company website" />
          </Form.Item>
        </SetingsSection>
      </Form>
    </>
  );
}

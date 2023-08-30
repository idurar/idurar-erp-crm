import uniqueId from '@/utils/uinqueId';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Menu, PageHeader } from 'antd';
import SetingsSection from './components/SetingsSection';

export default function InvoiceSettings() {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Invoice Settings"
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
      <Form>
        <SetingsSection title="details" description="">
          <Form.Item label="Last invoice number">
            <Input placeholder="xxxxxx" />
          </Form.Item>
          <Form.Item label="Last quote number">
            <Input placeholder="xxxxxx" />
          </Form.Item>
        </SetingsSection>
      </Form>
    </>
  );
}

import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Typography, Upload } from 'antd';

const { Title, Text } = Typography;
export default function GeneralSettings() {
  return (
    <>
      <Title level={2} style={{ marginBottom: '0px' }}>
        General System
      </Title>
      <Text type="secondary">Update your company name and logo</Text>
      <Form>
        <Title level={3} style={{}}>
          Company
        </Title>
        <Text type="secondary">Update your company name and logo</Text>

        <Form.Item label="Input">
          <Input placeholder="Company Name" />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </>
  );
}

import { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Tag } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Paragraph } = Typography;

export default function EmailForm({ current = null }) {
  const translate = useLanguage();
  const [body, setBody] = useState(current?.emailBody);

  const displayLabels = (labels = []) => (
    <>
      {labels.map((label, index) => (
        <Tag key={`${index}-${index}`} onClick={() => setBody(body)} color="blue">
          {label}
        </Tag>
      ))}
    </>
  );

  const setBodyValue = (value) => {
    setBody(value);
    current.emailBody = value;
  };

  return (
    <Row>
      <Col className="gutter-row" span={24}>
        <span>{translate('Available Variables')} : </span>
        {displayLabels(current?.emailVariables)}
        <div className="space40"></div>

        <Form.Item label={translate('Subject')} name="emailSubject">
          <Input />
        </Form.Item>
        <Form.Item label={translate('email Content')} name="emailBody">
          <ReactQuill theme="snow" value={body} onChange={setBodyValue} />
        </Form.Item>
        <Paragraph type="success">
          {translate('To write a variable name use the convention')} {`{{variable}}`} e.g. name -{' '}
          {`{{name}}`}
        </Paragraph>
      </Col>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          {translate('Update')}
        </Button>
      </Form.Item>
    </Row>
  );
}

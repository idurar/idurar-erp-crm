import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, Typography, Tag } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlusOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function EmailForm({ current = null }) {
  const [body, setBody] = useState(current?.emailBody);

  const displayLabels = (labels = []) => (
    <>
      {labels.map((label) => (
        <Tag onClick={() => setBody(body)} color="blue">
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
    <>
      <Form.Item label="Available Variables">{displayLabels(current?.emailVariables)}</Form.Item>
      <Form.Item label="Subject" name="emailSubject">
        <Input />
      </Form.Item>
      <Form.Item label="Body" name="emailBody">
        <ReactQuill theme="snow" value={body} onChange={setBodyValue} />
      </Form.Item>
      <Paragraph type="success">
        To write a variable name use the convention {`{{variable}}`} for e.g. name - {`{{name}}`}
      </Paragraph>
      <Col className="gutter-row" span={5}>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
            Update Email template
          </Button>
        </Form.Item>
      </Col>
    </>
  );
}

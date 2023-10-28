import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Divider,
  Row,
  Col,
  Typography,
  Tag,
  Space,
} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/lang/useLanguage';

const { Paragraph } = Typography;

export default function EmailForm({ current = null }) {
  const [body, setBody] = useState(current?.emailBody);

  const displayLabels = (labels = []) => (
    <>
      {labels.map((label, index) => (
        <Tag key={index + '-' + label} onClick={() => setBody(body)} color="blue">
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
        {/* <Form.Item label=""></Form.Item> */}
        <span>Available Variables : </span>
        {displayLabels(current?.emailVariables)}
        <div className="space40"></div>

        <Form.Item label="Subject" name="emailSubject">
          <Input />
        </Form.Item>
        <Form.Item label="Body" name="emailBody">
          <ReactQuill theme="snow" value={body} onChange={setBodyValue} />
        </Form.Item>
        <Paragraph type="success">
          To write a variable name use the convention {`{{variable}}`} for e.g. name - {`{{name}}`}
        </Paragraph>
      </Col>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          Update
        </Button>
      </Form.Item>
    </Row>
  );
}

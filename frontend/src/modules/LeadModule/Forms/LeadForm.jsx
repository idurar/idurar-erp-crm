import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

export default function LeadForm() {
  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Please input First name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Please input Last name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input Email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input Phone Number!',
              },
            ]}
          >
            <Input type="tel" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Company"
            name="company"
            rules={[
              {
                required: true,
                message: 'Please input Lead Company!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[
              {
                required: true,
                message: 'Please input the Job Title!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={9}>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item label="Country" name="country">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="status"
            name="status"
            rules={[
              {
                required: false,
                message: 'Please input Lead status!',
              },
            ]}
            initialValue={'new'}
          >
            <Select
              options={[
                { value: 'new', label: 'New' },
                { value: 'reached', label: 'Reached' },
                { value: 'interested', label: 'Interest' },
                { value: 'not interested', label: 'Not Interest' },
              ]}
            ></Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={9}>
          <Form.Item label="Note" name="note">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item label="Source" name="source">
            <Input placeholder="ex: linkedin, website, ads..." />
          </Form.Item>
        </Col>
      </Row>

      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                Save Lead
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Modal, Select, Row, Col, Divider, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, ShopOutlined, IdcardOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

const { Option } = Select;

export default function LoginForm() {
  const translate = useLanguage();
  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupForm] = Form.useForm();

  // Show signup modal
  const showSignupModal = () => {
    setIsSignupModalVisible(true);
  };

  // Handle signup cancel
  const handleSignupCancel = () => {
    setIsSignupModalVisible(false);
    signupForm.resetFields();
  };

  // Handle signup submit
  const handleSignupSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log('Signup form values:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Account created successfully! Please check your email for verification.');
      setIsSignupModalVisible(false);
      signupForm.resetFields();
    } catch (error) {
      message.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength validator
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input your password!'));
    }

    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters long!'));
    }

    if (!/(?=.*[A-Z])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one uppercase letter!'));
    }

    if (!/(?=.*[a-z])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one lowercase letter!'));
    }

    if (!/(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one number!'));
    }

    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one special character (@$!%*?&)!'));
    }

    return Promise.resolve();
  };

  // Phone number validator (removed 91+10 digits rule)
  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input your phone number!'));
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Please enter a valid phone number (10-15 digits)!'));
    }

    return Promise.resolve();
  };

  // Confirm password validator
  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
  });

  return (
    <div>
      {/* EXISTING LOGIN FORM - COMPLETELY UNCHANGED */}
      <Form.Item
        label={translate('email')}
        name="email"
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={'admin@admin.com'}
          type="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        label={translate('password')}
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={'admin123'}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '0px' }}>
          {translate('Forgot password')}
        </a>
      </Form.Item>

      {/* Signup Button Added Below Existing Login Form */}
      <Form.Item>
        <Button 
          type="default" 
          style={{ width: '100%' }}
          onClick={showSignupModal}
        >
          {translate('Sign Up')}
        </Button>
      </Form.Item>

      {/* Signup Modal - Completely Separate from Login */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#1890ff' }}>
              <ShopOutlined /> Join IDURAR ERP/CRM
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Open Source ERP • CRM • Accounting • Invoice
            </p>
          </div>
        }
        open={isSignupModalVisible}
        onCancel={handleSignupCancel}
        footer={null}
        width={650}
        style={{ top: 20 }}
        destroyOnClose
      >
        <Alert
          message="Open Source ERP / CRM | Simple To Use"
          description="Get started with your enterprise management system. Manage invoices, quotes, customers and more."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          form={signupForm}
          name="signupForm"
          onFinish={handleSignupSubmit}
          layout="vertical"
          autoComplete="off"
          scrollToFirstError
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[
                  {
                    required: true,
                    message: 'Please input your company name!',
                  },
                  {
                    min: 2,
                    message: 'Company name must be at least 2 characters!',
                  },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input 
                  prefix={<ShopOutlined />}
                  placeholder="Your Company Name"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Business Type"
                name="businessType"
                rules={[
                  {
                    required: true,
                    message: 'Please select business type!',
                  },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Select placeholder="Select Business Type">
                  <Option value="retail">Retail</Option>
                  <Option value="wholesale">Wholesale</Option>
                  <Option value="manufacturing">Manufacturing</Option>
                  <Option value="services">Services</Option>
                  <Option value="ecommerce">E-commerce</Option>
                  <Option value="consulting">Consulting</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: 'Please input your full name!',
                  },
                  {
                    min: 2,
                    message: 'Full name must be at least 2 characters!',
                  },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input 
                  prefix={<UserOutlined />}
                  placeholder="Your Full Name"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                  {
                    validator: validatePhone,
                  },
                ]}
                style={{ marginBottom: 16 }}
                extra="Enter your phone number (10-15 digits)"
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="9876543210"
                  maxLength={15}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="ceo@company.com"
              type="email"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: validatePassword,
                  },
                ]}
                hasFeedback
                style={{ marginBottom: 16 }}
                extra="Min 8 chars with uppercase, lowercase, number & special character"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Create strong password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  validateConfirmPassword,
                ]}
                hasFeedback
                style={{ marginBottom: 16 }}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Checkbox>
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="newsletter"
            valuePropName="checked"
            style={{ marginBottom: 24 }}
          >
            <Checkbox defaultChecked>
              Send me product updates and announcements about IDURAR ERP/CRM
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              style={{ width: '100%' }} 
              icon={<IdcardOutlined />}
            >
              Create ERP Account
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              🚀 Self-hosted Enterprise Version: {' '}
              <a href="https://cloud.idurarapp.com" target="_blank" rel="noopener noreferrer">
                cloud.idurarapp.com
              </a>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
              Give a Star ⭐️ & Fork to this project ... Happy coding! 🤩
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
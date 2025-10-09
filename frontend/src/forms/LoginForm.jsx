import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Modal } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, UserAddOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function LoginForm() {
  const translate = useLanguage();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  // Robot verification handler
  const handleRobotVerification = (e) => {
    setIsRobotVerified(e.target.checked);
  };

  // Google login handler
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google';
  };

  // Simulate storing data in text file
  const storeDataInTextFile = async (filename, data) => {
    try {
      const response = await fetch('/api/store-text-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, data }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error storing data in text file:', error);
    }
  };

  // Store data in MongoDB
  const storeInMongoDB = async (payload) => {
    try {
      const response = await fetch('/api/store-mongodb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error('Error storing data in MongoDB:', error);
    }
  };

  return (
    <div>
      {/* Original Login Form - Preserved exactly as is */}
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

      {/* Robot Verification Checkbox - Added new feature */}
      <Form.Item>
        <Checkbox 
          checked={isRobotVerified}
          onChange={handleRobotVerification}
        >
          I'm not a robot
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '0px' }}>
          {translate('Forgot password')}
        </a>
      </Form.Item>

      {/* Login Button with robot verification check */}
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          style={{ width: '100%' }} 
          size="large"
          disabled={!isRobotVerified}
        >
          {translate('Login')}
        </Button>
      </Form.Item>

      {/* Google Login Button - Added new feature */}
      <Form.Item>
        <Button 
          type="default" 
          style={{ width: '100%' }} 
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </Form.Item>

      {/* Register Link - Added new feature */}
      <Form.Item>
        <div style={{ textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <Button 
            type="link" 
            onClick={() => setIsRegisterModalVisible(true)}
            icon={<UserAddOutlined />}
          >
            Register here
          </Button>
        </div>
      </Form.Item>

      {/* Register Modal - Added new feature */}
      <Modal
        title="Create New Account"
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          name="register"
          onFinish={async (values) => {
            if (!isRobotVerified) {
              Modal.error({
                title: 'Robot Verification Required',
                content: 'Please complete the robot verification to continue.',
              });
              return;
            }

            if (values.password !== values.confirmPassword) {
              Modal.error({
                title: 'Password Mismatch',
                content: 'Password and confirmation password do not match.',
              });
              return;
            }

            // Store registration data
            await storeDataInTextFile('register_data.txt', JSON.stringify({
              type: 'register',
              email: values.email,
              name: values.name,
              timestamp: new Date().toISOString(),
            }));

            await storeInMongoDB({
              collection: 'users',
              data: {
                name: values.name,
                email: values.email,
                password: values.password,
                role: 'user',
                createdAt: new Date(),
                status: 'active'
              }
            });

            setIsRegisterModalVisible(false);
          }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your full name!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="John Doe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
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
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="john@example.com"
              type="email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>

          {/* Robot Verification for Register */}
          <Form.Item>
            <Checkbox 
              checked={isRobotVerified}
              onChange={handleRobotVerification}
            >
              I'm not a robot
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }} 
              size="large"
              disabled={!isRobotVerified}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
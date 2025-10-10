import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Modal } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, UserAddOutlined, ReloadOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

// Simple CAPTCHA component
const SimpleCaptcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
  };

  // Initialize CAPTCHA on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    
    const verified = value.toLowerCase() === captchaText.toLowerCase();
    setIsVerified(verified);
    onVerify(verified);
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '6px', background: '#fafafa' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ 
          fontFamily: 'monospace', 
          fontSize: '24px', 
          fontWeight: 'bold', 
          letterSpacing: '3px',
          background: 'linear-gradient(45deg, #666, #000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '8px 12px',
          border: '1px dashed #d9d9d9',
          borderRadius: '4px'
        }}>
          {captchaText}
        </div>
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={generateCaptcha}
          title="Refresh CAPTCHA"
        />
      </div>
      <Input
        placeholder="Enter the text above"
        value={userInput}
        onChange={handleInputChange}
        status={userInput && !isVerified ? 'error' : ''}
        style={{ marginBottom: '8px' }}
      />
      {userInput && !isVerified && (
        <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
          CAPTCHA verification failed. Please try again.
        </div>
      )}
      {isVerified && (
        <div style={{ color: '#52c41a', fontSize: '12px' }}>
          ✓ CAPTCHA verified successfully
        </div>
      )}
    </div>
  );
};

// Google reCAPTCHA component (you'll need to install react-google-recaptcha)
const GoogleReCaptcha = ({ onVerify }) => {
  const [isVerified, setIsVerified] = useState(false);

  // For actual implementation, you'll need to:
  // 1. Install: npm install react-google-recaptcha
  // 2. Get reCAPTCHA site key from Google Cloud Console
  // 3. Import: import ReCAPTCHA from "react-google-recaptcha";
  
  const handleFakeVerification = () => {
    setIsVerified(true);
    onVerify(true);
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '6px', background: '#fafafa' }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Google reCAPTCHA
        </div>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '20px', 
          borderRadius: '4px',
          border: '1px dashed #d9d9d9'
        }}>
          [Google reCAPTCHA Widget]
          <div style={{ marginTop: '12px' }}>
            <Button 
              type="primary" 
              size="small"
              onClick={handleFakeVerification}
              disabled={isVerified}
            >
              {isVerified ? '✓ Verified' : 'Verify I\'m not a robot'}
            </Button>
          </div>
        </div>
      </div>
      {isVerified && (
        <div style={{ color: '#52c41a', fontSize: '12px', textAlign: 'center' }}>
          reCAPTCHA verification successful
        </div>
      )}
    </div>
  );
};

export default function LoginForm() {
  const translate = useLanguage();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [captchaType, setCaptchaType] = useState('simple'); // 'simple' or 'google'

  // CAPTCHA verification handler
  const handleCaptchaVerification = (verified) => {
    setIsRobotVerified(verified);
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

      {/* CAPTCHA Section - Replaced simple checkbox */}
      <Form.Item label="Security Verification">
        {/* CAPTCHA Type Selector */}
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <Button 
            type={captchaType === 'simple' ? 'primary' : 'default'} 
            size="small" 
            onClick={() => setCaptchaType('simple')}
            style={{ marginRight: '8px' }}
          >
            Simple CAPTCHA
          </Button>
          <Button 
            type={captchaType === 'google' ? 'primary' : 'default'} 
            size="small" 
            onClick={() => setCaptchaType('google')}
          >
            Google reCAPTCHA
          </Button>
        </div>

        {/* Render selected CAPTCHA type */}
        {captchaType === 'simple' ? (
          <SimpleCaptcha onVerify={handleCaptchaVerification} />
        ) : (
          <GoogleReCaptcha onVerify={handleCaptchaVerification} />
        )}
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '0px' }}>
          {translate('Forgot password')}
        </a>
      </Form.Item>

      {/* Login Button with CAPTCHA verification check */}
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

      {/* Google Login Button */}
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

      {/* Register Link */}
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

      {/* Register Modal */}
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
                title: 'Security Verification Required',
                content: 'Please complete the CAPTCHA verification to continue.',
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

          {/* CAPTCHA for Register */}
          <Form.Item label="Security Verification">
            <div style={{ marginBottom: '12px', textAlign: 'center' }}>
              <Button 
                type={captchaType === 'simple' ? 'primary' : 'default'} 
                size="small" 
                onClick={() => setCaptchaType('simple')}
                style={{ marginRight: '8px' }}
              >
                Simple CAPTCHA
              </Button>
              <Button 
                type={captchaType === 'google' ? 'primary' : 'default'} 
                size="small" 
                onClick={() => setCaptchaType('google')}
              >
                Google reCAPTCHA
              </Button>
            </div>

            {captchaType === 'simple' ? (
              <SimpleCaptcha onVerify={handleCaptchaVerification} />
            ) : (
              <GoogleReCaptcha onVerify={handleCaptchaVerification} />
            )}
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
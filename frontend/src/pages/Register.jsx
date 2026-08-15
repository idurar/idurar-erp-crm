// File: frontend/src/pages/Register.jsx
// FIXED VERSION - No duplicate imports

import React, { useState } from 'react';
import { Form, Button, Row, Col, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '@/forms/RegisterForm';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';

export default function Register() {
  const translate = useLanguage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('IN');

  React.useEffect(() => {
    setUserLocation('IN');
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      
      const response = await request.post('/register', registerData);
      
      if (response.success) {
        message.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        message.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px' }}>
        <Col xs={22} sm={18} md={14} lg={10} xl={8}>
          <div className="register-box" style={{ 
            background: '#fff',
            padding: '40px 30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <img 
                src="/logo.png" 
                alt="iDURAR" 
                style={{ width: 100, marginBottom: 10 }}
              />
              <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>
                {translate('Create Account')}
              </h1>
              <p style={{ color: '#666', marginTop: 8 }}>
                {translate('Free Open Source ERP / CRM')}
              </p>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={true}
              scrollToFirstError
            >
              <RegisterForm userLocation={userLocation} />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{ 
                    backgroundColor: '#48a9a6',
                    borderColor: '#48a9a6',
                    height: 48,
                    marginTop: 10
                  }}
                >
                  {translate('Sign Up')}
                </Button>
              </Form.Item>

              <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                <span style={{ color: '#666' }}>
                  {translate('Already have an account?')}
                </span>
                {' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#48a9a6',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  {translate('Sign In')}
                </Link>
              </Form.Item>

            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
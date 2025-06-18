import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  GlobalOutlined 
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';

// CSS styles directly in the component
const styles = `
  .register-form-container .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
    font-size: 15px;
  }

  .register-form-container .ant-input,
  .register-form-container .ant-input-password,
  .register-form-container .ant-select-selector {
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 16px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s ease;
  }

  .register-form-container .ant-input-affix-wrapper {
    padding: 0;
  }

  .register-form-container .ant-input-affix-wrapper .ant-input {
    padding: 10px 16px;
  }

  .register-form-container .ant-input-prefix {
    margin-right: 10px;
    color: #8c8c8c;
  }

  .register-form-container .ant-input:focus,
  .register-form-container .ant-input-focused,
  .register-form-container .ant-input-password:focus,
  .register-form-container .ant-input-password-focused,
  .register-form-container .ant-select-focused .ant-select-selector {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .register-form-container .ant-select-selector {
    height: 46px !important;
    display: flex;
    align-items: center;
  }

  .register-form-container .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
    color: #8c8c8c;
  }

  .register-form-container .ant-form-item-explain-error {
    font-size: 13px;
    margin-top: 6px;
    animation: fadeIn 0.3s ease-in-out;
  }

  .register-form-container .ant-input-password-icon {
    color: #8c8c8c;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .register-form-container .ant-form-item {
      margin-bottom: 18px;
    }
    
    .register-form-container .ant-input,
    .register-form-container .ant-input-password,
    .register-form-container .ant-select-selector {
      padding: 12px 14px;
      font-size: 15px;
    }
    
    .register-form-container .ant-input-prefix {
      margin-right: 8px;
    }
  }

  .country-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export default function RegisterForm({ userLocation }) {
  const translate = useLanguage();
  
  return (
    <div className="register-form-container">
      <style>{styles}</style>
      
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <Form.Item
            name="name"
            label={translate('name')}
            rules={[{ required: true }]}
            hasFeedback
          >
            <Input 
              prefix={<UserOutlined className="text-primary" />}
              size="large"
              placeholder={translate('your_full_name')}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="email"
            label={translate('email')}
            rules={[
              { required: true },
              { type: 'email', message: translate('valid_email_required') }
            ]}
            hasFeedback
          >
            <Input
              prefix={<MailOutlined className="text-primary" />}
              type="email"
              size="large"
              placeholder="example@domain.com"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="password"
            label={translate('password')}
            rules={[{ required: true }]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="text-primary" />} 
              size="large"
              placeholder={translate('secure_password')}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="confirm_password"
            label={translate('confirm_password')}
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(translate('password_mismatch_error'))
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="text-primary" />} 
              size="large"
              placeholder={translate('confirm_your_password')}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label={translate('country')}
            name="country"
            rules={[{ required: true }]}
            initialValue={userLocation}
            hasFeedback
          >
            <Select
              showSearch
              placeholder={translate('select_country')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              size="large"
              suffixIcon={<GlobalOutlined className="text-primary" />}
              className="w-full"
            >
              {countryList.map((country) => (
                <Select.Option
                  key={country.value}
                  value={country.value}
                  label={translate(country.label)}
                >
                  <div className="country-option">
                    {country?.icon && <span>{country.icon}</span>}
                    <span>{translate(country.label)}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
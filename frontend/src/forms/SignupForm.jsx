import { Form, Input } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function SignupForm() {
  const translate = useLanguage();
  
  return (
    <>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          {
            required: true,
            message: translate('Please input your name!'),
          },
          {
            min: 2,
            message: translate('Name must be at least 2 characters!'),
          },
          {
            whitespace: true,
            message: translate('Name cannot be empty!'),
          },
        ]}
        hasFeedback
      >
        <Input 
          placeholder={translate('Enter your name')}
          autoComplete="name"
        />
      </Form.Item>
      
      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
            message: translate('Please input your email!'),
          },
          {
            type: 'email',
            message: translate('Please enter a valid email!'),
          },
        ]}
        hasFeedback
      >
        <Input 
          placeholder={translate('Enter your email')}
          autoComplete="email"
        />
      </Form.Item>
      
      <Form.Item
        label={translate('Password')}
        name="password"
        rules={[
          {
            required: true,
            message: translate('Please input your password!'),
          },
          {
            min: 6,
            message: translate('Password must be at least 6 characters!'),
          },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
            message: translate('Password must contain both letters and numbers!'),
          },
        ]}
        hasFeedback
      >
        <Input.Password 
          placeholder={translate('Enter your password')}
          autoComplete="new-password"
        />
      </Form.Item>
      
      <Form.Item
        label={translate('Confirm Password')}
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: translate('Please confirm your password!'),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(translate('Passwords do not match!')));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password 
          placeholder={translate('Confirm your password')}
          autoComplete="new-password"
        />
      </Form.Item>
    </>
  );
}
}
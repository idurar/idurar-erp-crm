import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { selectAuth } from '@/redux/auth/selectors';
import { register } from '@/redux/auth/actions'; // check if this action exists
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const RegisterPage = () => {
  const translate = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectAuth);

  const onFinish = (values) => {
    dispatch(register({ registerData: values })); // sends registration data
  };

  // Redirect after successful registration
  if (isSuccess) navigate('/');

  return (
    <AuthModule
      AUTH_TITLE={translate('Create Account')}
      authContent={
        <Loading isLoading={isLoading}>
          <Form
            layout="vertical"
            name="register_form"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label={translate('First Name')}
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={translate('Last Name')}
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={translate('Email')}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={translate('Password')}
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={translate('Confirm Password')}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                {translate('Register')}
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" block onClick={() => navigate('/login')}>
                {translate('Already have an account? Log in')}
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      }
    />
  );
};

export default RegisterPage;
// import { Link } from 'react-router-dom';

// function LoginForm() {
//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form>
//         {/* Existing email + password inputs */}
//         <button type="submit">Login</button>

//         {/* 🆕 Add this line */}
//         <p className="text-sm mt-3">
//           Don’t have an account?{' '}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Register here
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

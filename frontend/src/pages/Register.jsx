import { Form, Button, Input } from "antd";
import { Link } from "react-router-dom";
import useLanguage from "@/locale/useLanguage";

const RegisterPage = () => {
  const translate = useLanguage();

  const onFinish = (values) => {
    console.log("Register values:", values);
    // 👉 Later: hook into backend register API
  };

  return (
    <div className="register-container">
      <h2>{translate("Register")}</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate("Register")}
          </Button>
        </Form.Item>
      </Form>

      <p>
        {translate("Already have an account?")}{" "}
        <Link to="/login">{translate("Login here")}</Link>
      </p>
    </div>
  );
};

export default RegisterPage;

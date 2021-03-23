import React from "react";
import { Button, Form, Input } from "antd"
import { addNewCustomer } from "../redux/customer/actions";
import { connect } from "react-redux";


const FormCustomer = ({addNewCustomer}) => {
  const [form] = Form.useForm();

  const onFinish = (item) => {
    console.log("fieldsValues", item);
    // switch the new customer to reducer Redux
    addNewCustomer(item);
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return(
    <>
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={onFinish}
      >
        <Form.Item
          label="company Name"
          name="company"
          rules={[
            {
              required: true,
              message: "Please input your company name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sur Name"
          name="managerSurname"
          rules={[
            {
              required: true,
              message: "Please input your surname!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="managerName"
          rules={[
            {
              required: true,
              message: "Please input your manager name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewCustomer: item => dispatch(addNewCustomer(item)),
  };
};

export default connect(null, mapDispatchToProps)(FormCustomer) ;
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { selectAuth } from '@/redux/auth/selectors';
import { Result, Button, Input, Space, Form, Select } from 'antd';
import { verify as verifyAction } from '@/redux/auth/actions';

import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import Loading from '@/components/Loading';

function Survey({ current }) {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const translate = useLanguage();
  const { onFetch, isSuccess, isLoading } = useOnFetch();
  const navigate = useNavigate();

  async function postData(data) {
    return await request.create({ entity: 'survey', jsonData: data });
  }

  const onFinish = (values) => {
    let surveyData = {};
    let result = [];
    Object.entries(values).forEach(([key, value]) => {
      result.push({ question: key, answer: value });
    });
    surveyData.result = result;
    surveyData.user = current._id;
    console.log('🚀 ~ onFinish ~ surveyData:', surveyData);
    const callback = postData(surveyData);
    onFetch(callback);
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="are_you"
          label="Are you ?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{
              width: '100%',
            }}
            options={[
              { value: 'Freelance Developer', label: 'Freelance Developer' },
              { value: 'Software Company', label: 'Software Company' },
              { value: 'Company (All kind of business)', label: 'Company (All kind of business)' },
              { value: 'Student', label: 'Student' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="version"
          label="How you want to use IDURAR ERP CRM ?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{
              width: '100%',
            }}
            options={[
              { value: 'online - one click deployement', label: 'Online (one click deployement)' },
              {
                value: 'Self-hosted',
                label: 'Self-hosted (Require Tech Skills & Server & Database)',
              },
              { value: 'Both : online and self-hosted', label: 'Both : online and self-hosted' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="industry"
          label="In witch Industry you want use IDURAR ERP CRM ?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
            }
            options={[
              { value: 'Aerospace', label: 'Aerospace' },
              { value: 'Automobile', label: 'Automobile' },
              { value: 'Banking & Insurance', label: 'Banking  & Insurance' },
              { value: 'Biotechnology', label: 'Biotechnology' },
              { value: 'Chimical', label: 'Chimical' },
              { value: 'Clothing & Textiles', label: 'Clothing & Textiles' },
              { value: 'Cosmetics', label: 'Cosmetics' },
              { value: 'Consulting', label: 'Consulting' },
              { value: 'Construction', label: 'Construction' },
              { value: 'Defense', label: 'Defense' },
              { value: 'Distribution', label: 'Distribution' },
              { value: 'Electronics', label: 'Electronics' },
              { value: 'Energy', label: 'Energy' },
              { value: 'E-commerce', label: 'Ecommerce / E-commerce' },
              { value: 'Entertainment', label: 'Entertainment' },
              { value: 'Education & School', label: 'Education & School' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Food & Beverages', label: 'Food & Beverages' },
              {
                value: 'Jewelry & watches',
                label: 'Jewelry & watches',
              },
              { value: 'Healthcare', label: 'Healthcare , Hospital & Clinic' },
              { value: 'Hotel', label: 'Hotel' },
              { value: 'Logistics', label: 'Logistics' },
              { value: 'non profit & charities', label: 'non profit & charities' },
              { value: 'Maritime & Fishing', label: 'Maritime & Fishing' },
              { value: 'Manufacturing', label: 'Manufacturing' },
              { value: 'Pet', label: 'Pet' },
              { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
              { value: 'Photography', label: 'Photography' },
              { value: 'Print & Editon', label: 'Print & Editon' },
              { value: 'Professional Services', label: 'Professional Services' },
              { value: 'Real Estate', label: 'Real Estate' },
              { value: 'Retail', label: 'Retail' },
              { value: 'Restaurant & Cafe', label: 'Restaurant & Cafe' },
              { value: 'Sport', label: 'Sport' },
              { value: 'Travel & Tourism', label: 'Travel & Tourism' },
              { value: 'Trading & Import Export', label: 'Trading & Import Export' },
              { value: 'Telecommunications', label: 'Telecommunications' },
              { value: 'Transportation', label: 'Transportation' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="problem"
          label="What's problem you are trying to solve by using ERP CRM ?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        {/* <Form.Item
          name="features"
          label="What's features you are looking for ?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea />
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}

const Verify = () => {
  const translate = useLanguage();
  const { userId, emailToken } = useParams();
  const { isLoading, isSuccess, current } = useSelector(selectAuth);

  const [verfied, setVerified] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  function asyncVerify() {
    dispatch(verifyAction({ userId, emailToken }));
  }

  useEffect(() => {
    if (isSuccess) setVerified(true);
  }, [isSuccess]);

  if (!verfied) {
    return (
      <Result
        status="info"
        title={translate('Verify your account')}
        subTitle={translate(
          'Complete verification by providing the code that you received by email'
        )}
        extra={
          <Loading isLoading={isLoading}>
            <Space>
              <Input value={emailToken} style={{ width: 150 }} />
              <Button
                type="primary"
                onClick={() => {
                  asyncVerify();
                }}
              >
                {translate('Verify now')}
              </Button>
            </Space>
          </Loading>
        }
      ></Result>
    );
  } else {
    return (
      <Result
        status="success"
        title={translate('Complete your Registration')}
        subTitle={translate('Please answer those question to help us improve IDURAR')}
        extra={
          <div style={{ maxWidth: 450, margin: 'auto' }}>
            <Survey current={current} />
          </div>
        }
      ></Result>
    );
  }
};

export default Verify;

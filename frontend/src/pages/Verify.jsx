import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { selectAuth } from '@/redux/auth/selectors';
import { Result, Button, Input, Space, Form, Select } from 'antd';

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
          label="Are you"
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
              { value: 'Software Agency', label: 'Software Company' },
              { value: 'Company (All kind of business)', label: 'Company (All kind of business)' },
              { value: 'Studend', label: 'Studend' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="industry"
          label="In witch Industry you want use IDURAR ERP CRM"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              { value: 'Automobile', label: 'Automobile' },
              { value: 'Construction', label: 'Construction' },
              { value: 'Chimical', label: 'Chimical' },
              { value: 'Distribution', label: 'Distribution' },
              { value: 'E-commerce', label: 'E-commerce' },
              { value: 'Education & School', label: 'Education & School' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Healthcare', label: 'Healthcare' },
              { value: 'Hotel', label: 'Hotel' },
              { value: 'Logistics', label: 'Logistics' },
              { value: 'non profit & charities', label: 'non profit & charities' },
              { value: 'Manufacturing', label: 'Manufacturing' },
              { value: 'Professional Services', label: 'Professional Services' },
              { value: 'Retail', label: 'Retail' },
              { value: 'Restaurant & Cafe', label: 'Restaurant & Cafe' },
              { value: 'Software , IT & Design Agency', label: 'Software , IT & Design Agency' },
              { value: 'Travel & Tourism', label: 'Travel & Tourism' },
              { value: 'Trading & Import Export', label: 'Trading & Import Export' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="problem"
          label="What's problem you are trying to solve by using ERP CRM"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea />
        </Form.Item>

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

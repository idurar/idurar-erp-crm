import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { selectAuth } from '@/redux/auth/selectors';
import { Result, Button, Input, Space } from 'antd';

import { verify as verifyAction } from '@/redux/auth/actions';

import Loading from '@/components/Loading';

const Verify = () => {
  const translate = useLanguage();
  const { userId, emailToken } = useParams();
  const { isLoading, isSuccess } = useSelector(selectAuth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  function asyncVerify() {
    dispatch(verifyAction({ userId, emailToken }));
  }

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  return (
    <Result
      status="info"
      title={translate('Verify your account')}
      subTitle={translate('Complete verification by providing the code that you received by email')}
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
};

export default Verify;

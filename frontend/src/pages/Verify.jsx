import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { selectAuth } from '@/redux/auth/selectors';
import { Result, Button } from 'antd';

import { verify as verifyAction } from '@/redux/auth/actions';

import PageLoader from '@/components/PageLoader';

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
    asyncVerify();
  }, []);

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  if (isLoading) {
    return <PageLoader />;
  } else {
    return (
      <Result
        status="403"
        title={translate('Verification Failed')}
        subTitle={translate('your verification email failed please try again')}
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            {translate('Back')}
          </Button>
        }
      ></Result>
    );
  }
};

export default Verify;

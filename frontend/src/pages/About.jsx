import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'VERTEX'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.VERTEXapp.com">www.VERTEXapp.com</a>{' '}
          </p>
          <p>
            GitHub :{' '}
            <a href="https://github.com/VERTEX/VERTEX-erp-crm">
              https://github.com/VERTEX/VERTEX-erp-crm
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.VERTEXapp.com/contact-us/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;

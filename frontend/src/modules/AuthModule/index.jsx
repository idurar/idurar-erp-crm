import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import SelectLanguage from '@/components/SelectLanguage';

import logo from '@/style/images/idurar-crm-erp.svg';
import { selectLangDirection } from '@/redux/translate/selectors';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
      <AuthLayout sideContent={<SideContent />}>
      
        <Content
          style={{
            padding: isForRegistre ? '40px 30px 30px' : '100px 30px 30px',
            maxWidth: '440px',
            margin: '0 auto',
          }}
        >
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
            <img
              src={logo}
              alt="Logo"
              style={{
                margin: '0px auto 20px',
                display: 'block',
              }}
              height={63}
              width={220}
            />
            <div className="space10" />
          </Col>
          <Title level={1}>{translate(AUTH_TITLE)}</Title>

          <Divider />
          <div className="site-layout-content">{authContent}</div>
        </Content>
      </AuthLayout>

  );
};

export default AuthModule;

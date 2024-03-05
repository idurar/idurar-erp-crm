import { Content } from 'antd/lib/layout/layout';
import { Layout } from 'antd';
import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';

export default function ProfileModule({ config }) {
  return (
    <ProfileLayout>
      <Layout className="site-layout">
        <Content
          className="whiteBox shadow"
          style={{
            padding: '50px 40px',
            margin: '100px auto',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          <Profile config={config} />
        </Content>
      </Layout>
    </ProfileLayout>
  );
}

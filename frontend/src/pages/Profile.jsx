import { Card, Avatar, Row, Col, Typography, Button, Image } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import ProfileModule from '@/modules/ProfileModule';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;

export default function Profile() {
  const entity = 'profile';
  const translate = useLanguage();

  const Labels = {
    PANEL_TITLE: translate('Profile'),
    ENTITY_NAME: translate('Profile'),
  };

  const config = {
    entity,
    ...Labels,
  };
  
  const user = {
    name: 'MuthuSelvam K',
    email: 'muthuselvamk58@gmail.com',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=3',
    cover: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=1200&q=80', 
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto' }}>
      {/* Cover Image */}
      <div style={{ marginBottom: -50, position: 'relative' }}>
        <Image
          src={user.cover}
          preview={false}
          width="100%"
          style={{ height: 200, objectFit: 'cover', borderRadius: '8px' }}
        />
        {/* Avatar */}
        <Avatar
          size={120}
          src={user.avatar}
          icon={<UserOutlined />}
          style={{
            position: 'absolute',
            bottom: -60,
            left: 30,
            border: '3px solid white',
          }}
        />
      </div>

      {/* Profile Card */}
      <Card style={{ paddingTop: 80, borderRadius: 8 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
            <br />
            <Text>{translate('Role')}: {user.role}</Text>
          </Col>
          <Col>
            <Button type="primary" icon={<EditOutlined />}>
              {translate('Edit Profile')}
            </Button>
          </Col>
        </Row>

        {/* Additional ProfileModule content */}
        <div style={{ marginTop: 30 }}>
          <ProfileModule config={config} />
        </div>
      </Card>
    </div>
  );
}

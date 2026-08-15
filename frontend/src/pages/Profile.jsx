import React, { useState, useEffect } from 'react';
import { Card, Avatar, Row, Col, Typography, Button, Image, Spin, Divider, Descriptions } from 'antd';
import { UserOutlined, EditOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons';
import ProfileModule from '@/modules/ProfileModule';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;

// --- Mock User Data (to simulate data fetching) ---
const mockUserData = {
  name: 'MuthuSelvam K',
  email: 'muthuselvamk58@gmail.com',
  role: 'Administrator', // Changed to full word
  bio: 'Full-stack developer focused on creating scalable and efficient web applications. Loves React, Ant Design, and solving complex challenges. 🚀',
  phone: '+91 98765 43210',
  joinDate: 'Jan 1, 2023',
  avatar: 'https://i.pravatar.cc/150?img=3',
  cover: 'https://images.unsplash.com/photo-1542435503-9d9b62c0e7fe?fit=crop&w=1200&h=200&q=80', // Slightly more abstract cover
};

export default function EnhancedProfile() {
  const entity = 'profile';
  const translate = useLanguage();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would dispatch a Redux action or fetch API here
    const timer = setTimeout(() => {
      setUser(mockUserData);
      setLoading(false);
    }, 1000); // 1 second delay for mock loading

    return () => clearTimeout(timer);
  }, []);

  const Labels = {
    PANEL_TITLE: translate('My Account Profile'), // More specific title
    ENTITY_NAME: translate('Profile'),
  };

  const config = {
    entity,
    ...Labels,
  };

  // Content to display inside the Card
  const ProfileContent = () => (
    <>
      <Row justify="space-between" align="bottom" style={{ paddingLeft: 180, paddingRight: 20 }}>
        {/* Name and Bio Column */}
        <Col flex="1 1 auto" style={{ minWidth: 0 }}>
          <Title level={2} style={{ marginBottom: 0 }}>{user.name}</Title>
          <Text type="secondary" ellipsis>{user.email}</Text>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" strong>{translate('Role')}: </Text>
            <Text>{user.role}</Text>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <Text>{translate('Status')}: </Text>
          <Text italic>{user.bio}</Text>
        </Col>
      </Row>

      {/* Detail Descriptions */}
      <Divider orientation="left">{translate('Contact & Details')}</Divider>
      <Descriptions bordered column={{ xs: 1, sm: 2, lg: 3 }} size="small">
        <Descriptions.Item label={translate('Email')}>{user.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{user.phone}</Descriptions.Item>
        <Descriptions.Item label={translate('Joined')}>{user.joinDate}</Descriptions.Item>
        <Descriptions.Item label={translate('Website')} span={3}>
          <LinkOutlined /> <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a>
        </Descriptions.Item>
      </Descriptions>

      {/* Additional ProfileModule content for forms/settings */}
      <div style={{ marginTop: 30 }}>
        <ProfileModule config={config} />
      </div>
    </>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip={translate('Loading Profile Data...')} />
      </div>
    );
  }

  // Fallback for null user data (shouldn't happen with the mock but good for robustness)
  if (!user) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>{translate('User data could not be loaded.')}</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto' }}>
      {/* Cover Image Area */}
      <div style={{ marginBottom: -80, position: 'relative' }}>
        <Image
          src={user.cover}
          preview={false}
          width="100%"
          style={{ 
            height: 200, 
            objectFit: 'cover', 
            borderRadius: '10px 10px 0 0', // Rounded corners on top only
          }}
        />
        {/* Avatar */}
        <Avatar
          size={160} // Larger Avatar
          src={user.avatar}
          icon={<UserOutlined />}
          style={{
            position: 'absolute',
            bottom: -90, // Adjusted for larger avatar
            left: 50, // Moved slightly from the edge
            border: '5px solid #fff', // Thicker border
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Added shadow
          }}
        />
      </div>

      {/* Enhanced Profile Card */}
      <Card
        style={{ paddingTop: 100, borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        // Card Actions for better UI placement of buttons
        actions={[
          <Button type="text" icon={<SettingOutlined />} key="settings">
            {translate('Account Settings')}
          </Button>,
          <Button type="link" icon={<EditOutlined />} key="edit">
            {translate('Update Info')}
          </Button>,
        ]}
      >
        {/* Render the main profile content */}
        <ProfileContent />
      </Card>
    </div>
  );
}

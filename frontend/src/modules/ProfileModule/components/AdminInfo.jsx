import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { EditOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Descriptions, Divider, PageHeader, Row, Space, Tag } from 'antd';
import { useSelector } from 'react-redux';
import photo from '@/style/images/photo.png';
import history from '@/utils/history';
import { selectCurrentItem, selectReadItem } from '@/redux/crud/selectors';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { BASE_URL } from '@/config/serverApiConfig';

import { checkImage } from '@/request';


const AdminInfo = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { modal, updatePanel } = profileContextAction;
  const { ENTITY_NAME } = config;
  const currentAdmin = useSelector(selectCurrentAdmin);


  const srcImgProfile = checkImage(BASE_URL + currentAdmin?.photo)
    ? BASE_URL + currentAdmin?.photo
    : undefined;


  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={ENTITY_NAME}
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              updatePanel.open();
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit
          </Button>,
          <Button
            key={`${uniqueId()}`}
            icon={<LockOutlined />}
            onClick={() => {
              modal.open();
            }}
          >
            Update Password
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="middle">
        <Col xs={{ span: 24 }} sm={{ span: 7 }} md={{ span: 5 }}>
          <Avatar
            className="last left circle pad5"
            src={srcImgProfile}
            style={{
              width: '100px',
              height: '100px',
              border: '2px solid #1B98F5',
            }}
            size={95}
            alt={`${currentAdmin?.name}`}
          > 
           {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 18 }}>
          <Descriptions labelStyle={{ fontSize: '17px' }} size="small">
            <Descriptions.Item label="Name" span="3" style={{ paddingTop: '20px' }}>
              <h3
                style={{
                  color: '#22075e',
                  textTransform: 'capitalize',
                }}
              >
                {currentAdmin?.name}
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Surname" span="3">
              <h3
                style={{
                  color: '#22075e',
                  textTransform: 'capitalize',
                }}
              >
                {currentAdmin?.surname}
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Email" span="3" style={{ paddingTop: '20px' }}>
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                {currentAdmin?.email}
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Role" span="3">
              <h3
                style={{
                  color: '#22075e',
                  textTransform: 'capitalize',
                }}
              >
                {currentAdmin?.role}
              </h3>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider />
      <Button
        key={`${uniqueId()}`}
        icon={<LogoutOutlined />}
        className="right"
        onClick={() => history.push('/logout')}
      >
        Logout
      </Button>
    </>
  );
};
export default AdminInfo;
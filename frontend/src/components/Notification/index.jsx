import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useLanguage from '@/locale/useLanguage';

const Notifications = () => {
  const translate = useLanguage();
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: translate('First notification') },
    { id: 2, text: translate('Second notification') },
    { id: 3, text: translate('Third') },
    { id: 4, text: translate('Fourth notification') },
    { id: 5, text: translate('Fifth notification') },
    { id: 6, text: translate('Sixth notification') },
  ]);

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter((n) => n.id !== id);
    setNotifications(updatedNotifications);
  };

  return (
    <div className="notifications whiteBox shadow">
      <div className="pad20">
        <p className="strong">{translate('Notifications')}</p>
        <Button type="text" shape="circle" className="del-notif">
          <DeleteOutlined />
        </Button>
      </div>
      <div className="line"></div>
      <div className="notif-list">
        {notifications.map((notification) => (
          <div href="/" key={notification.id} className="notification">
            <Button type="text" className="notif-btn">
              <span>{notification.text}</span>
            </Button>
            <Button
              type="text"
              className="del-notif"
              shape="circle"
              onClick={() => deleteNotification(notification.id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Notifications;

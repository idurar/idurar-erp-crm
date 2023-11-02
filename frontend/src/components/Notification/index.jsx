import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: 'First notificationnnnnnnnnnnnnnnnn' },
    { id: 2, text: 'Second notification' },
    { id: 3, text: 'Third ' },
    { id: 4, text: 'Fourth notification' },
    { id: 5, text: 'Fifth notification' },
    { id: 6, text: 'Sixth notification' },
  ]);

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter((n) => n.id !== id);
    setNotifications(updatedNotifications);
  };

  return (
    <div className="notifications whiteBox shadow">
      <div className="pad20">
        <p className="strong">Notifications</p>
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

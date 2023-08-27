import React from "react";
import { DeleteOutlined } from '@ant-design/icons';

const Notifications = () => {

  const [notifications, setNotifications] = React.useState([
    {id: 1, text: 'First notification'},
    {id: 2, text: 'Second notification'},
    {id: 3, text: 'Third notification'}  
  ]);

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
  }

  return (
    <div className="notifications whiteBox shadow" style={{ minWidth: '200px' }}>
      {notifications.map((n) => (
        <div key={n.id} className="notification pad15">
          {n.text}
          <button onClick={() => deleteNotification(n.id)} className="info">
            <DeleteOutlined />
          </button>
        </div>
      ))}
    </div>
  );
}
export default Notifications;

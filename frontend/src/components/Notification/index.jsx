import React from "react";
import { DeleteOutlined } from '@ant-design/icons';

const Notifications = () => {

  const [notifications, setNotifications] = React.useState([
    {id: 1, text: 'First notification'},
    {id: 2, text: 'Second notification'},
    {id: 3, text: 'Third notification'},
    {id: 3, text: 'Fourth notification'},
    {id: 5, text: 'Fifth notification'},
    {id: 6, text: 'Sixth notification'},
  ]);

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
  }

  return (
    <div className="notifications whiteBox shadow" style={{ maxWidth: '200px', maxHeight: '200px' }}>
      <div>
      {notifications.map((n) => (
        <div key={n.id} className="pad15">
          {n.text}
          <button onClick={() => deleteNotification(n.id)} className="info">
            <DeleteOutlined />
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}
export default Notifications;

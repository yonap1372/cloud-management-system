import { useEffect, useState } from "react";
import { listenToNotifications } from "../services/api";
import "../styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    listenToNotifications((notification) => {
      setNotifications((prev) => [...prev, notification]);
    });
  }, []);

  return (
    <div className="notifications-container">
      {notifications.map((notif, index) => (
        <div key={index} className={`notification ${notif.type.toLowerCase()}`}>
          {notif.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;

import { useEffect, useState } from "react";
import { CToast, CToastBody, CToaster } from "@coreui/react";
import { subscribeToaster } from "@/utils/toaster";

const toastColors = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "info",
};

export default function ToasterHost() {
  const [notifications, setNotifications] = useState([]);

  useEffect(
    () =>
      subscribeToaster((notification) => {
        setNotifications((current) => [...current, notification]);
      }),
    [],
  );

  const removeNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  return (
    <CToaster placement="top-end" className="p-3">
      {notifications.map((notification) => (
        <CToast
          key={notification.id}
          color={toastColors[notification.type] || "info"}
          visible
          autohide
          delay={5000}
          onClose={() => removeNotification(notification.id)}
        >
          <CToastBody className="text-black">{notification.message}</CToastBody>
        </CToast>
      ))}
    </CToaster>
  );
}

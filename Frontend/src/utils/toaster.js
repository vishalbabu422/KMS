const listeners = new Set();
const pendingNotifications = [];
let nextNotificationId = 0;

export const subscribeToaster = (listener) => {
  listeners.add(listener);
  pendingNotifications.splice(0).forEach(listener);

  return () => listeners.delete(listener);
};

export default function toaster(type, message) {
  const notification = {
    id: ++nextNotificationId,
    type,
    message,
  };

  if (listeners.size === 0) {
    pendingNotifications.push(notification);
    return;
  }

  listeners.forEach((listener) => listener(notification));
}

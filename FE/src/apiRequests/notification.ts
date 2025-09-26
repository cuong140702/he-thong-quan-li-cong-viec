import { http } from "@/utils/api";
import { INotificationRes } from "@/utils/interface/notifications";

const notificationApiRequest = {
  getNotifications: () =>
    http.get<IBackendRes<INotificationRes[]>>(`notifications`),

  deleteAllNotification: () => http.delete(`notifications/clear-all`),

  markAsRead(id: string) {
    return http.patch(`notifications/${id}/read`, null);
  },

  markAllAsRead() {
    return http.patch(`notifications/mark-all-read`, null);
  },
};

export default notificationApiRequest;

import { http } from "@/utils/api";
import { INotificationRes } from "@/utils/interface/notifications";

const notificationApiRequest = {
  getNotifications: () =>
    http.get<IBackendRes<INotificationRes[]>>(`notifications`),

  deleteAllNotification: () => http.delete(`notifications/clear-all`),
};

export default notificationApiRequest;

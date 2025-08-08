import { http } from "@/utils/api";
import { INotificationRes } from "@/utils/interface/notifications";

const notificationApiRequest = {
  getNotifications: () =>
    http.get<IBackendRes<INotificationRes[]>>(`notifications`),
};

export default notificationApiRequest;

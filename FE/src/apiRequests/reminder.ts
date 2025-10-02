import { http } from "@/utils/api";
import {
  IBodyReminder,
  IGetRemindersResponse,
} from "@/utils/interface/reminder";

const reminderApiRequest = {
  getReminders: () =>
    http.get<IBackendRes<IGetRemindersResponse[]>>(`reminders`),

  createReminder: (body: IBodyReminder) => http.post("reminders", body),
};

export default reminderApiRequest;

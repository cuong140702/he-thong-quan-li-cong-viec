import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import {
  IBodyReminder,
  IGetRemindersResponse,
} from "@/utils/interface/reminder";

const reminderApiRequest = {
  getReminders: (payload: IQueryBase) =>
    http.get<IListDataResponse<IGetRemindersResponse[]>>(`reminders`, {
      queryParams: payload,
    }),

  createReminder: (body: IBodyReminder) => http.post("reminders", body),

  deleteReminder: (id: string) => http.delete(`reminders/${id}`),
};

export default reminderApiRequest;

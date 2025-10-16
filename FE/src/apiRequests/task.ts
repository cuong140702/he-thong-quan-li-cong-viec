import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import {
  IBodyTask,
  IGetCalendarDetail,
  IGetCalendarRes,
  IQueryCalendar,
  ITaskRes,
} from "@/utils/interface/task";
import { ht } from "date-fns/locale";

const taskApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<ITaskRes[]>>("task", {
      queryParams: payload,
    }),
  addTask: (body: IBodyTask) => http.post("task", body),
  getTasksByTag: (payload: IQueryBase) =>
    http.get<IListDataResponse<ITaskRes[]>>(`task/task-by-tag`, {
      queryParams: payload,
    }),
  updateTask: (id: string, body: IBodyTask) => http.put(`task/${id}`, body),
  deleteTask: (id: string) => http.delete(`task/${id}`),
  getTask: (id: string) => http.get<ITaskRes>(`task/${id}`),
  getCalendar: (payload: IQueryCalendar) =>
    http.get<IBackendRes<IGetCalendarRes[]>>("task/calendar", {
      queryParams: payload,
    }),
  getCalendarDatail: (id: string) => http.get<IGetCalendarDetail>(`task/${id}`),
};

export default taskApiRequest;

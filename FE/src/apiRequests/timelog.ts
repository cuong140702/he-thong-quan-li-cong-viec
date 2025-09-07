import { http } from "@/utils/api";
import { IListDataResponse } from "@/utils/interface/common";
import {
  IGetClockInRes,
  IGetClockOutRes,
  IGetTotalByTaskRes,
  ITimelog,
} from "@/utils/interface/timelog";

const timeLogApiRequest = {
  clockIn: ({ id }: { id: string }) =>
    http.post<IGetClockInRes>("timelog/clock-in", { taskId: id }),
  getLog: (id: string) =>
    http.get<IListDataResponse<ITimelog[]>>(`timelog/task/${id}`),
  clockOut: (id: string) =>
    http.put<IGetClockOutRes>(`timelog/clock-out/${id}`, {}),
  totalByTask: (id: string, body: { startTime: Date }) =>
    http.post<IGetTotalByTaskRes>(`timelog/task/${id}/total`, body),
  deleteTimelog: (id: string) => http.delete(`timelog/${id}`),
};

export default timeLogApiRequest;

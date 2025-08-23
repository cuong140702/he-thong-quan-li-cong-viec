import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import { IBodyTask, ITaskRes } from "@/utils/interface/task";

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
};

export default taskApiRequest;

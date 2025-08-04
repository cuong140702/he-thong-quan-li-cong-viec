import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import { IBodyProject, IGetProjectsResponse } from "@/utils/interface/project";

const projectApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IGetProjectsResponse[]>>("project", {
      queryParams: payload,
    }),
  addProject: (body: IBodyProject) => http.post("project", body),
  getProject: (id: string) => http.get<IGetProjectsResponse>(`project/${id}`),
  updateProject: (id: string, body: IBodyProject) =>
    http.put(`project/${id}`, body),
  deleteProject: (id: string) => http.delete(`project/${id}`),
};

export default projectApiRequest;

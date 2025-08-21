import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import { IBodyTag, IGetTagsResponse } from "@/utils/interface/tag";

const tagApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IGetTagsResponse[]>>("tag", {
      queryParams: payload,
    }),
  addTag: (body: IBodyTag) => http.post("tag", body),
  getTag: (id: string) => http.get<IGetTagsResponse>(`tag/${id}`),
  updateTag: (id: string, body: IBodyTag) => http.put(`tag/${id}`, body),
  deleteTag: (id: string) => http.delete(`tag/${id}`),
};

export default tagApiRequest;

import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import {
  ICreateUser,
  IGetUserRes,
  IUpdateUser,
  IUserDetailRes,
} from "@/utils/interface/user";

const userApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IGetUserRes[]>>("user", {
      queryParams: payload,
    }),

  createUser: (payload: ICreateUser) => http.post("user", payload),
  detailUser: (id: string) => http.get<IUserDetailRes>(`user/${id}`),
  updateUser: (id: string, body: IUpdateUser) => http.put(`user/${id}`, body),

  deleteUser: (id: string) => http.delete(`user/${id}`),
};

export default userApiRequest;

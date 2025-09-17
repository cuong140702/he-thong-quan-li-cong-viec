import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import { IGetUserRes } from "@/utils/interface/user";

const userApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IGetUserRes[]>>("user", {
      queryParams: payload,
    }),

  deleteUser: (id: string) => http.delete(`user/${id}`),
};

export default userApiRequest;

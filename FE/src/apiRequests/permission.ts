import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import { IPermissionsRes } from "@/utils/interface/permission";

const permissionsApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IPermissionsRes[]>>("permission", {
      queryParams: payload,
    }),
};

export default permissionsApiRequest;

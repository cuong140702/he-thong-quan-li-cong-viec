import { http } from "@/utils/api";
import { IQueryBase } from "@/utils/interface/common";

const activitiesApiRequest = {
  getActivities: (payload: IQueryBase) =>
    http.get<IBackendRes<any[]>>(`activities`, {
      queryParams: payload,
    }),
};

export default activitiesApiRequest;

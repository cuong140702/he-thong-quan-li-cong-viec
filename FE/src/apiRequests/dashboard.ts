import { http } from "@/utils/api";
import { IDashboardRes } from "@/utils/interface/dashboard";

const dashboardApiRequest = {
  getDashboard: () => http.get<IDashboardRes>(`dashboard`),
};

export default dashboardApiRequest;

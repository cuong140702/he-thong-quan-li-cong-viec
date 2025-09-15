"use client";

import { use, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import CountUp from "react-countup";
import dashboardApiRequest from "@/apiRequests/dashboard";
import { LoadingData } from "@/components/LoadingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDashboardRes } from "@/utils/interface/dashboard";
import { useTranslations } from "next-intl";

export default function Home(props: { params: Promise<{ locale: string }> }) {
  const { locale } = use(props.params);
  const t = useTranslations("Dashboard");
  const loadingContext = useContext(LoadingData);
  const [taskData, setTaskData] = useState<IDashboardRes>();

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  const handleGetDashboardData = async () => {
    try {
      loadingContext?.show();

      const res = await dashboardApiRequest.getDashboard();
      if (!res) return;

      const responseData = res.data;

      setTaskData(responseData);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tổng Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tổng Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              <CountUp end={taskData?.totalTasks ?? 0} duration={2} />
            </p>
          </CardContent>
        </Card>

        {/* Hoàn thành */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              <CountUp end={taskData?.completedTasks ?? 0} duration={2} />
            </p>
          </CardContent>
        </Card>

        {/* Thời gian tuần này */}
        <Card className="bg-white dark:bg-[#101728] border border-border dark:border-[#1e293b] shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-foreground">
              Thời gian tuần này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
              <CountUp end={taskData?.weeklyHours ?? 0} duration={2} /> giờ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

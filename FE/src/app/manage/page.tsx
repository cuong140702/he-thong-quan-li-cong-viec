"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { http } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await http.get<any>("/task", {
        queryParams: {
          page: 1,
          limit: 10,
        },
      });
      setTaskData(res);
      console.log("Task data:", res);
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tổng Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tổng Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              12
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
              8
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
              24h
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { IQueryBase } from "@/utils/interface/common";
import activitiesApiRequest from "@/apiRequests/activities";
import { methodColors } from "@/lib/utils";
import permissionsApiRequest from "@/apiRequests/permission";
import { IGetAllModule } from "@/utils/interface/permission";

type Activity = {
  id: string;
  action: string;
  module: string;
  details?: string;
  createdAt: string;
  user?: { fullName: string; email: string };
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({ module: "" });
  const [dataModule, setDataModule] = useState<IGetAllModule[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleGetListActivities = useCallback(
    async (payload: IQueryBase, isLoadMore = false) => {
      try {
        setLoading(true);

        const res = await activitiesApiRequest.getActivities(payload);

        const newItems = (res?.data as any).items || [];
        const totalPages = (res?.data as any).pagination.totalPages;

        setActivities((prev) =>
          isLoadMore ? [...prev, ...newItems] : newItems
        );
        setHasMore(payload.page! < totalPages);
      } catch (error) {
        console.error("❌ Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 🎯 Khi đổi filter => reset trang
  useEffect(() => {
    setPage(1);
    handleGetListActivities({ page: 1, limit: 1 });
    handleGetAllModule();
  }, [filter, handleGetListActivities]);

  // 🧩 Infinite Scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setLoading(true); // ⚡ chặn trùng
          const nextPage = page + 1;
          setPage(nextPage);
          handleGetListActivities({ page: nextPage, limit: 1 }, true);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, loading, hasMore, filter, handleGetListActivities]);

  const handleGetAllModule = async () => {
    try {
      const res = await permissionsApiRequest.getAllModule();
      if (res?.data && res?.statusCode === 200) {
        setDataModule(res.data.data || []);
      }
    } catch (error) {
      console.error("❌ Error fetching all modules:", error);
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🧾 Activity Log</h1>
        <Select
          onValueChange={(val) =>
            setFilter((f) => ({ ...f, module: val === "all" ? "" : val }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {dataModule.map((module, index) => (
              <SelectItem key={index} value={module.module}>
                {module.module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activity list */}
      <div className="space-y-4">
        {activities.length === 0 && loading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : activities.length > 0 ? (
          <>
            {activities.map((a) => (
              <Card
                key={a.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-all duration-200"
              >
                {/* User info */}
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="flex flex-col">
                    <div className="font-semibold text-base">
                      {a.user?.fullName || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">{a.user?.email}</div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-3 sm:mt-0 flex-1 sm:ml-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{a.module}</Badge>
                    {a.action && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          methodColors[a.action as keyof typeof methodColors] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {a.action}
                      </span>
                    )}
                  </div>
                  {a.details && (
                    <p className="text-sm text-gray-600 mt-1">{a.details}</p>
                  )}
                </div>

                {/* Time */}
                <div className="text-right text-sm text-gray-500 mt-3 sm:mt-0 sm:w-[160px]">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </Card>
            ))}

            {/* Loading indicator ở cuối */}
            <div ref={loaderRef} className="flex justify-center py-4">
              {loading && (
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-10 border rounded-xl">
            No activities found.
          </div>
        )}
      </div>
    </div>
  );
}

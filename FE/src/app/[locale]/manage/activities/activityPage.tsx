"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";

import activitiesApiRequest from "@/apiRequests/activities";
import { methodColors } from "@/lib/utils";
import { IQueryBase } from "@/utils/interface/common";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Activity = {
  id: string;
  action: string;
  module: string;
  details?: string;
  createdAt: string;
  user?: { fullName: string; email: string };
};

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    handleGetListActivities({ page: 1, limit: 4 });
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && page < totalPages && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          handleGetListActivities({ page: nextPage, limit: 4 }, true);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [page, totalPages, loading]);

  const handleGetListActivities = useCallback(
    async (payload: IQueryBase, isLoadMore = false) => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await activitiesApiRequest.getActivities(payload);

        const newItems = (res?.data as any).items || [];
        const total = (res?.data as any).pagination.totalPages;

        setTotalPages(total);

        setActivities((prev) => {
          const merged = [...prev, ...newItems];
          const unique = Array.from(
            new Map(merged.map((item) => [item.id, item])).values()
          );
          return isLoadMore ? unique : newItems;
        });
      } catch (error) {
        console.error("❌ Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">
        🧾 Activity Log
      </h1>

      <div className="relative">
        {/* Timeline dọc gradient */}
        <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-300 to-blue-600 rounded-full"></div>

        <div className="space-y-12">
          {(loading ? Array(5).fill({}) : activities).map((a, idx) => (
            <div key={a?.id || idx} className="relative flex items-start">
              {/* Dấu chấm timeline */}
              <div
                className="absolute left-3 top-5 w-6 h-6 rounded-full border-4 border-white shadow-md 
                          flex items-center justify-center bg-blue-500 text-white text-xs font-bold
                          animate-pulse hover:scale-110 transition-transform duration-300"
              >
                {!loading && a?.action ? a.action.charAt(0).toUpperCase() : ""}
              </div>

              {/* Card activity */}
              <Card
                className="ml-16 p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 
                           border-l-4 border-transparent hover:border-blue-500 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    {loading ? (
                      <Skeleton className="h-5 w-32 mb-1" />
                    ) : (
                      <div className="font-semibold text-lg">
                        {a.user?.fullName || "Unknown User"}
                      </div>
                    )}
                    {loading ? (
                      <Skeleton className="h-3 w-40" />
                    ) : (
                      <div className="text-xs text-gray-400">
                        {a.user?.email}
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <Skeleton className="h-3 w-20" />
                  ) : (
                    <div className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  {loading ? (
                    <>
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">{a.module}</Badge>
                      {a.action && (
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            methodColors[
                              a.action as keyof typeof methodColors
                            ] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {a.action}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {loading ? (
                  <Skeleton className="h-4 w-full mt-3" />
                ) : (
                  a.details && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {a.details}
                    </p>
                  )
                )}
              </Card>
            </div>
          ))}

          {/* Load more */}
          <div
            ref={loadMoreRef}
            className="h-12 flex justify-center items-center"
          >
            {loading && (
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;

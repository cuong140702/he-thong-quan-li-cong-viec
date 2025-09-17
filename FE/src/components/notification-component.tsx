// components/NotificationDropdown.tsx
"use client";

import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INotificationRes } from "@/utils/interface/notifications";
import { LoadingData } from "./LoadingData";
import notificationApiRequest from "@/apiRequests/notification";
import { toast } from "sonner";
import { useAppContext } from "./app-context";
import { Sockets } from "@/lib/socket";

const NotificationDropdown = () => {
  const loadingContext = useContext(LoadingData);
  const { sockets, userId } = useAppContext();
  const { messages: message } = (sockets || {}) as Sockets;
  const [dataNotifications, setDataNotifications] = useState<
    INotificationRes[]
  >([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleListMessage();
  }, []);

  useEffect(() => {
    if (!message) return;

    const handler = (notification: INotificationRes) => {
      setDataNotifications((prev) => [notification, ...prev]);
    };

    message.on("receive-notification", handler);

    return () => {
      message.off("receive-notification", handler);
    };
  }, [message]);

  const handleListMessage = async () => {
    try {
      loadingContext?.show();
      const res = await notificationApiRequest.getNotifications();
      const responseData = res.data;
      console.log("res", responseData?.data);

      if (responseData) {
        setDataNotifications(responseData.data ?? []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleDelete = async () => {
    loadingContext?.show();

    try {
      const res = await notificationApiRequest.deleteAllNotification();

      if (res.statusCode === 200) {
        toast.success("Deleted successfully!");
        handleListMessage();
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    } finally {
      loadingContext?.hide();
    }
  };

  const unreadCount = useMemo(() => {
    return dataNotifications.filter((noti) => !noti.isRead).length;
  }, [dataNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="relative size-9 p-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-[400px] overflow-hidden">
          <Card className="shadow-none rounded-none border-none h-full flex flex-col">
            <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Thông báo</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                onClick={handleDelete}
              >
                Xóa tất cả
              </Button>
            </CardHeader>

            <CardContent className=" p-2 flex-1 overflow-auto">
              <ScrollArea className="max-h-64">
                {dataNotifications.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 select-none">
                    Không có thông báo
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {dataNotifications.map((noti, idx) => (
                      <li
                        key={idx}
                        className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${
                          noti.isRead ? "" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {noti.title}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {noti.content}
                        </p>
                        <time className="block text-xs text-gray-500 dark:text-gray-400 mt-1 select-none">
                          {new Date(noti.createdAt).toLocaleString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

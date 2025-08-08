// components/NotificationDropdown.tsx
"use client";

import React, { useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  userId: number | string;
  senderId: number | string;
  title: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fake data
  const notifications: Notification[] = [
    {
      userId: 1,
      senderId: 2,
      title: "Tin nhắn mới",
      content: "Bạn có tin nhắn từ người dùng 2",
      createdAt: new Date().toISOString(),
      isRead: false,
    },
    {
      userId: 1,
      senderId: 3,
      title: "Tin nhắn mới",
      content: "Người dùng 3 vừa gửi cho bạn một tin nhắn",
      createdAt: new Date().toISOString(),
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="relative size-9 p-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded-full shadow animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <Card className="shadow-none rounded-none border-none">
            <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Thông báo</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                Xóa tất cả
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="max-h-64 pr-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 select-none">
                    Không có thông báo
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {notifications.map((noti, idx) => (
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

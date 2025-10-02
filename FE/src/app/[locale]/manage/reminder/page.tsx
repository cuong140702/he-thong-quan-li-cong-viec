"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data
const mockReminders = [
  {
    id: uuidv4(),
    taskTitle: "Hoàn thành báo cáo doanh thu",
    remindAt: new Date(Date.now() + 60 * 60 * 1000),
    isSent: false,
  },
  {
    id: uuidv4(),
    taskTitle: "Gọi khách hàng tiềm năng",
    remindAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    isSent: false,
  },
  {
    id: uuidv4(),
    taskTitle: "Review code project",
    remindAt: new Date(Date.now() - 30 * 60 * 1000),
    isSent: true,
  },
];

export default function ReminderTimeline() {
  const [reminders, setReminders] = useState(mockReminders);

  const sortedReminders = [...reminders].sort(
    (a, b) => a.remindAt.getTime() - b.remindAt.getTime()
  );

  const handleMarkSent = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSent: true } : r))
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Reminder Timeline</h2>
      <ScrollArea className="max-h-[600px] overflow-auto">
        <div className="relative border-l-2 border-gray-200 ml-6">
          {sortedReminders.map((reminder) => (
            <div key={reminder.id} className="mb-10 ml-6 relative group">
              {/* Dot */}
              <span
                className={`absolute -left-5 top-2 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  reminder.isSent
                    ? "bg-green-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              ></span>

              {/* Card */}
              <Card className="shadow-lg hover:shadow-xl transition duration-300">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {reminder.taskTitle}
                  </h3>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      reminder.isSent
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {reminder.isSent ? "Sent" : "Pending"}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-gray-500 text-sm">
                    {reminder.remindAt.toLocaleString()}
                  </p>
                  {!reminder.isSent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkSent(reminder.id)}
                    >
                      Mark Sent
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

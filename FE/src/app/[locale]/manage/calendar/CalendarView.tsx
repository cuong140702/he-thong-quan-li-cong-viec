"use client";

import React, { useMemo, useRef, useState } from "react";
import viLocale from "@fullcalendar/core/locales/vi";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { useLocale } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import taskApiRequest from "@/apiRequests/task";
import { colorMap, cn, handleGetDataTimeZone, formatDate } from "@/lib/utils";
import { TaskStatus } from "@/utils/enum/task";
import { IGetCalendarRes } from "@/utils/interface/task";

export default function CalendarView() {
  const locale = useLocale();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const calendarLocale = useMemo(
    () => (locale === "vi" ? viLocale : enLocale),
    [locale]
  );

  const fetchEvents = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const res = await taskApiRequest.getCalendar({
        startDate: start,
        deadline: end,
        timeZone: handleGetDataTimeZone(),
      });

      const mapped = res?.data?.data?.map((t: IGetCalendarRes) => ({
        id: t.id,
        title: t.title,
        start: t.startDate,
        end: t.deadline,
        status: t.status,
        backgroundColor: colorMap[t.status as TaskStatus],
      }));

      setEvents(mapped ?? []);
    } catch (err) {
      console.error("❌ Lỗi tải calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRange = () => {
    if (dateRange?.from && dateRange?.to) {
      fetchEvents(dateRange.from, dateRange.to);
    }
  };

  return (
    <Card className="p-4 md:p-6 shadow-sm border rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between  gap-[50px] mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          📅 Lịch công việc
        </h2>

        <div className="flex items-center gap-2 ">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex">
                <CalendarIcon className="w-4 h-4" />
                {dateRange?.from && dateRange?.to ? (
                  <>
                    {formatDate(dateRange.from, "dd/MM/yyyy")} →{" "}
                    {formatDate(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  "Chọn khoảng ngày"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full max-w-[550px]" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleApplyRange}
            disabled={!dateRange?.from || !dateRange?.to || loading}
          >
            Áp dụng
          </Button>
        </div>
      </div>

      {loading && !events.length ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <div className={cn("rounded-md")}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={events}
            locale={calendarLocale}
            eventClick={(info) => alert(`📝 ${info.event.title}`)}
            eventContent={(arg) => {
              const event = arg.event;
              const start = event.start;
              const end = event.end;
              const bg = event.backgroundColor;

              return (
                <div
                  className="text-[11px] text-white p-1.5 rounded-md leading-tight shadow-sm"
                  style={{ backgroundColor: bg }}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  🕓 {formatDate(start as Date) as string}
                  {end && ` → ${formatDate(end)}`}
                </div>
              );
            }}
          />
        </div>
      )}
    </Card>
  );
}

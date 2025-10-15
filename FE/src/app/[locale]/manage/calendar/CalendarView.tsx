"use client";

import React, { useMemo, useRef, useState } from "react";
import viLocale from "@fullcalendar/core/locales/vi";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { useLocale } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Loader2 } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import taskApiRequest from "@/apiRequests/task";
import { colorMap } from "@/lib/utils";
import { TaskStatus } from "@/utils/enum/task";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
}

export default function CalendarView() {
  const locale = useLocale();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const lastRange = useRef<{ start: Date; end: Date } | null>(null);
  const calendarLocale = useMemo(() => {
    return locale === "vi" ? viLocale : enLocale;
  }, [locale]);

  const fetchEvents = async (start: Date, end: Date) => {
    if (
      lastRange.current &&
      lastRange.current.start.getTime() === start.getTime() &&
      lastRange.current.end.getTime() === end.getTime()
    ) {
      return;
    }
    lastRange.current = { start, end };

    setLoading(true);
    try {
      const res = await taskApiRequest.getCalendar({
        startDate: start,
        deadline: end,
      });
      const mapped = (res.data as any).map((t: any) => ({
        id: t.id,
        title: t.title,
        start: t.startDate,
        end: t.deadline,
        backgroundColor: colorMap[t.status as TaskStatus],
      }));
      setEvents(mapped);
    } catch (err) {
      console.error("❌ Lỗi tải calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDatesSet = (arg: any) => {
    console.log("📅 Range đang hiển thị:", arg.start, "→", arg.end);
    fetchEvents(arg.start, arg.end);
  };

  return (
    <Card className="p-4 md:p-6 shadow-sm border rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          📅 Lịch công việc
        </h2>
        {loading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tải...
          </div>
        )}
      </div>

      {loading && !events.length ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <div className={cn("rounded-md ")}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={events}
            datesSet={handleDatesSet}
            eventClick={(info) => alert(`📝 ${info.event.title}`)}
            eventContent={(arg) => {
              const { title } = arg.event;

              const start = formatInTimeZone(
                new Date(arg.event.start || ""),
                "UTC",
                "dd/MM/yyyy"
              );
              const end = formatInTimeZone(
                new Date(arg.event.end || ""),
                "UTC",
                "dd/MM/yyyy"
              );

              return (
                <div
                  className="text-[11px] text-white p-1.5 rounded-md leading-tight shadow-sm"
                  style={{
                    backgroundColor: arg.event.backgroundColor,
                  }}
                >
                  <div className="font-medium truncate">{title}</div>
                  {start && (
                    <div className="opacity-80 text-[10px] mt-0.5">
                      🕓 {start}
                      {end && ` → ${end}`}
                    </div>
                  )}
                </div>
              );
            }}
            validRange={() => ({
              start: "1900-01-01",
              end: "2100-12-31",
            })}
            locale={calendarLocale}
          />
        </div>
      )}
    </Card>
  );
}

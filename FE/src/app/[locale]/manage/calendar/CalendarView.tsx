"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { IGetCalendarDetail, IGetCalendarRes } from "@/utils/interface/task";
import CalendarDetail from "./CalendarDetail";
import { LoadingData } from "@/components/LoadingData";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

export default function CalendarView() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadingContext = useContext(LoadingData);
  const fromParam = useMemo(() => searchParams.get("from"), [searchParams]);
  const toParam = useMemo(() => searchParams.get("to"), [searchParams]);
  const [events, setEvents] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (fromParam && toParam) {
      return {
        from: new Date(fromParam),
        to: new Date(toParam),
      };
    }
    return {
      from: new Date(),
      to: new Date(),
    };
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataCalendarDetail, setDataCalendarDetail] =
    useState<IGetCalendarDetail | null>(null);

  const calendarLocale = useMemo(
    () => (locale === "vi" ? viLocale : enLocale),
    [locale]
  );

  useEffect(() => {
    if (fromParam && toParam) {
      const from = new Date(fromParam);
      const to = new Date(toParam);
      fetchEvents(from, to);
    }
  }, [fromParam, toParam]);

  const fetchEvents = async (start: Date, end: Date) => {
    loadingContext?.show();
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
      loadingContext?.hide();
    }
  };

  const handleApplyRange = () => {
    if (dateRange?.from && dateRange?.to) {
      // Cập nhật query string
      const params = new URLSearchParams();
      params.set("from", dateRange.from.toISOString());
      params.set("to", dateRange.to.toISOString());

      router.push(`?${params.toString()}`);

      // Fetch lại dữ liệu
      fetchEvents(dateRange.from, dateRange.to);
    }
  };

  const handleDetailTask = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await taskApiRequest.getCalendarDatail(id);
      if (!res) return;

      const responseData = res?.data;
      if (!responseData) return;

      setDataCalendarDetail(responseData);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
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
            disabled={!dateRange?.from || !dateRange?.to}
          >
            Áp dụng
          </Button>
        </div>
      </div>

      <div className={cn("rounded-md")}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          locale={calendarLocale}
          eventClick={(info) => {
            const id = info.event.id;
            setIsOpen(true);
            handleDetailTask(id);
          }}
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
                🕓 {formatDate(start as Date, "dd/MM/yyyy") as string}
                {end && ` → ${formatDate(end, "dd/MM/yyyy")}`}
              </div>
            );
          }}
        />
      </div>

      <CalendarDetail
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        dataCalendarDetail={dataCalendarDetail}
      />
    </Card>
  );
}

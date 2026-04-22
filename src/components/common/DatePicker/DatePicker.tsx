import { useEffect, useMemo, useRef, useState } from "react";
import "./DatePicker.css";

interface DatePickerProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  onBlur?: () => void;
}

interface CalendarDay {
  date: Date;
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

function formatDisplayDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const startDay = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastOfMonth.getDate();

  const days: CalendarDay[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date,
      iso: toIsoDate(date),
      dayNumber: date.getDate(),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      iso: toIsoDate(date),
      dayNumber: day,
      isCurrentMonth: true,
    });
  }

  const remainder = days.length % 7;
  const nextDaysNeeded = remainder === 0 ? 0 : 7 - remainder;

  for (let day = 1; day <= nextDaysNeeded; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      iso: toIsoDate(date),
      dayNumber: day,
      isCurrentMonth: false,
    });
  }

  return days;
}

export function DatePicker({
  id,
  value,
  onChange,
  hasError = false,
  onBlur,
}: DatePickerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  useEffect(() => {
    if (value) {
      const next = new Date(`${value}T00:00:00`);
      setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBlur]);

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const handleSelectDate = (iso: string, date: Date) => {
    onChange(iso);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
    onBlur?.();
    triggerRef.current?.focus();
  };

  return (
    <div className="date-picker" ref={wrapperRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`date-picker__trigger ${
          hasError ? "date-picker__trigger--error" : ""
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="date-picker__value">
          {value ? formatDisplayDate(value) : "Select date"}
        </span>

        <svg
          className="date-picker__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="date-picker__popover" role="dialog" aria-modal="false">
          <div className="date-picker__header">
            <button
              type="button"
              className="date-picker__nav"
              aria-label="Previous month"
              onClick={() =>
                setVisibleMonth(
                  new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              ‹
            </button>

            <h3 className="date-picker__month-label">
              {getMonthLabel(visibleMonth)}
            </h3>

            <button
              type="button"
              className="date-picker__nav"
              aria-label="Next month"
              onClick={() =>
                setVisibleMonth(
                  new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              ›
            </button>
          </div>

          <div className="date-picker__grid">
            {calendarDays.map((day) => {
              const isSelected = day.iso === value;

              const todayIso = toIsoDate(new Date());
              const isToday = day.iso === todayIso;

              return (
                <button
                  key={day.iso}
                  type="button"
                  className={`date-picker__day ${
                    !day.isCurrentMonth ? "date-picker__day--muted" : ""
                  } ${isSelected ? "date-picker__day--selected" : ""} ${
                    isToday ? "date-picker__day--today" : ""
                  }`}
                  onClick={() => handleSelectDate(day.iso, day.date)}
                >
                  {day.dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

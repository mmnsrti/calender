import React, { useState, useMemo } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
} from "date-fns";
import { formatDate } from "../utils/formatDate";
import { cc } from "../utils/cc";
const Calender = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const calenderDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekEnd = startOfWeek(endOfMonth(selectedMonth));

    return eachDayOfInterval({
      start: firstWeekStart,
      end: lastWeekEnd,
    });
  }, [selectedMonth]);

  return (
    <div>
      <div className="calendar">
        <div className="header">
          <button className="btn">Today</button>
          <div>
            <button className="month-change-btn">&lt;</button>
            <button className="month-change-btn">&gt;</button>
          </div>
          <span className="month-title">June 2023</span>
        </div>
        <div className="days">
          {calenderDays.map((day, index) => (
            <CalenderDay
              key={day.getTime()}
              day={day}
              showWeekName={index < 7}
              selectedMonth={selectedMonth}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type CalenderDayProps = {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
};

function CalenderDay({ day, showWeekName, selectedMonth }: CalenderDayProps) {
  return (
    <div
      className={cc(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day"
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatDate(day, { weekday: "short" })}
          </div>
        )}
        <div className={cc("day-number", isToday(day) && "today")}>
          {formatDate(day, { day: "numeric" })}
        </div>
        <button className="add-event-btn">+</button>
      </div>
      {/* <div className="events">
            <button className="all-day-event blue event">
              <div className="event-name">Short</div>
            </button>
            <button className="all-day-event green event">
              <div className="event-name">
                Long Event Name That Just Keeps Going
              </div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">7am</div>
              <div className="event-name">Event Name</div>
            </button>
          </div> */}
    </div>
  );
}

export default Calender;

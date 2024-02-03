import React, { useState, useMemo, useEffect, useId, Fragment } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { formatDate } from "../utils/formatDate";
import { cc } from "../utils/cc";
import { EVENT_COLOR, useEvent } from "../context/useEvent";
import Modal, { ModalProps } from "./Modal";
import { UnionOmit } from "../utils/types";
import { Event } from "../context/Event";
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
          <button className="btn" onClick={() => setSelectedMonth(new Date())}>
            Today
          </button>
          <div>
            <button
              className="month-change-btn"
              onClick={() => setSelectedMonth((m) => subMonths(m, 1))}
            >
              &lt;
            </button>
            <button
              className="month-change-btn"
              onClick={() => setSelectedMonth((m) => addMonths(m, 1))}
            >
              &gt;
            </button>
          </div>
          <span className="month-title">
            {formatDate(selectedMonth, { month: "long", year: "numeric" })}{" "}
          </span>
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
  const { addEvent } = useEvent();
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
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
        <button
          className="add-event-btn"
          onClick={() => setIsNewEventModalOpen(!isNewEventModalOpen)}
        >
          +
        </button>
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
      <EventFormModal
        date={day}
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={addEvent}
      />
    </div>
  );
}

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | {
      onDelete: () => void;
      event: Event;
      date?: never;
    }
  | {
      onDelete?: never;
      event?: never;
      date?: Date;
    }
) &
  Omit<ModalProps, "children">;

function EventFormModal({
  onDelete,
  event,
  date,
  onSubmit,
  ...modalProps
}: EventFormModalProps) {
  const isNew = event == null;
  const formId = useId();
  const [selectedColor,setSelectedColor]=useState(event?.color||EVENT_COLOR[0])
  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add" : "Edit "} Event</div>
        <small>{formatDate(date || event.date, { dateStyle: "long" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input type="text" name="name" id={`${formId}-name`} />
        </div>
        <div className="form-group checkbox">
          <input type="checkbox" name="all-day" id={`${formId}-all-day`} />
          <label htmlFor={`${formId}-all-day`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input type="time" name="start-time" id={`${formId}-start-time`} />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input type="time" name="end-time" id={`${formId}-end-time`} />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENT_COLOR.map((c) => (
              <Fragment key={c}>
                <input
                  type="radio"
                  name="color"
                  value={c}
                  id={`${formId}-${c}`}

                  checked={selectedColor===c}
                  onChange={()=>setSelectedColor(c)}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${c}`}>
                  <span className="sr-only">{c}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {isNew ? "Add" : "Edit"}
          </button>
          {onDelete != null && (
            <button onClick={onDelete} className="btn btn-delete" type="button">
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default Calender;

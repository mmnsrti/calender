import {
  useState,
  useMemo,
  useRef,
  useId,
  Fragment,
  FormEvent,
  useEffect,
} from "react";
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
  isSameDay,
  parse,
} from "date-fns";
import { formatDate } from "../utils/formatDate";
import { cc } from "../utils/cc";
import { EVENT_COLOR, useEvent } from "../context/useEvent";
import Modal, { ModalProps } from "./Modal";
import { UnionOmit } from "../utils/types";
import { Event } from "../context/Event";
import OverflowContainer from "./OverflowContainer";
import DarkMode from "./darkMode/darkMode";
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
  const { events,dark } = useEvent();
  return (
    <div>
      <div className={dark ? "calendar dark-mode" : "calendar"}>
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
            {formatDate(selectedMonth, { month: "long", year: "numeric" })}
          </span>
          <DarkMode 
           
          />
        </div>
        <div className="days">
          {calenderDays.map((day, index) => (
            <CalenderDay
              key={day.getTime()}
              day={day}
              showWeekName={index < 7}
              selectedMonth={selectedMonth}
              events={events.filter((e) => isSameDay(day, e.date))}
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
  events: Event[];
};

function CalenderDay({
  day,
  showWeekName,
  selectedMonth,
  events,
}: CalenderDayProps) {
  const { addEvent } = useEvent();
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isViewMoreEventModalOpen, setIsViewMoreEventModalOpen] =
    useState(false);
  const sortedEvents = useMemo(() => {
    const timeToNumber = (time: string) => parseFloat(time.replace(":", "."));

    return [...events].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0;
      } else if (a.allDay) {
        return -1;
      } else if (b.allDay) {
        return 1;
      } else {
        return timeToNumber(a.startTime) - timeToNumber(b.startTime);
      }
    });
  }, [events]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const totalMinutesInDay = 25 * 60;
  const currentMinutes = currentHour * 60 + currentMinute;
  const heightPercentage = (currentMinutes / totalMinutesInDay) * 100;
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--current-time-height",
      `${heightPercentage}%`
    );
  }, [heightPercentage]);

  return (
    <div
      className={cc(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day",
        isToday(day) && `current-time-indicator`
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatDate(day, { weekday: "long" })}
          </div>
        )}
        <div className={cc("day-number", isToday(day) && " today")}>
          {formatDate(day, { day: "2-digit" })}
        </div>
        <div
          className={cc(isToday(day) && "")}
          style={{ height: `${heightPercentage}%` }}
        >
          {isToday(day) && formatDate(currentTime, { timeStyle: "short" })}
        </div>

        <button
          className="add-event-btn "
          onClick={() => setIsNewEventModalOpen(!isNewEventModalOpen)}
        >
          +
        </button>
      </div>
      {events.length > 0 && (
        <div className="events">
          {sortedEvents.length > 0 && (
            <OverflowContainer
              className="events"
              items={sortedEvents}
              getKey={(event) => event.id}
              renderItem={(event) => <CalenderEvent event={event} />}
              renderOverflow={(amount) => (
                <>
                  <button
                    onClick={() => setIsViewMoreEventModalOpen(true)}
                    className="events-view-more-btn"
                  >
                    +{amount} More
                  </button>
                  <ViewMoreCalendarEventsModal
                    events={sortedEvents}
                    isOpen={isViewMoreEventModalOpen}
                    onClose={() => setIsViewMoreEventModalOpen(false)}
                  />
                </>
              )}
            />
          )}
        </div>
      )}
      <EventFormModal
        date={day}
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={addEvent}
      />
    </div>
  );
}
type ViewMoreCalendarEventsModalProps = {
  events: Event[];
} & Omit<ModalProps, "children">;

function ViewMoreCalendarEventsModal({
  events,
  ...modalProps
}: ViewMoreCalendarEventsModalProps) {
  if (events.length === 0) return null;
  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <small>{formatDate(events[0].date, { dateStyle: "long" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <div className="events">
        {events.map((event) => (
          <CalenderEvent event={event} key={event.id} />
        ))}
      </div>
    </Modal>
  );
}

function CalenderEvent({ event }: { event: Event }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { updateEvent, deleteEvent } = useEvent();
  return (
    <>
      <button
        className={cc("event", event.color, event.allDay && "all-day-event ")}
        onClick={() => setIsEditOpen(true)}
      >
        {event.allDay ? (
          <div className="event-name">{event.name}</div>
        ) : (
          <>
            <div className={`color-dot blue ${event.color}`}></div>
            <div className="event-time">
              {formatDate(parse(event.startTime, "HH:mm", event.date), {
                timeStyle: "short",
              })}
            </div>
            <div className="event-name">{event.name}</div>
          </>
        )}
      </button>
      <EventFormModal
        event={event}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(e) => updateEvent(event.id, e)}
        onDelete={() => deleteEvent(event.id)}
      />
    </>
  );
}
type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | { onDelete: () => void; event: Event; date?: never }
  | { onDelete?: never; event?: never; date: Date }
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
  const endTimeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENT_COLOR[0]
  );
  const [isAllDayChecked, setIsAllDayChecked] = useState(
    event?.allDay || false
  );
  const [startTime, setStartTime] = useState(event?.startTime || "");
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const name = nameRef.current?.value;
    const endTime = endTimeRef.current?.value;

    if (name == null || name === "") return;

    const commonProps = {
      name,
      date: date || event?.date,
      color: selectedColor,
    };
    let newEvent: UnionOmit<Event, "id">;

    if (isAllDayChecked) {
      newEvent = {
        ...commonProps,
        allDay: true,
      };
    } else {
      if (
        startTime == null ||
        startTime === "" ||
        endTime == null ||
        endTime === ""
      ) {
        return;
      }
      newEvent = {
        ...commonProps,
        allDay: false,
        startTime,
        endTime,
      };
    }

    modalProps.onClose();
    onSubmit(newEvent);
  }
  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add" : "Edit "} Event</div>
        <small>{formatDate(date || event.date, { dateStyle: "long" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            defaultValue={event?.name}
            required
            type="text"
            name="name"
            ref={nameRef}
            id={`${formId}-name`}
          />
        </div>
        <div className="form-group checkbox">
          <input
            checked={isAllDayChecked}
            onChange={(e) => setIsAllDayChecked(e.target.checked)}
            type="checkbox"
            name="all-day"
            id={`${formId}-all-day`}
          />
          <label htmlFor={`${formId}-all-day`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              required={!isAllDayChecked}
              disabled={isAllDayChecked}
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              name="start-time"
              id={`${formId}-start-time`}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              ref={endTimeRef}
              defaultValue={event?.endTime}
              required={!isAllDayChecked}
              min={startTime}
              disabled={isAllDayChecked}
              type="time"
              name="end-time"
              id={`${formId}-end-time`}
            />
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
                  checked={selectedColor === c}
                  onChange={() => setSelectedColor(c)}
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

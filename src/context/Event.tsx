import { createContext, useEffect, useState } from "react";
import { UnionOmit } from "../utils/types";
import { EVENT_COLOR } from "./useEvent";

export type Event = {
  id: string;
  name: string;
  color: (typeof EVENT_COLOR)[number];
  date: Date;
} & (
  | { allDay: false; startTime: string; endTime: string }
  | { allDay: true; startTime?: never; endTime?: never }
);
type EventsContext = {
  events: Event[];
  addEvent: (event: UnionOmit<Event, "id">) => void;
  updateEvent: (id: string, event: UnionOmit<Event, "id">) => void;
  deleteEvent: (id: string) => void;
};

export const Context = createContext<EventsContext | null>(null);

type EventProviderProps = {
  children: React.ReactNode;
};
export function EventProvider({ children }: EventProviderProps) {
  const [events, setEvents] = useLocalStorage("events", []);
  function addEvent(event: UnionOmit<Event, "id">) {
    setEvents((e) => [...e, { ...event, id: crypto.randomUUID() }]);
  }
  function updateEvent(id: string, eventDetails: UnionOmit<Event, "id">) {
    setEvents((e) => {
      return e.map((event) => {
        return event.id === id ? { id, ...eventDetails } : event;
      });
    });
  }
  function deleteEvent(id: string) {
    setEvents(events.filter((event) => event.id !== id));
  }

  return (
    <Context.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </Context.Provider>
  );
}

function useLocalStorage(key: string, initialValue: Event[]) {
  const [value, setValue] = useState<Event[]>(() => {
    const v = localStorage.getItem(key);
    if (v == null) {
      return initialValue;
    }
    return (JSON.parse(v) as Event[]).map((event) => {
      if (event.date instanceof Date) return event;
      return { ...event, date: new Date(event.date) };
    });
  });
  useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value));
}, [key, value])

  return [value, setValue] as const;

}

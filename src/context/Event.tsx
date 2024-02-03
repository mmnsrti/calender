import { createContext, useContext, useState } from "react";
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
  addEvent:(event : UnionOmit<Event ,'id'>)=>void
};

export const Context = createContext<EventsContext | null>(null);

type EventProviderProps={
    children: React.ReactNode;
}
export function EventProvider ({ children }: EventProviderProps) {
    const [events, setEvents] = useState<Event[]>([])
    function addEvent (event:UnionOmit<Event,'id'>){
        setEvents(e=>[...e,{...event,id:crypto.randomUUID()}])
    }
    return <Context.Provider value={{events,addEvent}}>{children}</Context.Provider>
}

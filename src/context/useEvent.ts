import  { useContext } from "react";
import { Context } from "./Event";
export const EVENT_COLOR = ["red", "green", "blue"] as const;

export const useEvent = () => {

  const value = useContext(Context);
  if (value == null) {
    throw new Error("useEvent must be used within a EventProvider");
  }
  return value;
};

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Calender from "./components/Calender";
import { EventProvider } from "./context/Event";

function App() {
  return (
    <EventProvider>
      <Calender />
    </EventProvider>
  );
}

export default App;

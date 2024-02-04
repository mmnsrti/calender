import Calender from "./components/Calender";
import { EventProvider } from "./context/Event";
import "./App.css";

function App() {
  return (
    <EventProvider>
      <Calender />
    </EventProvider>
  );
}

export default App;

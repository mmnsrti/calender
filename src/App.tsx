<<<<<<< HEAD
import Calender from "./components/Calender";
import { EventProvider } from "./context/Event";
import "./App.css";

function App() {
  return (
    <EventProvider>
      <Calender />
    </EventProvider>
  );
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calender from './components/Calender'

function App() {

  return (
    <>
    <Calender/>
     
    </>
  )
>>>>>>> 3d9964b (added datefns function  and changed some styles)
}

export default App;

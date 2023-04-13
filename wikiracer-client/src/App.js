import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewHome from './Components/NewHome';
import Room from "./Components/Room";
import JoinRoom from "./Components/JoinRoom";
import HostRoom from "./Components/HostRoom"
import SocketManager from "./Components/SocketManager";
import { GlobalProvider } from "./context/GlobalContext";
import socketIOClient from "socket.io-client";

const SERVER_URL = "http://localhost:4001/";
const socket = socketIOClient(SERVER_URL);

const App = () => {
  useEffect(() => {
    fetch('/');
  }, []);

  return (
    <GlobalProvider>
      <SocketManager socket={socket} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewHome socket={socket} />} />
          <Route path="/join/" element={<JoinRoom socket={socket}/>} />
          <Route path="/host/" element={<HostRoom socket={socket}/>} />
          <Route path="/room/:roomID/" element={<Room socket={socket} />} />
          <Route path="/room/:roomID/:articleTitle/" element={<Room socket={socket} />} />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;

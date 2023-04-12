import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import NewHome from './Components/NewHome';
import Room from "./Components/Room";
import SocketManager from "./Components/SocketManager";
import { GlobalContext, GlobalProvider } from "./context/GlobalContext";
import socketIOClient from "socket.io-client";
const SERVER_URL = "http://localhost:4001/";
const socket = socketIOClient(SERVER_URL);

const App = () => {
  useEffect(() => {
    // connect to backend server
    fetch('/');
  }, []);

  return (
    <GlobalProvider>
      <SocketManager socket={socket} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewHome socket={socket} />} />
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

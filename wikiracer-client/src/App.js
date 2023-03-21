import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
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

  const { startArticle, roomCode } = useContext(GlobalContext);

  return (
    <GlobalProvider>
      <SocketManager socket={socket} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/room/:id/" element={<Room socket={socket} />} />
          <Route path="/room/:id/:articleTitle/" element={<Room socket={socket} />} />
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

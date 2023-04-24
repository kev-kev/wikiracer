import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Home = ({ socket }) => {
  const {
    setHost,
    setIsHost,
    setGuest,
    clearContext,
    roomID
  } = useContext(GlobalContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if(roomID) socket.emit("DISCONNECT");
    clearContext();
  }, [roomID]);  
  
  const handleJoinClick = () => {
    socket.emit(
      "JOIN_ROOM", roomCode, usernameInput, (response) => {
        if(response.invalidRoom) {
          alert("invalid room code");
          return;
        }
        setGuest(usernameInput);
        setHost(response.room["host"]);
        navigate(`/room/${roomCode}/`);
      }
    );
  }

  const handleHostClick = () => {
    socket.emit(
      "CREATE_ROOM", usernameInput, (response) => {
        const { roomCode } = response;
        setHost(usernameInput);
        setIsHost(true);
        navigate(`/room/${roomCode}/`);
      }
    );
  }

  return (
    <div>
      <h1>Home</h1>
      <label htmlFor="usernameInput">username</label><br/>
      <input 
        name="usernameInput" 
        onChange={(e) => setUsernameInput(e.target.value)}
        value={usernameInput}
      /><br/>
      <label htmlFor="roomCode">room code</label><br/>
      <input 
        name="roomCode" 
        onChange={(e) => setRoomCode(e.target.value)}
        value={roomCode}
      /><br/>
      <button
        disabled={roomCode.length !== 4 || usernameInput.length < 1}
        onClick={() => handleJoinClick()}
      >
        Join
      </button><br/><br/>
      <button
        disabled={usernameInput.length < 1}
        onClick={() => handleHostClick()}
      >
        Host
      </button>
      <br/>
    </div>
  );
}

export default Home
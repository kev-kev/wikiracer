import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Home = ({ socket }) => {
  const {
    setHost,
    setIsHost,
    setGuest,
    clearContext
  } = useContext(GlobalContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [roomID, setRoomID] = useState("");

  useEffect(() => {
    clearContext();
  }, [])
  
  const navigate = useNavigate();
  
  const handleJoinClick = () => {
    console.log("Joining room");
    socket.emit(
      "JOIN_ROOM", roomID, usernameInput, (response) => {
        if(response.invalidRoom) {
          alert("invalid room code");
          return;
        }
        setGuest(usernameInput);
        setHost(response.room["host"]);
        navigate(`/room/${roomID}/`);
      }
    )
  }

  const handleHostClick = () => {
    console.log("Hosted");
    socket.emit(
      "NEW_ROOM", usernameInput, (response) => {
        const { roomID } = response;
        setHost(usernameInput);
        setIsHost(true);
        navigate(`/room/${roomID}/`);
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
      <label htmlFor="roomID">room code</label><br/>
      <input 
        name="roomID" 
        onChange={(e) => setRoomID(e.target.value)}
        value={roomID}
      /><br/>
      <button
        disabled={roomID.length !== 4 || usernameInput.length < 1}
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
  )
}

export default Home
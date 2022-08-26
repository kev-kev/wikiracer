import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Home = (props) => {
  const navigate = useNavigate();
  const {
    setRoomCode,
  } = useContext(GlobalContext);

  const handleJoinClick = () => {
     console.log("Joined");
     navigate("/room/1");
  }

  const handleHostClick = () => {
     console.log("Hosted");
      props.socket.emit(
        "NEW_ROOM", (response) => {
          const roomCode = response.roomCode; // const {roomCode} = response;
          setRoomCode(roomCode);
          navigate(`/room/${roomCode}`);
        }
      );
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => handleJoinClick()}>Join</button><br/>
      <button onClick={() => handleHostClick()}>Host</button>
    </div>

   
  )
}

export default Home
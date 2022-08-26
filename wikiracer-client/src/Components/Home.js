import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Home = (props) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");

  const navigate = useNavigate();
  const {
    setRoomCode,
    setHost,
    setGuest
  } = useContext(GlobalContext);

  const handleJoinClick = () => {
     console.log("Joined");
     props.socket.emit(
      "JOIN_ROOM", roomCodeInput, usernameInput, (response) => {
        setRoomCode(roomCodeInput);
        setGuest(usernameInput);
        setHost(response.room.host)
        navigate(`/room/${roomCodeInput}`);
      }
     )
  }

  const handleHostClick = () => {
     console.log("Hosted");
      props.socket.emit(
        "NEW_ROOM", usernameInput, (response) => {
          const {roomCode} = response;
          setRoomCode(roomCode);
          setHost(usernameInput);
          navigate(`/room/${roomCode}`);
        }
      );
  }

  return (
    <div>
      <h1>Home</h1>
      <label for="usernameInput">username</label><br/>
      <input 
        name="usernameInput" 
        onChange={(e) => setUsernameInput(e.target.value)}
        value={usernameInput}
      /><br/>
      <label for="roomCodeInput">room code</label><br/>
      <input 
        name="roomCodeInput" 
        onChange={(e) => setRoomCodeInput(e.target.value)}
        value={roomCodeInput}
      /><br/>
      <button onClick={() => handleJoinClick()}>Join</button><br/><br/>
      <button onClick={() => handleHostClick()}>Host</button><br/>
    </div>

   
  )
}

export default Home
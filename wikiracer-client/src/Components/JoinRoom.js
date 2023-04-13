import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import HomeNav from './HomeNav';

const JoinRoom = ({ socket }) => {
  const {
    setGuest,
    setHost,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [roomCode, setRoomCode] = useState("");

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
  
  return (
    <div>
      <HomeNav />
      <input 
        name="usernameInput" 
        onChange={(e) => setUsernameInput(e.target.value)}
        value={usernameInput}
      />
      <button
        disabled={roomCode.length !== 4 || usernameInput.length < 1}
        onClick={() => handleJoinClick()}
      >
        Join
      </button>
    </div>
  )
}

export default JoinRoom
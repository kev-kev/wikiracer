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
  const [roomCodeInput, setRoomCodeInput] = useState("");

  const handleJoinClick = () => {
    socket.emit(
      "JOIN_ROOM", roomCodeInput, usernameInput, (response) => {
        if(response.invalidRoom) {
          alert("invalid room code");
          return;
        }
        setGuest(usernameInput);
        setHost(response.room["host"]);
        navigate(`/room/${roomCodeInput}/`);
      }
    );
  }
  
  return (
    <>
      <HomeNav />
      <div>
        <label for="usernameInput">Username</label>
        <input 
          name="usernameInput" 
          onChange={(e) => setUsernameInput(e.target.value)}
          value={usernameInput}
        />
        <label for="roomCodeInput">Room Code</label>
        <input 
          name="roomCodeInput" 
          onChange={(e) => setRoomCodeInput(e.target.value)}
          value={roomCodeInput}
        />
        <button
          disabled={roomCodeInput.length !== 4 || usernameInput.trim().length < 1}
          onClick={() => handleJoinClick()}
        >
          Join
        </button>
      </div>
    </>
  )
}

export default JoinRoom
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
      <div className="form-container">
        <img className="join-room-img header-img" src="/join-room.png" alt="Join a Room!" />
        <div className="form">
          <div className='input-container'>
            <label htmlFor="usernameInput">Username</label>
            <input 
              className='username-input form-input'
              name="usernameInput" 
              onChange={(e) => setUsernameInput(e.target.value)}
              maxLength={16}
              value={usernameInput}
            />
          </div>
          <div className='input-container'>
            <label htmlFor="roomCodeInput">Room Code</label>
            <input 
              className='room-code-input form-input'
              name="roomCodeInput" 
              onChange={(e) => setRoomCodeInput(e.target.value)}
              maxLength={4}
              value={roomCodeInput}
            />
          </div>
          <div
            className='join-room-btn round-btn'
            disabled={roomCodeInput.length !== 4 || usernameInput.trim().length < 1}
            onClick={() => handleJoinClick()}
          >
            <span>JOIN ROOM</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default JoinRoom
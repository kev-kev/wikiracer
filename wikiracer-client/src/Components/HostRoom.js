import React, { useState, useContext } from 'react'
import HomeNav from './HomeNav'
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

const HostRoom = ({ socket }) => {
  const {
    setHost,
    setIsHost,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");

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
    <>
      <HomeNav />
      <div className="form-container">
        <img className="host-room-img header-img" src="/host-room.png" alt="Host a Room!" />
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
          <div
            className='host-room-btn round-btn'
            disabled={usernameInput.length < 4}
            onClick={handleHostClick}
          >
            <span>HOST ROOM</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default HostRoom
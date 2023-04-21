import React, { useContext, useState, useEffect, useRef } from 'react'
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
  const [roomCodeInput, setRoomCodeInput] = useState(['', '', '', '']);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];


  const handleChangeRoomCodeInput = (index, value) => {
    value = value.toUpperCase();
    const newCode = [...roomCodeInput];
    newCode[index] = value;
    setRoomCodeInput(newCode);
  };

  const handleRoomCodeInputClick = () => {
    // Find the first empty input and set focus to it
    const emptyInput = refs.find((ref) => ref.current && ref.current.value === '');
    if (emptyInput) emptyInput.current.focus();
  }

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
      <div className="join-container">
        <img className="join-img" src="/join-room.png" alt="Join a Room!" />
        <div className="join-form">
          <div className='input-container'>
            <label htmlFor="usernameInput">Username</label>
            <input 
              className='form-input'
              name="usernameInput" 
              onChange={(e) => setUsernameInput(e.target.value)}
              value={usernameInput}
            />
          </div>
          <div className='input-container'>
            <label htmlFor="roomCodeInput">Room Code</label>
            {/* <input 
              className='form-input'
              name="roomCodeInput" 
              onChange={(e) => setRoomCodeInput(e.target.value)}
              value={roomCodeInput}
            /> */}
            <div className="room-code-input">
              <input type="text" maxLength={1} value={roomCodeInput[0]} onClick={handleRoomCodeInputClick} onChange={(e) => handleChangeRoomCodeInput(0, e.target.value)} ref={refs[0]}/>
              <input type="text" maxLength={1} value={roomCodeInput[1]} onClick={handleRoomCodeInputClick} onChange={(e) => handleChangeRoomCodeInput(1, e.target.value)} ref={refs[1]}/>
              <input type="text" maxLength={1} value={roomCodeInput[2]} onClick={handleRoomCodeInputClick} onChange={(e) => handleChangeRoomCodeInput(2, e.target.value)} ref={refs[2]}/>
              <input type="text" maxLength={1} value={roomCodeInput[3]} onClick={handleRoomCodeInputClick} onChange={(e) => handleChangeRoomCodeInput(3, e.target.value)} ref={refs[3]}/>
            </div>

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
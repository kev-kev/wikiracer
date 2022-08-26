import React from 'react'
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const navigate = useNavigate();
  const handleStartGame = () => {
    console.log("Start game clicked");
  };

  const handleExitRoom = () => {
    navigate("/");
  };

  return (
    <>
      <div>Room Code: </div>
      <div>Players: </div>
      <button onClick={() => handleStartGame()}>Start Game</button><br/>
      <button onClick={() => handleExitRoom()}>Exit Room</button>
    </>
  );
}

export default Room
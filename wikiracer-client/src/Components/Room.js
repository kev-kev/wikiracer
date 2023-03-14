import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import WikipediaContent from './WikipediaContent';

const Room = ({socket}) => {
  const {
    host,
    guest,
    startGame,
    roomCode,
    isHost,
    gameInProgress,
    username,
    winGame,
    forfeitGame,
    winner,
    startArticle,
    setStartArticle,
    endArticle,
    setEndArticle,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const urlParams = useParams();
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, exit room.

  // TODO: Add timer to state https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks

  useEffect(() => {
    setStartArticle("waluigi");
    setEndArticle("wario");
  }, []);

  const handleStartGame = () => {
    console.log("Start game clicked");
    startGame();
    socket.emit("GAME_START", roomCode);
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens (stretch)
  const handleExitRoom = () => {
    socket.emit("USER_LEFT", isHost, roomCode);
    debugger
    navigate("/");
  };

  const renderGameArea = () => {
    if (gameInProgress) {
      return "GAME IS IN PROGRESS!";
    } else if (!isHost) {
      return "Waiting for host to start game...";
    }
  } 

  const handleWinGame = () => {
    socket.emit("GAME_WIN", username, roomCode);
    winGame(username);
  }
  
  const handleForfeitGame = () => {
    socket.emit("GAME_FORFEIT", username, roomCode);
    forfeitGame(username);
  }

  return (
    <>
      {!roomCode && <Navigate to="/" />}
      <div>Room Code: {roomCode} </div>
      <br />
      {winner && <h2>Winner: {winner}</h2>}
      <div>
        <div>Host: {host} {isHost ? "(You)" : ""}</div>
        <div>Guest: {guest} {isHost ? "" : "(You)"}</div>
        <button
          onClick={() => handleStartGame()}
          disabled={!isHost || gameInProgress}
        >
          Start Game
        </button><br />
        {renderGameArea()}
        <button onClick={() => handleWinGame()}>Win Game</button>
        <br/>
        <button onClick={() => handleForfeitGame()}>Forfeit Game</button>
        <br/>
        <button onClick={() => handleExitRoom()}>Exit Room</button> <br/>
        <h3>Start: {startArticle}</h3>
        <h3>End: {endArticle}</h3>
        <WikipediaContent />
      </div>
    </>
  );
}

export default Room
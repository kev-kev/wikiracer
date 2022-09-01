import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const Room = (props) => {
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
    winner
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const urlParams = useParams();
  const iFrameRef = useRef(null);
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, exit room.

  // TODO: Add timer to state https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks

  const handleStartGame = () => {
    console.log("Start game clicked");
    startGame();
    props.socket.emit("GAME_START", roomCode);
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens (stretch)
  const handleExitRoom = () => {
    props.socket.emit("USER_LEFT", isHost, roomCode);
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
    props.socket.emit("GAME_WIN", username, roomCode);
    winGame(username);
  }
  
  const handleForfeitGame = () => {
    props.socket.emit("GAME_FORFEIT", username, roomCode);
    forfeitGame(username);
  }

  const renderIframe = () => {
    return (
      <iframe src="https://en.wikipedia.org/wiki/Special:Random" height="800" width="80%" 
        onLoad={() => console.log(iFrameRef.current.contentWindow.location.href)}
        ref={iFrameRef}
      />
    )

  }

  // TODO: Add wikipedia iframe here and listen for onLoad
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
        {renderIframe()}
      </div>
    </>
  );
}

export default Room
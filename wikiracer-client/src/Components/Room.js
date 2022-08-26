import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const Room = (props) => {
  const {
    host,
    guest,
    startGame,
    roomCode,
    isHost,
    gameInProgress
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const urlParams = useParams();

  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, exit room.

  const handleStartGame = () => {
    console.log("Start game clicked");
    startGame();
    props.socket.emit("GAME_START", roomCode);
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens
  const handleExitRoom = () => {
    navigate("/");
  };

  const renderGameArea = () => {
    if (gameInProgress) {
      return "GAME IS IN PROGRESS!";
    } else if (!isHost) {
      return "Waiting for host to start game...";
    }
  }
  // TODO: Add wikipedia iframe here and listen for onLoad
  return (
    <>
      <div>Room Code: {roomCode} </div>
      <br />
      <div>Host: {host} {isHost ? "(You)" : ""}</div>
      <div>Guest: {guest} {isHost ? "" : "(You)"}</div>
      <button
        onClick={() => handleStartGame()}
        disabled={!isHost || gameInProgress}
      >
        Start Game
      </button><br />
      {renderGameArea()}
      <br/>
      <button onClick={() => handleExitRoom()}>Exit Room</button>
    </>
  );
}

export default Room
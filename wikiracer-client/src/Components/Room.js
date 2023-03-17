import { useNavigate, Navigate, useParams, } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import WikipediaContent from './WikipediaContent';

const compareArticles = (str1, str2) => {
  return str1.toLowerCase().split("_").join(" ") === str2.toLowerCase().split("_").join(" "); 
}
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
  const { articleTitle } = useParams();
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, exit room.
  useEffect(() => {
    setStartArticle("waluigi");
    setEndArticle("wario");
  }, []);

  useEffect(() => {
    navigate(`/room/${roomCode}/${startArticle}`);
  }, [startArticle])

  useEffect(() => {
    if(articleTitle && compareArticles(articleTitle, endArticle)) winGame(username);
  }, [articleTitle])

  const handleStartGame = () => {
    console.log("Start game clicked");
    startGame();
    socket.emit("GAME_START", roomCode);
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens (stretch)
  const handleExitRoom = () => {
    socket.emit("USER_LEFT", roomCode);
    navigate("/");
  };

  const renderGameArea = () => {
    return gameInProgress ? "Game is in progress!" : "Waiting for host to start the game..."
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
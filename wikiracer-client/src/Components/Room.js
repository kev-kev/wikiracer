import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import WikipediaContent from './WikipediaContent';

const compareArticles = (str1, str2) => {
  return str1.toLowerCase().split("_").join(" ") === str2.toLowerCase().split("_").join(" "); 
}

const Room = ({ socket }) => {
  const {
    host,
    guest,
    startGame,
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
    clearContext,
  } = useContext(GlobalContext);

  const [startArticleInput, setStartArticleInput] = useState("");
  const [endArticleInput, setEndArticleInput] = useState("");

  const navigate = useNavigate();
  const { roomID, articleTitle } = useParams();
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, redirect to /.

  useEffect(() => {
    socket.emit("ROOM_CHECK", roomID, (res) => {
      if(!res.roomExists) navigate('/');
    })
  }, [])

  useEffect(() => {
    if(gameInProgress) navigate(`/room/${roomID}/${startArticle}/`);
  }, [gameInProgress])

  useEffect(() => {
    if(articleTitle && compareArticles(articleTitle, endArticle)) handleWinGame(username);
  }, [articleTitle]);

  useEffect(() => {
    if(guest && startArticle && endArticle) {
      socket.emit("SEND_ARTICLES", roomID, startArticle, endArticle);
    }
  }, [guest])

  const handleStartGame = () => {
    // navigate(`/room/${roomID}/${startArticle}/`);
    startGame();
    socket.emit("GAME_START", roomID);
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens (stretch)
  const handleExitRoom = () => {
    socket.emit("USER_LEFT", roomID);
    clearContext();
    navigate("/");
  };

  const renderGameArea = () => {
    return gameInProgress ? "Game is in progress!" : "Waiting for host to start the game..."
  } 

  const handleWinGame = () => {
    socket.emit("GAME_WIN", username, roomID);
    winGame(username);
  }
  
  const handleForfeitGame = () => {
    socket.emit("GAME_FORFEIT", username, roomID);
    forfeitGame(username);
  }

  const renderGameControls = () => {
    return(
      <>
        <button
          onClick={() => handleStartGame()}
          disabled={!isHost || gameInProgress}
        >
          Start Game
        </button><br />
        {renderGameArea()}
        <button onClick={() => handleWinGame()}>Win Game</button> <br/>
        <button onClick={() => handleForfeitGame()}>Forfeit Game</button> <br/>
        <button onClick={() => handleExitRoom()}>Exit Room</button> <br/>
        <h3>Start: {startArticle}</h3>
        <h3>End: {endArticle}</h3>
      </>
    )
  }

  const handleGameFormSubmit = (e) => {
    e.preventDefault();
    if(
      (startArticleInput.trim().split("_").join("").split(" ").join("").toLowerCase() ===
      endArticleInput.trim().split("_").join("").split(" ").join("").toLowerCase()) ||
      (!startArticleInput || !endArticleInput)
    ) {
      alert('Invalid start / end article!')
    } else {
      setStartArticle(startArticleInput);
      setEndArticle(endArticleInput);
      if(guest) socket.emit("SEND_ARTICLES", roomID, startArticle, endArticle);
    }
  }

  const renderGameForm = () => {
    return (
      <form onSubmit={(e) => handleGameFormSubmit(e)}>
        <label htmlFor='start-article'>Start Article</label> <br/>
        <input type="text" name="start-article" onChange={(e) => setStartArticleInput(e.target.value)} value={startArticleInput} /> <br/>
        <label htmlFor='end-article'>End Article</label> <br/>
        <input type="text" name="end-article" onChange={(e) => setEndArticleInput(e.target.value)} value={endArticleInput} /> <br/>
        <input type="submit"/>
      </form>
    )
  }

  return (
    <>
      {!roomID && <Navigate to="/" />}
      <div>Room Code: {roomID} </div>
      <br />
      {winner && <h2>Winner: {winner}</h2>}
      <div>
        <div>Host: {host} {isHost ? "(You)" : ""}</div>
        <div>Guest: {guest} {isHost ? "" : "(You)"}</div>
        {renderGameControls()}
        {(isHost && !gameInProgress) && renderGameForm()}
        {gameInProgress && <WikipediaContent />}
      </div>
    </>
  );
}

export default Room
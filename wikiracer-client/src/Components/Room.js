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
    setRoomID
  } = useContext(GlobalContext);

  const [startArticleInput, setStartArticleInput] = useState("");
  const [endArticleInput, setEndArticleInput] = useState("");
  const [startSearchResults, setStartSearchResults] = useState([]);
  const [endSearchResults, setEndSearchResults] = useState([]);
  const [shouldSearch, setShouldSearch] = useState(false);

  const navigate = useNavigate();
  const { articleTitle, roomID } = useParams();
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, redirect to /.

  useEffect(() => {
    setRoomID(roomID);
  }, []);

  useEffect(() => {
    socket.emit("ROOM_CHECK", roomID, (res) => {
      if(!res.roomExists) navigate('/');
    });
  }, [roomID]);

  useEffect(() => {
    if(articleTitle && compareArticles(articleTitle, endArticle)) handleWinGame(username);
  }, [articleTitle]);

  useEffect(() => {
    if(guest) {
      startArticle && socket.emit("SEND_ARTICLE", roomID, startArticle, 'start');
      endArticle && socket.emit("SEND_ARTICLE", roomID, endArticle, 'end');
    }
  }, [guest, startArticle, endArticle]);

  const handleStartGame = () => {
    startGame();
    socket.emit("GAME_START", roomID);
  }

  // TODO: Set idle timeout and trigger exit room if nothing happens (stretch)
  const handleExitRoom = () => {
    socket.emit("USER_LEFT", roomID);
    clearContext();
    navigate("/");
  }

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
    );
  }

  // TODO: change timeout so it's cancellable, then cancel it on every call of handleChangearticleInput
  const handleChangeArticleInput = async (type, value) => {
    const searchTimeout = delay => new Promise(resolve => setTimeout(resolve, delay));
    type === 'start' ? setStartArticleInput(value) : setEndArticleInput(value);
    await searchTimeout(1000);
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${value}&origin=*`);
    const data = await res.json();
    type === 'start' ? setStartSearchResults(data[1]) : setEndSearchResults(data[1]);
  }

  const renderSearchResults = (type) => {
    const arr = type === 'start' ? startSearchResults : endSearchResults;
    const searchResults = [];
    for(let i = 0; i < arr?.length; i++) {
      if([startArticle, endArticle].includes(arr[i])) continue;
      searchResults.push (
        <div onClick={() => type === 'start' ? handleArticleSelect('start', arr[i]) : handleArticleSelect('end', arr[i])}>{arr[i]}</div>
      );
    }
    return searchResults;
  }

  const handleArticleSelect = (type, value) => {
    type === 'start' ? setStartArticle(value) : setEndArticle(value);
  }

  const renderGameForm = () => {
    return (
      <>
        <label htmlFor='start-article'>Start Article</label> <br/>
        <input type="text" name="start-article" onChange={(e) => handleChangeArticleInput('start', e.target.value)} value={startArticleInput} /> <br/>
        <div className='search-results start-search-results'>
          {renderSearchResults('start')}
        </div> <br/>
        <label htmlFor='end-article'>End Article</label> <br/>
        <input type="text" name="end-article" onChange={(e) => handleChangeArticleInput('end', e.target.value)} value={endArticleInput} /> <br/>
        <div className='search-results end-search-results'>
          {renderSearchResults('end')}
        </div> <br/>
      </>
    );
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
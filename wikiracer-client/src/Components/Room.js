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
  const [startSearchResults, setStartSearchResults] = useState([]);

  const navigate = useNavigate();
  const { roomID, articleTitle } = useParams();
  
  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, redirect to /.

  useEffect(() => {
    socket.emit("ROOM_CHECK", roomID, (res) => {
      if(!res.roomExists) navigate('/');
    })
  }, []);

  useEffect(() => {
    if(articleTitle && compareArticles(articleTitle, endArticle)) handleWinGame(username);
  }, [articleTitle]);

  useEffect(() => {
    if(guest && startArticle && endArticle) {
      socket.emit("SEND_ARTICLES", roomID, startArticle, endArticle);
    }
  }, [guest]);

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

  const handleGameFormSubmit = (e) => {
    e.preventDefault();
    if(
      (startArticleInput.trim().split("_").join("").split(" ").join("").toLowerCase() ===
      endArticleInput.trim().split("_").join("").split(" ").join("").toLowerCase()) ||
      (!startArticleInput || !endArticleInput)
    ) {
      alert('Invalid start / end article!');
    } else {
      setStartArticle(startArticleInput);
      setEndArticle(endArticleInput);
      if(guest) socket.emit("SEND_ARTICLES", roomID, startArticleInput, endArticleInput);
    }
  }

  const getSearchResults = async (searchTerm) => {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${searchTerm}&origin=*`);
    const data = await res.json();
    return data;
  }

  const handleChangeArticleInput = async (type, value) => {
    setStartArticleInput(value);
    // send api request to search for input after delay
    if(type === 'start'){
      console.log('getting search results')
      setTimeout(() => {
        // data is a promise....
        fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${value}&origin=*`)
          .then( res => res.json())
          .then( data => setStartSearchResults(data));
      }, 1000);
    }
  }

  const renderSearchResults = (type) => {
    console.log('start search results: ', startSearchResults)
    if(!startSearchResults || startSearchResults.length === 0) return;
    if(type === 'start') {
      // create an option element for each result with the title as the value and the url stored as a param
      const options = [];
      for(let i = 0; i < startSearchResults[1]?.length; i++) {
        console.log(startSearchResults[1][i], startSearchResults[3][i]);
        options.push (
          <option url={startSearchResults[3][i]}>{startSearchResults[1][i]}</option>
        )
      }
      return options;
    }
  }

  const renderGameForm = () => {
    return (
      <form onSubmit={(e) => handleGameFormSubmit(e)}>
        <label htmlFor='start-article'>Start Article</label> <br/>
        <input type="text" name="start-article" onChange={(e) => handleChangeArticleInput('start', e.target.value)} value={startArticleInput} /> <br/>
        <select className='search-results'>
          {renderSearchResults('start')}
        </select> <br/>
        <label htmlFor='end-article'>End Article</label> <br/>
        <input type="text" name="end-article" onChange={(e) => setEndArticleInput(e.target.value)} value={endArticleInput} /> <br/>
        <input type="submit"/>
      </form>
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
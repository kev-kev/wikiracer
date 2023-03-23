import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

const SocketManager = ({ socket }) => {
  const {
    setGuest,
    startGame,
    winGame,
    forfeitGame,
    clearContext,
    clearGuest,
    setStartArticle,
    setEndArticle
  } = useContext(GlobalContext);

  // Events from the backend -> frontend,
  // possibly/usually triggered by other frontend connections
  useEffect(() => {
    socket.on("USER_JOINED_ROOM", (username) => {
      setGuest(username);
      console.log("guest is set!")
    });
    // game start
    socket.on("HOST_STARTED_GAME", () => {
      startGame();
      console.log('Host started game')
    });
    
    socket.on("USER_WIN", (username) => {
      // TODO: (stretch) score for the user who won
      winGame(username);
      console.log(`game won by ${username}`)
    });
    // other user forfeit
    socket.on("USER_FORFEIT", (username) => {
      forfeitGame(username);
      console.log(`game forfeited by ${username}`)
    });

    // guest left room
    socket.on("GUEST_LEFT", () => {
      clearGuest();
    });

    socket.on("HOST_LEFT", () => {
      clearContext();
    });
    
    socket.on("INVALID_ROOM", () => {
      alert("no room exists with that code :(");
    });

    socket.on("SET_ARTICLES", (startArticle, endArticle) => {
      setStartArticle(startArticle);
      setEndArticle(endArticle);
    });
  }, []);

  return null;
};

export default SocketManager;

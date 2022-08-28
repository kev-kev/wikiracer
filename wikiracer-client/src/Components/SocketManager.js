import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

const SocketManager = (props) => {
  const {
    setGuest,
    startGame,
    winGame,
    forfeitGame,
    clearContext,
    clearGuest
  } = useContext(GlobalContext);

  // Events from the backend -> frontend,
  // possibly/usually triggered by other frontend connections
  useEffect(() => {
    props.socket.on("USER_JOINED_ROOM", (username) => {
      setGuest(username);
      console.log("guest is set!")
    });
    // game start
    props.socket.on("HOST_STARTED_GAME", () => {
      startGame();
      console.log('Host started game')
    });
    
    props.socket.on("USER_WIN", (username) => {
      // TODO: (stretch) score for the user who won
      winGame(username);
      console.log(`game won by ${username}`)
    });
    // other user forfeit
    props.socket.on("USER_FORFEIT", (username) => {
      forfeitGame(username);
      console.log(`game forfeited by ${username}`)
    });
    // other user left room
    props.socket.on("GUEST_LEFT", () => {
      clearGuest();
    });

    props.socket.on("HOST_LEFT", () => {
      console.log('firing alert')
      alert("the host left the game :<");
      clearContext();
    })
  }, []);

  return null;
};

export default SocketManager;

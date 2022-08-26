import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

const SocketManager = (props) => {
  const {
    setGuest,
    startGame,
    endGame
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

    });
    // other user win
    props.socket.on("USER_WON", (username) => {
      // ...

    });
    // other user forfeit
    props.socket.on("USER_FORFEIT", (username) => {
      // ...

    });
    // other user left room
    props.socket.on("USER_LEFT", (username) => {
      // Find username in GlobalContext (either host or guest)
      // If it was guest, remove/clear the name.
      // If it was host, change guest to host and remove/clear guest.
    });
  }, []);

  return null;
};

export default SocketManager;

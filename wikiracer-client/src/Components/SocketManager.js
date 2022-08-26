import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

const SocketManager = (props) => {
  // const {
  //   setRoomCode,
  // } = useContext(GlobalContext);

  // Events from the backend -> frontend,
  // possibly/usually triggered by other frontend connections
  useEffect(() => {
    props.socket.on("USER_JOINED_ROOM", (userId) => {
      // Add the user id to the players
    });
    props.socket.on("USER_LEFT_ROOM", () => {
      // Remove the extra user id from players
    });
    props.socket.on("GAME_WIN", (winnerId) => {
      // End the game and set the winner
      // Display the win screen
    });
    props.socket.on("GAME_FORFEIT", () => {
      // End the game and say the other player forfeited
      // If they exit the socket or idle too long
    });
  }, []);

  return null;
};

export default SocketManager;

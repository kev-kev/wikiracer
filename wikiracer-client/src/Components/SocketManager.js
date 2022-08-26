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
  }, []);

  return null;
};

export default SocketManager;

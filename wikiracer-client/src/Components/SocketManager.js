import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

const SocketManager = (props) => {
  const {
    setGuest,
  } = useContext(GlobalContext);

  // Events from the backend -> frontend,
  // possibly/usually triggered by other frontend connections
  useEffect(() => {
    props.socket.on("USER_JOINED_ROOM", (username) => {
      setGuest(username);
      console.log("guest is set!")
    });
  }, []);

  return null;
};

export default SocketManager;

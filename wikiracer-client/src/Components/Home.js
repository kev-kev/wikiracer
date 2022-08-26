import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";


const Home = () => {
  const [client, setClient] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if(client){
      client.onopen = () => {
        console.log('WebSocket Client Connected');
      };
      client.onmessage = (message) => {
        console.log(message);
      };
    }
  }, [client])

  const handleJoinClick = () => {
     console.log("Joined");
     navigate("/room/1");
  }

  const handleHostClick = () => {
     console.log("Hosted");
     setClient(new W3CWebSocket('ws://127.0.0.1:8000'));
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => handleJoinClick()}>Join</button><br/>
      <button onClick={() => handleHostClick()}>Host</button>
    </div>

   
  )
}

export default Home
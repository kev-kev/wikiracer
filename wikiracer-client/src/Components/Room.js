import { useNavigate, useParams } from 'react-router-dom';

const Room = () => {
  const navigate = useNavigate();
  const urlParams = useParams();

  // TODO: When component mounts, check that this room ID exists
  // in the server via socket event -- if it does not, exit room.

  const handleStartGame = () => {
    console.log("Start game clicked");
  };

  // TODO: Set idle timeout and trigger exit room if nothing happens
  const handleExitRoom = () => {
    navigate("/");
  };

  // TODO: Add wikipedia iframe here and listen for onLoad
  return (
    <>
      <div>Room Code: {urlParams.id} </div>
      <br />
      <div>Players: 
        <ul>
          <li>You</li>
        </ul>
      </div>
      <button onClick={() => handleStartGame()}>Start Game</button><br/>
      <button onClick={() => handleExitRoom()}>Exit Room</button>
    </>
  );
}

export default Room
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalContext';

const NewHome = ({ socket }) => {
  const { clearContext } = useContext(GlobalContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    clearContext();
  }, [clearContext])

  const handleJoinBtnClick = () => {
    navigate(`/join/`);
  }

  const handleHostBtnClick = () => {
    navigate(`/host/`);
  }

  return (
    <div className="home">
      <div className="home-container">
        <div className="welcome-container">
          <img className="logo" src="/logo.png" alt="logo"/>
          <h2 className='welcome'>Welcome to</h2>
        </div>
          <h1 className='title'>WikiRacer</h1>
        <img className="car" src="/car-vroom.png" alt="car going vroom"/>
        <div className='home-btn-container'>
          <button className="home-btn" onClick={handleJoinBtnClick}>JOIN</button>
          <button className="home-btn" onClick={handleHostBtnClick}>HOST</button>
        </div>
      </div>
    </div>
  );
}

export default NewHome
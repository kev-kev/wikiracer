import React from 'react'

const NewHome = () => {
  return (
    <div className="home">
      <div className="home-container">
        <div className="welcome-container">
          <img className="logo" src="logo.png" alt="logo"/>
          <h2 className='welcome'>Welcome to</h2>
        </div>
          <h1 className='title'>WikiRacer</h1>
        <img className="car" src="car-vroom.png" alt="car going vroom"/>
        <div className='home-btn-container'>
          <button className="join-room-btn home-btn">JOIN</button>
          <button className="host-room-btn home-btn">HOST</button>
        </div>
      </div>
    </div>
  )
}

export default NewHome
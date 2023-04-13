import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeNav = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  }
  
  return (
    <div className="homeNav-container">
      <img className="homeNav-logo" src="/logo.png" alt="WikiRacer Logo" onClick={handleLogoClick}/>
      <h1 className="title homeNav-title">WikiRacer</h1>
    </div>
  )
}

export default HomeNav
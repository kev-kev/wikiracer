import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

export const initialState = {
  roomCode: "",
  host: "",
  guest: "",
  gameInProgress: false,
  isHost: false,
  winner: "",
};



export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const setRoomCode = (roomCode) => {
    dispatch({
      type: "SET_ROOM_CODE",
      payload: roomCode,
    });
  };

  const setHost = (username) => {
    dispatch({
      type: "SET_HOST",
      payload: username
    });
  }

  const setGuest = (username) => {
    dispatch({
      type: "SET_GUEST",
      payload: username
    });
  }

  const startGame = () => {
    dispatch({
      type: "SET_GAME_IN_PROGRESS",
      payload: true
    });
  }

  const endGame = () => {
    dispatch({
      type: "SET_GAME_IN_PROGRESS",
      payload: false
    });
  }

  const winGame = (username) => {
    // TODO: score for winner
    endGame();
    dispatch({
      type: "SET_WINNER",
      payload: username
    })
  }

  const forfeitGame = (username) => {
    console.log(`game forfeited by ${username}`)
    endGame();
    dispatch({
      type: "SET_WINNER",
      payload: username === state.host ? 
        state.guest : state.host 
    })
  }
  
  const setIsHost = (isHost) => {
    dispatch({
      type: "SET_IS_HOST",
      payload: isHost
    });
  }

  const clearGuest = () => {
    dispatch({
      type: "CLEAR_GUEST"
    })
  }

  const clearContext = () => {
    dispatch({
      type: "CLEAR_CONTEXT"
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        roomCode: state.roomCode,
        setRoomCode,
        setHost,
        host: state.host,
        setGuest,
        guest: state.guest,
        startGame,
        winGame,
        winner: state.winner,
        endGame,
        gameInProgress: state.gameInProgress,
        isHost: state.isHost,
        setIsHost,
        clearContext,
        username: state.isHost ? state.host : state.guest,
        forfeitGame,
        clearGuest
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

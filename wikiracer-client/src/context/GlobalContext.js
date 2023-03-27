import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

export const initialState = {
  host: "",
  guest: "",
  gameInProgress: false,
  isHost: false,
  winner: "",
  startArticle: "",
  endArticle: "",
  isFetching: false,
  roomID: "",
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

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
    console.log('game won!')
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
  
  const setStartArticle = (article) => {
    dispatch({
      type: "SET_START_ARTICLE",
      payload: article
    })
  }

  const setEndArticle = (article) => {
    dispatch({
      type: "SET_END_ARTICLE",
      payload: article
    })
  }

  const setIsFetching = (bool=true) => {
    dispatch({
      type: "SET_IS_FETCHING",
      payload: bool
    })
  }

  const setRoomID = (id) => {
    dispatch({
      type: "SET_ROOM_ID",
      payload: id
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
        clearGuest,
        startArticle: state.startArticle,
        setStartArticle,
        endArticle: state.endArticle,
        setEndArticle,
        isFetching: state.isFetching,
        setIsFetching,
        roomID: state.roomID,
        setRoomID,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

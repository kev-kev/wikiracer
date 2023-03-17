import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

export const initialState = {
  roomCode: "",
  host: "",
  guest: "",
  gameInProgress: false,
  isHost: false,
  winner: "",
  startArticle: "",
  endArticle: "",
  curArticle: "",
  isFetching: false,
  history: [],
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

  const setCurArticle = (article) => {
    dispatch({
      type: "SET_CUR_ARTICLE",
      payload: article
    })
  }

  const setIsFetching = (bool=true) => {
    dispatch({
      type: "SET_IS_FETCHING",
      payload: bool
    })
  }

  const clearContext = () => {
    dispatch({
      type: "CLEAR_CONTEXT"
    });
  }

  const setHistory = (history) => {
    dispatch({
      type: "SET_HISTORY",
      payload: history
    })
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
        clearGuest,
        startArticle: state.startArticle,
        setStartArticle,
        endArticle: state.endArticle,
        setEndArticle,
        curArticle: state.curArticle,
        setCurArticle,
        isFetching: state.isFetching,
        setIsFetching,
        history: state.history,
        setHistory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  roomCode: "",
  host: "",
  guest: "",
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
    })
  }

  const setGuest = (username) => {
    dispatch({
      type: "SET_GUEST",
      payload: username
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
        guest: state.guest
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

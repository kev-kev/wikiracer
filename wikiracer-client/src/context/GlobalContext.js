import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  roomCode: "",
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function setRoomCode(roomCode) {
    dispatch({
      type: "SET_ROOM_CODE",
      payload: roomCode,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        roomCode: state.roomCode,
        setRoomCode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

import {initialState} from "./GlobalContext";

export default (state, action) => {
  switch (action.type) {
    case "SET_ROOM_CODE":
      return {
        ...state,
        roomCode: action.payload,
      }
    case "SET_HOST":
      return {
        ...state,
        host: action.payload
      }
    case "SET_GUEST":
      return {
        ...state,
        guest: action.payload
      }
    case "SET_IS_HOST":
      return {
        ...state,
        isHost: action.payload
      }
    case "SET_GAME_IN_PROGRESS":
      return {
        ...state,
        gameInProgress: action.payload
      }
    case "CLEAR_CONTEXT":
      return initialState;
    default:
      return state;
  }
};

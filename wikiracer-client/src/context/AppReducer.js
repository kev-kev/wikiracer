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

    default:
      return state;
  }
};

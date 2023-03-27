const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // client server url; TODO: set up for production
    methods: ["GET", "POST"],
  },
});
const PORT = 4001;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
const rooms = {};

const getUniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

const createNewRoom = (username, socket) => {
  const roomID = getUniqueID();
  rooms[roomID] = {"host": username};
  socket.username = username;
  console.log('hosting room: ' + roomID + ' in ' + Object.keys(rooms));
  socket.join(roomID);
  return roomID;
}

const joinRoom = (username, roomID, socket) => {
  socket.username = username;
  rooms[roomID]["guest"] = username;
  socket.join(roomID);
  console.log(username + "joined room: " + roomID);
}

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  socket.on("NEW_ROOM", (username, cb) => {
    const newRoomID = createNewRoom(username, socket);
    cb({
      roomCode : newRoomID,
    });
  });
  socket.on("JOIN_ROOM", (roomID, username, cb) => {
    if(!rooms[roomID]){
      cb({
        invalidRoom: true,
      })
    } else {
      joinRoom(username, roomID, socket);
      cb({
        room: rooms[roomID],
        roomCode : roomID
      });
    }
    socket.to(roomID).emit("USER_JOINED_ROOM", username);
  });
  socket.on("GAME_START", (roomID) => {
    socket.to(roomID).emit("HOST_STARTED_GAME");
  });
  socket.on("GAME_WIN", (username, roomID) => {
    socket.to(roomID).emit("USER_WIN", username);
  });
  socket.on("GAME_FORFEIT", (username, roomID) => {
    socket.to(roomID).emit("USER_FORFEIT", username);
  });
  socket.on("USER_LEFT", (roomID) => {
    handleRoomLeave(roomID, socket);
  });
  socket.on("ROOM_CHECK", (roomID, cb) => {
    cb({
      roomExists: !!rooms[roomID]
    });
  });
  socket.on("SEND_ARTICLE", (roomID, article, type) => {
    socket.to(roomID).emit("SET_ARTICLE", article, type);
  });
  socket.on("DISCONNECT", () => {
    console.log('disconnecting client', socket.username);
    handleRoomLeave([...socket.rooms][1], socket);
    socket.disconnect();
  });
});

const handleRoomLeave = (roomID, socket) => {
  if(!rooms[roomID]) return;
  const isHost = () => {
    if(rooms[roomID]["host"] === socket.username) return true;
    else return false;
  }
  if(isHost()){
    console.log('host left, deleting room');
    delete rooms[roomID];
    socket.to(roomID).emit("HOST_LEFT");
    socket.leave(roomID);
  }
  else {
    console.log('guest left the room');
    rooms[roomID]["guest"] = "";
    socket.to(roomID).emit("GUEST_LEFT");
    socket.leave(roomID);
  }
}
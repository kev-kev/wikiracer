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
  console.log("Client connected");
  socket.on("NEW_ROOM", (username, cb) => {
    const newRoomID = createNewRoom(username, socket);
    cb({
      roomID : newRoomID,
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
        roomID : roomID
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

  socket.on("disconnecting", () => {
    for(const room of socket.rooms) {
      if (rooms[room]) {
        console.log(socket.username, 'disconnected');
        if(rooms[room]["host"] === socket.username) socket.to(room).emit("HOST_LEFT");
        else socket.to(room).emit("GUEST_LEFT");
      }
    }
  });
});

const handleRoomLeave = (roomID, socket) => {
  if(!rooms[roomID]) return;
  const isHost = () => {
    if(rooms[roomID]["host"] === socket.username) return true;
    else return false;
  }
  if(isHost()){
    console.log('deleting empty room', roomID);
    delete rooms[roomID];
    socket.to(roomID).emit("HOST_LEFT");
    socket.leave(roomID);
  }
  else {
    rooms[roomID]["guest"] = "";
    socket.to(roomID).emit("GUEST_LEFT");
    socket.leave(roomID);
  }
}
const express = require('express');
const app = express();
const ejs = require('ejs');
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // client server url; TODO: set up for production
    methods: ["GET", "POST"],
  },
});
const fetch = require("node-fetch");
const PORT = 4001;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

const path = require('path');
const rooms = {};


app.get('/wiki/:articleTitle', async (req, res) => {
  const response = await fetch(`https://en.wikipedia.org/wiki/${req.params.articleTitle}`);
  const body = await response.text();
  ejs.renderFile(__dirname + '/wikiframe.ejs', {body: body, articleTitle: req.params.articleTitle}, {}, function(err, str) {
    // str => Rendered HTML string
    res.send(str);
  });
});

const getUniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

const createNewRoom = (username, socket) => {
  const roomID = getUniqueID();
  rooms[roomID] = {"host": socket.id};
  console.log('hosting room: ' + roomID + ' in ' + Object.keys(rooms));
  socket.join(roomID);
  return roomID;
}

const joinRoom = (username, roomID, socket) => {
  rooms[roomID]["guest"] = socket.id;
  socket.join(roomID);
  console.log(username + "joined room: " + roomID);
}

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("NEW_ROOM", (username, cb) => {
    const newRoomCode = createNewRoom(username, socket);
    cb({
      roomCode: newRoomCode,
    });
  });
  socket.on("JOIN_ROOM", (roomID, username, cb) => {
    joinRoom(username, roomID, socket);
    cb({
      room: rooms[roomID],
      roomCode: roomID
    });
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
    handleRoomLeave(roomID, socket)
  });
  socket.on("disconnecting", () => {
    for(const room of socket.rooms) {
      if (rooms[room]) {
        console.log(socket.id, 'disconnected');
        if(rooms[room]["host"] === socket.id) socket.to(room).emit("HOST_LEFT");
        else socket.to(room).emit("GUEST_LEFT");
      }
    }
  });
});

const handleRoomLeave = (roomID, socket) => {
  const isHost = () => {
    if(rooms[roomID]["host"] === socket.id) return true
    else return false;
  }
  if(isHost){
    console.log('deleting empty room', roomID);
    delete rooms[roomID];
    socket.to(roomID).emit("HOST_LEFT");
  }
  else {
    rooms[roomID]["guest"] = "";
    socket.to(roomID).emit("GUEST_LEFT");
  }
}
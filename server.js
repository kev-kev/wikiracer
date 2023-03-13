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
  rooms[roomID] = {"host": username};
  console.log('hosting room: ' + roomID + ' in ' + Object.getOwnPropertyNames(rooms));
  socket.join(roomID);
  return roomID;
}

const joinRoom = (username, roomID, socket) => {
  rooms[roomID]["guest"] = username;
  socket.join(roomID);
  console.log("joined room: " + roomID);
}

io.on("connection", (socket) => {
  console.log("Client connected");

  // Events that come from the frontend -> backend
  // That may either send back info to the same frontend
  // Or cause an emit of an event to the other connected frontends
  socket.on("NEW_ROOM", (username, cb) => {
    const newRoomCode = createNewRoom(username, socket);
    cb({
      roomCode: newRoomCode,
    });
  });
  // join room
  socket.on("JOIN_ROOM", (roomID, username, cb) => {
    joinRoom(username, roomID, socket);
    cb({
      room: rooms[roomID],
      roomCode: roomID
    });
    socket.to(roomID).emit("USER_JOINED_ROOM", username);
  });
  // game start
  socket.on("GAME_START", (roomID) => {
    socket.to(roomID).emit("HOST_STARTED_GAME");
  });
  // game win
  socket.on("GAME_WIN", (username, roomID) => {
    // What do we send to the room when game is won by someone?
    socket.to(roomID).emit("USER_WIN", username);
  });
  // forfeit
  socket.on("GAME_FORFEIT", (username, roomID) => {
    // What do we send to the room when game is forfeited by someone?
    socket.to(roomID).emit("USER_FORFEIT", username);
  });
  // leave room
  socket.on("USER_LEFT", (isHost, roomID) => {
    if(isHost){
      delete rooms[roomID];
      socket.to(roomID).emit("HOST_LEFT");
    }
    else {
      rooms[roomID]["guest"] = "";
      socket.to(roomID).emit("GUEST_LEFT");
    }
  });
});

// TODO: room cleanup
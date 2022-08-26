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

const path = require('path');
const rooms = {};

// Set up proxy to the frontend React app
//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'wikiracer-client/build'))); 
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
} else {
  //build mode
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
  });
}

const getUniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

const createNewRoom = (connection) => {
  const roomID = getUniqueID();
  rooms[roomID] = {"host": connection};
  console.log('hosting room: ' + roomID + ' in ' + Object.getOwnPropertyNames(rooms));
  return roomID;
}

const joinRoom = (connection, roomID) => {
  rooms[roomID]["guest"] = connection;
  console.log("joined room: " + roomID);
}


io.on("connection", (socket) => {
  console.log("Client connected");

  // Events that come from the frontend -> backend
  // That may either send back info to the same frontend
  // Or cause an emit of an event to the other connected frontends
  socket.on("NEW_ROOM", (cb) => {
    const newRoomCode = createNewRoom();
    cb({
      roomCode: newRoomCode,
    });
  });

  // FORFEIT_GAME event

  // WIN_GAME event
});


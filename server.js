const express = require('express');
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 5000;
const path = require('path');
const rooms = {};

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

//Start server
// app.listen(port, (req, res) => {
//   console.log(`server listening on port: ${port}`);
// });

const webSocketServer = require('websocket').server;
const webSocketsServerPort = process.env.PORT || 8000;

app.listen(webSocketsServerPort, (req, res) => {
  console.log(`listening to WS server, port: ${webSocketsServerPort}`);
});

const wsServer = new webSocketServer({
  httpServer: server
});

const getUniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

const createNewRoom = (connection) => {
  const roomID = getUniqueID();
  rooms[roomID] = {"host": connection};
  console.log('hosting room: ' + roomID + ' in ' + Object.getOwnPropertyNames(rooms));
}

const joinRoom = (connection, roomID) => {
  rooms[roomID]["guest"] = connection;
  console.log("joined room: " + roomID);
}

wsServer.on('request', (request) => {
  // You can rewrite this part of the code to accept only the requests from allowed origin
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  const connection = request.accept(null, request.origin);

});



const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

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
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`);
});
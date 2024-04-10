const express = require("express");
const bodyParser = require("body-parser");
const postRoute = require("./routes/postroute.js");
const profileRoute = require('./routes/profileroute.js')
const adminRoute = require('./routes/adminroute.js')
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const multer =require("multer");

app.use(bodyParser.json());
app.use(multer().any());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err));

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    
    socket.on('like', (data) => {
      console.log('Like event received:', data);

      io.emit('notification', { message: 'Someone liked a post!' });
    });
  
    
    socket.on('comment', (data) => {
      console.log('Comment event received:', data);
    
      io.emit('notification', { message: 'Someone commented on a post!' });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

app.use("/", postRoute,profileRoute);
app.use("/admin",adminRoute)

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
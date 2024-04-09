// app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require ('multer');
const dotenv = require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const userRoute = require('./routes/userRoute');
const postRoutes = require('./routes/postRoutes');
const commentRoute = require('./routes/commentRoute')
const adminRoute = require('./routes/adminroute')

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Client connected');

    // Handle 'like' event
    socket.on('like', (data) => {
        console.log('Like received:', data);

        io.emit('notification', { type: 'like', data });
    });

    socket.on('comment', (data) => {
        console.log('Comment received:', data);

        io.emit('notification', { type: 'comment', data });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err));

app.use(express.json());
app.use (multer().any())


app.use('/user', userRoute);
app.use('/post', postRoutes,commentRoute);
app.use('admin', adminRoute)


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formateMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder

app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
  console.log("New WebSocket connection...");

  // Welcome current user
  socket.emit("message", "Welcome to ChatCord!");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A User has joined the chat");

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A User has left the chat");
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

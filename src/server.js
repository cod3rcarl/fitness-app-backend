const express = require("express");
const path = require("path");
const connectDB = require("../config/db");
const colors = require("colors");
const cors = require("cors");
const http = require("http");

const config = require("../config/config");
const router = require("./routes/user-routes");

const app = express();
const server = http.Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: config.SOCKET_CONNECTION,
    methods: ["GET", "POST"],

    credentials: true,
  },
});

//Use Redis

const PORT = config.PORT || 8000;

connectDB();

const connectedUsers = {};

io.on("connection", (socket) => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;

  io.emit("newData", { data: "hello" });
});
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});
app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
app.use(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.blue);
});

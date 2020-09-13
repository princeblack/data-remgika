#!/usr/bin/env node
/**
 * Module dependencies.
 */


// var app = require('../app');
const express = require("express");
var debug = require('debug')('data-remgika:server');
var http = require('http');
/** INIT THE SERVER */
const app = express();
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
// process.env.PORT
var port = normalizePort(process.env.PORT || "8000");
const host = process.env.HOST || "localhost";

app.enable('trust proxy'); // trust all
app.set('trust proxy', true); // same as above
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);





/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
   if (error.syscall !== "listen") {
     throw error;
   }
   const address = server.address();
   const bind =
     typeof address === "string" ? "pipe " + address : "port: " + port;
   switch (error.code) {
     case "EACCES":
       console.error(bind + " requires elevated privileges.");
       process.exit(1);
       break;
     case "EADDRINUSE":
       console.error(bind + " is already in use.");
       process.exit(1);
       break;
     default:
       throw error;
   }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    :  addr.port;
  debug(`App running at http://${host}:${bind}`);
}





/** EXTERNAL DEPENDENCIES */

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
var morgan = require("morgan");
const path = require('path');
const cors = require("cors");
// const server = require('./bin/www')

/** ROUTERS */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const playgroundRouter = require("./routes/playground");
const groupRouter = require("./routes/group");
const eventRouter = require("./routes/event");
const profileImage = require("./routes/profileImage");
const comment = require('./routes/comment')
const groupNewsRouter = require('./routes/groupNewsRoute')
const groupEventRouter = require('./routes/groupEventRoute')
const groupChat = require("./routes/groupChats")
const GroupChats = require("./models/chat")

/** OUR MIDDLEWARE */
const env = require("./config/config");


app.enable("trust proxy"); //needed if you're behind a load balancer
app.enable('trust proxy'); // trust all
app.set('trust proxy', true); // same as above
app.use(helmet());
app.use(morgan("common"));
/** LOGS */
app.use(logger("dev"));

/** CONNECT TO MONGO */
mongoose.connect(env.db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")  
);

mongoose.connection.on("open", () => {
  console.log(`Connected to the database...`);
});

// const io = require("socket.io")(server)
// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://remgika.com", "http://localhost:3000"],
    allowedHeaders:'Origin, X-Requested-With, Content, Accept,Content-Type,Authorization',
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204

  })
);
// const io = require('socket.io')(server);
// io.on('connection', (socket) => { 
//   console.log("user connected");
//   // console.log(socket);
//   socket.on('join', async ({name, room, userId}, callback)  =>{
//       socket.join(room)
//       socket.emit("welcome", {user: 'admin', text: `${name}, welcomwe to the room `})
//       socket.broadcast.to(room).emit('welcome', {user : 'admin', text: `${name}, has joind!`})
//   })

//   socket.on("sendMessage", async ({message, room, name, userId})=>{
//       try {
//           const Chats = new GroupChats({
//               userId : userId,
//               groupId:  room,
//               message: message
//           })
//           await Chats.save();
//           io.to(room).emit('message', { name: name, user: userId, text: message})
//       } catch (error) {
//           return error
//       }
//   })

//   socket.on('disconnect', ()=>{
//       console.log('user had left;;;');
//   })
// });
/** STATIC FILES */
app.use("/static", express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/playground", playgroundRouter);
app.use("/group", groupRouter);
app.use("/events", eventRouter);
app.use("/images", profileImage);
app.use("/comment", comment);
app.use("/news", groupNewsRouter);
app.use("/groupEvent", groupEventRouter);
app.use("/groupChats", groupChat)
/** ERROR HANDLING */
app.use(function (req, res, next) {
  const err = new Error("Looks like something is broken...");
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(400).send({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;

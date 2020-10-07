const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
var morgan = require("morgan");
const path = require('path');
const cors = require("cors");
const express = require("express");

/** INIT THE SERVER */
const app = express();

/** EXTERNAL DEPENDENCIES */


// const server = require('./bin/www')

/** ROUTERS */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const playgroundRouter = require("./routes/playground");
const groupRouter = require("./routes/group");
const eventRouter = require("./routes/event");
const profileImage = require("./routes/profileImage");
const comment = require('./routes/comment');
const groupNewsRouter = require('./routes/groupNewsRoute');
const groupEventRouter = require('./routes/groupEventRoute');
const groupChat = require("./routes/groupChats");
const GroupChats = require("./models/chat");
const articles = require("./routes/article");
const messager = require('./routes/message');

/** OUR MIDDLEWARE */
const env = require("./config/config");


app.enable("trust proxy"); //needed if you're behind a load balancer
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

app.get('/' ,function (req,res) {
  res.sendFile(__dirname + '/public/index.html');
})
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
app.use("/articles", articles)
app.use("/message", messager)
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

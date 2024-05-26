const dotenv = require("dotenv").config();
const express = require('express');
const session = require("express-session");
const {createServer} = require("node:http");
const {Server} = require("socket.io");

//global error handler
const globalHandler = require("./middleware/globalHandler");

//morgan
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

//db
require("./config/dbConnect");
const mongoStore = require("connect-mongo");

//frontend routes
const homeRoutes = require('./routes/frontend/home/route');
const blogRoutes = require('./routes/frontend/blog/route');
const adminRoutes = require('./routes/frontend/admin/route');
const aiRoutes = require("./routes/frontend/ai/route")
const snakeRoutes = require("./routes/frontend/snake/route");
const golRoutes = require("./routes/frontend/gameOfLife/route");
const blobshooterRoutes = require("./routes/frontend/blobshooter/route");
const chessRoutes = require("./routes/frontend/chess/route");

//api routes
const userApiRoutes = require('./routes/api/blog/user/route');
const postApiRoutes = require('./routes/api/blog/post/route');
const commentApiRoutes = require('./routes/api/blog/comment/route');
const adminApiRoutes = require('./routes/api/admin/route');
const aiApiRoutes = require("./routes/api/ai/route")

// configure express app
const app = express();
const server = createServer(app);


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(globalHandler);
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms ::::', { stream: accessLogStream }));

// socket.io
const io = new Server(server);

//session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    }),
  })
);

app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

//admin routes
app.use("/admin", adminRoutes);

//admin api routes
app.use("/api/v1/admin", adminApiRoutes);

//ai routes
app.use("/ai", aiRoutes);

//ai api routes
app.use("/api/v1/ai", aiApiRoutes);

//snake routes
app.use("/snake", snakeRoutes);

//gameOfLife routes
app.use("/gameOfLife", golRoutes);

//blobshooter routes
app.use("/blobshooter", blobshooterRoutes);

//chess routes
app.use("/chess", chessRoutes);

//blog routes
app.use("/blog", blogRoutes);

//blog api user routes
app.use("/api/v1/blog/user", userApiRoutes);

//blog api post routes
app.use("/api/v1/blog/post", postApiRoutes);

//blog api comment routes
app.use("/api/v1/blog/comment", commentApiRoutes);

//home routes
app.use("/", homeRoutes);

// blobshooter
const gameState = require("./blobshooter/gameState");
const {updatePlayers, updateBullets, updatePowerups} = require("./blobshooter/gameLogic");

//chess
const { matchmaking } = require('./chess/matchmaking');

const chessPlayers = [];
const chessGames = [];

const socketHandler = require("./utils/socketHandler");

socketHandler(io, gameState, chessPlayers, chessGames);

setInterval(() => {
	updatePlayers(gameState, io);
	updateBullets(gameState);
	updatePowerups(gameState);
	io.emit("gameState", gameState);
}, 3);

setInterval(() => {
	matchmaking(chessGames, chessPlayers, io);
}, 1000);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});


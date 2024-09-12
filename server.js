const express = require("express");

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

const server = express();

// global middleware
server.use(express.json());
server.use(logger);

// Routers
server.use("/posts", postRouter);
server.use("/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} `);

  next();
}

module.exports = server;

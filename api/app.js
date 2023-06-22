const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.get("/api", (req, res) => {
  res.send("EUREKA on Vercel");
});

const indexRouter = require("../src/routes/index");
const categoryRouter = require("../src/routes/category");
const placeRouter = require("../src/routes/place");

mongoose.connect(`${process.env.MONGODB_URI}`);

// default mockup
require("../src/mockup");

// view engine setup
app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/category/place", placeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
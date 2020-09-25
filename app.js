const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const { userValidation, loginValidation } = require("./middlewares/joiValidation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.post("/signin", loginValidation, login);
app.post("/signup", userValidation, createUser);

app.use("/", auth, usersRouter);
app.use("/", auth, cardsRouter);

app.use(errorLogger);

app.use((req, res) => {
  res.status(400).send({ message: "Запрашиваемый ресурс не найден" });
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT);

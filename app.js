const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const { userValidation, loginValidation } = require("./middlewares/joiValidation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/NotFoundError");

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post("/signin", loginValidation, login);
app.post("/signup", userValidation, createUser);

app.use("/", auth, usersRouter);
app.use("/", auth, cardsRouter);

app.use(() => {
  throw new NotFoundError({ message: "Запрашиваемый ресурс не найден" });
});

app.use(errorLogger);

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

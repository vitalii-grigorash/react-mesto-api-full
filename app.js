const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");

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

app.use((req, res, next) => {
  req.user = {
    _id: "5f4d22c615863125e4377059",
  };

  next();
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.use((req, res) => {
  res.status(400).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT);

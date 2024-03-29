const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error("NotValidUserId"))
    .catch((err) => {
      if (err.message === "NotValidUserId") {
        throw new NotFoundError({ message: "Нет пользователя с таким id" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        throw new ConflictError({ message: "Пользователь с таким email уже существует" });
      } else next(err);
    })
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar, email: user.email,
      },
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" },
      );
      res.cookie("jwt", token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error("NotValidUserId"))
    .catch((err) => {
      if (err.message === "NotValidUserId") {
        throw new NotFoundError({ message: "Нет пользователя с таким id" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error("NotValidUserId"))
    .catch((err) => {
      if (err.message === "NotValidUserId") {
        throw new NotFoundError({ message: "Нет пользователя с таким id" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
};

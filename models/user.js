const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AuthError = require("../errors/AuthError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: "Некорректный URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Некорректный формат почты",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError({ message: "Неправильные email или пароль" });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError({ message: "Неправильные email или пароль" });
          }
          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);

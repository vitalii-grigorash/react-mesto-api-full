const { celebrate, Joi, CelebrateError } = require("celebrate");
const validator = require("validator");

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError("Некорректный URL");
  }
  return value;
};

const idValidation = celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24).hex(),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(urlValidation).uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidation).uri().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation).uri(),
  }),
});

module.exports = {
  idValidation,
  updateUserValidation,
  updateAvatarValidation,
  cardValidation,
  userValidation,
  loginValidation,
};

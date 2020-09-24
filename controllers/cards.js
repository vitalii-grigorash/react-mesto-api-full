const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new BadRequestError({ message: "Переданы некорректные данные" });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(
    req.user._id,
    req.params.cardId,
  )
    .orFail(new Error("NotValidCardId"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("NotValidCardId"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("NotValidCardId"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

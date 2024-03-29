const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

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
    .catch(() => {
      throw new BadRequestError({ message: "Переданы некорректные данные" });
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new Error("NotValidCardId"))
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: "Недостаточно прав для удаления карточки" });
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("NotValidCardId"))
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("NotValidCardId"))
    .catch((err) => {
      if (err.message === "NotValidCardId") {
        throw new NotFoundError({ message: "Карточка не найдена" });
      } else {
        throw new BadRequestError({ message: "Переданы некорректные данные" });
      }
    })
    .then((likes) => {
      res.status(200).send({ data: likes });
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

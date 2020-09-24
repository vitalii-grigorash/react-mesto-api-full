const router = require("express").Router();
const {
  cardValidation,
  idValidation,
} = require("../middlewares/joiValidation");
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", cardValidation, postCard);
router.delete("/cards/:cardId", idValidation, deleteCard);
router.put("/cards/:cardId/likes", idValidation, likeCard);
router.delete("/cards/:cardId/likes", idValidation, dislikeCard);

module.exports = router;

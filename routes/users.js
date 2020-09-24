const router = require("express").Router();
const {
  idValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require("../middlewares/joiValidation");
const {
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/:id", idValidation, getUser);
router.patch("/users/me", updateUserValidation, updateUser);
router.patch("/users/me/avatar", updateAvatarValidation, updateAvatar);

module.exports = router;

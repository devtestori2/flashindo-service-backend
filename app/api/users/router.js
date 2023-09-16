const express = require("express");
const router = express.Router();
const {
  getAllUser,
  getOneUser,
  updateInfoUser,
  deleteUser,
} = require("./controller");

const { authenticateUser, authorizeRoles } = require("../../middleware/auth");
const {
  signupAdmin,
  signinAdmin,
  signup,
  signin,
  resetPasswordServicerByAdmin,
  resetPasswordServicer,
} = require("../auth/controller");

router.get("/", authenticateUser, authorizeRoles("admin"), getAllUser);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  getOneUser
);

router.put(
    "/reset-password",
    authenticateUser,
    authorizeRoles("servicer"),
    resetPasswordServicer
  );
  
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  updateInfoUser
);

router.post("/admin/auth/register/ux18xp-2781jx-12467s", signupAdmin);
router.post("/admin/auth/login", signinAdmin);
router.post(
  "/servicer/auth/register",
  authenticateUser,
  authorizeRoles("admin"),
  signup
);
router.post("/servicer/auth/login", signin);

router.put(
  "/admin/reset-password-servicer/:id",
  authenticateUser,
  authorizeRoles("admin"),
  resetPasswordServicerByAdmin
);

module.exports = router;

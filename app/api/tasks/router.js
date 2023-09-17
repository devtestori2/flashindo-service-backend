const express = require("express");
const {
  createOneTask,
  getOneTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getAllTasksByServicer,
  getOneTaskByKodeTask,
  giveCommentToTask,
  givePriceOfTask,
  takeTaskByServicer,
  uploadImageTask,
} = require("./controller");
const router = express.Router();
const uploadMiddleware = require("../../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  getAllTasks
);
router.get(
  "/task-by-servicer",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  getAllTasksByServicer
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  getOneTask
);
router.get("/kode/:kode", getOneTaskByKodeTask);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteTask);
router.put(
  "/:id",
  uploadMiddleware.fields([
    { name: "gambar_service", maxCount: 1 },
  ]),
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  updateTask
);
router.put(
  "/comment-task/:id",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  giveCommentToTask
);
router.put(
  "/finish-task/:id",
  authenticateUser,
  authorizeRoles("admin"),
  giveCommentToTask
);
router.put(
  "/give-price-task/:id",
  authenticateUser,
  authorizeRoles("admin"),
  givePriceOfTask
);
router.put(
  "/take-task/:id",
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  takeTaskByServicer
);
router.put(
  "/upload-task/:id",
  uploadMiddleware.fields([
    { name: "gambar_service", maxCount: 1 },
  ]),
  authenticateUser,
  authorizeRoles("admin", "servicer"),
  uploadImageTask
);

router.post("/", authenticateUser, authorizeRoles("admin"), createOneTask);

module.exports = router;

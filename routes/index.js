const express = require("express");
const multer = require("multer");
const router = express.Router();
const jwtAuth = require("../utils/middlewares/jwtAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

//  Import Controllers 
//.......................................................................//
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const chatController = require("../controllers/chat");

//  Configure Routes
//.......................................................................//

// User
router.post("/user", upload.single('image'), userController.create)
// router.put("/user/:user_id", jwtAuth, upload.single('image'), userController.updateById)
router.get("/user", jwtAuth, userController.getAll);
router.get("/user/:user_id", jwtAuth, userController.getById);
// router.delete("/user/:user_id", jwtAuth, userController.deleteById)

// Auth
router.post("/auth/login", authController.login);
router.get("/auth/profile", jwtAuth, userController.getAuth);

// Chat
router.post("/chat", jwtAuth, upload.single('image'), chatController.create);
// router.put("/user/:user_id", jwtAuth, upload.single('image'), userController.updateById)
router.get("/chat", jwtAuth, chatController.getAll);
router.get("/chat/:chat_id", jwtAuth, chatController.getById);
router.post("/chat/:chat_id/user", jwtAuth, chatController.addUser);
router.delete("/chat/:chat_id/user", jwtAuth, chatController.removeUser);

module.exports = router;
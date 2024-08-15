const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${global.__basedir}/assets`);
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null, Date.now() + '_' + file.originalname.split('.')[0] + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage });

//  Import Controllers 
//.......................................................................//
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const jwtAuth = require("../utils/middlewares/jwtAuth");

//  Configure Routes
//.......................................................................//

// User
router.post("/user", jwtAuth, upload.single('image'), userController.create)
// router.put("/user/:user_id", jwtAuth, upload.single('image'), userController.updateById)
// router.get("/user", jwtAuth, userController.getAll)
// router.get("/user/:user_id", jwtAuth, userController.getById)
// router.delete("/user/:user_id", jwtAuth, userController.deleteById)

// Auth
router.post("/login", authController.login)

module.exports = router;
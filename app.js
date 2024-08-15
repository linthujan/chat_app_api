require('dotenv').config();
const express = require("express");
const cors = require("cors");

const successHandler = require("./utils/middlewares/successHandler");
const errorLogger = require("./utils/middlewares/errorLogger");
const errorHandler = require("./utils/middlewares/errorHandler");
const router = require("./routes");

global.__basedir = __dirname;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(cors());
app.use(successHandler);

app.use("/api", router);
app.use('/public', express.static('public'))
app.use('/assets', express.static('assets'))


app.all("*", (req, res) => {
    res.status(404).send({ message: `The route URL ${req.originalUrl} does not exists` });
})

app.use(errorHandler);

module.exports = app;
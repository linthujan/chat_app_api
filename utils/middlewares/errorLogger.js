// const chalk = require("chalk");

let i = 0;
const errorLogger = (err, req, res, next) => {
    // console.log(chalk.redBright(err.stack))
    console.log(err.stack)
    console.log(++i);
    next(err)
}
module.exports = errorLogger;
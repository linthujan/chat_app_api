'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

console.log("Environment :", env);
console.log("Host :", config.host);
console.log("Database :", config.database);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.User = require("../models/user")(sequelize, Sequelize.DataTypes);
db.Chat = require("../models/chat")(sequelize, Sequelize.DataTypes);
db.UserChat = require("../models/user_chat")(sequelize, Sequelize.DataTypes);
db.Message = require("../models/message")(sequelize, Sequelize.DataTypes);
db.Asset = require("../models/asset")(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize.sync({ force: true }).then(async () => {
//   seedTag();
//   console.log("All models were synchronized successfully.");
// });

async function seedTag() {
  const { User, Asset, Chat, UserChat, Message } = db;

  const userImage = fs.readFileSync('assets/user-profile1.png');
  console.log(`userImage`, userImage);

  const user1 = await User.create({
    user_id: 'd64f14b2-d0d8-490f-8996-043ee66fb58b',
    username: "Test1",
    mobile: "123",
    // image: {
    //   data: userImage,
    // }
  }, {
    include: [
      {
        model: Asset,
        as: 'image',
      },
    ],
  });

  const user2 = await User.create({
    user_id: '792a0e19-ae18-4d12-8a92-0dc4f04c8086',
    username: "Test2",
    mobile: "456",
    // image: {
    //   data: userImage,
    // }
  }, {
    include: [
      {
        model: Asset,
        as: 'image',
      },
    ],
  });

  const user3 = await User.create({
    user_id: '5b526d0e-c669-4678-a2e6-08572a575d50',
    username: "Test3",
    mobile: "789",
    // image: {
    //   data: userImage,
    // }
  }, {
    include: [
      {
        model: Asset,
        as: 'image',
      },
    ],
  });

  // console.log(`user.image.toJSON()`, user.image.toJSON());
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

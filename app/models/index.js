const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.goal = require("./goal.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./account.model.js")(sequelize, Sequelize);


// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
); 
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for genre
db.user.hasMany(
  db.genre,
  { as: "genre" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.genre.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for time period
db.user.hasMany(
  db.timePeriod,
  { as: "time period" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.timePeriod.belongsTo(
    db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);

// foreign key for character roles
db.user.hasMany(
  db.characterroles,
  { as: "characterroles" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.characterroles.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);


// foreign key for Location
db.user.hasMany(
  db.location,
  { as: "location" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.location.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for character name
db.user.hasMany(
  db.character_name,
  { as: "character_name" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.character_name.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for stories
db.user.hasMany(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.story.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

module.exports = db;


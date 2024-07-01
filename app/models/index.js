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

db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./account.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.goal = require("./goal.model.js")(sequelize, Sequelize);
db.skill = require("./skill.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.resume = require("./resume.model.js")(sequelize, Sequelize);

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

// foreign key for goals
db.user.hasMany(
  db.goal,
  { as: "goal" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.goal.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for skills
db.user.hasMany(
  db.skill,
  { as: "skill" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.skill.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for experiences
db.user.hasMany(
  db.experience,
  { as: "experience" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.experience.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for user with role
db.role.hasMany(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.user.belongsTo(
  db.role,
  { as: "role" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);


// foreign key for resume with user
db.user.hasMany(
  db.resume,
  { as: "resume" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.resume.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);


//---------------------------RESUME FOREIGN KEYS---------------------------
db.resume.belongsToMany(
  db.goal,
 { as: "Goal" ,
  through : "Resume_Goal",
  //foreignKey: { allowNull: true }, onDelete: "CASCADE" 
  }
);
db.goal.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Goal",
  //foreignKey: { allowNull: false }, onDelete: "CASCADE"
  }
);
module.exports = db;

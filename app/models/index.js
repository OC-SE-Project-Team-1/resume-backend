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
db.education = require("./education.model.js")(sequelize, Sequelize);
db.skill = require("./skill.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.resume = require("./resume.model.js")(sequelize, Sequelize);
db.jobDescription = require("./jobDescription.model.js")(sequelize, Sequelize);
db.experienceType = require("./experienceType.model.js")(sequelize, Sequelize);
db.link = require("./link.model.js")(sequelize, Sequelize);

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

// foreign key for education
db.user.hasMany(
  db.education,
  { as: "education" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.education.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for job description
db.user.hasMany(
  db.jobDescription,
  { as: "jobDescription" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.jobDescription.belongsTo(
  db.user,
  { as: "user" },
);

// foreign key for experienceType
db.experienceType.hasMany(
  db.experience,
  { as: "experience" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.experience.belongsTo(
  db.experienceType,
  { as: "experienceType" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for Links
db.user.hasMany(
  db.link,
  { as: "link" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.link.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
//---------------------------RESUME FOREIGN KEYS---------------------------
//Resume Relationship with Goal
db.resume.belongsToMany(
  db.goal,
 { as: "Goal" ,
  through : "Resume_Goal"
  }
);
db.goal.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Goal"
  }
);
//Resume Relationship with Experience
db.resume.belongsToMany(
  db.experience,
 { as: "Experience" ,
  through : "Resume_Experience"
  }
);
db.experience.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Experience"
  }
);
//Resume Relationship with Skill
db.resume.belongsToMany(
  db.skill,
 { as: "Skill" ,
  through : "Resume_Skill"
  }
);
db.skill.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Skill"
  }
);
//Resume Relationship with Education
db.resume.belongsToMany(
  db.education,
 { as: "Education" ,
  through : "Resume_Education"
  }
);
db.education.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Education"
  }
);
//Resume Relationship with Education
db.resume.belongsToMany(
  db.jobDescription,
 { as: "JobDescription" ,
  through : "Resume_JobDescription"
  }
);
db.jobDescription.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_JobDescription"
  }
);
//Resume Relationship with Link
db.resume.belongsToMany(
  db.link,
 { as: "Link" ,
  through : "Resume_Link"
  }
);
db.link.belongsToMany(
  db.resume,
  { as: "Resume",
  through : "Resume_Link"
  }
);

module.exports = db;

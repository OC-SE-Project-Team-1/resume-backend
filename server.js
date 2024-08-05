require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");

const addValues = require("./addValues");
db.sequelize.sync().then(()=>{
  addValues.create();
    
  if (process.env.TESTING == 'true') {
    addValues.testCreate();
  }
});

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the R.A.I.N." });
});

require("./app/routes/account.routes")(app);
require("./app/routes/auth.routes.js")(app);
require("./app/routes/education.routes.js")(app);
require("./app/routes/experience.routes.js")(app);
require("./app/routes/experienceType.routes.js")(app);
require("./app/routes/goal.routes.js")(app);
require("./app/routes/jobDescription.routes.js")(app);
require("./app/routes/link.routes.js")(app);
require("./app/routes/resume.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/skill.routes.js")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 3036;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;

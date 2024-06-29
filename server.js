require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");

const addValues = require("./addValues");
db.sequelize.sync().then(()=>{
   addValues.create();
});


var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the fAIry tale backend." });
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/account.routes")(app);
require("./app/routes/goal.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/skill.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3201;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;

module.exports = (app) => {
    const goal = require("../controllers/goal.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new character name
    router.post("/goal/", goal.create);
  
    // Retrieve all character name
    router.get("/goal/", goal.findAll);

    // Retrieve all character names for a user
    router.get("/goal/user/:userId", goal.findAllForUser);
  
    // Retrieve a single character name with Id
    router.get("/goal/:id", goal.findOne);
  
    // Update an character name with Id
    router.put("/goal/:id", goal.update);
  
    // Delete an character name with Id
    router.delete("/goal/:id", goal.delete);
  
    app.use("/resume", router);
  };
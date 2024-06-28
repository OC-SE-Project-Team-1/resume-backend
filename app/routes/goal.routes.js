module.exports = (app) => {
    const goal = require("../controllers/goal.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new goal
    router.post("/goal/", goal.create);
  
    // Retrieve all goals
    router.get("/goal/", goal.findAll);

    // Retrieve all goals for a user
    router.get("/goal/user/:userId", goal.findAllForUser);
  
    // Retrieve a single goal with Id
    router.get("/goal/:id", goal.findOne);
  
    // Update a goal with Id
    router.put("/goal/:id", goal.update);
  
    // Delete a goal with Id
    router.delete("/goal/:id", goal.delete);
  
    app.use("/resume", router);
  };
module.exports = (app) => {
    const experience = require("../controllers/experience.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new goal
    router.post("/experience/", [authenticateRoute, authenticateAdmin], experience.create);
  
    // Retrieve all goals
    router.get("/experience/", [authenticateRoute, authenticateAdmin], experience.findAll);
  
    // Update a role with Id
    router.put("/experience/:id", [authenticateRoute, authenticateAdmin], experience.update);
  
    // Delete a role with Id
    router.delete("/experience/:id", [authenticateRoute, authenticateAdmin], experience.delete);
  
    app.use("/resume", router);
  };
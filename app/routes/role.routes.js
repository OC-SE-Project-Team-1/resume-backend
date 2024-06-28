module.exports = (app) => {
    const role = require("../controllers/role.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new goal
    router.post("/role/", role.create);
  
    // Retrieve all goals
    router.get("/role/", role.findAll);
  
    // Update a role with Id
    router.put("/role/:id", role.update);
  
    // Delete a role with Id
    router.delete("/role/:id", role.delete);
  
    app.use("/resume", router);
  };
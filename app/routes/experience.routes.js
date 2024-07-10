module.exports = (app) => {
    const experience = require("../controllers/experience.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new experience
    router.post("/experience/", [authenticateRoute], experience.create);
  
    // Retrieve all experiences
    router.get("/experience/", [authenticateRoute, authenticateAdmin], experience.findAll);

    // Retrieve all experiences for a user
    router.get("/experience/user/:userId", experience.findAllForUser);
  
    // Retrieve a single experience with Id
    router.get("/experience/:id", experience.findOne);
  
    // Update a experience with Id
    router.put("/experience/:id", [authenticateRoute, authenticateAdmin], experience.update);
  
    // Delete a experience with Id
    router.delete("/experience/:id", [authenticateRoute, authenticateAdmin], experience.delete);
  
    app.use("/resume-p2t1", router);
  };
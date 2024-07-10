module.exports = (app) => {
    const experienceType = require("../controllers/experienceType.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new goal
    router.post("/experienceType/", [authenticateRoute, authenticateAdmin], experienceType.create);
  
    // Retrieve all goals
    router.get("/experienceType/", [authenticateRoute, authenticateAdmin], experienceType.findAll);
  
    // Update a experienceType with Id
    router.put("/experienceType/:id", [authenticateRoute, authenticateAdmin], experienceType.update);
  
    // Delete a experienceType with Id
    router.delete("/experienceType/:id", [authenticateRoute, authenticateAdmin], experienceType.delete);
  
    app.use("/resume-p2t1", router);
  };
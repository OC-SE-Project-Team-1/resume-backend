module.exports = (app) => {
    const experience = require("../controllers/experience.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new experience
    router.post("/experience/", [authenticateRoute, authenticateUserReq], experience.create);
  
    // Retrieve all experiences
    router.get("/experience/", [authenticateRoute, authenticateAdmin], experience.findAll);

    // Retrieve all experiences for a user
    router.get("/experience/user/:userId", [authenticateRoute, authenticateUserReq], experience.findAllForUser);
  
    // Retrieve a single experience with Id
    router.get("/experience/:id", [authenticateRoute, authenticateUserReq], experience.findOne);
  
    // Update a experience with Id
    router.put("/experience/:id", [authenticateRoute, authenticateUserReq], experience.update);
  
    // Delete a experience with Id
    router.delete("/experience/:id", [authenticateRoute, authenticateUserReq], experience.delete);
  
    app.use("/resume", router);
  };
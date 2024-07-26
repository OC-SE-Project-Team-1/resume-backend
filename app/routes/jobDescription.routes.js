module.exports = (app) => {
    const jobDescription = require("../controllers/jobDescription.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new jobDescription
    router.post("/jobDescription/",[authenticateRoute, authenticateUserReq], jobDescription.create);
  
    // Retrieve all jobDescriptions
    router.get("/jobDescription/",[authenticateRoute, authenticateAdmin], jobDescription.findAll);

    // Retrieve all jobDescriptions for a user
    router.get("/jobDescription/user/:userId",[authenticateRoute, authenticateUserReq], jobDescription.findAllForUser);
  
    // Retrieve a single jobDescription with Id
    router.get("/jobDescription/:id",[authenticateRoute], jobDescription.findOne);
  
    // Update a jobDescription with Id
    router.put("/jobDescription/:id",[authenticateRoute, authenticateUserReq], jobDescription.update);
  
    // Delete a jobDescription with Id
    router.delete("/jobDescription/:id",[authenticateRoute, authenticateUserReq], jobDescription.delete);
  
    app.use("/resume-p2t1", router);
  };
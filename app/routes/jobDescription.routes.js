module.exports = (app) => {
    const jobDescription = require("../controllers/jobDescription.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new jobDescription
    router.post("/jobDescription/", jobDescription.create);
  
    // Retrieve all jobDescriptions
    router.get("/jobDescription/", jobDescription.findAll);

    // Retrieve all jobDescriptions for a user
    router.get("/jobDescription/user/:userId", jobDescription.findAllForUser);
  
    // Retrieve a single jobDescription with Id
    router.get("/jobDescription/:id", jobDescription.findOne);
  
    // Update a jobDescription with Id
    router.put("/jobDescription/:id", jobDescription.update);
  
    // Delete a jobDescription with Id
    router.delete("/jobDescription/:id", jobDescription.delete);
  
    app.use("/resume-p2t1", router);
  };
module.exports = (app) => {
    const resume = require("../controllers/resume.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq } = require("../authentication/authentication.js");
  
    // Create a new resume
    router.post("/resumes/", [authenticateRoute, authenticateUserReq], resume.create);
  
    // Retrieve all resumes
    router.get("/resumes/", [authenticateRoute], resume.findAll);

    // Retrieve all resumes for a user
    router.get("/resumes/user/:userId", [authenticateRoute], resume.findAllForUser);
  
    // Retrieve a single resume with Id
    router.get("/resumes/:id", [authenticateRoute], resume.findOne);
  
    // Update a resume with Id
    router.put("/resumes/:id", [authenticateRoute], resume.update);
  
    // Delete a resume with Id
    router.delete("/resumes/:id", [authenticateRoute, authenticateUserReq], resume.delete);

    // Resume Feedback
    router.post("/resumes/jobFeedback", resume.getJobFeedback);
  
    app.use("/resume", router);
  };
module.exports = (app) => {
    const education = require("../controllers/education.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new education
    router.post("/education/",[authenticateRoute, authenticateUserReq], education.create);
  
    // Retrieve all educations
    router.get("/education/", [authenticateRoute, authenticateAdmin],education.findAll);

    // Retrieve all educations for a user
    router.get("/education/user/:userId", [authenticateRoute, authenticateUserReq], education.findAllForUser);
  
    // Retrieve a single education with Id
    router.get("/education/:id", [authenticateRoute, authenticateUserReq], education.findOne);
  
    // Update a education with Id
    router.put("/education/:id", [authenticateRoute, authenticateUserReq], education.update);
  
    // Delete a education with Id
    router.delete("/education/:id", [authenticateRoute, authenticateUserReq], education.delete);
  
    app.use("/resume", router);
  };
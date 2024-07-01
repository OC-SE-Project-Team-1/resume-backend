module.exports = (app) => {
    const education = require("../controllers/education.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new education
    router.post("/education/", education.create);
  
    // Retrieve all educations
    router.get("/education/", education.findAll);

    // Retrieve all educations for a user
    router.get("/education/user/:userId", education.findAllForUser);
  
    // Retrieve a single education with Id
    router.get("/education/:id", education.findOne);
  
    // Update a education with Id
    router.put("/education/:id", education.update);
  
    // Delete a education with Id
    router.delete("/education/:id", education.delete);
  
    app.use("/resume", router);
  };
module.exports = (app) => {
    const skill = require("../controllers/skill.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new skill
    router.post("/skill/", skill.create);

    // Ai assist to create desciption 
    router.post("/skill/assist/", skill.generateAIDescription);
  
    // Retrieve all skills
    router.get("/skill/", skill.findAll);

    // Retrieve all skills for a user
    router.get("/skill/user/:userId", skill.findAllForUser);
  
    // Retrieve a single skill with Id
    router.get("/skill/:id", skill.findOne);
  
    // Update a skill with Id
    router.put("/skill/:id", skill.update);
  
    // Delete a skill with Id
    router.delete("/skill/:id", skill.delete);
  
    app.use("/resume", router);
  };
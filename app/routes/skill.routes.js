module.exports = (app) => {
    const skill = require("../controllers/skill.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new skill
    router.post("/skill/",[authenticateRoute, authenticateUserReq], skill.create);

    // Ai assist to create desciption 
    router.post("/skill/assist/", skill.generateAIDescription);
  
    // Retrieve all skills
    router.get("/skill/",[authenticateRoute, authenticateAdmin], skill.findAll);

    // Retrieve all skills for a user
    router.get("/skill/user/:userId",[authenticateRoute, authenticateUserReq], skill.findAllForUser);
  
    // Retrieve a single skill with Id
    router.get("/skill/:id",[authenticateRoute], skill.findOne);
  
    // Update a skill with Id
    router.put("/skill/:id",[authenticateRoute, authenticateUserReq], skill.update);
  
    // Delete a skill with Id
    router.delete("/skill/:id",[authenticateRoute, authenticateUserReq], skill.delete);
  
    app.use("/resume-p2t1", router);
  };

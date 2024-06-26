module.exports = (app) => {
    const story = require("../controllers/story.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin, authenticateUserReq } = require("../authentication/authentication.js");
  
    // Create a new story
    router.post("/story/", story.generateStory);

    // Extend existing story
    router.post("/story/update/:id", story.extendStory);

    // Save a new story
    router.post("/story/account/:userId",[authenticateRoute, authenticateUserReq], story.create);
  
    // Retrieve all stories
    router.get("/story/",[authenticateAdmin], story.findAll);

    // Retrieve all stories for a user
    router.get("/story/account/:userId", [authenticateRoute, authenticateUserReq],story.findAllForUser);
  
    // Retrieve a single story with Id
    router.get("/story/:id",[authenticateRoute], story.findOne);
  
    // Update a story with Id
    router.put("/story/:id",[authenticateRoute, authenticateUserReq], story.update);
  
    // Delete a story with Id
    router.delete("/story/:id",[authenticateRoute, authenticateUserReq], story.delete);
  
    app.use("/fairytales", router);
  };
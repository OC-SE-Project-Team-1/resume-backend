module.exports = (app) => {
    const character_name = require("../controllers/characterName.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new character name
    router.post("/characterName/", [authenticateRoute, authenticateUserReq], character_name.create);
  
    // Retrieve all character name
    router.get("/characterName/", [authenticateRoute, authenticateAdmin], character_name.findAll);

    // Retrieve all character names for a user
    router.get("/characterName/account/:userId", [authenticateRoute, authenticateUserReq], character_name.findAllForUser);
  
    // Retrieve a single character name with Id
    router.get("/characterName/:id", character_name.findOne);
  
    // Update an character name with Id
    router.put("/characterName/:id", [authenticateRoute, authenticateUserReq], character_name.update);
  
    // Delete an character name with Id
    router.delete("/characterName/:id", [authenticateRoute, authenticateUserReq], character_name.delete);
  
    app.use("/fairytales", router);
  };
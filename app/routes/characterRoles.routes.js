module.exports = (app) => {
  const CharacterRoles = require("../controllers/characterRoles.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");

  // Create a new character role
  router.post("/characterRoles", [authenticateRoute, authenticateUserReq], CharacterRoles.create);
   
  // Retrieve all character roles for a user
  router.get("/characterRoles/account/:userId", [authenticateRoute, authenticateUserReq], CharacterRoles.findAllForUser);

  // Retrieve all character roles
  router.get("/characterRoles", [authenticateRoute, authenticateAdmin], CharacterRoles.findAllCharacterRoles);

  // Retrieve a single character role with tableId
  router.get("/characterRoles/:id", CharacterRoles.findOne);

  // Update an character role with tableId
  router.put("/characterRoles/:id", [authenticateRoute, authenticateUserReq], CharacterRoles.update);

  // Delete an character role with tableId
  router.delete("/characterRoles/:id", [authenticateRoute, authenticateUserReq], CharacterRoles.delete);

  app.use("/fairytales", router);
};
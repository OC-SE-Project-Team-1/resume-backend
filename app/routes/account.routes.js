module.exports = (app) => {
  const User = require("../controllers/account.controller.js");
  const { authenticateRoute, authenticateUserReq, authenticateAdmin, authenticateCareerService } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/account/", User.create);

  // Retrieve all Users
  router.get("/account/", [authenticateRoute, authenticateCareerService], User.findAll);

  // Retrieve a single User with id
  router.get("/account/:id", [authenticateRoute], User.findOne);

  // Update a User with id
  router.put("/account/:id", [authenticateRoute, authenticateUserReq], User.update);

  // Delete a User with id
  router.delete("/account/:id", [authenticateRoute, authenticateAdmin], User.delete);

  app.use("/resume-p2t1", router);
};
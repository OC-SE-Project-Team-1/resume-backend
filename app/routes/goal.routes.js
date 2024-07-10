module.exports = (app) => {
    const goal = require("../controllers/goal.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new goal
    router.post("/goal/", [authenticateRoute, authenticateUserReq], goal.create);
  
    // Retrieve all goals
    router.get("/goal/",[authenticateRoute, authenticateAdmin], goal.findAll);

    // Retrieve all goals for a user
    router.get("/goal/user/:userId",[authenticateRoute, authenticateUserReq], goal.findAllForUser);
  
    // Retrieve a single goal with Id
    router.get("/goal/:id", [authenticateRoute, authenticateUserReq], goal.findOne);
  
    // Update a goal with Id
    router.put("/goal/:id", [authenticateRoute, authenticateUserReq], goal.update);
  
    // Delete a goal with Id
    router.delete("/goal/:id", [authenticateRoute, authenticateUserReq], goal.delete);
  
    app.use("/resume-p2t1", router);
  };
module.exports = (app) => {
    const link = require("../controllers/link.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateUserReq, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new link
    router.post("/link/",[authenticateRoute, authenticateUserReq], link.create);
  
    // Retrieve all links
    router.get("/link/",[authenticateRoute, authenticateAdmin], link.findAll);

    // Retrieve all links for a user
    router.get("/link/user/:userId",[authenticateRoute, authenticateUserReq], link.findAllForUser);
  
    // Retrieve a single link with Id
    router.get("/link/:id",[authenticateRoute, authenticateUserReq], link.findOne);
  
    // Update a link with Id
    router.put("/link/:id",[authenticateRoute, authenticateUserReq], link.update);
  
    // Delete a link with Id
    router.delete("/link/:id",[authenticateRoute, authenticateUserReq], link.delete);
  
    app.use("/resume-p2t1", router);
  };
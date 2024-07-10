module.exports = (app) => {
    const link = require("../controllers/link.controller.js");
    var router = require("express").Router();
    const { authenticateRoute } = require("../authentication/authentication.js");
  
    // Create a new link
    router.post("/link/", link.create);
  
    // Retrieve all links
    router.get("/link/", link.findAll);

    // Retrieve all links for a user
    router.get("/link/user/:userId", link.findAllForUser);
  
    // Retrieve a single link with Id
    router.get("/link/:id", link.findOne);
  
    // Update a link with Id
    router.put("/link/:id", link.update);
  
    // Delete a link with Id
    router.delete("/link/:id", link.delete);
  
    app.use("/resume-p2t1", router);
  };
module.exports = (app) => {
    const Location = require("../controllers/location.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin, authenticateUserReq } = require("../authentication/authentication");
  
    // Create a new location
    router.post("/location", [authenticateRoute, authenticateUserReq], Location.create);
  
     
    // Retrieve all location for a user
    router.get("/location/account/:userId", [authenticateRoute, authenticateUserReq], Location.findAllForUser);

    // Retrieve all location
    router.get("/location", [authenticateRoute, authenticateAdmin], Location.findAll);

  
    // Retrieve a single location with tableId
    router.get("/location/:id", Location.findOne);
  
    // Update an location with tableId
    router.put("/location/:id", [authenticateRoute, authenticateUserReq], Location.update);
  
    // Delete an location with tableId
    router.delete("/location/:id", [authenticateRoute, authenticateUserReq], Location.delete);
  
    app.use("/fairytales", router);
  };
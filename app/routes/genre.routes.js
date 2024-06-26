module.exports = (app) => {
    const Genre = require("../controllers/genre.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin, authenticateUserReq } = require("../authentication/authentication");
  
    // Create a new genre
    router.post("/genre", [authenticateRoute, authenticateUserReq], Genre.create);
  
     
    // Retrieve all genre for a user
    router.get("/genre/account/:userId",[authenticateRoute, authenticateUserReq], Genre.findAllForUser);

    // Retrieve all genre for a user
    router.get("/genre",[authenticateRoute, authenticateAdmin], Genre.findAllGenre);

  
    // Retrieve a single genre with tableId
    router.get("/genre/:id", Genre.findOne);
  
    // Update an genre with tableId
    router.put("/genre/:id", [authenticateRoute, authenticateUserReq], Genre.update);
  
    // Delete an genre with tableId
    router.delete("/genre/:id", [authenticateRoute, authenticateUserReq], Genre.delete);
  
    app.use("/fairytales", router);
  };
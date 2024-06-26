module.exports = (app) => {
    const TimePeriod = require("../controllers/timePeriod.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");

  
    // Create a new timePeriod
    router.post("/timePeriod", [authenticateRoute, authenticateUserReq], TimePeriod.create);
  
     
    // Retrieve all timePeriod for a user
    router.get("/timePeriod/account/:userId",[authenticateRoute, authenticateUserReq], TimePeriod.findAllForUser);

    // Retrieve all timePeriod
    router.get("/timePeriod",[authenticateRoute, authenticateAdmin], TimePeriod.findAllTimePeriod);

  
    // Retrieve a single timePeriod with tableId
    router.get("/timePeriod/:id", TimePeriod.findOne);
  
    // Update an timePeriod with tableId
    router.put("/timePeriod/:id", [authenticateRoute, authenticateUserReq], TimePeriod.update);
  
    // Delete an timePeriod with tableId
    router.delete("/timePeriod/:id", [authenticateRoute, authenticateUserReq], TimePeriod.delete);
  
    app.use("/fairytales", router);
  };
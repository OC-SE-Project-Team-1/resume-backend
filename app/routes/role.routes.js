module.exports = (app) => {
    const role = require("../controllers/role.controller.js");
    var router = require("express").Router();
    const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication.js");
  
    // Create a new role
    router.post("/role/", [authenticateRoute, authenticateAdmin], role.create);
  
    // Retrieve all role
    router.get("/role/", [authenticateRoute, authenticateAdmin], role.findAll);
  
    // Update a role with Id
    router.put("/role/:id", [authenticateRoute, authenticateAdmin], role.update);
  
    // Delete a role with Id
    router.delete("/role/:id", [authenticateRoute, authenticateAdmin], role.delete);
  
    app.use("/resume-p2t1", router);
  };
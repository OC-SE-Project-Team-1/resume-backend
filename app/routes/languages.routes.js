module.exports = (app) => {
  const Language = require("../controllers/languages.controller.js");
  var router = require("express").Router();
  const { authenticateRoute, authenticateAdmin } = require("../authentication/authentication");

  // Create a new language
  router.post("/language", [authenticateRoute, authenticateAdmin], Language.create);

  // Retrieve all language
  router.get("/language", Language.findAll);

  // Retrieve a single language with tableId
  router.get("/language/:id", Language.findOne);

  // Update an language with tableId
  router.put("/language/:id", [authenticateRoute, authenticateAdmin], Language.update);

  // Delete an language with tableId
  router.delete("/language/:id", [authenticateRoute, authenticateAdmin], Language.delete);

  app.use("/fairytales", router);
};
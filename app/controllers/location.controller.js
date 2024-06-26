const db = require("../models");
const Location = db.location;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateLocation(entry, userId){
    try{
      const existingLocation = await Location.findOne({where: {location: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});
  
      if (existingLocation){
        console.error('There is an imposter location among us');
        return true;
      } else {
        console.error('No duplicates location here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

// Create and Save a new Location
exports.create = async (req, res) => {
    // Validate request
    if (req.body.location === undefined) {
        const error = new Error("Name cannot be empty for Location");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.userId === undefined) {
      const error = new Error("User ID cannot be empty for Location");
      error.statusCode = 400;
      throw error;
    }

    // Create a Location
    const locations = {
        location: req.body.location,
        userId: req.body.userId
    };
    
      const isDuplicateLocation = await findDuplicateLocation(req.body.location, req.body.userId);

      if (isDuplicateLocation) {
        return res.status(500).send({
          message:
            "This Location is already in use",
        });
      } else {
              console.log("Location not found");
              
    // Save Location in the database
    Location.create(locations).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Location.",
        });
    });
    }
};

// Retrieve all Locations from the database.
exports.findAll = (req, res) => {
    const locationId = req.query.id;
    var condition = locationId
      ? {
          id: {
            [Op.like]: `%${locationId}%`,
          },
        }
      : null;
  
    Location.findAll({ where: condition, order: ["location"] })
    .then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Locations.",
        });
    });
};

// Find all Locations for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Location.findAll({
        where: { [Op.or]: [{ userId: userId }, { userId: null }]},
        order: [
            ["location"], 
        ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Locations for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Locations for user with id=" + userId,
        });
    });
};

// Find a single location for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Location.findByPk(id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Locations with id=" + id,
        });
    });
};

// Update a Location by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    if (id <= 4){
        res.status(500).send({
            message: "Can't update default values",
        });
    }
    else {
    
      const isDuplicateLocation = await findDuplicateLocation(req.body.location, req.body.userId);

    if (isDuplicateLocation) {
        return res.status(500).send({
          message:
            "This Location is already in use PUT",
        });
      } else {
              console.log("Location not found");

    Location.update(req.body, {
        where: { id: id, userId : req.body.userId},
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Location was updated successfully.",
            });
        } else {
            res.send({
                message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error updating Location with id=" + id,
        });
    });
    }
    }
  };

// Delete a Location with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    if (id <= 4){
        res.status(500).send({
            message: "Can't delete default values",
        });
    }
    else {
    Location.destroy({
      where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Location was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Location with id=${id}. Maybe Location was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Location with id=" + id,
        });
    });
}
  };
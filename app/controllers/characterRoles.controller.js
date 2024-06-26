const db = require("../models");
const CharacterRoles = db.characterroles;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateRole(entry,userId){
  try{
    const existingRole = await CharacterRoles.findOne({where: {name: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});

    if (existingRole){
      console.error('There is an imposter role among us');
      return true;
    } else {
      console.error('No duplicates role here');
      return false;
    }
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

// Create and Save a new Character Roles
exports.create = async (req, res) => {
    // Validate request
    if (req.body.name === undefined) {
        const error = new Error("Name cannot be empty for Character Roles");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.userId === undefined) {
      const error = new Error("User ID cannot be empty for Character Roles");
      error.statusCode = 400;
      throw error;
  }

    // Create a Character Roles
  const characterRoles = {
    name: req.body.name,
    userId: req.body.userIdy
  };

  const isDuplicateRole = await findDuplicateRole(req.body.name, req.body.userId);

  if (isDuplicateRole) {
    return res.status(500).send({
      message:
        "This Character Role is already in use",
    });
  } else {
          console.log("Character Role not found");

  // Save Character Roles in the database
  CharacterRoles.create(characterRoles)
    .then((data) => {
      console.log(characterRoles);
      res.send(data);
    })
    .catch((err) => {
      console.log(characterRoles);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Character Roles.",
      });
    });
  }
};


// Retrieve all Character Roles from the database.
exports.findAllCharacterRoles = (req, res) => {
    const characterRolesId = req.query.characterRolesId;
    var condition = characterRolesId
      ? {
          id: {
            [Op.like]: `%${characterRolesId}%`,
          },
        }
      : null;
  
    CharacterRoles.findAll({ where: condition, order: ["name"] })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Character Roles.",
        });
      });
  };

// Find all Character Roles for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    CharacterRoles.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["name"], 
      ],
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Character Roles for user with id=${userId}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error retrieving Character Roles for user with id=" + userId,
        });
      });
};

// Find a single Character Roles for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    CharacterRoles.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Character Roles with id=" + id,
      });
    });
};


//  Update a Character Roles by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  if (req.body.userId === undefined) {
    const error = new Error("User ID cannot be empty");
    error.statusCode = 400;
    throw error;
  }
    //default values check
  if (id <= 4){
    res.status(500).send({
        message: "Can't update default values",
    });
  }
  else {

  const isDuplicateRole = await findDuplicateRole(req.body.name, req.body.userId);

  if (isDuplicateRole) {
    return res.status(500).send({
      message:
        "This Character Role is already in use",
    });
  } else {
          console.log("Character Role not found");

  CharacterRoles.update(req.body, {
    where: { id: id , userId : req.body.userId},
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Character Roles was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Character Roles with id=${id}. Maybe Character Roles was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Character Roles with id=" + id,
      });
    });
  }
}
};
// Delete a Character Roles with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  if (req.body.userId === undefined) {
    const error = new Error("User ID cannot be empty");
    error.statusCode = 400;
    throw error;
  }
  //default values check
  if (id <= 4){
    res.status(500).send({
        message: "Can't delete default values",
    });
  }
  else {
    CharacterRoles.destroy({
      where: { id: id , userId : req.body.userId},
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            message: "Character Roles was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Character Roles with id=${id}. Maybe Character Roles was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete Character Roles with id=" + id,
        });
      });
    }
};
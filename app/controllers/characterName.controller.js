const db = require("../models");
const CharacterName = db.character_name;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateName(entry, userId){
    try{
      const existingName = await CharacterName.findOne({where: {name: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});
  
      if (existingName){
        console.error('There is an imposter name among us');
        return true;
      } else {
        console.error('No duplicates name here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

// Create and Save a new character name
exports.create = async (req, res) => {
    // Validate request
    if (req.body.name === undefined) {
        const error = new Error("Name cannot be empty for Character Name");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Character Name");
        error.statusCode = 400;
        throw error;
    }

    // Create character name
    const character = {
        name: req.body.name,
        userId: req.body.userId
    };

    const isDuplicateName = await findDuplicateName(req.body.name, req.body.userId);

    if (isDuplicateName) {
        return res.status(500).send({
          message:
            "This Character Name is already in use",
        });
      } else {
              console.log("Character Name not found");

    // Save character name
    CharacterName.create(character)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Character name.",
            });
        });
    }
};

// Find all Character names in the database
exports.findAll = (req, res) => {
    const characterNameId = req.query.id;
    var condition = characterNameId ? {
        id: {
            [Op.like]: `%${characterNameId}`,
        },
    } : null;

    CharacterName.findAll({
        where: condition, 
        order: ["name"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Character names.",
        });
    });
};

// Find all Character Names for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    CharacterName.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["name"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Character Names for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Character Names for user with id=" + userId,
        });
    });
};

// Find a single character name for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    CharacterName.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Character Name with id=" + id,
      });
    });
};

//  Update a character name by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    const id = req.params.id;
    //default values check
    if (id <= 4){
        res.status(500).send({
            message: "Can't update default values",
        });
    }
    else {

    const isDuplicateName = await findDuplicateName(req.body.name, req.body.userId);

    if (isDuplicateName) {
        return res.status(500).send({
          message:
            "This Character Name is already in use",
        });
      } else {
              console.log("Character Name not found");

    CharacterName.update(req.body, {
      where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Character Name was updated successfully.",
            });
        } else {
            res.send({
                message: `Cannot update Character Name with id=${id}. Maybe Character Name was not found or req.body is empty!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error updating Character Name with id=" + id,
        });
    });
    }
}
};

// Delete a Character Name with the specified id in the request
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
    CharacterName.destroy({
      where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Character Name was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Character Name with id=${id}. Maybe Character Name was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Character Name with id=" + id,
        });
    });
    }
};
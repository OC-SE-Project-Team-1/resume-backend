const db = require("../models");
const Genre = db.genre;

const Op = db.Sequelize.Op;

async function findDuplicateGenre(entry, userId){
  try{
    const existingGenre = await Genre.findOne({where: {name: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});

    if (existingGenre){
      console.error('There is an imposter genre among us');
      return true;
    } else {
      console.error('No duplicates genre here');
      return false;
    }
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

// Create and Save a new Genre
exports.create = async (req, res) => {
  // Validate request
  if (req.body.name === undefined) {
      const error = new Error("Name cannot be empty for Genre");
      error.statusCode = 400;
      throw error;
  }
  else if (req.body.userId === undefined) {
    const error = new Error("User ID cannot be empty for Genre");
    error.statusCode = 400;
    throw error;
  }

    // Create a Genre
  const genre = {
    name: req.body.name,
    userId: req.body.userId
  };

  const isDuplicateGenre = await findDuplicateGenre(req.body.name, req.body.userId);

  if (isDuplicateGenre) {
    return res.status(500).send({
      message:
        "This Genre is already in use",
    });
  } else {
          console.log("Genre not found");

  // Save Genre in the database
  Genre.create(genre)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Genre.",
      });
    });
  }
};

// Retrieve all Genres from the database.
exports.findAllGenre = async (req, res) => {
  const genreId = req.query.genreId;
  var condition = genreId
    ? {
        id: {
          [Op.like]: `%${genreId}%`,         
        },
      }
    : null;

  Genre.findAll({ where: condition, order: ["name"] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Genres.",
      });
    });
  };

// Find all Genre for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Genre.findAll({
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
            message: `Cannot find Genre for user with id=${userId}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error retrieving Genre for user with id=" + userId,
        });
      });
};


// Find a single genre for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Genre.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Genre with id=" + id,
      });
    });
};


//  Update a Genre by the id in the request
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

  const isDuplicateGenre = await findDuplicateGenre(req.body.name, req.body.userId);

  if (isDuplicateGenre) {
    return res.status(500).send({
      message:
        "This Genre is already in use",
    });
  } else {
          console.log("Genre not found");

  Genre.update(req.body, {
    where: { id: id , userId : req.body.userId},
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Genre was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Genre with id=${id}. Maybe Genre was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Genre with id=" + id,
      });
    });
  }
}
};
// Delete a Genre with the specified id in the request
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
  Genre.destroy({
    where: { id: id , userId : req.body.userId},
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Genre was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Genre with id=${id}. Maybe Genre was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Genre with id=" + id,
      });
    });
  }
};

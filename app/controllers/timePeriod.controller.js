const db = require("../models");
const TimePeriod = db.timePeriod;
const User = db.user;

const Op = db.Sequelize.Op;

async function findDuplicateTime(entry, userId){
  try{
    const existingTime = await TimePeriod.findOne({where: {name: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});

    if (existingTime){
      console.error('There is an imposter time among us');
      return true;
    } else {
      console.error('No duplicates time here');
      return false;
    }
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}


// Create and Save a new TimePeriod
exports.create = async (req, res) => {
    // Validate request
    if (req.body.name === undefined) {
        const error = new Error("Name cannot be empty for Time Period");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.userId === undefined) {
      const error = new Error("User ID cannot be empty for Time Period");
      error.statusCode = 400;
      throw error;
  }

    // Create a Time Period
  const timePeriod = {
    name: req.body.name,
    userId: req.body.userId
  };

  const isDuplicateTime = await findDuplicateTime(req.body.name, req.body.userId);

  if (isDuplicateTime) {
    return res.status(500).send({
      message:
        "This Time is already in use",
    });
  } else {
          console.log("Time not found");
  // Save Time Period in the database
  TimePeriod.create(timePeriod)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Time Period.",
      });
    });
  }
};

// Retrieve all Time Periods from the database.
exports.findAllTimePeriod = (req, res) => {
    const timePeriodId = req.query.timePeriodId;
    var condition = timePeriodId
      ? {
          id: {
            [Op.like]: `%${timePeriodId}%`,
          },
        }
      : null;
  
    TimePeriod.findAll({ where: condition, order: ["name"] })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Time Periods.",
        });
      });
  };

// Find all Time Period for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    TimePeriod.findAll({
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
            message: `Cannot find Time Period for user with id=${userId}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error retrieving Time Period for user with id=" + userId,
        });
      });
};


// Find a single Time Period for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    TimePeriod.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Time Period with id=" + id,
      });
    });
};


//  Update a Time Period by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  if (req.body.userId === undefined) {
    const error = new Error("User ID cannot be empty");
    error.statusCode = 400;
    throw error;
}
  if (id <= 4){
    res.status(500).send({
        message: "Can't change default values",
    });
}
else {
  
  const isDuplicateTime = await findDuplicateTime(req.body.name, req.body.userId);

  if (isDuplicateTime) {
    return res.status(500).send({
      message:
        "This Time is already in use",
    });
  } else {
          console.log("Time not found");

  TimePeriod.update(req.body, {
    where: { id: id , userId : req.body.userId},
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Time Period was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Time Period with id=${id}. Maybe Time Period was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Time Period with id=" + id,
      });
    });
  }
}
};
// Delete a Time Period with the specified id in the request
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
  TimePeriod.destroy({
    where: { id: id, userId : req.body.userId },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Time Period was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Time Period with id=${id}. Maybe Time Period was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Time Period with id=" + id,
      });
    });
  }
};

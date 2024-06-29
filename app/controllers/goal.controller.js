const db = require("../models");
const Goal = db.goal;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateGoal(entry, userId){
    try{
      const existingGoal = await Goal.findOne({where: {title: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});
  
      if (existingGoal){
        console.error('There is an imposter goal among us');
        return true;
      } else {
        console.error('No duplicate goal here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new goal
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Goal");
        error.statusCode = 400;
        throw error;
    } else if (req.body.description === undefined) {
        const error = new Error("description cannot be empty for Goal");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Goal");
        error.statusCode = 400;
        throw error;
    }

    // Create goal
    const goal = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId
    };

    const isDuplicateGoal = await findDuplicateGoal(req.body.title, req.body.userId);

    if (isDuplicateGoal) {
        return res.status(500).send({
          message:
            "This Goal is already in use",
        });
    } else {
        console.log("Goal not found");

        // Save Goal
        Goal.create(goal).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Goal.",
            });
        });
    }
};

// Find all Goals in the database
exports.findAll = (req, res) => {
    const goalId = req.query.id;
    var condition = goalId ? {
        id: {
            [Op.like]: `%${goalId}`,
        },
    } : null;

    Goal.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Goals.",
        });
    });
};

// Find all Goals for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Goal.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Goals for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Goals for user with id=" + userId,
        });
    });
};

// Find a single Goal for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Goal.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Goal with id=" + id,
      });
    });
};

//  Update a Goal by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const isDuplicateGoal = await findDuplicateGoal(req.body.title, req.body.userId);

    if (isDuplicateGoal) {
        return res.status(500).send({
        message:
            "This Goal is already in use",
        });
    } else {
            console.log("Goal not found");

        Goal.update(req.body, {
            where: { id: id, userId : req.body.userId },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Goal was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Goal with id=${id}. Maybe Goal was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Goal with id=" + id,
            });
        });
    }
    
};

// Delete a Goal with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    Goal.destroy({
        where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Goal was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Goal with id=${id}. Maybe Goal was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Goal with id=" + id,
        });
    });
    
};
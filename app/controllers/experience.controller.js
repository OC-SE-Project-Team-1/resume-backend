const db = require("../models");
const Exp = db.experience;
const Op = db.Sequelize.Op;

async function findDuplicateExp(entry, userId, id){
    try{
      const existingExp = await Exp.findOne({where: {title: entry, userId: userId, [Op.not]: [{id: id}]}});
  
      if (existingExp){
        console.error('There is an imposter experience among us');
        return true;
      } else {
        console.error('No duplicate experience here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new experience
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Experience");
        error.statusCode = 400;
        throw error;
    } else if (req.body.description === undefined) {
        const error = new Error("Description cannot be empty for Experience");
        error.statusCode = 400;
        throw error;
    } else if (req.body.startDate === undefined) {
        const error = new Error("Start Date cannot be empty for Experience");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Experience");
        error.statusCode = 400;
        throw error;
    }

    // Create Experience
    const exp = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        userId: req.body.userId
    };

    const isDuplicateExp = await findDuplicateExp(req.body.title, req.body.userId, 0);

    if (isDuplicateExp) {
        return res.status(500).send({
          message:
            "This Experience is already created",
        });
    } else {
        // Save Experience
        Exp.create(exp).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Experience.",
            });
        });
    }
};

// Find all Experiences in the database
exports.findAll = (req, res) => {
    const expId = req.query.id;
    var condition = expId ? {
        id: {
            [Op.like]: `%${expId}`,
        },
    } : null;

    Exp.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Experience.",
        });
    });
};

// Find all Experiences for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Exp.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Experiences for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Experiences for user with id=" + userId,
        });
    });
};

// Find a single Experience for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Exp.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Experience with id=" + id,
      });
    });
};

//  Update a Experience by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const isDuplicateExp = req.body.title != null ? await findDuplicateExp(req.body.title, req.body.userId, id) : null;

    if (isDuplicateExp) {
        return res.status(500).send({
        message:
            "This Experience is already in use",
        });
    } else {
        Exp.update(req.body, {
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Experience was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Experience with id=${id}. Maybe Experience was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Experience with id=" + id,
            });
        });
    }
};

// Delete a Experience with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    //default values check
    Exp.destroy({
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Experience was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Experience with id=" + id,
            });
        });
};
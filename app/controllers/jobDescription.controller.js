const db = require("../models");
const JobDescription = db.jobDescription;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateJobDescription(entry, userId, id){
    try{
      const existingJobDescription = await JobDescription.findOne({where: {title: entry, userId: userId, [Op.not]: [{id: id}]}});
  
      if (existingJobDescription){
        console.error('There is an imposter jobDescription among us');
        return true;
      } else {
        console.error('No duplicate jobDescription here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new jobDescription
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for JobDescription");
        error.statusCode = 400;
        throw error;
    } else if (req.body.description === undefined) {
        const error = new Error("description cannot be empty for JobDescription");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for JobDescription");
        error.statusCode = 400;
        throw error;
    }

    // Create jobDescription
    const jobDescription = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId
    };

    const isDuplicateJobDescription = await findDuplicateJobDescription(req.body.title, req.body.userId, 0);

    if (isDuplicateJobDescription) {
        return res.status(500).send({
          message:
            "This JobDescription is already in use",
        });
    } else {
        console.log("JobDescription not found");

        // Save JobDescription
        JobDescription.create(jobDescription).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the JobDescription.",
            });
        });
    }
};

// Find all JobDescriptions in the database
exports.findAll = (req, res) => {
    const jobDescriptionId = req.query.id;
    var condition = jobDescriptionId ? {
        id: {
            [Op.like]: `%${jobDescriptionId}`,
        },
    } : null;

    JobDescription.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the JobDescription.",
        });
    });
};

// Find all JobDescriptions for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    JobDescription.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find JobDescriptions for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving JobDescriptions for user with id=" + userId,
        });
    });
};

// Find a single JobDescription for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    JobDescription.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving JobDescription with id=" + id,
      });
    });
};

//  Update a JobDescription by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const id = req.params.id;
    const isDuplicateJobDescription = (req.body.title) ? await findDuplicateJobDescription(req.body.title, req.body.userId, id) : null;

    if (isDuplicateJobDescription) {
        return res.status(500).send({
        message:
            "This JobDescription is already in use",
        });
    } else {
            console.log("JobDescription not found");

        JobDescription.update(req.body, {
            where: { id: id },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "JobDescription was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update JobDescription with id=${id}. Maybe JobDescription was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating JobDescription with id=" + id,
            });
        });
    }
    
};

// Delete a JobDescription with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    JobDescription.destroy({
        where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "JobDescription was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete JobDescription with id=${id}. Maybe JobDescription was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete JobDescription with id=" + id,
        });
    });
    
};
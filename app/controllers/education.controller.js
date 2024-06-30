const db = require("../models");
const Education = db.education;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateEducation(entry, userId){
    try{
      const existingEducation = await Education.findOne({where: {title: entry}});
  
      if (existingEducation){
        console.error('There is an imposter education among us');
        return true;
      } else {
        console.error('No duplicate education here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new education
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    } else if (req.body.description === undefined) {
        const error = new Error("description cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.startDate === undefined) {
        const error = new Error("Start Date cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.endDate === undefined) {
        const error = new Error("End Date cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.gradDate === undefined) {
        const error = new Error("Grad Date cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.gpa === undefined) {
        const error = new Error("GPA  cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.organization === undefined) {
        const error = new Error("Organization cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }

    // Create education
    const education = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        gradDate: req.body.gradDate,
        gpa: req.body.gpa,
        organization: req.body.organization
    };

    const isDuplicateEducation = await findDuplicateEducation(req.body.title);

    if (isDuplicateEducation) {
        return res.status(500).send({
          message:
            "This Education is already in use",
        });
    } else {
        console.log("Education not found");

        // Save Education
        Education.create(education).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Education.",
            });
        });
    }
};

// Find all Educations in the database
exports.findAll = (req, res) => {
    const educationId = req.query.id;
    var condition = educationId ? {
        id: {
            [Op.like]: `%${educationId}`,
        },
    } : null;

    Education.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Education.",
        });
    });
};

// Find all Educations for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Education.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Educations for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Educations for user with id=" + userId,
        });
    });
};

// Find a single Education for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Education.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Education with id=" + id,
      });
    });
};

//  Update a Education by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const id = req.params.id;
    const isDuplicateEducation = await findDuplicateEducation(req.body.title);

    if (isDuplicateEducation) {
        return res.status(500).send({
        message:
            "This Education is already in use",
        });
    } else {
            console.log("Education not found");

        Education.update(req.body, {
            where: { id: id },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Education was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Education with id=${id}. Maybe Education was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Education with id=" + id,
            });
        });
    }
    
};

// Delete a Education with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    Education.destroy({
        where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Education was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Education with id=${id}. Maybe Education was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Education with id=" + id,
        });
    });
    
};
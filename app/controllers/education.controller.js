const db = require("../models");
const Education = db.education;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateEducation(org, desc, userId, id){
    try{
      const existingEducation = await Education.findOne({where: {organization: org, description: desc, userId: userId, [Op.not]: [{id: id}]}});
  
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
    if (req.body.description === undefined) {
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
    else if (req.body.city === undefined) {
        const error = new Error("City cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.state === undefined) {
        const error = new Error("State cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.courses === undefined) {
        const error = new Error("Courses cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.minor === undefined) {
        const error = new Error("Minor cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }
    else if (req.body.totalGPA === undefined) {
        const error = new Error("Total GPA cannot be empty for Education");
        error.statusCode = 400;
        throw error;
    }

    // Create education
    const education = {
        description: req.body.description,
        userId: req.body.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        gradDate: req.body.gradDate,
        gpa: req.body.gpa,
        organization: req.body.organization,
        city: req.body.city,
        state: req.body.state,
        courses: req.body.courses,
        minor: req.body.minor,
        totalGPA: req.body.totalGPA,
        awards: req.body.awards
    };

    const isDuplicateEducation = await findDuplicateEducation(req.body.organization, req.body.description, req.body.userId, 0);

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

// Update a Education by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const id = req.params.id;
    const isDuplicateEducation = (req.body.title) ? await findDuplicateEducation(req.body.organization, req.body.description, req.body.userId, id) : null;

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
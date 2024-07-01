const db = require("../models");
const ExperienceType = db.experienceType;
const Op = db.Sequelize.Op;

async function findDuplicateExperienceType(entry){
    try{
      const existingExperienceType = await ExperienceType.findOne({where: {title: entry}});
  
      if (existingExperienceType){
        console.error('There is an imposter experienceType among us');
        return true;
      } else {
        console.error('No duplicate experienceType here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new experienceType
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for ExperienceType");
        error.statusCode = 400;
        throw error;
    }

    // Create ExperienceType
    const experienceType = {
        title: req.body.title,
    };

    const isDuplicateExperienceType = await findDuplicateExperienceType(req.body.title);

    if (isDuplicateExperienceType) {
        return res.status(500).send({
          message:
            "This ExperienceType is already in Created",
        });
    } else {
        // Save ExperienceType
        ExperienceType.create(experienceType).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the ExperienceType.",
            });
        });
    }
};

// Find all ExperienceTypes in the database
exports.findAll = (req, res) => {
    const experienceTypeId = req.query.id;
    var condition = experienceTypeId ? {
        id: {
            [Op.like]: `%${experienceTypeId}`,
        },
    } : null;

    ExperienceType.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the ExperienceTypes.",
        });
    });
};

//  Update a ExperienceType by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
        const isDuplicateExperienceType = await findDuplicateExperienceType(req.body.title);

    if (isDuplicateExperienceType) {
        return res.status(500).send({
        message:
            "This ExperienceType is already in use",
        });
    } else {
        ExperienceType.update(req.body, {
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "ExperienceType was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update ExperienceType with id=${id}. Maybe ExperienceType was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating ExperienceType with id=" + id,
            });
        });
    }
    
};

// Delete a ExperienceType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    //default values check
    ExperienceType.destroy({
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "ExperienceType was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete ExperienceType with id=${id}. Maybe ExperienceType was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete ExperienceType with id=" + id,
            });
        });
};
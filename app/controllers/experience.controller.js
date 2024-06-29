const db = require("../models");
const Exp = db.experience;
const Op = db.Sequelize.Op;

async function findDuplicateExp(entry){
    try{
      const existingExp = await Exp.findOne({where: {title: entry}});
  
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
    }

    // Create Experience
    const exp = {
        title: req.body.title,
    };

    const isDuplicateExp = await findDuplicateExp(req.body.title);

    if (isDuplicateExp) {
        return res.status(500).send({
          message:
            "This Role is already in Created",
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

//  Update a Experience by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
        const isDuplicateExp = await findDuplicateExp(req.body.title);

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
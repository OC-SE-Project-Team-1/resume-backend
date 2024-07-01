const db = require("../models");
const Role = db.role;
const Op = db.Sequelize.Op;

async function findDuplicateRole(entry, id){
    try{
      const existingRole = await Role.findOne({where: {title: entry, [Op.not]: [{ id: id }]}});
  
      if (existingRole){
        console.error('There is an imposter role among us');
        return true;
      } else {
        console.error('No duplicate role here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new role
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Role");
        error.statusCode = 400;
        throw error;
    }

    // Create Role
    const role = {
        title: req.body.title,
    };

    const isDuplicateRole = await findDuplicateRole(req.body.title, 0);

    if (isDuplicateRole) {
        return res.status(500).send({
          message:
            "This Role is already in Created",
        });
    } else {
        // Save Role
        Role.create(role).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Role.",
            });
        });
    }
};

// Find all Roles in the database
exports.findAll = (req, res) => {
    const roleId = req.query.id;
    var condition = roleId ? {
        id: {
            [Op.like]: `%${roleId}`,
        },
    } : null;

    Role.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Roles.",
        });
    });
};

//  Update a Role by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const isDuplicateRole = await findDuplicateRole(req.body.title, id);

    if (isDuplicateRole) {
        return res.status(500).send({
        message:
            "This Role is already in use",
        });
    } else {
        Role.update(req.body, {
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Role was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Role with id=" + id,
            });
        });
    }
    
};

// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    //default values check
    Role.destroy({
            where: { id: id},
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Role was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Role with id=${id}. Maybe Role was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Role with id=" + id,
            });
        });
};
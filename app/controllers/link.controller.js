const db = require("../models");
const Link = db.link;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateLink(entry, userId){
    try{
      const existingLink = await Link.findOne({where: {url: entry, [Op.or]: [{ userId: userId }, { userId: null }]}});
  
      if (existingLink){
        console.error('There is an imposter Link among us');
        return true;
      } else {
        console.error('No duplicate Link here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new Link
exports.create = async (req, res) => {
    // Validate request
    if (req.body.url === undefined) {
        const error = new Error("URL cannot be empty for Link");
        error.statusCode = 400;
        throw error;
    } else if (req.body.type === undefined) {
        const error = new Error("Type cannot be empty for Link");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Link");
        error.statusCode = 400;
        throw error;
    }

    // Create Link
    const link = {
        url: req.body.url,
        type: req.body.type,
        userId: req.body.userId
    };

    const isDuplicateLink = await findDuplicateLink(req.body.url, req.body.userId);

    if (isDuplicateLink) {
        return res.status(500).send({
          message:
            "This Link is already in use",
        });
    } else {
        console.log("Link not found");

        // Save Link
        Link.create(link).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Link.",
            });
        });
    }
};

// Find all Links in the database
exports.findAll = (req, res) => {
    const linkId = req.query.id;
    var condition = linkId ? {
        id: {
            [Op.like]: `%${linkId}`,
        },
    } : null;

    Link.findAll({
        where: condition, 
        order: ["url"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Links.",
        });
    });
};

// Find all Links for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Link.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["url"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Links for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Links for user with id=" + userId,
        });
    });
};

// Find a single Link for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Link.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Link with id=" + id,
      });
    });
};

//  Update a Link by the id in the request
exports.update = async (req, res) => {
    let id = req.params.id;
    const isDuplicateLink = req.body.url != null ? await findDuplicateLink(req.body.url, req.body.userId) : null;

    if (isDuplicateLink) {
        return res.status(500).send({
        message:
            "This Link is already in use",
        });
    } else {
        Link.update(req.body, {
            where: { id: id },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Link was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Link with id=${id}. Maybe Link was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Link with id=" + id,
            });
        });
    }
};

// Delete a Link with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    Link.destroy({
        where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Link was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Link with id=${id}. Maybe Link was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Link with id=" + id,
        });
    });
    
};
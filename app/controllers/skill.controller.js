const db = require("../models");
const Skill = db.skill;
const User = db.user;
const Op = db.Sequelize.Op;
const cohere = require("./cohereRequest");

async function findDuplicateSkill(entry, userId, id){
    try{
      const existingSkill = await Skill.findOne({where: {title: entry, userId: userId ,[Op.not]: [{ id: id }]}});
  
      if (existingSkill){
        console.error('There is an imposter skill among us');
        return true;
      } else {
        console.error('No duplicate skill here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

// Create and Save a new character name
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Skill");
        error.statusCode = 400;
        throw error;
    } else if (req.body.description === undefined) {
        const error = new Error("description cannot be empty for Skill");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Skill");
        error.statusCode = 400;
        throw error;
    }

    // Create Skill
    const skill = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        chatHistory : (req.body.chatHistory != null) ? req.body.chatHistory : [],
    };

    const isDuplicateSkill = await findDuplicateSkill(req.body.title, req.body.userId, 0);

    if (isDuplicateSkill) {
        return res.status(500).send({
          message:
            "This Skill is already in use",
        });
    } else {
        console.log("Skill not found");

        // Save Skill
        Skill.create(skill).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Skill.",
            });
        });
    }
};

// Find all Skills in the database
exports.findAll = (req, res) => {
    const skillId = req.query.id;
    var condition = skillId ? {
        id: {
            [Op.like]: `%${skillId}`,
        },
    } : null;

    Skill.findAll({
        where: condition, 
        order: ["title"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Skills.",
        });
    });
};

// Find all Skills for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Skill.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Skills for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Skills for user with id=" + userId,
        });
    });
};

// Find a single Skill for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Skill.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Skill with id=" + id,
      });
    });
};

//  Update a Skill by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    const id = req.params.id;

    const isDuplicateSkill = (req.body.title) ? await findDuplicateSkill(req.body.title, req.body.userId, id) : null;

    if (isDuplicateSkill) {
        return res.status(500).send({
        message:
            "This Skill is already in use",
        });
    } else {
            console.log("Skill not found");

        Skill.update(req.body, {
            where: { id: id, userId : req.body.userId },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Skill was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Skill with id=${id}. Maybe Skill was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Skill with id=" + id,
            });
        });
    }
    
};

// Delete a Skill with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    else {
        Skill.destroy({
            where: { id: id, userId : req.body.userId },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Skill was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Skill with id=${id}. Maybe Skill was not found!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Skill with id=" + id,
            });
        });
    }
};

//========== Cohere Functions ==========//
function GenerateCohereRequest(settings) {
    let request = `Write me a short skill description from this: ` + settings 

    request = `${request}. \n\nJump straight into the skill description.`;

    return request;
}

exports.generateAIDescription = async (req, res) => {
    let response = "";
    let request = "";
    let history = [];
    if (req.body.chatHistory === undefined || JSON.stringify(req.body.chatHistory) === '[]') {
       
        request = GenerateCohereRequest(req.body.description);
    } else {
        history = req.body.chatHistory;
        request = "Give me an alternative skill summary";
    }
    response = await cohere.SendCohereRequest(request, history);

    let skillSummary = cohere.SaveAIAssist(history, request, response);

    res.send(skillSummary);
};

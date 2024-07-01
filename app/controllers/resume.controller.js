const db = require("../models");
const Resume = db.resume;
const Session = db.session;
const Goal = db.goal;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateResume(entry, userId, id){
    try{
      const existingResume = await Resume.findOne({where: {title: entry, userId : userId , [Op.not]: [{ id: id }]}});
  
      if (existingResume){
        console.error('There is an imposter resume among us');
        return true;
      } else {
        console.error('No duplicate resume here');
        return false;
      }
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
}

//search for current session user
async function getUser(req){
    let auth = req.get("authorization");
    if (
      auth.startsWith("Bearer ") &&
      (typeof require !== "string" || require === "token")
    ) {
      let token = auth.slice(7);
      let sessionId = await decrypt(token);
      let session = {};
      await Session.findAll({ where: { id: sessionId } })
        .then((data) => {
          session = data[0];
        })
        .catch((error) => {
          console.log(error);
        });
        //ger roleId from userId found in session
        const user = await  User.findOne({
          where: {
            id: session.userId,
          },
        })
          .then((data) => {return data})
        return user;
    }
  }


// Create and Save a new resume
exports.create = async (req, res) => {
    // Validate request
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Resume");
        error.statusCode = 400;
        throw error;
    } else if (req.body.content === undefined) {
        const error = new Error("content cannot be empty for Resume");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Resume");
        error.statusCode = 400;
        throw error;
    }

    // Create resume
    const resume = {
        title: req.body.title,
        content: req.body.content,
        comments : "",
        editing : false,
        rating : "",
        userId: req.body.userId,
    };

    const isDuplicateResume = await findDuplicateResume(req.body.title, req.body.userId, 0);

    if (isDuplicateResume) {
        return res.status(500).send({
          message:
            "This Resume is already in use",
        });
    } else {
        console.log("Resume not found");
        
        // Save Resume
        Resume.create(resume).then((data) => {
            //add Goals
            const goals = req.body.goalId;
            goals.forEach( async (goalId) => {
                var goal = await Goal.findOne(
                    //find a goal that match Id and userId
                    {where: {id : goalId, userId : req.body.userId}}).then((goalItem) => { return goalItem});
               await data.addGoal(goal)
            });

            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the Resume.",
            });
        });
    }
};

// Find all Resumes in the database
exports.findAll = async (req, res) => {
    //check if user is a student and deny request
    const user = await getUser(req);
    if(user.roleId == 3 ){
        return res.status(500).send({
            message:
              "Student cannot retrieve all resume",
          });
    }
    const resumeId = req.query.id;
    var condition = resumeId ? {
        id: {
            [Op.like]: `%${resumeId}`,
        },
    } : null;

    Resume.findAll({
        where: condition, 
        order: ["title"],
        include: [{ model: Goal, as: 'Goal', }, /* Add more model as created */],
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Resumes.",
        });
    });
};

// Find all Resumes for a user
exports.findAllForUser = async (req, res) => {
    const userId = req.params.userId;
    const user = await getUser(req);
    if(user.roleId == 3 && user.id != userId){
        return res.status(500).send({
            message:
              "user does not have permission to retrieve resume",
          });
    }
    Resume.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["title"], 
      ],
      include: [{ model: Goal, as: 'Goal', }, /* Add more model as created */],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Resumes for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Resumes for user with id=" + userId,
        });
    });
};

// Find a single Resume for a user with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    const user = await getUser(req);
    if(user.roleId == 3 && user.userId != req.params.userId){
        return res.status(500).send({
            message:
              "user does not have permission to retrieve resume with id=" + id,
          });
    }
    Resume.findByPk(id,{
        include: [{ model: Goal, as: 'Goal', }, /* Add more model as created */],   
    })
    .then(async (data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Resume with id=" + id,
      });
    })
};

//  Update a Resume by the id in the request
exports.update = async (req, res) => {
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    var isDuplicateResume = (req.body.title != null) ? await findDuplicateResume(req.body.title, req.body.userId, req.params.id) : null;

    if (isDuplicateResume) {
        return res.status(500).send({
        message:
            "This Resume is already in use",
        });
    } else {
            console.log("Resume not found");
        const user = await getUser(req);
        //user with ID = 2(Career service)
         if(req.body.comments != null && user.roleId != 2){
            return res.status(500).send({
                message: "Cannot add/edit comment, user does not have permission",
            });
        }
        const editing = Resume.findOne({where: { id: req.params.id, userId : req.body.userId }}).then((data)=> {return data.editing})
        if(req.body.comments != null && user.roleId == 2 && !editing){
            return res.status(500).send({
                message: "Cannot add/edit comment, resume owner does not allow for comments",
            });
        }
        Resume.update(req.body, {
            where: { id: req.params.id, userId : req.body.userId },
        }).then((number) => {
            if (number == 1) {
                res.send({
                    message: "Resume was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Resume with id=${id}. Maybe Resume was not found or req.body is empty!`,
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Resume with id=" + id,
            });
        });
    }
    
};

// Delete a Resume with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
    }
    //check if user matched with ID, or if user is admon or carreer service(roleId = 2 || 3)
    const user = await getUser(req);
    //check if userId don't match for roleId 3 or if roleId is 2, deny delete request
    if ((user.userId != req.body.userId && user.roleId == 3) || user.roleId == 2){
        return res.status(500).send({
            message:
                "User does not have permission to delete resume",
            });
    }

    Resume.destroy({
        where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Resume was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Resume with id=${id}. Maybe Resume was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Resume with id=" + id,
        });
    });
    
};
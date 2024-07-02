const db = require("../models");
const Resume = db.resume;
const { authenticate } = require("../authentication/authentication");
const Goal = db.goal;
const Skill = db.skill;
const Experience = db.experience;
const Education = db.education;
const JobDescription = db.jobDescription;
const Link = db.link;
const User = db.user;
const Op = db.Sequelize.Op;

async function findDuplicateResume(entry, userId, id){
    try{
      const existingResume = await Resume.findOne({where: {title: entry, userId : userId, [Op.not]: [{ id: id }]}});
  
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
async function getUser(req, res){
    //get userId from session
    let { userId } = await authenticate(req, res, "token");
    let user = {};
    if (userId !== undefined) {
        //find and get user from db
        await User.findByPk(userId).then(async (data) => { user = data });  
        return user;
    }
    else{
        return res.status(500).send({ message:"This Resume is already in use"});
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
                    //find a Goal that match Id and userId
                    {where: {id : goalId, userId : req.body.userId}}).then((item) => { return item});
               await data.addGoal(goal)
            });

            //add Skills
            const skills = req.body.skillId;
            skills.forEach( async (skillId) => {
                var skill = await Skill.findOne(
                    //find a Skill that match Id and userId
                    {where: {id : skillId, userId : req.body.userId}}).then((item) => { return item});
               await data.addSkill(skill)
            });

            //add Experiences
            const experiences = req.body.experienceId;
            experiences.forEach( async (experiencelId) => {
                var experience = await Experience.findOne(
                    //find a Experience that match Id and userId
                    {where: {id : experiencelId, userId : req.body.userId}}).then((item) => { return item});
               await data.addExperience(experience)
            });

             //add Educations
             const educations = req.body.educationId;
             educations.forEach( async (educationId) => {
                 var education = await Education.findOne(
                     //find a Education that match Id and userId
                     {where: {id : educationId, userId : req.body.userId}}).then((item) => { return item});
                await data.addEducation(education)
             });

              //add Job Description
              const jobDesciptions = req.body.jobDescriptionId;
              jobDesciptions.forEach( async (jobDescriptionId) => {
                  var jobDesciption = await JobDescription.findOne(
                      //find a Job Description that match Id and userId
                      {where: {id : jobDescriptionId, userId : req.body.userId}}).then((item) => { return item});
                 await data.addJobDescription(jobDesciption)
              });

             //add Links
             const links = req.body.linkId;
             links.forEach( async (linkId) => {
                 var link = await Link.findOne(
                     //find a Link that match Id and userId
                     {where: {id : linkId, userId : req.body.userId}}).then((item) => { return item});
                await data.addLink(link)
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
    const user = await getUser(req, res);
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
        include: [{ model: Goal, as: 'Goal' }, { model: Skill, as: 'Skill'},{ model: Experience, as: 'Experience'},
             { model: Education, as: 'Education'}, { model: JobDescription, as: 'JobDescription'}, { model: Link, as: 'Link'} ],
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
    const user = await getUser(req, res);
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
      include: [{ model: Goal, as: 'Goal', }, { model: Skill, as: 'Skill'}, { model: Experience, as: 'Experience'},
         { model: Education, as: 'Education'}, { model: JobDescription, as: 'JobDescription'}, { model: Link, as: 'Link'} ],
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
    const user = await getUser(req, res);
    if(user.roleId == 3 && user.userId != req.params.userId){
        return res.status(500).send({
            message:
              "user does not have permission to retrieve resume with id=" + id,
          });
    }
    Resume.findByPk(id,{
        include: [{ model: Goal, as: 'Goal', }, { model: Skill, as: 'Skill'}, { model: Experience, as: 'Experience'},
             { model: Education, as: 'Education'}, { model: JobDescription, as: 'JobDescription'}, { model: Link, as: 'Link'}],   
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
        const user = await getUser(req, res);
        
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
    const user = await getUser(req, res);
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
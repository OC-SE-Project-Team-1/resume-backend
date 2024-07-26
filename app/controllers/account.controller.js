const db = require("../models");
const User = db.user;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt, getSalt, hashPassword } = require("../authentication/crypto");
const { authenticate } = require("../authentication/authentication");

async function findDuplicateEmail(entry, id){
  try{
    const existingUser = await User.findOne({where: {email: entry, [Op.not]: [{ id: id }]}});
    console.log(id);
    if (existingUser){
      console.error('There is an imposter email among us');
      return true;
    } else {
      console.error('No duplicates email here');
      return false;
    }
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}

async function findDuplicateUser(entry, id){
  try{
    const existingUser = await User.findOne({where: {userName: entry, [Op.not]: [{ id: id }]}});

    if (existingUser){
      console.error('There is an imposter user among us');
      return true;
    } else {
      console.error('No duplicates user here');
      return false;
    }
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
}
// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request 
  if (req.body.userName === undefined  || req.body.userName?.trim() === "") {
    const error = new Error("User name cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.email === undefined || req.body.email?.trim() === "") {
    const error = new Error("Email cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.password === undefined || req.body.password?.trim() === "") {
    const error = new Error("Password cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.firstName === undefined || req.body.firstName?.trim() === "") {
    const error = new Error("First Name cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.lastName === undefined || req.body.lastName?.trim() === "") {
    const error = new Error("Last Name cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.roleId === undefined) {
    const error = new Error("roleId cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  }

const isDuplicateEmail = await findDuplicateEmail(req.body.email, 0);
const isDuplicateUser = await findDuplicateUser(req.body.userName, 0);

  // find by email

      if (isDuplicateEmail) {
        return res.status(500).send({
          message:
            "This Email is already in use",
        });
      } else {
            if (isDuplicateUser) {
              return  res.status(500).send({
                message:
                  "This Username is already in use",
              });
            }
            else{
              console.log("email not found");
      
        let salt = await getSalt();
        let hash = await hashPassword(req.body.password, salt);

        // Create a User
        const user = {
          id : req.body.id,
          roleId : req.body.roleId,
          userName : req.body.userName,
          email : req.body.email,
          firstName : req.body.firstName,
          lastName : req.body.lastName,
          address : req.body.address,
          darkMode : req.body.darkMode,
          phoneNumber : req.body.phoneNumber,
          password : hash,
          salt : salt,
        };

        // Save User in the database
        await User.create(user)
          .then(async (data) => {
            // Create a Session for the new user
            let userId = data.id;

            let expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 1);

            const session = {
              email: req.body.email,
              userId: userId,
              expirationDate: expireTime,
            };
            await Session.create(session).then(async (data) => {
              let sessionId = data.id;
              let token = await encrypt(sessionId);
              let userInfo = {
                email: user.email,
                userName: user.userName,
                roleId : user.roleId,
                id: userId,               
                token: token,
              };
              res.send(userInfo);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
            }

      }
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving User with id = " + id,
      });
    });
};

// Find a single User with an email
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ email: "not found" });
        /*res.status(404).send({
          message: `Cannot find User with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving User with email=" + email,
      });
    });
};

//search for current session
async function isAdmin(req, res){

  let { userId } = await authenticate(req, res, "token");
  let user = {};
  if (userId !== undefined) {
      //find and get user from db
      await User.findByPk(userId).then(async (data) => { user = data });  
      return (user.roleId == 1);
  }
}

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const isDuplicateEmail = (req.body.email != null) ? await findDuplicateEmail(req.body.email, id) : false
  const isDuplicateUser = (req.body.userName != null) ? await findDuplicateUser(req.body.userName, id) : false
  
const isAdminmistrator = await isAdmin(req, res);
//only let user with roleId = 1(admin) to change roleId of a user
  if(req.body.roleId != null && !isAdminmistrator){
    return res.status(500).send({
      message:
        "Cannot change User Role",
    });
  }

  if (req.body.userId === undefined ) {
    const error = new Error("userId cannot be empty");
    error.statusCode = 400;
    throw error;
  }  if (isDuplicateEmail) {
    return res.status(500).send({
      message:
        "This Email is already in use",
    });
  } else {
        if (isDuplicateUser) {
          return  res.status(500).send({
            message:
              "This Username is already in use",
          });
        }
        else{

          if(req.body.password != null){
            let salt = await User.findByPk(req.body.userId).then((data) => {return data.salt});
            let hash = await hashPassword(req.body.password, salt);
            req.body.password = hash
          }
          if(req.body.salt != null){
            return  res.status(500).send({ message: "Does not have permission to change salt"});
          }
          User.update(req.body, {
            where: { id: id },
          })
            .then((number) => {
              if (number == 1) {
                res.send({
                  message: "User was updated successfully.",
                });
              } else {
                res.send({
                  message: `Cannot update User with id = ${id}. Maybe User was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Error updating User with id =" + id,
              });
            });
        }
  };
}

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  if (req.body.userId === undefined ) {
    const error = new Error("userId cannot be empty");
    error.statusCode = 400;
    throw error;
  }
  const isAdminmistrator = await isAdmin(req, res)
  if(!isAdminmistrator){
    return  res.status(500).send({
      message:
        "Does not have permission to delete user",
    });
  }
  User.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id = ${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete User with id = " + id,
      });
    });
};
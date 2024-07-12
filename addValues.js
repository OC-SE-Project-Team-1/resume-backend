const db = require("./app/models");
const User = db.user;
const Role = db.role;
const ExperienceType = db.experienceType;
const { encrypt, getSalt, hashPassword } = require("./app/authentication/crypto");

//default values
//create when first construct table and ensure items did not exist before create
module.exports ={ create: async function(){

//default roles
Role.findOrCreate({
  where : {id : 1},
  defaults: {
    title : "Administrator"
  }
});
//default roles
Role.findOrCreate({
  where : {id : 2},
  defaults: {
    title : "Career Service"
  }
});
//default roles
Role.findOrCreate({
  where : {id : 3},
  defaults: {
    title : "Student"
  }
});

//default Experience Type
ExperienceType.findOrCreate({
  where : {id : 1},
  defaults: {
    title : "Work Experience"
  }
});
//default Experience Type
ExperienceType.findOrCreate({
  where : {id : 2},
  defaults: {
    title : "Internship Experience"
  }
});
//default Experience Type
ExperienceType.findOrCreate({
  where : {id : 3},
  defaults: {
    title : "Activities"
  }
});
//default Experience Type
ExperienceType.findOrCreate({
  where : {id : 4},
  defaults: {
    title : "Leadership Experience"
  }
});
//default Experience Type
ExperienceType.findOrCreate({
  where : {id : 5},
  defaults: {
    title : "Projects"
  }
});

  //admin user
  let salt = await getSalt();
  let hash = await hashPassword("password", salt);
User.findOrCreate({
  where: { id: 1 },
  defaults: {
    userName: 'Admin',
    email: "Admin@email.com",
    firstName: "Admin",
    lastName : "user",
    address: "In this web",
    phoneNumber: "555-555-555",
    roleId : 1,
    darkMode: false,
    password: hash,
    salt: salt
  },
});



}//end function
}//end export

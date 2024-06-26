const db = require("./app/models");
const User = db.user;
const Genre = db.genre;
const CharacterRoles = db.characterroles;
const TimePeriod = db.timePeriod;
const Location = db.location;
const CharacterName = db.character_name;
const { encrypt, getSalt, hashPassword } = require("./app/authentication/crypto");

//default values that all user can access
//create when first construct table and ensure items did not exist before create
module.exports ={ create: async function(){
  //admin user
  let salt = await getSalt();
  let hash = await hashPassword("password", salt);
User.findOrCreate({
  where: { id: 1 },
  defaults: {
    userName: 'Admin',
    email: "Admin@email.com",
    password: hash,
    salt: salt
  },
}); 
//Genre
Genre.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: 'Adventure',
      userId: null
    },
  });
Genre.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: 'Action',
      userId: null
    },
  });
Genre.findOrCreate({
    where: { id: 3 },
    defaults: {
      name: 'Sci-fi',
      userId: null
    },
  });
Genre.findOrCreate({
    where: { id: 4 },
    defaults: {
      name: 'Comedy',
      userId: null
    },
  });
  
//Time Period
TimePeriod.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: 'Medieval',
      userId: null
    },
  });
TimePeriod.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: 'Future',
      userId: null
    },
  });
TimePeriod.findOrCreate({
    where: { id: 3 },
    defaults: {
      name: '1800s',
      userId: null
    },
  });
TimePeriod.findOrCreate({
    where: { id: 4 },
    defaults: {
      name: 'Pre-Historic',
      userId: null
    },
  });  

//Location
Location.findOrCreate({
    where: { id: 1 },
    defaults: {
      location: 'Magical Forest',
      userId: null
    },
  });
Location.findOrCreate({
    where: { id: 2 },
    defaults: {
      location: 'Europe',
      userId: null
    },
  });
Location.findOrCreate({
    where: { id: 3 },
    defaults: {
    location: 'Alternate Dimension',
      userId: null
    },
  });
Location.findOrCreate({
    where: { id: 4 },
    defaults: {
      location: 'Space Station',
      userId: null
    },
  });

//Character Roles
CharacterRoles.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: 'Knight',
      userId: null
    },
  });
CharacterRoles.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: 'Hero',
      userId: null
    },
  });
CharacterRoles.findOrCreate({
    where: { id: 3 },
    defaults: {
      name: 'Anti-Hero',
      userId: null
    },
  });
CharacterRoles.findOrCreate({
    where: { id: 4 },
    defaults: {
      name: 'Farmer',
      userId: null
    },
  });  

//Character Names
CharacterName.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: 'Sr. James Bond',
      userId: null
    },
  });
CharacterName.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: 'King Arthur',
      userId: null
    },
  });
CharacterName.findOrCreate({
    where: { id: 3 },
    defaults: {
      name: 'Indiana Jones',
      userId: null
    },
  });
CharacterName.findOrCreate({
    where: { id: 4 },
    defaults: {
      name: 'Mickey Mouse',
      userId: null
    },
  }); 
}
}

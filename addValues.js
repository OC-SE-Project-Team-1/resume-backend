const db = require("./app/models");
const User = db.user;
const { encrypt, getSalt, hashPassword } = require("./app/authentication/crypto");

//default values
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
    firstName: "Admin",
    lastName : "user",
    address: "In this web",
    phoneNumber: "555-555-555",
    darkMode: false,
    password: hash,
    salt: salt
  },
}); 
}
}

const { saltSize, keySize } = require("../authentication/crypto");

module.exports = (sequelize, Sequelize) => {
  const account = sequelize.define("user", {
    userName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    darkMode: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    password: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
    salt: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
  });

  return account;
};

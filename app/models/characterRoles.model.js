module.exports = (sequelize, Sequelize) => {
  const CharacterRoles = sequelize.define("characterroles", {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  });
  return CharacterRoles;
};
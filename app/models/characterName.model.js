module.exports = (sequelize, Sequelize) => {
    const character_name = sequelize.define("characterName", {
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
    return character_name;
  };
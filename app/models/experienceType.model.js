module.exports = (sequelize, Sequelize) => {
    const experienceType = sequelize.define("experienceType", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
    return experienceType;
  };
module.exports = (sequelize, Sequelize) => {
    const skill = sequelize.define("skill", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      chatHistory: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
    return skill;
  };
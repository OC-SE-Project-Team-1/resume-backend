module.exports = (sequelize, Sequelize) => {
    const goal = sequelize.define("goal", {
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
      }
    });
    return goal;
  };
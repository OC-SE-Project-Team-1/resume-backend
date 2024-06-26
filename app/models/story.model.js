module.exports = (sequelize, Sequelize) => {
    const story = sequelize.define("story", {
      title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      story: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
    return story;
  };
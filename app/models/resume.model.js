module.exports = (sequelize, Sequelize) => {
    const resume = sequelize.define("resume", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rating: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      editing: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
    return resume;
  };
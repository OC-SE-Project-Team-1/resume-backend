module.exports = (sequelize, Sequelize) => {
    const resume = sequelize.define("resume", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rating: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      editing: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      template: {
        type: Sequelize.INTEGER(1),
        allowNull: false
      }
    });
    return resume;
  };
module.exports = (sequelize, Sequelize) => {
    const link = sequelize.define("link", {
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
    return link;
  };
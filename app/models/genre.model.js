module.exports = (sequelize, Sequelize) => {
    const Genre = sequelize.define("genre", {
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
    return Genre;
  };
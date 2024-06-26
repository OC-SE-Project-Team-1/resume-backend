module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {
      location: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },
    });
    return Location;
  };
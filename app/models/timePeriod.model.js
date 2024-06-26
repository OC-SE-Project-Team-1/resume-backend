module.exports = (sequelize, Sequelize) => {
    const TimePeriod = sequelize.define("time period", {
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
    return TimePeriod;
  };
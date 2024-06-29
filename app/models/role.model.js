module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define("role", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
    return role;
  };
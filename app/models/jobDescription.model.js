module.exports = (sequelize, Sequelize) => {
    const jobDescription = sequelize.define("jobDescription", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      }
    });
    return jobDescription;
  };
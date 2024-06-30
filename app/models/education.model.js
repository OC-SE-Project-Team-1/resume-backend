module.exports = (sequelize, Sequelize) => {
    const education = sequelize.define("education", {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gradDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gpa: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      organization: {
        type: Sequelize.TEXT,
        allowNull: false,
      }
    });
    return education;
  };
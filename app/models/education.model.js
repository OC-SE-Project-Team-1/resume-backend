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
        allowNull: true,
      },
      gradDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gpa: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: false,
      },
      organization: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      city: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      courses: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      minor: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      totalGPA: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: false,
      }
    });
    return education;
  };
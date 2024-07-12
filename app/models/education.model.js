module.exports = (sequelize, Sequelize) => {
    const education = sequelize.define("education", {
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
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
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
        allowNull: true,
      },
      totalGPA: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: false,
      }
    });
    return education;
  };
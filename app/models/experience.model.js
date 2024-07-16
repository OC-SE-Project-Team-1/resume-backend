module.exports = (sequelize, Sequelize) => {
    const experience = sequelize.define("experience", {
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
      current: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      organization: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      chatHistory: {
        type: Sequelize.JSON,
        allowNull: true,
      }
    });
    return experience;
  };
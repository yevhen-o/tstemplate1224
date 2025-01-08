module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "updatedAt", Sequelize.DATE);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "updatedAt");
  },
};

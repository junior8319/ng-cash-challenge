'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    await queryInterface.bulkInsert(
      'accounts',
      [
        { balance: 100.00 },
        { balance: 100.00 },
        { balance: 100.00 },
        { balance: 100.00 },
        { balance: 100.00 },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('accounts', null, {});
  }
};

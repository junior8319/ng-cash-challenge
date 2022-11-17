'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
     await queryInterface.bulkInsert('transactions', [
      {
        value: 0.00,
        createdAt: new Date(),
      },
      {
        value: 0.00,
        createdAt: new Date(),
      },
      {
        value: 0.00,
        createdAt: new Date(),
      },
      {
        value: 0.00,
        createdAt: new Date(),
      },
      {
        value: 0.00,
        createdAt: new Date(),
      },
    ], {});
    
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};

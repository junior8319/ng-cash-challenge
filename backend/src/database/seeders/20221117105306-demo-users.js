const md5 = require('md5');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'John Doe',
        password: md5('1Q2345678'),
        accountid: 1,
      },
      {
        username: 'Jane Doe',
        password: md5('1Q2345678'),
        accountid: 2,
      },
      {
        username: 'Mark Doe',
        password: md5('1Q2345678'),
        accountid: 3,
      },
      {
        username: 'Silvia Doe',
        password: md5('1Q2345678'),
        accountid: 4,
      },
      {
        username: 'Gal Wonder',
        password: md5('1Q2345678'),
        accountid: 5,
      },
    ], {});
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

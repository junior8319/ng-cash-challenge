'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'transactions',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        debitedAccountId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'accounts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        creditedAccountId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'accounts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        value: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
    );
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};

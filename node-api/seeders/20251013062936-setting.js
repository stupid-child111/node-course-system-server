'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Settings',
      [
        {
          name: 'node-course-system',
          icp: '粤ICP备2025000000号-1',
          copyright: '© 2025 node-course-system. All Rights Reserved.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {});
  },
};

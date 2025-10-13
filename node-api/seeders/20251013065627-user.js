"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "root@qq.com",
          username: "root",
          password: "111111",
          nickname: "超厉害的管理员",
          sex: 2,
          role: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo1@qq.com",
          username: "demo1",
          password: "111111",
          nickname: "普通用户1",
          sex: 0,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo2@qq.com",
          username: "demo2",
          password: "111111",
          nickname: "普通用户2",
          sex: 0,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo3@qq.com",
          username: "demo3",
          password: "111111",
          nickname: "普通用户3",
          sex: 1,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};

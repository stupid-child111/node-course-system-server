"use strict";
const bcrypt = require("bcryptjs");
const moment = require("moment/moment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "root@qq.com",
          username: "root",
          password: bcrypt.hashSync("111111", 10),
          nickname: "超厉害的管理员",
          sex: 2,
          role: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo1@qq.com",
          username: "demo1",
          password: bcrypt.hashSync("111111", 10),
          nickname: "普通用户1",
          sex: 0,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo2@qq.com",
          username: "demo2",
          password: bcrypt.hashSync("111111", 10),
          nickname: "普通用户2",
          sex: 0,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "demo3@qq.com",
          username: "demo3",
          password: bcrypt.hashSync("111111", 10),
          nickname: "普通用户3",
          sex: 1,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "member@clwy.cn",
          username: "member",
          password: bcrypt.hashSync("123123", 10),
          nickname: "大会员用户",
          sex: 1,
          role: 1,
          membershipExpiredAt: moment().add(1, "year").toDate(),
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

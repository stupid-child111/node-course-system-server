"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Courses",
      [
        // 前端开发
        {
          categoryId: 1,
          userId: 1,
          name: "CSS 入门",
          recommended: true,
          introductory: true,
          chaptersCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 1,
          userId: 1,
          name: "JavaScript 高级特性",
          recommended: true,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 1,
          userId: 1,
          name: "React 实战项目",
          recommended: false,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 后端开发
        {
          categoryId: 2,
          userId: 1,
          name: "Node.js 项目实践（2024 版）",
          recommended: true,
          introductory: false,
          chaptersCount: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 2,
          userId: 1,
          name: "Express 框架入门",
          recommended: true,
          introductory: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 移动端开发
        {
          categoryId: 3,
          userId: 1,
          name: "Flutter 跨平台开发",
          recommended: true,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 3,
          userId: 1,
          name: "React Native 入门",
          recommended: false,
          introductory: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 数据库
        {
          categoryId: 4,
          userId: 1,
          name: "MySQL 基础到进阶",
          recommended: true,
          introductory: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 4,
          userId: 1,
          name: "Redis 缓存实战",
          recommended: false,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 服务器运维
        {
          categoryId: 5,
          userId: 1,
          name: "Linux 系统管理",
          recommended: true,
          introductory: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 5,
          userId: 1,
          name: "Docker 容器化部署",
          recommended: true,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 公共
        {
          categoryId: 6,
          userId: 1,
          name: "Git 版本控制",
          recommended: true,
          introductory: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: 6,
          userId: 1,
          name: "RESTful API 设计规范",
          recommended: false,
          introductory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};

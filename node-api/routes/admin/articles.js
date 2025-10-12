const express = require("express");
const router = express.Router();
const { Article } = require("../../models");

/***
 * 查询文章列表
 * GET /admin/articles
 */

router.get("/", async function (req, res) {
  try {
    // 定义查询条件
    const condition = {
      order: [["id", "DESC"]],
    };
    //读取数据库操作
    const articles = await Article.findAll(condition);
    res.json({
      status: true,
      message: "后端文章的接口",
      data: { articles },
    });
  } catch (error) {
    // 返回错误信息
    res.status(500).json({
      status: false,
      message: "查询文章列表失败。",
      errors: [error.message],
    });
  }
});

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res) {
  try {
    // 获取文章 ID
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (article) {
      res.json({
        status: true,
        message: "查询文章详情成功",
        data: article,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "文章未找到。",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "查询文章详情失败。",
      errors: [error.message],
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");

/***
 * 查询文章列表
 * GET /admin/articles
 */

router.get("/", async function (req, res) {
  try {
    // 获取查询参数
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    // 定义查询条件
    const condition = {
      order: [["id", "DESC"]],

      //添加limit和offset
      limit: pageSize,
      offset: offset,
    };

    // 如果有 title 查询参数，就添加到 where 条件中
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }

    // 查询数据
    // 将 findAll 方法改为 findAndCountAll 方法
    // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
    // count 是查询到的数据的总数，rows 中才是查询到的数据
    const { count, rows } = await Article.findAndCountAll(condition);

    // 返回查询结果
    res.json({
      status: true,
      message: "查询文章列表成功。",
      data: {
        articles: rows,
        pagination: {
          total: count,
          currentPage,
          pageSize,
        },
      },
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

/**
 * 创建文章
 * POST /admin/articles
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建文章
    const article = await Article.create(body);

    res.status(201).json({
      status: true,
      message: "创建文章成功。",
      data: article,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((e) => e.message);

      res.status(400).json({
        status: false,
        message: "请求参数错误",
        errors,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "创建文章失败。",
        errors: [error.message],
      });
    }
  }
});

router.delete("/:id", async function (req, res) {
  try {
    // 获取文章 ID
    const { id } = req.params;

    // 查询文章
    const article = await Article.findByPk(id);

    if (article) {
      // 删除文章
      await article.destroy();

      res.json({
        status: true,
        message: "删除文章成功。",
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
      message: "删除文章失败。",
      errors: [error.message],
    });
  }
});

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const body = filterBody(req);
    const article = await Article.findByPk(id);
    if (article) {
      await article.update(body);
      res.json({
        status: true,
        message: "更新文章成功。",
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
      message: "更新文章失败。",
      errors: [error.message],
    });
  }
});

/**
 * 公共方法：白名单过滤  只获取需要的参数
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}

module.exports = router;

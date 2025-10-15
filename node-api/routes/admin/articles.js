const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

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
      where: {},
      order: [["id", "DESC"]],

      //添加limit和offset
      limit: pageSize,
      offset: offset,
    };

    // 如果有 title 查询参数，就添加到 where 条件中
    if (query.title) {
      condition.where.title = {
        [Op.like]: `%${query.title}%`,
      };
    }

    // 查询数据
    // 将 findAll 方法改为 findAndCountAll 方法
    // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
    // count 是查询到的数据的总数，rows 中才是查询到的数据
    const { count, rows } = await Article.findAndCountAll(condition);

    // 返回查询结果
    success(res, "查询文章列表成功。", {
      articles: rows,
      pagination: { total: count, currentPage, pageSize },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);
    success(res, "查询文章详情成功", { article });
  } catch (error) {
    failure(res, error);
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

    success(res, "创建文章成功。", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);

    await article.destroy();
    success(res, "删除文章成功。");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);
    const body = filterBody(req);
    await article.update(body);
    success(res, "更新文章成功。", { article });
  } catch (error) {
    failure(res, error);
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

/**
 * 公共方法：查询当前文章
 */
async function getArticle(req) {
  // 获取文章 ID
  const { id } = req.params;

  // 查询当前文章
  const article = await Article.findByPk(id);

  // 如果没有找到，就抛出异常
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到。`);
  }

  return article;
}

module.exports = router;

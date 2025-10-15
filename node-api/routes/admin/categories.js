const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op, where } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

/***
 * 查询分类列表
 * GET /admin/categories
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
      where:{},
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],

      //添加limit和offset
      limit: pageSize,
      offset: offset,
    };

    // 如果有 name 查询参数，就添加到 where 条件中
    if (query.name) {
      condition.where.name = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      };
    }

    // 查询数据
    // 将 findAll 方法改为 findAndCountAll 方法
    // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
    // count 是查询到的数据的总数，rows 中才是查询到的数据
    const { count, rows } = await Category.findAndCountAll(condition);

    // 返回查询结果
    success(res, "查询分类列表成功。", {
      categories: rows,
      pagination: { total: count, currentPage, pageSize },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    success(res, "查询分类详情成功", { category });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建分类
 * POST /admin/categories
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建分类
    const category = await Category.create(body);

    success(res, "创建分类成功。", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);

    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new Error("当前分类有课程，无法删除。");
    }

    await category.destroy();
    success(res, "删除分类成功。");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    const body = filterBody(req);
    await category.update(body);
    success(res, "更新分类成功。", { category });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤  只获取需要的参数
 * @param req
 * @returns {{name, rank:*}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  // 获取分类 ID
  const { id } = req.params;

  // 查询当前分类
  const category = await Category.findByPk(id);

  // 如果没有找到，就抛出异常
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到。`);
  }

  return category;
}

module.exports = router;

const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, failure } = require("../../utils/responses");

/***
 * 查询用户列表
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

    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email,
        },
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username,
        },
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`,
        },
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role,
        },
      };
    }

    // 查询数据
    // 将 findAll 方法改为 findAndCountAll 方法
    // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
    // count 是查询到的数据的总数，rows 中才是查询到的数据
    const { count, rows } = await User.findAndCountAll(condition);

    // 返回查询结果
    res.json({
      status: true,
      message: "查询用户列表成功。",
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
    failure(res, error);
  }
});

/**
 * 查询用户详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const user = await getArticle(req);
    res.json({
      status: true,
      message: "查询用户详情成功",
      data: user,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/articles
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建用户
    const user = await User.create(body);

    res.status(201).json({
      status: true,
      message: "创建用户成功。",
      data: user,
    });
  } catch (error) {
    failure(res, error);
  }
});


/**
 * 更新用户
 * PUT /admin/articles/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const user = await getArticle(req);
    const body = filterBody(req);
    await user.update(body);
    res.json({
      status: true,
      message: "更新用户成功。",
      data: user,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, role: (number|string|*), introduce: ({type: *}|*), sex: ({allowNull: boolean, type: *, validate: {notNull: {msg: string}, notEmpty: {msg: string}, isIn: {args: [number[]], msg: string}}}|{defaultValue: number, allowNull: boolean, type: *}|*), nickname: (string|*), company: ({type: *}|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*), email: (string|*), username}}
 */
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}

/**
 * 公共方法：查询当前用户
 */
async function getArticle(req) {
  // 获取用户 ID
  const { id } = req.params;

  // 查询当前用户
  const user = await User.findByPk(id);

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`);
  }

  return user;
}

module.exports = router;

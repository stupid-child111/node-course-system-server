const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { NotFound, failure, success } = require('../../utils/responses');
const { delKey } = require('../../utils/redis');

/***
 * 查询用户列表
 * GET /admin/users
 */

router.get('/', async function (req, res) {
  try {
    // 获取查询参数
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      where: {},
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
    };

    if (query.email) {
      condition.where.email = query.email;
    }

    if (query.username) {
      condition.where.username = query.username;
    }

    if (query.nickname) {
      condition.where.nickname = {
        [Op.like]: `%${query.nickname}%`,
      };
    }

    if (query.role) {
      condition.where.role = query.role;
    }

    // 查询数据
    // 将 findAll 方法改为 findAndCountAll 方法
    // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
    // count 是查询到的数据的总数，rows 中才是查询到的数据
    const { count, rows } = await User.findAndCountAll(condition);

    // 返回查询结果
    success(res, '查询用户列表成功。', {
      users: rows,
      pagination: { total: count, currentPage, pageSize },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询当前登录的用户详情
 * GET /admin/users/me
 */
router.get('/me', async function (req, res) {
  try {
    const user = req.user;
    success(res, '查询当前用户信息成功。', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 通过 id 查询用户详情
 * GET /admin/users/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const user = await getArticle(req);
    success(res, '查询用户详情成功', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async function (req, res) {
  try {
    const body = filterBody(req);
    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建用户
    const user = await User.create(body);

    success(res, '创建用户成功。', { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const user = await getArticle(req);
    const body = filterBody(req);
    await user.update(body);
    await clearCache(user);

    success(res, '更新用户成功。', { user });
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
    throw new NotFound(`ID: ${id}的用户未找到。`);
  }

  return user;
}

/**
 * 清除缓存
 * @param user
 * @returns {Promise<void>}
 */
async function clearCache(user) {
  await delKey(`user:${user.id}`);
}

module.exports = router;

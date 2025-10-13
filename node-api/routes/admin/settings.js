const express = require("express");
const router = express.Router();
const { Setting } = require("../../models");
const { NotFoundError, failure ,success} = require("../../utils/response");

/***
 * 查询系统设置列表
 * GET /admin/articles
 */

router.get('/', async function (req, res) {
  try {
    const setting = await getSetting();
    success(res, '查询系统设置成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新系统设置
 * PUT /admin/articles/
 */
router.put("/", async function (req, res) {
  try {
    const setting = await getSetting(req);
    const body = filterBody(req);
    await setting.update(body);
    res.json({
      status: true,
      message: "更新系统设置成功。",
      data: setting,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{copyright: (string|*), icp: (string|string|DocumentFragment|*), name}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  };
}

/**
 * 公共方法：查询当前系统设置
 */
async function getSetting() {
  const setting = await Setting.findOne();
  // const setting = await Setting.findByPk(1);
  if (!setting) {
    throw new NotFoundError('初始系统设置未找到，请运行种子文件。')
  }

  return setting;
}

module.exports = router;

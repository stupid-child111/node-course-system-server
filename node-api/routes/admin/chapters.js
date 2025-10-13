const express = require("express");
const router = express.Router();
const { Chapter, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

/***
 * 查询章节列表
 * GET /admin/chapters
 */

router.get("/", async function (req, res) {
  try {
    // 获取查询参数
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    if (!query.courseId) {
      throw new Error("获取章节列表失败，课程ID不能为空。");
    }

    const condition = {
      ...getCondition(),
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],
      limit: pageSize,
      offset: offset,
    };

    condition.where = {
      courseId: {
        [Op.eq]: query.courseId,
      },
    };

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
    const { count, rows } = await Chapter.findAndCountAll(condition);

    // 返回查询结果
    res.json({
      status: true,
      message: "查询章节列表成功。",
      data: {
        chapters: rows,
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
 * 查询章节详情
 * GET /admin/chapters/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);
    res.json({
      status: true,
      message: "查询章节详情成功",
      data: chapter,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建章节
 * POST /admin/chapters
 */
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建章节
    const chapter = await Chapter.create(body);

    res.status(201).json({
      status: true,
      message: "创建章节成功。",
      data: chapter,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除章节
 * DELETE /admin/chapters/:id
 */
router.delete("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);

    await chapter.destroy();
    res.json({
      status: true,
      message: "删除章节成功。",
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新章节
 * PUT /admin/chapters/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);
    const body = filterBody(req);
    await chapter.update(body);
    res.json({
      status: true,
      message: "更新章节成功。",
      data: chapter,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  };
}

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ["CourseId"] },
    include: [
      {
        model: Course,
        as: "course",
        attributes: ["id", "name"],
      },
    ],
  };
}

/**
 * 公共方法：查询当前章节
 */
async function getChapter(req) {
  const { id } = req.params;
  const condition = getCondition();

  const chapter = await Chapter.findByPk(id, condition);
  if (!chapter) {
    throw new NotFoundError(`ID: ${id}的章节未找到。`);
  }

  return chapter;
}

module.exports = router;

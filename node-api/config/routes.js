const express = require('express');
const router = express.Router();

// 路由配置
const adminAuth = require('../middlewares/admin-auth');
const userAuth = require('../middlewares/user-auth');

// 后台路由
const adminArticlesRouter = require('../routes/admin/articles');
const adminCategoriesRouter = require('../routes/admin/categories');
const adminSettingsRouter = require('../routes/admin/settings');
const adminUsersRouter = require('../routes/admin/users');
const adminCoursesRouter = require('../routes/admin/courses');
const adminChaptersRouter = require('../routes/admin/chapters');
const adminChartsRouter = require('../routes/admin/charts');
const adminAuthRouter = require('../routes/admin/auth');
const adminLogsRouter = require('../routes/admin/logs');
const adminMembershipsRouter = require('../routes/admin/memberships');
const adminAttachmentsRouter = require('../routes/admin/attachments');

// 前台路由
const indexRouter = require('../routes/index');
const categoriesRouter = require('../routes/categories');
const coursesRouter = require('../routes/courses');
const chaptersRouter = require('../routes/chapters');
const articlesRouter = require('../routes/articles');
const settingsRouter = require('../routes/settings');
const searchRouter = require('../routes/search');
const authRouter = require('../routes/auth');
const likesRouter = require('../routes/likes');
const usersRouter = require('../routes/users');
const uploadsRouter = require('../routes/uploads');
const captchaRouter = require('../routes/captcha');
const membershipsRouter = require('../routes/memberships');

// 前台路由配置
router.use('/', indexRouter);
router.use('/users', userAuth, usersRouter);
router.use('/categories', categoriesRouter);
router.use('/courses', coursesRouter);
router.use('/chapters', userAuth, chaptersRouter);
router.use('/articles', articlesRouter);
router.use('/settings', settingsRouter);
router.use('/search', searchRouter);
router.use('/auth', authRouter);
router.use('/likes', userAuth, likesRouter);
router.use('/uploads', userAuth, uploadsRouter);
router.use('/captcha', captchaRouter);
router.use('/memberships', membershipsRouter);

// 后台路由配置
router.use('/admin/articles', adminAuth, adminArticlesRouter);
router.use('/admin/categories', adminAuth, adminCategoriesRouter);
router.use('/admin/settings', adminAuth, adminSettingsRouter);
router.use('/admin/users', adminAuth, adminUsersRouter);
router.use('/admin/courses', adminAuth, adminCoursesRouter);
router.use('/admin/chapters', adminAuth, adminChaptersRouter);
router.use('/admin/charts', adminAuth, adminChartsRouter);
router.use('/admin/logs', adminAuth, adminLogsRouter);
router.use('/admin/memberships', adminAuth, adminMembershipsRouter);
router.use('/admin/auth', adminAuthRouter);
router.use('/admin/attachments', adminAuth, adminAttachmentsRouter);

module.exports = router;

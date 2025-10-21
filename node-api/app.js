const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
// 启动邮件消费者
const { mailConsumer } = require('./utils/rabbit-mq');
(async () => {
  await mailConsumer();
})();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
const routers = require('./config/routes');
app.use(routers);

module.exports = app;

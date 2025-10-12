# 基于Node开发的课程系统后端接口



## nvm 使用
  - nvm list available   (最新的Node.js LTS的版本号，**LTS也就是长期支持版本**)
  - nvm install [version]  (下载)
  - nvm use [version] (使用 && 切换版本)
  - npm config set registry [URL]  (更换镜像)

## express
  - express --no-view [projectName] (--no-view参数，不需要任何视图模板，此项目专门做后端接口)
  

## sequelize ORM 学习
- ![alt text](image.png)
- ![alt text](image-1.png)
- sequelize init
  - ![alt text](image-2.png)
  
- 具体步骤

|步骤	|命令|	说明|
| --- | --- | --- |
|第一步	|sequelize model:generate --name Article --attributes ...|	建模型和迁移文件|
|第二步|	人工处理	|根据需求调整迁移文件
|第三步|	sequelize db:migrate|	运行迁移，生成数据|表
|第四步|	sequelize seed:generate --name article	|新建种子文件
|第五步|	人工处理	|将种子文件修改为自己想填充的数据
|第六步|	sequelize db:seed --seed xxx-article	|运行种子文件，将数据填充到数据表中


# 注意点
- 接口获取数据需要主要是否是异步操作(async await)
- 查询文章详情接口
  - 配置 **:id** 这种路由，用来接收接口中的参数,通过 **req.params**
  - 查询单条数据，可以使用**findByPk**
- 创建文章
  - 使用create()
- 删除文章
  - 先获取id才能删除
  - 使用destory()
- 更新文章
  - 先通过id查看是否有
  - 再通过update()更新(异步)
- 模糊搜索
  - 引入const { Op } = require('sequelize');
  - 相当于SQL语句select * from Articles where title like '%标题 10%' <------>`[Op.like]: `%${query.title}%`
- 数据分页
  - 实现分页，用户需要传递**currentPage和pageSize**(当前页  数据条数)两个参数
  - 然后通过这两个参数，计算出offset(起始数)
  - 再使用**findAndCountAll**方法进行查询
  - 返回了count和rows(数据总数 数据)，rows里才是真正查询到的结果
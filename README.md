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
- 白名单过滤
  - 封装公共函数,从req中取出title和content作为需要的参数传入
- 验证表单数据
  - 文档地址:  https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
  - 在model中对字段进行约束
  - 错误信息通过error.errors数组取出错误message
  - 返回客户端就行
- 何为 **DRY** 原则(Don't Repeat Yourself)
  - 对于常用的，重复性高的代码，可以做一个封装。
- 项目开发流程(个人经历)
  - 编写需求文档
  - 原型和UI设计
  - 确定数据库的表 字段以及接口地址和数据
  - 同时进行：前端mock开发、后端开发接口
  - 接口开发完成后，将mock地址，换为接口地址
  - 测试、上线部署
- 建立数据库表
  - 回滚迁移
    - 数据不重要
      - 直接删除数据库中的表 --> 修改迁移文件并重新运行
    - 数据重要
      - 增加另一个迁移文件,调整各个表的字段
  - 完成:建立模型和表
  ## 个人总结学习
- **模型文件**是 Sequelize 中用于定义数据库表结构和数据操作的核心部分
  - 定义表结构：在模型文件中，通过 Sequelize 的 API 来定义数据库表的字段、数据类型、约束条件等。
  - 实现数据操作：模型文件中可以定义各种方法来进行数据库的增删改查操作（CRUD）。(finaAll findByPk  create destory)
  - 定义关联关系：在实际应用中，数据库表之间通常存在关联关系，如一对一、一对多、多对多等。在模型文件中，可以使用 Sequelize 提供的方法来定义这些关联关系，以便在查询数据时能够方便地获取相关联的数据。
- **迁移文件**
  - **sequelize db:migrate**是 Sequelize 用于执行数据库迁移（Database Migration）操作的命令
  - **sequelize db:migrate:undo** 命令用于撤销最近一次执行的数据库迁移操作
-**种子文件**
  - 编写种子文件（通常位于项目的 seeders 目录下）来定义这些初始数据，并使用 **sequelize db:seed** 命令插入到数据库中
  - **sequelize db:seed:undo** 命令可以撤销上一次种子命令插入的数据

### git restore --staged (恢复文件状态,移出暂存区)
- **--staged** 参数表示 “从暂存区移除，但保留本地文件的修改”（不会删除你的文件内容）
### git commit --amend  (适合未push操作)
- 打开vim编辑器   -->  按 **i** 进入编辑模式 → 修改内容 → 按 **Esc** → 输入 **:wq** 保存退出
### git reset HEAD~1 (适合已push操作)

## 参数传递
### params
- **Path 参数：是URL 路径的一部分**，用于动态标识资源。
- **Query 参数：是跟在 URL 问号（?）后面的键值对**，用于对请求进行过滤、分页等额外说明。
### 其他
- Body 参数（请求体）,放在 HTTP 请求的 Body 中，不在 URL 里
  - 用途：传递大量数据或复杂结构（JSON、表单等）
    - application/json
       ```json
       {
        "username": "test",
        "password": "123456"
       }
       ```    
    - application/x-www-form-urlencoded
       ```plaintext
       username=test&password=123456
       ``` 
    - multipart/form-data（上传文件时用）
- Header 参数（请求头）放在 HTTP 请求头（Header）中
  - 用途：传递元数据（metadata），比如认证信息、内容类型等
    ```
    Authorization: Bearer <token>
    Content-Type: application/json
    ```
- Cookie 参数  放在 HTTP 请求头的 Cookie 字段中
    ```plaintext
     Cookie: sessionId=abc123; theme=dark
    ``` 
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
### git reset HEAD~1
- **保留代码，只撤销提交记录**   git reset --soft (相当于git add 未 git commit)
- **保留代码，但取消暂存**  git reset --mixed  (相当于未git add)
- **完全丢弃提交和代码** git reset --hard

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

## 系统设置接口
- 只需要查询和更新接口
- 通过findOne()查询设置表的第一条记录即可(或者 fingByPk(1))
- 白名单过滤获得各个接口需要的字段(用户接口  分类接口   设置接口 都有自己独有的字段)

## 其他问题
- model使用unique验证
  - 使用unique验证，必须要给字段加唯一索引。
  - 出错后，异常的名字是**SequelizeUniqueConstraintError**，而不是SequelizeValidationError。也就说要去resonses.js里增加另一个判断。
  - 不能通过msg自定义提示信息

## 用户接口
- 邮箱、用户名和用户组，都是用的**eq**，也就是等于的意思，这是做的精确查找，而昵称用了模糊搜索**like**。
- [Op.eq]: query.email   [Op.like]: `%${ query.nickname }%`
### 使用 bcryptjs  加密password
**注意点**
- 加密这个步骤，可以在**路由文件里的创建和更新用户**两个地方写这些代码,但是数据验证的时候，特别是长度验证这里。验证的就不是用户实际输入的密码长度，而是加密后的密码长度，这样就验证错了。
- 在模型中添加set方法,在验证之后再对密码进行加密(this.setDataValue('password', bcrypt.hashSync(value, 10));)


## 课程接口
- 每个课程都是是属于一个分类的，每个课程也是属于某一个用户的。所以这里的**categoryId和userId**在**分类表和用户表中，必须有对应的ID值**。
- 添加了一个自定义验证**isPresent**，通过用户过传递过来的categoryId和userId去分类表和用户表里查了一下，确保提交的数据有对应的分类和用户。
- 在验证里，要用到其他模型，前面要加上sequelize.models    (sequelize.models.Category.findByPk(value))

## **课程接口（关联模型）**
- 这些**表与表之间的关系**，在**Sequelize**里就叫**关联模型**（Associations）。
  - 如果没有关联模型,需要自己写SQL
  - 使用关联模型  只需要在模型里定义一次关系：
    ```javascript
    static associate(models) {
      models.Course.belongsTo(models.Category);
      models.Course.belongsTo(models.User);
    }
    ```
  - 查询的时候直接：
    ```javascript
    Course.findByPk(1, {
      include: [Category, User]
    });
    ```
  - 会自动生成嵌套对象
    ```json
    {
    "id": 1,
    "title": "Node.js入门",
    "CategoryId": 2,
    "UserId": 5,
    "category": { "id": 2, "name": "后端开发" },
    "user": { "id": 5, "username": "admin" }
    }
    ``` 
  - 加了 hasMany 之后，我们就可以反向查询：
      从分类查它下面的所有课程
      从用户查他创建的所有课程

## 孤儿记录问题处理
- 数据库里添加外键约束 (产生额外开销  性能瓶颈)
- 代码层面处理,删除分类时,将分类关联的所有课程删除(不合理)
- 删除分类时,查询有没有关联的课程,存在,就提示不能删除

## 关联关系总计
- 查询关联表的数据，可以**在模型中定义关联关系**。然后查询代码中，使用**include**就可以查询到对应的关联数据了。
  可以用**attributes**，来查询指定的字段，而不用查询出所有字段。
  可以在attributes里，添加**exclude**，来排除部分不想查询的字段。
  关联里，可以用**as**来定义别名。但是记住，如果模型里定义了as，**在查询时，也一定要加上as**

## 管理员登录验证接口
- 密码在数据库里，都是加密形式存在的，所以不能直接对比是否相等。 使用**compareSync**方法
- 登陆验证(邮箱 || 用户名登录) --->验证密码  ---> 验证是否是管理员 **ENDDING**
  
## jwt生成token
```json
jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });
```
- 中间的data：是要生成token的数据。
secret：自定义秘钥。
expiresIn：有效期
- 使用node自带**crypto**生成随机字符串

## 中间件
- 就是在运行某一个方法之前，我们**必须**要先去运行的方法。
- **token验证方法**: jwt.verify(token, process.env.SECRET);
- **一定要加上next(),才能进入后续路由**
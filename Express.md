**Express**：与 Node.js 内置的 http 模块类似，专门用来创建 Web 服务器。

- Web 网站服务器：提供 Web 网页资源的服务器
- API 接口服务器：提供 API 接口的服务器

```
npm i express
```



创建基本的 Web 服务器

```js
// 导入 express
const express = require('express')
// 创建 web 服务器
const app = express()

// 调用 app.listen(post, callback) 启动服务器
app.listen(80,() => {
	console.log('express server running at http://127.0.0.1')	
}) 

```

监听 GET 请求

```js
app.get(url, function(req, res){
	// req 请求对象
  // res 响应对象
  res.send({
    
  })// 向客户端响应 JSON / 普通文本
})
```

监听 POST 请求

```js
app.post(url, function(req, res){})
```



#### 获取 URL 中携带的查询参数

会将查询字符串转换为对象的键值对形式。

```js
req.query 
```



#### 获取 URL 中的动态参数

可以访问到 url 中，通过 : 匹配到的动态参数。

可以有多个动态参数。

```js
// req.params

app.get('/user/:id', (req, res) => {
	res.send(req.params) // 自动转换为 键值对形式的对象
  // {id:"2"}
})
```

### 1.3 托管静态资源

#### express.static()

创建一个静态资源服务器。

可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问：

```js
app.use(express.static('public'))
```

Express 在指定的静态目录中查找文件，并对外提供资源的访问路径。

**存放静态文件的目录名不会出现在 URL 中。**



#### 托管多个静态资源目录

多次调用 express.static() 函数

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

访问静态资源文件时，express.static 会根据目录的添加顺序查找所需的文件。



#### 挂载路径前缀

```js
app.use('/abc', express.static('./files'))
```

此时需要访问 abc/index.html 才能访问到 files/index.html。

```js
app.use('/public', express.static('./public'))
```

通过 /public 前缀地址来访问 public 目录中的文件。
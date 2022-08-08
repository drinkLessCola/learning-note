## 1. Node.js 的应用场景

### 前端工程化

- **Bundle 打包工具**：webpack，vite，esbuild，parcel 
- **Uglify 代码压缩（转换）减少代码体积**：uglifyjs
- **Transpile 语法转换**：babeljs，typescript
- **其他语言加入竞争**： esbuild（go），parcel（rust），prisma

现状：Node.js 在前端工程化方面难以替代

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220806030741975.png" alt="image-20220806030741975" style="zoom:80%;" />

### Web 服务端应用（Node.js / Vercel）

- 在 JavaScript 基础之上只需要再去了解运行环境 和 Node.js 的 API 即可。
- Node.js 作为一门不需要编译环境的语言，运行效率接近常见的编译语言。
- 社区生态丰富（npm） 及 工具链成熟（V8 inspector）
- 与前端结合的场景会有优势（服务端渲染 SSR）

现状：竞争激烈，Node.js 有自己的优势

### Electron 跨端桌面应用

- 结合了 Node 和 JS 去实现的跨端桌面应用。
- 大型公司内的效率工具也会选择 Electron 开发。
- 运行消耗资源较多，运行较慢
- 优势为开发效率高，跨端，稳定性

现状：大部分场景在选型时，都值得考虑

## 2. Node.js 运行时结构

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220806030818260.png" alt="image-20220806030818260" style="zoom:80%;" />

用户引入的包也算作是用户代码。

Node.js 内部很多代码是使用 JavaScript 写的（如 http 模块）。但更多的功能是使用 C++ 编写的。

- 比如提供 http 模块和对应的 API，需要去调用底层 C++ 的代码。



- **N-API**：通过 JavaScript 代码无法满足的需求（如性能）
  - 需要更 native 的语言去和 Node.js 通信，那么就需要 N-API 一系列的模块来提供这种能力。
- **V8**： JavaScript 运行时，包括诊断调试工具（inspector）
  - Node.js 在解释性语言中效率较高归因于 V8 引擎
  - V8 提供的 inspector 使得 Node.js 可以使用 chrome devtool 类似的工具进行调试
- **libuv**：封装了各种操作系统的 API，并提供了 Node.js 核心的 EventLoop
  - 提供跨平台的 UI 操作
- **nghttp2**： 与 http2 相关的模块
- **zlib**： 做常见的压缩与解压缩的算法
- **c-ares**： 做 dns 查询的库
- **llhttp**： http 协议的解析
- **OpenSSL**： 网络层面上的加密解密工具



**举例：使用npm 上的 node-fetch 模块发起请求的过程**

- 在 JavaScript 代码中调用引入的 `node-fetch` 模块，会在 **V8** 中执行
- `node-fetch` 底层调用了 Node.js 的 `http` 模块，即调用了 **Node.js Core(JavaScript)**
- http 模块会去调用更加底层的 **C++** 模块的 API
- 可能需要调用 **llhttp** 去实现 <u>http 的序列化和反序列化</u>，将得到的数据通过 **libuv** <u>创建的 tcp 连接发送至服务器</u>
- 服务器发来的响应在事件循环中得到一个消息，再将响应的数据交给 **libuv** 解析出来，再将数据交给 **JavaScript 代码**，再到**用户代码**，即收到了数据。

### 特点

1. **异步 I/O**
2. **单线程**
   - Node.js 的 JavaScript 线程 是单线程，不适合做 CPU 密集的操作
   - Node.js 较新的版本已经支持使用 `worker_thread `模块，通过该线程可以创建一个新的 JavaScript 线程，但每个线程的模型没有太大变化。
     - 都有一个 V8 的实例
     - 都有独立的 `EventLoop`
3. **跨平台**
   - 可以通过在本地创建文件，进行进程间的通信

### 异步 IO

**Node.js 执行 I/O 操作时，会在响应返回后恢复操作，而不是阻塞线程的执行并占用额外内存等待。**

- 效率较高
- 对系统资源的利用率较高

**fs** 模块的 `readFile() / readFileSync()` 可以用于读取文件。

使用 `readFileSync()` 时会触发一个异步调用，将读取文件的工作交给 **libuv** 的线程池去做。

文件读取的操作从线程返回回来的时候，将数据交给主线程。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220806031753085.png" alt="image-20220806031753085" style="zoom:80%;" />

### 单线程

其实只有 JS 主线程是单线程，Node.js 实际上有很多线程。

- **JS 主线程**
- **uv 线程池：** 默认会创建 4 个线程，来完成 I/O 操作，或是对 CPU 消耗较大的底层操作（如加密 / 解密），避免对主线程产生较大的阻塞
- **V8 任务线程池：**可以通过配置调整
- **V8 Inspector 线程：**在 JavaScript 中程序进入死循环时，仍然可以进行调试的操作

**优点：不用考虑多线程状态同步问题**

- 不需要锁机制，也不需要考虑可能出现的死锁的状况。但需要去考虑异步的问题。
- 能够比较高效地利用系统资源

**缺点：阻塞会产生更多负面影响**

- 解决办法：多进程或多线程

### 跨平台

libuv 封装了**大部分**操作系统的 API，并提供了一套统一的 API。

- 仍然有一些 API 是某个平台特有的。
- 如果需要极高的性能，则需要调用大量 UNIX 的 API。

开发成本与学习成本都比较低。

- Node.js 跨平台 + JS 无需编译环境 + Web 跨平台 + 诊断工具跨平台。

## 3. 编写 Http Server

### 安装 Node.js

- Mac、Linux 推荐使用 nvm，多版本管理。

- windows 推荐 nvm4w 或官方安装包。

- 安装慢，安装失败的情况，设置安装源。

  ```
  NVM_NODEJS_ORG_MIRROR = https://npmmirror.com/mirrors/node nvm install 16
  ```

### Hello World

```js
const http = require('http')
const server = http.createServer((req, res) => {
	res.end('hello')
  // 发出响应
})

const port = 3000
server.listen(port, () => {
  // 端口成功被监听后，会触发该回调
  console.log('listening on:', port)
})
```

### Http Server

```js
const http = require('http')
const server = http.createServer((req, res) => {
  // 每当连接返回了一段数据， 即 http body 上的数据
  // 使用 bufs 收集起来
  const bufs = []
	req.on('data', (buf) => {
    bufs.push(buf)
  })
  // 当数据传输完毕时会触发 end 事件
  req.on('end', () => {
    // 将数据段整理成完整的数据
    // 将 JSON 转换成 UTF-8 字符串
    const buf = Buffer.concat(bufs).toString('utf8')
    let msg = 'hello'
    
    try {
      const ret = JSON.parse(buf)
      msg = ret.msg
    } catch (err) {
      // 不是 JSON 数据
    }
    
    const responseJson = {
        msg:`receive: ${msg}`
      }
      // 将响应数据序列化为 JSON
      // 还需要设置响应头 Content-Type
      // 浏览器可能基于这个信息去自动进行一些操作
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(responseJson))
  })
  
})

const port = 3000
server.listen(port, () => {
	console.log('listening on:', port)
})
```

### Http Client

```js
const http = require('http')
const body = JSON.stringify({
  msg:'Hello from my own client',
})

const req = http.request('http://127.0.0.1:3000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Node.js 中 Content-Length 会自动补上
  }
}, (res) => {
  // 收到了服务端的响应，会触发该回调函数
  const bufs = []
  res.on('data', (buf) => {
    bufs.push(buf)
  })
  res.on('end', () => {
    const buf = Buffer.concat(bufs).toString('utf8')
    cosnt json = JSON.parse(buf)
    
    console.log('json.msg is:', json.msg)
  })
})
// 发送请求
req.end(body)
```

### Promisify

用 `Promise` + `async await` 重写这两个例子：

- 回调函数难以维护，不符合人的思维模式

`http.createServer` 的回调函数无法 Promisify，因为该函数**会被重复调用多次**。

```js
const http = require('http')
const server = http.createServer(async (req, res) => {
	const msg = await new Promise((resolve, reject) => {
    const bufs = []
    req.on('data', (buf) => {
      bufs.push(buf)
    })
		req.on('error', (err) => {
      reject(err)
    })
    req.on('end', () => {
      const buf = Buffer.concat(bufs).toString('utf8')
      let msg = 'hello'
      try {
        const ret = JSON.parse(buf)
        msg = ret.msg
      } catch (err) {}
      
      resolve(msg)
    })
    const responseJson = {
      msg:`receive: ${msg}`
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(responseJson))
  })
})

const port = 3000
server.listen(port, () => {
	console.log('listening on:', port)
})
```

### 静态文件

编写一个简单的静态文件服务：

- 使用 stream 类型 API 的好处：
  - 内部做了处理，可以帮助占用尽可能少的内容空间。
  - 按需返回给客户端，匹配客户端的消费速率。内存的使用率更好。
- 假如直接使用 readFile 读取整个文件，则需要分配一个内存空间来存放整个文件

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

// __dirname 即当前文件所在的目录
const folderPath = path.resolve(__dirname, './static')

const server = http.createServer((req, res) => {
  const info = url.parse(req.url)
  const filepath = path.resolve(folderPath, './' + info.path)
  // 使用 stream 类型 API 的好处：内部做了处理，可以帮助占用尽可能少的内容空间。按需返回给客户端，匹配客户端的消费速率。内存的使用率更好。
  // 假如直接使用 readFile 读取整个文件，则需要分配一个内存空间来存放整个文件
  const filestream = fs.createReadStream(filepath)
	filestream.pipe(res)
})

const port = 3000

server.listen(port, () => {
  console.log('listening on:', port)
})
```

**实现高性能、可靠的服务：**

1. CDN：缓存 + 加速
   - 缓存静态资源，使返回的速率更快
   - 数据分发到不同结点，为用户提供更快的结点。
2. 分布式存储，容灾
   - 当容器故障时，仍然有已经缓存的数据能够正常提供出去。

外部服务：cloudflare，阿里云，七牛云

### React SSR

**SSR** (server side rendering) 有什么特点？

- 相比传统 HTML 模板引擎：避免重复编写代码
  - 现在的 HTML 都由 JavaScript 来编写
  - 如果能运行 JavaScript 代码，就能够知道要返回什么 HTML 代码，就不需要模板引擎
- 相比 SPA：首屏渲染更快， SEO 友好
  - SPA 应用首屏会更慢：需要等到所有 JavaScript 代码都加载好以后，才可以开始给用户返回数据
  - 不运行 JavaScript 代码就无法提供信息给客户端
- 缺点：通常 qps 较低，前端代码编写时需要考虑服务端渲染情况
  - 服务端需要运行 JavaScript 代码，其中可能有一些比较重的操作，耗时更长
  - 代码编写比较困难，需要同时兼顾客户端和服务端运行。

```js
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const http = require('http')

function App(props){
  return React.createElement('div', {}, props.children ||'Hello')
}

const server = http.createServer((req, res) => {
  res.end(`
  <!DOCTYPE html>
  <html>
  	<head>
  		<title>My Application</title>
  	</head>
    <body>
    	${ReactDomServer.renderToString(
    			React.createElement(App,{},'my_content')
  		)}
    	<script>
    		// 可能还需要一些操作来初始化 React 在浏览器上的应用
    	</script>
    </body>
   </html>
  `)
})
const port = 3000
server.listen(port, () => {
  console.log("listening on:", port)
})
```



#### SSR 难点：

1. 需要处理打包代码的问题

   - 在服务端，打包工具加载 css / 图片 没有意义。

   - 设置打包工具在服务端处理时，绕过 CSS 、图片文件的打包处理。或者直接改动代码。

     <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220806031929085.png" alt="image-20220806031929085" style="zoom:80%;" />

2. 需要思考前端代码在服务端运行时的逻辑

   - 大部分应用在做渲染的时候都需要先获取数据，根据数据再进行渲染

   - 获取数据的操作需要放在 React 生命周期的后面再去执行（如 componentDidMount 及以后再去执行）

   - 因为这些生命周期在服务端渲染的时候是不会触发的

     <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220806031903566.png" alt="image-20220806031903566" style="zoom:80%;" />

3. 移除对服务端无意义的副作用 / 重置环境

   - 比如前端应用需要将数据挂载到全局对象  `window` 上
   - 可能通过一些配置将 `Node.js` 环境中的 `GlobalThis` 替换成了 `window` 来使应用正常运行，若还需要从 window 上将这些数据拿出来渲染，则这些累积的副作用，可能会在两次无关联的渲染中建立意外的联系。
   - 重置环境：每次启动一个新的 Node.js 进程去做渲染
     - 需要考虑性能问题

### Debug

**V8 Inspector：**开箱即用，特性丰富强大，与前端开发一致、跨平台

- 启动调试器：添加 `–inspect` 参数 `node --inspect`
- 查看帮助：`open http://localhost:9229/json`

**场景**：

- 查看 `console.log` 内容
- `breakpoint`
  - `logpoint` 应用不会被阻塞，但会将断点数据打印出来
- 高 CPU、死循环：`cpuprofile`
  - 记录一段时间内的 JavaScript 运行情况
- 高内存占用：`heapsnapshot`
- 性能分析

### 部署

部署要解决的问题：

- 守护进程：当进程退出时，重新拉起
- 多进程：cluster 便捷地利用多进程
- 记录进程状态，用于诊断

容器环境，不必再单独使用进程管理工具

- 通常有健康检查的手段，只需考虑多核 cpu 利用率即可。


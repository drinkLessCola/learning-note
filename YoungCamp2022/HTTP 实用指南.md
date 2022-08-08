## HTTP 超文本传输协议

超文本：包括 HTML、CSS、JavaScript、Web APIs

- HTTP 协议是一个无状态协议。
- HTTP 协议是一个简单可扩展的协议。
  - 可以向请求头中添加一些特殊的头部

## 协议分析

### 报文

以 HTTP/1.1 为例：

请求行：`POST /xxx HTTP/1.1` 请求方法 url 路径 协议版本

响应行：`HTTP/1.1 403 Forbidden` 协议版本 响应状态码 状态字段

#### Method

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730195719708.png" alt="image-20220730195719708" style="zoom:80%;" />

- Safe（安全的）：不会修改服务器的数据的方法。
  - GET
  - HEAD
  - OPTIONS
- Idempotent 幂等性：同样的请求被执行一次与连续执行多次的效果是一样的，服务器的状态是一样的。
  - 所有安全的方法都是幂等的。
  - GET、HEAD、OPTIONS、PUT、DELETE

#### 状态码

- 1xx 指示信息，表示请求已接收，继续处理
- 2xx 成功，表示请求已被成功接收、理解、接受
- 3xx 重定向，要完成请求必须进行更进一步的操作
- 4xx **客户端**错误，请求有语法错误或请求无法实现
  - 401 `Unauthorized` 请求未经授权
- 5xx **服务器端**错误，服务器未能实现合法的请求
  - 504 `Gateway Timeout` 网关或者代理的服务器无法在规定的时间内获得想要的响应。



#### RESTful API

**RESTful API**（Representational State Transfer）：一种 API 设计风格

1. 每一个 URI 代表一种资源。
2. 客户端和服务器之间，传递这种资源的某种表现层。
3. 客户端通过 HTTP method，对服务器端资源进行操作，实现“表现层状态转化”。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730205656650.png" alt="image-20220730205656650"  />

#### 常用请求头

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730210007326.png" alt="image-20220730210007326" style="zoom:80%;" />

#### 常用响应头

![image-20220731133806959](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731133806959.png)



#### 缓存

##### 强缓存

本地有资源直接用即可。

- Expires 到期时间（时间戳）
- Cache-Control 
  - 可缓存性
    - no-cache：协商缓存验证
    - no-store：不适用任何缓存
    - public
    - private
  - 到期
    - max-age 
      - 单位为秒
      - 资源的最大生存周期
  - 重新验证 重新加载
    - must-revalidate 
      - 与 max-age 一起使用
      - 一旦资源过期，在成功向原始服务器验证之前，不能使用

##### 协商缓存

即使本地具有该资源的缓存，也需要向服务端进行通信，以检查资源是否过期。

- Etag / If-None-Match 资源的特定版本的标识符，类似于指纹。
- Last-Modified / If-Modified-Since 最后修改时间。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730220003515.png" alt="image-20220730220003515" style="zoom:80%;" />

- 强缓存是否可用
  - 是，读取浏览器缓存
- 否，检查 协商缓存 相关信息
  - 上一次响应头中是否有 `ETag`
    - 发起请求，请求头带上 `If-None-Match`
  - 上一次响应头中是否有 `Last-Modified` （时间准确性稍差）
    - 发起请求，请求头带上 `If-Modified-Since`
  - 状态为 304 Not Modified，使用浏览器缓存
  - 状态为 200，将响应的最新的数据缓存协商

#### cookie

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730231958479.png" alt="image-20220730231958479" style="zoom:80%;" />

HttpOnly：禁止 JavaScript 中获取 cookie 的 API，防止 cookie 泄露。

### 发展

1. HTTP/0.9 单行协议
   - 只有一个起始行： GET 方法和 目标地址
   - 承载的只有 HTML 类型的文档
2. HTTP/1.0 初步构建可扩展性
   - 增加了 Header
   - 有了状态码
   - 支持多种文档类型
3. HTTP/1.1 标准化协议
   - 连接复用
   - 缓存
   - 内容协商
4. HTTP/2 
   - 二进制协议
   - 压缩 header
   - 服务器推送

#### HTTP/2 ：更快、更稳定、更简单

**帧（frame）**：HTTP/2 通信的最小单位，每个帧都包含帧头，至少也会标识出当前帧所属的数据流。

- 将报文划分为许多个帧
- 采用二进制编码
- 使用新的压缩算法

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730232631912.png" alt="image-20220730232631912" style="zoom:80%;" />

**消息**：与逻辑请求或响应消息对应的完整的一系列帧。（是一个逻辑上的概念）

**数据流**：已建立的连接内的双向字节流，可以承载一条或多条消息。

- 帧可以彼此交错发送。
- 帧中具有标信息，可以根据标信息将消息重新组装。

HTTP/2 的能力：

- HTTP/2 连接都是永久的，而且仅需要每个来源一个连接

- 流控制：阻止发送方向接收方发送大量数据的机制

- 服务器推送：服务器根据文档中的引用关系，自动地将相应的资源**提前推送**给客户端。

  ![image-20220730233501767](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730233501767.png)

#### HTTPS

经过 TSL/SSL 加密。

HTTPS 使用 对称加密 和 非对称加密 混用的方法。

- 对称加密
  - 加密和解密都是使用同一个秘钥。
- 非对称加密
  - 加密和解密需要使用两个不同的秘钥：公钥和私钥。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220730234147889.png" alt="image-20220730234147889" style="zoom:80%;" />



## 静态资源

**静态资源方案：**缓存 + CDN + 文件名 hash

**CDN 内容分发网络：**通过用户就近性和服务器负载的判断，CDN 确保内容以一种极为高效的方式为用户的请求提供服务。

**强缓存优化：** 保证用户请求的文件是最新的。

- 打包时在文件名中加入 hash / 版本号。

## 跨域解决方案

- 浏览器的安全策略：CORS 跨域资源共享
- 代理服务器：绕开浏览器的同源策略
- Iframe 通信：限制较多

## 登录鉴权方案

- Session + cookie
  - 服务器端生成并返回一个 session（保存在数据库中），由 set-cookie 保存在客户端本地。
  - 客户端下一次发送请求，会自动携带 cookie 的 session。
- JWT（JSON web token）
  - 服务器生成 token 后不会存储，会直接在响应中返回给客户端
  - 客户端下一次请求，将 token 放在请求头相应的字段里面，由服务器进行 token 的解析，检查 token 是否有效。
  - token 具有唯一性。

## SSO 单点登录（Single Sign On）

子应用之间实现登录信息的共享。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731003651991.png" alt="image-20220731003651991" style="zoom:80%;" />

## Fetch

- 使用 Promise
- 模块化设计，Rseponse，Request，Header 对象。
- 通过数据流处理对象，支持分块读取。

## 网络优化

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731004244433.png" alt="image-20220731004244433" style="zoom:80%;" />

### 预解析 / 预连接

```html
<link rel="dns-prefetch" href="//example.com">
<link rel="preconnect" href="//cdn.example.com" crossorigin>
```

### 稳定性

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731004541141.png" alt="image-20220731004541141" style="zoom:80%;" />

- 重试是保证稳定的有效手段，但要防止加剧恶劣情况。
- 缓存合理使用，作为最后一道防线。

## 扩展-通信方式

### WebSocket

- 浏览器与服务器进行全双工通讯的网络技术
- 典型场景：实时性要求高，如聊天室
- URL 使用 ws:// 或 wss:// 等开头

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731004757330.png" alt="image-20220731004757330" style="zoom:80%;" />



### QUIC：Quick UDP Internet Connection

- 0-RTT 建立连接（首次除外）
- 类似 TCP 的可靠连接
- 类似 TLS 的加密传输，支持完美前向安全
- 用户空间的拥塞控制，最新的 BBR 算法
- 支持 http/2 的基于流的多路复用，但没有 TCP 的 HOL 问题
- 前向纠错 FEC
- 类似 MPTCP 的 Connection migration

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731005309677.png" alt="image-20220731005309677" style="zoom: 80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731005429352.png" alt="image-20220731005429352" style="zoom:80%;" />
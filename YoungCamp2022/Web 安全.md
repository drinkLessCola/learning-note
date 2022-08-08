# 一、攻击篇

## 1. Cross-Site Scripting（XSS） 跨站脚本攻击

攻击者将自己的恶意脚本注入页面，用户访问时恶意脚本会执行，进而可能导致隐私泄露。

### XSS 利用机制

- 开发者盲目信任用户提交的内容。
- 直接将用户提交的文本转化成 DOM
  - document.write
  - element.innerHTML
  - SSR(user_data)

### XSS 的一些特点

- 通常难以从 UI 上感知
- 可能窃取用户信息（cookie / token）
- 绘制 UI（如弹窗），诱骗用户点击 / 填写表单

### XSS demo

```js
public async submit(ctx) {
	const { content, id } = ctx.request.body
	// 没有对 content 过滤
	await db.save({
		content,
		id
	})
}

public async render(ctx) {
	const { content } = await db.query({
		id: ctx.query.id
	})
	// 没有对 content 过滤
	ctx.body = `<div>${content}</div>`
}
```

XSS 可以分为几类：

###  Stored XSS 存储型 XSS

- 恶意脚本被存在数据库中
- 访问页面 -> 读数据，用户被攻击
- 危害最大，对全部用户可见

### Reflected XSS 反射型 XSS

- 不涉及数据库
- 从 URL 上攻击

#### Demo

将 url 中的字段打印在页面上。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731222546050.png" alt="image-20220731222546050" style="zoom:80%;" />

```js
public async render(ctx) {
	const { param } = ctx.query
	ctx.status = 200
	ctx.body = `<div>${param}</div>`
}
```

### DOM-based XSS 基于 DOM 的 XSS 攻击

- 不需要服务器的参与
- 恶意攻击的发起 + 执行，全在浏览器完成。

#### Demo

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731222546050.png" alt="image-20220731222546050" style="zoom:80%;" />

```js
const content = new URL(location.href).searchParams.get("param")
const div = document.createElement("div")

div.innerHTML = content
document.body.append(div)
```

#### 与 Reflected XSS 的区别

完成注入脚本的地方不同。

- Reflected XSS 在服务端完成注入
- DOM-based XSS 完全由浏览器来完成

### Mutation-based XSS 基于 Mutation 

- 利用了浏览器渲染 DOM 的特性（独特性）
- 不同浏览器，会有区别（按浏览器进行攻击）

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731223656519.png" alt="image-20220731223656519" style="zoom:80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731223638735.png" alt="image-20220731223638735" style="zoom:80%;" />

很多 XSS 过滤工具都会把上面的属性当作合理的来看待。

img 的 error 事件一触发就完成了 XSS 攻击。

## 2. Cross-Site request forgery(CSRF) 跨站伪造请求

- 在用户不知情的前提下
- 利用用户权限 cookie
- 构造指定 HTTP 请求，窃取或修改用户敏感信息。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731224138975.png" alt="image-20220731224138975" style="zoom:80%;" />

最常见的是 GET 请求方式。

```html
<a href="http://bank.com/transfer?to=hacker&amount=100"></a>
```

```html
<img style="display:none;" src="https//bank.com/transfer?to=hacker&amount=100">
```

也可以使用 POST 方式， 只需要构造一个 `method=“POST”` 的表单。

```html
<form action="http://bank/transfer_tons_of_money" method="POST">
	<input name="amount" value="1000000000000000" type="hidden"/>
  <input name="to" value="hacker" type="hidden"/>
</form>
```

## 3. Injection 注入

### SQL 注入

- 通过一个 HTTP 请求的参数承载 SQL 参数，请求到达服务器端。
- 服务器从请求上读取参数，构造出一个 SQL 语句运行，即执行了恶意的 SQL 注入。
- 攻击者可以获取其他数据，修改数据，删除数据。

#### Demo

```js
public async renderForm(ctx){
	const { username, form_id } = ctx.query;
	const result = await sql.query(`
		SELECT a, b, c FROM table
		WHERE username = ${username}
		AND form_id = ${form_id}
	`);
	ctx.body = renderForm(result);
}
```

攻击者：

```js
fetch("/api", {
	method:"POST",
	headers:{
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		username: "any; DROP TABLE table;",
	})
})
```

在服务器端就会变成：

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731230323731.png" alt="image-20220731230323731" style="zoom:80%;" />

**Injection 不至于 SQL，还可以通过：**

- `CLI`
- `OS command`
- `Server-Side Request Forgery(SSRF)`，服务器端伪造请求
  - 严格而言，`SSRF` 不是 injection，但是原理类似

```js
public async converVideo(ctx){
	const { video, options } = ctx.request.body
  exec(`convert-cli ${video} -o ${options}`);
  ctx.body = "ok"
}
```

```js
fetch("/api", {
	method:"POST",
	body: JSON.stringify({
		options:` && rm -rf xxx`
	})
})
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731230825723.png" alt="image-20220731230825723" style="zoom:80%;" />

可能会删除服务器端的若干文件。

甚至还会进行读取、修改服务器端文件的行为。

比如服务器配置文件这种重要的文件。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731231059003.png" alt="image-20220731231059003" style="zoom:80%;" />

修改了服务器配置文件，可以将服务器接收到的请求代理转发到另一个网站。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731231258178.png" alt="image-20220731231258178" style="zoom:80%;" />

### SSRF 服务器端伪造请求

```js
public async webhook(ctx){
	// callback 可能是内网 url
	ctx.body = await fetch(ctx.query.callback);
}
```

1. 请求**用户自定义**的 callback URL（构造一些内网的 url）
2. web server 通常具有内网访问权限

可能暴露内网信息 / 使内网服务崩溃。

## 4. Denial of Service(DoS) 服务拒绝攻击

通过某种方式（构造特定请求），导致服务器资源被显著消耗。来不及响应更多请求，导致请求挤压，进而雪崩。

### ReDos：基于正则表达式的 DoS

#### 正则表达式——贪婪模式

重复匹配时

-  `?`   ：满足一个即可
- `no ?`：满足尽量多

```js
const greedyRegExp = /a+/ // 有多少匹配多少
const nongreedyRegExp = /a+?/ // 一个即可
const str = "aaaaaa"
console.log(str.match(greedyRegExp)[0]) //"aaaaaa"
console.log(str.match(nonGreedyRegExp)[0]) //"a"
```

#### demo

服务器端写了一个贪婪的正则表达式，攻击者可以传入一个容易发生回溯行为的字符串对我们进行攻击。

导致服务器端的响应时间大大延长，吞吐量明显降低。响应用户的请求次数下降。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731232535441.png" alt="image-20220731232535441" style="zoom:80%;" />



### Distributed DoS(DDoS)

短时间内，构造来自大量僵尸设备的请求流量，服务器不能及时完成全部请求，导致请求堆积，进而雪崩效应，无法响应新请求。

- 直接访问 IP
- 任意 API
- 消耗大量带宽



#### demo：洪水攻击

攻击者请求建立连接，但不回应第三次握手，不响应一个 ACK，导致整个三次握手未完成，连接数不能被释放。

服务器达到最大连接数，所有的新请求都无法被响应。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731233345484.png" alt="image-20220731233345484" style="zoom:80%;" />

## 5. 传输层攻击

### 中间人攻击

**中间人攻击**是最常见的传输层攻击。

中间人可以是一个恶意的路由器 / 路由器 / 服务提供商。

主要利用了:

- 明文传输
- 信息篡改不可知
- 对方身份未验证

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731233704095.png" alt="image-20220731233704095" style="zoom:80%;" />

# 二、防御篇

## 1. XSS

永远不信任用户的提交内容，不要将用户提交内容直接转换成 DOM。

### 现成工具

前端：

- 主流框架默认防御 XSS
- `google-closure-library` 提供了防御 XSS 攻击的工具函数

服务端 Node：

- `DOMPurify` npm 包完成字符串转义

### string 转成 DOM

要对 string 进行转义！

### 上传 SVG 文件

也要对 SVG 文件进行一次扫描，

因为按照规范，**SVG 文件中可以插入 script 标签。**

### 自定义跳转链接

需要过滤！

**href 实际是可以传递 JS 代码的。**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731234849274.png" alt="image-20220731234849274" style="zoom:80%;" />

### 自定义样式

在一些样式属性中，可以**通过 url 形式引入资源。**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220731234918512.png" alt="image-20220731234918512" style="zoom:80%;" />



## 2. Content Security Policy (CSP) 内容安全策略

- 允许开发者定义哪些源是安全的
- 来自安全源的脚本可以执行，否则直接报错。
- 直接拒绝 eval + inline script 

**通过服务器的响应头部设置 CSP:**

`Content-Security-Policy: script-src 'self' ` 允许同源脚本

`Content-Security-Policy: script-src 'self' https://domain.com`

除了同源之外，还允许了另一个域名的 script 请求。

**也可以通过浏览器 meta 设置：**

```html
<meta http-equiv="Content-Security-Policy" content="script-src self">
```

## 3. CSRF 防御

对请求的 `Origin` / `referrer` 进行校验，决定是否允许请求。

- 同源请求中， GET 和 HEAD 请求不会发送 `origin` 字段。
- 因此 `referrer` 会被更广泛的利用。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801000130998.png" alt="image-20220801000130998" style="zoom:80%;" />

除了 `Origin` / `Referrer`，其他判断请求来自合法来源的手段：

### token 方式：

- 客户端请求页面，服务器会返回页面以及一个 `token`
- 客户端后续对服务器的请求都会带上 `token`
- 服务器端对 `token` 进行校验
  - 校验不通过，则直接报错不通过。
  - 校验通过，返回真实数据。

`token` 需要注意的地方：

- **用户绑定**：`token` 必须保证与用户单独绑定，确保不会被其他注册用户利用。
- **过期时间**：用户的 `token` 可能会被窃取，被攻击者利用。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801000416472.png" alt="image-20220801000416472" style="zoom:80%;" />

### 防御 iframe 攻击

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801000902378.png" alt="image-20220801000902378" style="zoom:80%;" />

由于按钮有 `pointer-events:none` 属性，导致点击事件被穿越到 iframe 的合法页面上。

可以利用此点击事件发起一个 HTTP 请求，即同源请求。

==**可以通过一个 http 头部设置页面是否可被 iframe 加载进行防御**==：

`X-Frame-Options: DENY/SAMEORIGIN`

在服务器进行编码可以为所有页面设置该头部。

- `DENY`：该页面不可以作为 iframe 被加载
- `SAMEORIGIN`：只有同源页面才可以将该页面作为 iframe 被加载。

### CSRF anti-pattern

**按照功能将各个接口的职责划分开。不要将多个方法整合在一个接口中。**

- CSRF 攻击者既可以获取用户数据，而且可以修改。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801002208331.png" alt="image-20220801002208331" style="zoom:80%;" />

### 避免用户信息被携带：SameSite Cookie

CSRF 能够利用 cookie 是由于 **用户权限保存在 cookie 之中**。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801002621605.png" alt="image-20220801002621605" style="zoom:80%;" />

在域名 A 中：

- 第一方 cookie：domain 为 A 的 cookie
- 第三方 cookie：domain 不为 A 的 cookie

**SameSite cookie：根据 cookie 的 domain 属性与当前页面的域名是否匹配，匹配才发送该 cookie。**

向域名 A 发出请求时，所有第一方 cookie 会被带上，第三方 cookie 不会被携带给域名 A 对应的服务器。

![image-20220801004311912](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801004311912.png)

#### 依赖 Cookie 的第三方服务

如内嵌一个播放器，识别不了用户登录态，无法发送弹幕。

```
Set-Cookie: SameSite=None; Secure;
```

**可以不对 SameSite 进行任何限制，但同时需要标明 cookie 为 Secure 以确保安全。**

### SameSite 与 CORS 的异同

**SameSite**

- 针对的是 Cookie 的发送
- 对比的是 Cookie 的 domain 属性和页面域名是否一致。

**CORS 跨站资源共享：**

- 针对的是资源读写，是对 HTTP 请求进行的限制
- 对应的是 资源域名 与 页面域名是否一致。
- 是一种白名单机制。

### 防御 CSRF 的正确方式

不需要 case by case 的进行防御。

可以使用一个**中间件**，由**中间件生成各种防御 CSRF 的策略**。

## 4. Injection

### SQL 注入

- 找到代码中使用 SQL 语句的地方。
- 正确使用 `prepared statement`，将 **SQL 语句进行提前的编译**。

### 其他注入方式

- 最小权限原则
  - 任何命令都不使用 sudo 来执行
  - 不开放 root 权限
- 建立允许名单 + 过滤
  - 不使用 rm 操作
- 对 URL 类型参数进行协议、域名、ip 等的限制
  - 避免攻击者能够访问我们的内网资源。

## 5. DoS

### Regex DoS

- 避免写出贪婪匹配的模式，特别是在接口处理处。
- 使用代码扫描工具对代码中的正则表达式进行规整，并进行性能测试
- 拒绝使用用户提供的正则表达式。

### DDoS

- 流量治理
  - 负载均衡。
  - API 网关。
    - 可在上述这两层进行流量的识别，过滤恶意攻击，转到其他服务 / 直接拒绝。
  - 前置 CDN，所有流量都要经过 CDN 得到我们的服务。
- 快速自动扩容
- 非核心服务降级，如关闭，留出更多资源应对集中流量。

## 6. 传输层

### 防御中间人：HTTPS

使用 `HTTPS` （ `HTTP` + `TLS`），`HTTP/3` 内置了 `TLS`。

#### HTTPS 的一些特性：

- **可靠性**：加密，避免明文传输
- **完整性**：MAC 验证，确保信息不被篡改
  - 服务端传递信息的同时，会传递一个加密信息对应的 `hash` 
  - 接收方会对接收的信息重新进行一次 `hash` 计算
  - 与传递过来的 `hash` 值进行一次对比，以确定信息是否被篡改
- **不可抵赖性**：数字签名，确保双方身份是可被信任的
  - `CA` 证书机构完成签名工作
  - 服务提供方将 **元信息** 和 **公钥** 合并为一个信息，使用 `CA` 提供的**私钥**进行签名，生成服务器端真正保存的证书
  - 证书传递给浏览器侧，浏览器侧通过 `CA` 发布的**公钥**对证书进行校验
  - 每个浏览器会内置大量 `CA` 证书，包含各个 `CA` 的公钥

![image-20220801013244023](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013244023.png)

#### HTTPS 通信方式：

1. 浏览器将自己支持的加密套件选项传递给服务端。
2. 服务器选中一个加密套件，将**采用的加密方式** 和 **自己的证书** 返回给浏览器侧。浏览器对证书进行校验。
3. 校验通过后，使用之前协商的加密算法和随机数算出一个 `Session Key`，使用证书中的**网站的公钥**对该随机数进行加密，发送给服务端。服务端使用**自己的私钥**对随机数进行解密得到 `Session Key`。
   - 此时**非对称加密**的过程结束，进入**对称加密**。
4. 双方使用 `Session Key` 作为 `secret` 对所有的信息进行对称加密。

![image-20220801013143871](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013143871.png)

![image-20220801013213041](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013213041.png)

#### 数字签名

签名执行者：有一对私钥（privateKey）和公钥（publicKey）。

签名执行者使用私钥对内容进行数学计算得到一个签名，

具有公钥的人可以使用公钥对签名进行一次校验，确认签名是否是由私钥生成。

![image-20220801013227129](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013227129.png)

当签名算法不够健壮时，证书是可以被造假的。

## HTTP Strict-Transport-Security(HSTS)：将 HTTP 主动升级到 HTTPS

- 浏览器向服务器侧发出一个 https 的请求
- 服务器返回一个 `Strict-Transport-Security:max-age=3600` 的头部
  - **在 max-age 时间内发出的 HTTP 请求会被自动升级为 HTTPS 请求**
  - 防止可能存在的中间人攻击

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013335671.png" alt="image-20220801013335671" style="zoom:80%;" />

## Subresource Integrity(SRI)：确保 CDN 中存放的静态资源没有被劫持 / 篡改。

SRI 其实是一个 `hash` 值。

实现方式：**在 script 标签上增加一个属性，声明摘要值的算法和具体的摘要值。**

```html
<script src="https://example/app.js"
				integrity="sha384-{some-hash-value}"
				crossorigin="anonymous"></script>
```

当浏览器发出请求拿到资源时，会对资源进行一次 hash 计算，并与声明的摘要值进行对比，如果相同，说明资源没有被篡改。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220801013419117.png" alt="image-20220801013419117" style="zoom:80%;" />

## Feature Policy/Permission Policy

针对某一个源，可以使用哪些功能。

- camera
- microphone
- autoplay

即使被 XSS 攻击了，也可以**限制页面不能调用一些敏感的功能。**

`iframe` 支持一个 `allow` 属性，也可以实现类似的功能。
# Vite 知识体系

## 01. 为什么需要构建工具

前端项目的核心要素是一系列的资源。

- 模块化：将项目拆分为不同的模块，分别进行维护
  - 前端没有统一的模块规范： ESM，CommonJS，UMD
- 资源编译：TS，JSX，Sass，
- 产物质量：代码体积 / 代码性能
  - 线上代码需要压缩
  - 未使用的模块，从构建产物中剔除
  - 语法兼容性问题，可能会产生白屏事故
- 开发效率：热更新

### 前端构建工具的意义

1. 模块化方案
   - 提供统一的模块加载方案
   - 兼容不同模块规范
2. 语法转译
   - 高级语法转译，构建工具一般会集成一系列的工具链，如 Sass，TypeScript
   - 静态资源加载，如图片、字体、worker
3. 产品质量
   - 产物压缩，Tree Shaking（无用代码删除）
   - 语法降级，达到语法安全的目的
4. 开发效率
   - 构建工具提供热更新的系统

## 02. Vite  是什么？

- 定位：新一代前端构建工具
- 两大组成部分：
  - 开发阶段的 No-bundle 开发服务，源文件无需打包
    - 基于 Node.js 的 dev-Server
    - 与传统构建工具最大的不同
  - 生产环境基于 Rollup 的 Bundler 打包器
    - 将所有业务代码进行打包
    - 针对 web 构建场景，对 Rollup 进行了深度的定制和优化
- 核心特征
  - 高性能，dev 启动速度和热更新速度非常快
  - 简单易用，开发者体验好

### 当代构建工具的问题 & Vite 的优化思路

- 缓慢的启动 -> 项目编译等待成本高
- 缓慢的热更新 -> 修改代码后不能实时更新

前端技术瓶颈所在：

- bundle 带来的性能开销
  - 在开发阶段都会进行代码的打包，打包过程比较消耗性能
- JavaScript 语言的性能瓶颈
  - JavaScript 是单线程的解释性语言，没有那么多的性能优化手段

#### 两大行业趋势

- 全球浏览器对原生 ESM 的普遍支持（目前占比 92% 以上）。

  - ```html
    <script type="module">
    	import {foo} from './foo.js'
      console.log(foo)
    </script>
    ```

  - `script` 标签增加 `type=“module”` 属性

  - 使用 ESM 模块导入导出语法

  - 浏览器发现 `import` 语句之后会发起一个对模块的请求

  - 解析出模块的导出字段。

- 基于原生语言（Go，Rust）编写的前端编译工具链逐渐兴起。

  - 如 Go 语言编写的 Esbuild（Vite 底层的核心工具），Rust 编写的 SWC（对标 Babel 的 JS 编译器）



#### 基于原生 ESM 的开发服务优势

Vite 本质上是一个开发时的 devServer。底层原理即为 script type=“module”

- 针对这种 script，浏览器会发送一个文件请求
- devServer 接收该文件请求，即可进行一些自定义的文件编译，将浏览器可以识别的 JS 内容响应给浏览器

**基于 ESM 的优势**：

- **无需打包项目源代码**：去除了 bundle 的开销
- **天然的按需加载**：一个文件就是一个请求，请求的时候才进行编译
- **可以利用文件级的浏览器缓存**：模块的粒度为文件级别
  - 文件变更时不会导致整个 bundle 失效，只会导致当前文件缓存失效
  - 可以达到更细粒度的浏览器缓存

#### 基于 Esbuild 的编译性能优化

Vite 深度使用了 Esbuild，性能极高。具备如下能力：

1. 打包器 `Bundler`   - 对标 webpack
2. 编译器 `Transformer`   - 对标 Babel
3. 压缩器 `Minifier`   - 对标 JS 压缩的工具

### 内置的 Web 构建能力

Vite 不作配置，具有等价于以下 webpack 基础设施的能力。

- 对常见的 web 开发需求进行了封装
- 并内置了一些默认的最佳实践



## 03.

### 项目初始化

```
// 提前安装 pnpm
npm i -g pnpm
// 初始化命令
pnpm create vite
// 安装依赖
pnpm install
// 启动项目
npm run dev
```



- dev：”vite” 开发阶段的启动 Vite 的 dev Server
- build：“tsc && vite build” 生产环境进行项目打包
- preview：如何预览通过生产模式打包出的产物内容

### 使用 Sass/Scss & CSS Modules

CSS Module：生成的 className 并不是原本的字符串，而是相当于引入了 JSON 的一个字段，变成 类名 + hash 值。

- 防止出现不同组件中的样式污染，起到样式隔离的作用



### 使用静态资源

```js
import reactLogo from './assets/react.svg'
```

路径会给 devServer 发起一个请求，

Vite 作为一个 devServer ，会把 svg 的内容返回给浏览器。

除了常见的图片格式，Vite 也内置了对于 JSON、Worker、WASM 资源的加载支持

### 使用 HRM

无需额外配置，自动开启。

**HRM 可以保存（未修改？）组件的局部状态。**

### 生产环境 Tree Shaking

无需配置，默认开启。

**优化原理：**

1. 基于 `ESM` 的 `import / export` 语句依赖关系，可以静态确定，与运行时状态无关
   - common.js 就无法静态分析，因为 require 的部分可能是运行时计算的结果
   - Tree Shaking 只能用于 ESM
2. 在构建阶段将未使用到的代码进行删除

**使用 build 构建：**

1. 首先会使用 tsc 编译，进行项目的类型检查
   - 因为 Vite 底层使用 Esbuild 没有提供 TypeScript 的类型支持
2. 然后使用 vite build 进行项目的打包，产生最终的产物

```js
// 📂vite.config.ts
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins:[react()],
	build:{
		minify:false // 关闭生产环境的代码压缩
	}
})
```

## 04. Vite 整体架构

- 开发阶段 Development
  - 依赖预打包
- 生产阶段 Production
- Vite Plugin Pipeline  Vite 的插件机制
  - 可以在开发阶段与生产环境共用



为什么要进行预打包？

- node_modules 不可控，里面可能有非常多的文件请求
- node_modules 代码产物的格式可能不规范，可能为CommonJS 格式。需要将 CommonJS 格式转换为 ESM 格式

实现原理：

1. 服务启动前扫描代码中用到的依赖
2. 用 Esbuild 对依赖代码进行预打包
3. 改写业务代码中的 import 语句，指定依赖为预构建产物路径



### 关键技术：单文件编译

用 Esbuild 编译 TS / JSX。

优势

局限性：

- 不支持 TS 类型检查
- 不支持语法降级到 ES5

### 关键技术：代码压缩

Esbuild 作为了默认的压缩工具，替换传统的 Terser、Uglify.js 等压缩工具

### 关键技术：插件机制

- 开发阶段：模拟 Rollup 插件机制
- 生产环境：直接使用 Rollup

## 05. Vite 进阶路线

### 深入双引擎

- Esbuild
- Rollup

### Vite 插件开发

为什么需要插件机制？

- 抽离核心逻辑，达到解耦的效果
  - 构建和 devServer 分离开，通过一个个插件来实现构建过程
- 易于拓展



Vite 插件的钩子如下，可以在不同的构建阶段插入自定义的逻辑。

- config
- resolveId
- load
- transform

### 插件示例



### 代码分割（拆包）

只有一个 bundle 文件的问题：

- 无法进行并发请求
- 缓存复用率低，一个文件改动，整个bundle 都会失效

拆包可以达到更好的缓存复用的效果，提升页面加载速度。

依赖于 Rollup 打包功能。



### JS 编译工具（Babel）

出现的原因：

- JavaScript 语法标准繁多，浏览器支持程度不一
- 开发者需要用到高级语法

使用一系列的编译工具，对高级语法进行降级以支持各个浏览器。

语法降级的功能的实现

- 将代码解析为 AST 抽象语法树。每个单词都是 AST 的一个结点
- 将高级语法的 AST 进行一系列操作转换为低级语法的 AST
- 通过 Babel 生成器Generator 将 AST 转换为 低级语法的代码，达到语法降级的功能



### 语法安全降级

以 Promise 语法为例，IE11 没有支持。



- 上层解决方案
- 底层原理
  - 借助 Babel 进行语法自动降级
  -  

### 服务端渲染 SSR 

提升首屏性能 + SEO 优化。

除了构建出客户端的产物，还会构建出一份 SSR 的产物。

服务端会拿到 SSR 的产物，进行数据预取，组件渲染，

在服务端就将HTML 内容产生出来，

前端能够直接拿到完整的 HTML 内容，而不仅仅是一个 div id=“root” 的标签。能够更快渲染到页面上。



### 深入了解底层标准

ESM 即将实现大一统。

Node 也支持了原生的 ESM 模块加载。




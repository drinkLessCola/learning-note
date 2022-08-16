## 01. 什么是 Webpack

前端项目是由很多资源构成的：图片文件、`JavaScript` 文件、`CSS`、`Vue`、`React` 文件 或者 字体文件。

**在 Webpack 之前是通过手动管理资源：**

- 依赖手工，如果有很多个 `JavaScript` 文件，引入操作将会非常繁琐
- 当代码文件之间有依赖的时候，就得严格按照依赖顺序书写
- 开发与生产环境一致，难以接入 `TypeScript` 或 `JavaScript` 新特性
- 比较难接入 `Less`、`Sass` 等预编译工具
- `JavaScript`、图片、`CSS` 资源管理模型不一致，衍生出复杂的团队规范

**出现了很多工程化工具：**

某种程度上正是这些工具的出现，才有了前端工程这一概念。

- `Gulp`
- `grunt`
- `require.js`
- `browserify`

主要解决 `JavaScript` 文件模块化的问题，以及任务转移器的设计。

- `Webpack`
- `Vite`
- `rollup.js`

等新一代构建工具。

==**Webpack 本质上是一种前端资源编译、打包工具**==。

**编译**：将图片、`Less`、`Sass`、`TypeScript` 文件等非 `JavaScript` 文件编译为标准的 `JavaScript` 兼容的内容。

**打包**：将编译好的内容打包为一个 `Bundle` 文件。

**为什么需要打包：**

- 浏览器一开始不支持 `ESM` 模式
- 要将资源放进浏览器运行，需要为所有资源分别使用 `script` 标签
- `Webpack` 将资源整合进一个文件，只需要插入一个 `script` 标签即可

`Webpack` **组件逐渐发展成为功能化的中枢：**

- 多份资源文件打包成一个 `Bundle`
- 支持许多其他的工程化工具，这些工具都可以成为 `Webpack` 的一个组件，`Webpack` 工作流里面的一个步骤去运行。
  - 支持的工程化工具： `Babel`、`Eslint`、`TypeScript`、`CoffeeScript`、`Less`、`Sass`
- 统一了资源文件的管理模型，不需要为图片、`CSS` 资源独立地设计一套管理规范
  - 支持模块化处理 `CSS`、图片等资源文件
- 支持 `HMR` + 开发服务器
- 支持持续监听、持续构建
- 支持代码分离
- 支持 `Tree-shaking`
- 支持 `Sourcemap`

## 02. Webpack 打包核心流程

### 2.1 示例

1. 安装 `Webpack` / `Webpack-cli` 依赖

   - ```
     npm i -D Webpack Webpack-cli
     ```

2. 编辑配置文件

   - ```js
     module.exports = {
       // 项目的入口文件
     	entry:'./src/index',
     	mode:'development',
     	devtool:false,
       // 打包完的文件存放的位置
     	output:{
     		filename:'[name].js',
     		path:path.join(__dirname, './dist')
     	}
     }
     ```

3. 执行编译命令

   - ```
     npx Webpack
     ```

- `import .. from` 会被转换成 `Webpack_require` 语句
- 多个 `JavaScript` 文件会被合并为一个 `JavaScript` 文件。

### 2.2 核心工作流程

**Entry** => **Dependencies Lookup** => **Transform** => **Bundle** => **Output**

1. 入口处理 **get start**：从 `entry` 文件开始，启动编译流程
2. 依赖解析 / 收集 **dependencied lookup**：从 `entry` 文件开始，根据 `require` or `import` 等语句找到依赖资源
3. 资源解析 **transform**：根据 `module` 配置，调用资源转移器，将 png、css 等非标准 `JavaScript` 资源转译为 `JavaScript` 内容。
4. 资源合并打包 **combine assets**：将转义后的资源内容合并打包为可直接在浏览器运行的 `JavaScript` 文件
   - 插入一些运行时代码
   - 进行代码优化，合并，tree shaking，混淆
   - 输出最终的产物文件

第2、3个步骤是一个**递归处理**的（调用 loader）过程：

- 因为在第二个步骤找到的新的资源中<u>可能还有新的依赖</u>
- 递归处理直到项目中**所有资源都被解析过**了，即进入资源合并打包步骤

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810055126184.png" alt="image-20220810055126184" style="zoom:80%;" />

#### **Webpack 本质上做的事情：模块化 + 一致性**

- 统一图片、CSS、字体等其他资源的处理模型。
  - 不同类型的资源都可以使用 `import` 、`require` 语句进行管理

- 支持 `TypeScript`、`CoffeeScript` 等 `JavaScript` 的超集语言
- 多个文件资源合并为一个，减少 http 请求数
- 支持模块化开发
- 支持高级 `JavaScript` 特性

### 2.3 关键配置项介绍

Webpack 的使用方法，基本围绕 **配置** 展开。

配置大致可以分为两类：

1. **流程类**：作用于流程中的某个 / 若干个环节，直接影响打包效果的配置项
2. **工具类**：主流程之外，提供更多工程化能力的配置项，如 `tree-shaking`、`dev-tool`

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image (1).png"  />

#### 流程类配置

- **entry:**
  - `entry` ：定义项目的入口，Webpack 会从这个项目的入口去解析整个项目
  - `context` ：定义Webpack 运行的时候，从哪个文件夹去寻找资源
- **模块解析：**
  - `resolve`
  - `externals`
- **模块转译：**
  - `module`

- **后处理：**
  - `optimization`
  - `mode`
  - `target`


#### 配置总览

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810112755865.png" alt="image-20220810112755865" style="zoom:80%;" />

- **开发效率类：** `watch` 、`devServer`、 `devtool`
- **性能优化类：** `cache` 、`performance`
- **日志类：**`stats`、 `infrastructureLogging` 

**应该关注的配置项，按使用频率：**

- `entry` / `output`
- `module` / `plugins`
  - `module` 定义 Webpack loader 属性
  - `plugins` 定义 Webpack 插件
- `mode`
- `watch` / `devtool` / `devServer`

### 2.4 使用 Webpack

#### 必选的 entry / output

两个必选属性：每个项目都需要定义至少一个 `entry` / `output`。

`mode:production` （默认值） 产物会做一个压缩，比较简洁。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810113327404.png" alt="image-20220810113327404" style="zoom: 80%;" />

#### 处理 CSS

`JavaScript` 文件中可以通过 `import` 引入 CSS 文件

如果没有注册 `loader` 来处理这种 CSS 文件，实际构建过程会报错：内容无法解析。

**loader 的定义方法：**

```js
const path = require("path")

module.exports = {
  entry:"./src/index",
  output:{
    filename:"[name].js",
    path:path.join(__dirname, "./dist")
  },
  module:{
    rules:[{
      // 过滤条件，满足该条件的文件才使用该 loader 进行处理
      test:/\.css$/,	
      // 对象 / 数组，处理文件使用的 loader
      use:['style-loader','css-loader']
    }]
  }
}

```

**loader 的作用：**

- 在 Webpack 用来处理不同类型资源的一个组件
- 通常的写法：针对不同的后缀名，定义一个 loader 的序列

`style-loader`会在打包后的文件中插入许多<u>运行时代码</u>，

CSS 内容会被转义为字符串，在需要时用作样式代码。

步骤：

1. 安装 `Loader`
2. 添加 `module` 定义



- 与旧时代——在 HTML 文件中维护 css 相比，这种方式会有什么优劣处？
  - 减少浏览器加载资源的数量，提高网页加载速度，尤其是首屏的加载速度。
  - 浏览器加载资源文件是单线程，加载 CSS 文件会阻塞页面渲染。
- Less、Sass、Stylus 这一类 CSS 预编译框架，如何在 Webpack 接入这些工具？
  - 见下文，在 `use` 数组中增加 对应的特定 `loader`

#### 处理 JavaScript：接入 Babel

`Babel`：`JavaScript` 代码转义工具，高版本 `JavaScript` 代码转义为低版本的。

步骤：

1. 安装依赖 `npm i -D @babel/core @babel/preset-env babel-loader`
2. 声明产物出口 `output`
3. 执行 `npx webpack`

```js
const path = require("path")

module.exports = {
  entry:"./src/index",
  output:{
    filename:"[name].js",
    path:path.join(__dirname, "./dist")
  },
  module:{
    rules:[{
      test:/\.js$/,
      use:[{
        loader:'babel-loader',
        // options 会被传入 loader 中运行
        options:{
          // 规则集
          // @babel/preset-react
          // @babel/preset-typescript
          presets:[
            ['@babel/preset-env']
          ]
        }
      }]
    }]
  }
}
```

为了运行代码，注入了 `Babel` 的运行时：

`class` => `createClass()`

箭头函数 => 普通函数的定义

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810125440610.png" alt="image-20220810125440610" style="zoom: 50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810130458130.png" alt="image-20220810130458130" style="zoom:80%;" />

#### 生成 HTML

与上述处理相比，生成 HTML 的特别之处在于：使用的是一个插件 `html-Webpack-plugins`

步骤：

1. 安装依赖 `npm i -D html-webpack-plugin`
2. 声明产物出口 `output`
3. 执行 `npx webpack`

通过模板生成标准 `HTML` 文件来运行 `JavaScript` 文件。

打包的 `JavaScript` 产物会被自动插入这个 `HTML` 文件。

**使用插件生成 HTML 的原因：**

- `CSS`、`JavaScript` 都由 Webpack 托管之后，已经<u>没有必要再在 HTML 中手动管理这些资源</u>。
- 既然该管理过程可以自动化，那么就<u>不必自己去定义 HTML</u> 了。

可以通过插件的配置定制 HTML 。

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry:"./src/index",
  output:{
    filename:"[name].js",
    path:path.join(__dirname, './dist')
  },
  plugins:[new HtmlWebpackPlugin()]
}

```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810131856458.png" alt="image-20220810131856458" style="zoom:80%;" />

### 2.5 使用 Webpack - 工具线

![image-20220810132011234](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810132011234.png)

#### HMR 

`Hot Module Replacement` 模块热替换：

代码能够立刻被替换更新至页面上，无需手动刷新页面。

**步骤：**

1. 开启 HMR

2. 启动 Webpack

   ```
   npx Webpack serve
   ```

```js
module.exports = {
  ...
  devServer:{
    hot:true, // 开启 HMR 效果
    open: true
  },
  watch:true // 持续监听文件的变化，一旦更新代码，自动生成新的版本
}

```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810132734557.png" alt="image-20220810132734557" style="zoom:50%;" />

#### Tree-Shaking

删除没有用到的代码 Dead Code。

- 代码没有被用到，不可到达
- 代码的执行结果不会被用到
- 代码只读不写

对工具类库如 Lodash 有奇效。

开启 `tree-shaking`：

```js
module.exports = {
  entry:"./src/index",
  devtool:false,
  
  // 两个开启 Tree-Shaking 的必需属性
  mode:'production', // 简化的办法，可以跳过很多细节
  optimization:{
    usedExports:true,
  }
}

```

#### 其他工具

- 缓存: Webpack5 
- `Sourcemap`：经过压缩的产物可以通过 `sourcemap` 映射回最开始开发的状态，提升在线上环境调试的效率
- 性能监控
- 日志
- 代码压缩
- 分包

思考题：

1. 除上面提到的内容，还有哪些配置可划分为“流程类”配置？
2. 工具类配置具体有什么作用？包括`devtool/cache/stat`等



## 03.进阶篇：Loader 

`Loader`：为了处理非标准 `JavaScript` 资源，设计出的资源翻译模块。

- 核心功能：用于将非 `JavaScript` 资源转化为标准 `JavaScript`。

- Webpack 只认识 `JavaScript` 代码
- 解析其他资源会报错

使用 Loader:

1. 安装 Loader
2. 添加 `module` 配置

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810133551586.png" alt="image-20220810133551586" style="zoom:50%;" />

### 链式调用

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810133641401.png" alt="image-20220810133641401" style="zoom:80%;" />

- `less-loader`：实现 `less => css` 的转换
  - 接收到的是 `less` 文件的源代码
  - 调用 `less` 转码器得到 `css` 的内容
- `css-loader`：将 CSS 包装成类似 `module.exports = "${css}"` 的内容，包装后的内容（字符串）符合 `JavaScript` 语法
- `style-loader`：将 CSS 模块包进 `require` 语句，并在运行时调用 `injectStyle` 等函数将内容注入到页面的 `style` 标签
  - 不进行转换，而是注入一段运行时

```
ndb npx Webpack // 调试库
```

### 其他特性

特点：

- 链式执行
- 支持异步执行
- 分 `normal`、`pitch` 两种模式

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810133914822.png" alt="image-20220810133914822" style="zoom:80%;" />

运行机制（由 `loader-runner` 控制）：执行时会一个接一个地执行`loader` 。运行最开始是 `pitch`  阶段。

- `pitch` 阶段，根据 `loader` 定义的顺序，从左到右逐个执行 `loader.pitch` 函数（如果有的话）。
  - 特性：任意一个 `pitch` 阶段有返回值，就会立即停止后面的执行
  - 适合用来做一些 `catch`
  - [style-loader 使用 pitch 进行阻断示例](https://mp.weixin.qq.com/s/TPWcB4MfVrTgFtVxsShNFA)
- 正常的执行阶段，会从最后一个 `loader` 开始执行，直到第一个。

### 如何编写 Loader

一个 `loader` 文件需要具备的内容：

```js
module.exports = function(source, sourceMap?, data?) {
	// source 为 loader 的输入
	// 可能是文件内容，也可能是上一个 loader 的处理结果
	return source
}
```

导出一个默认函数，可能有三个参数。

- `sourceMap`：源码的 `sourceMap` 信息，如果前面的处理过程生成了 `sourceMap`，就会通过该参数进行传递
- `data`：额外的信息，经常用来传递 ast 对象，避免重复解析

返回一段代码字符串。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810134301309.png" alt="image-20220810134301309" style="zoom:80%;" />

```js
// 简单的 loader 示例
module.exports = function (source) {
	console.log(source)
	return source + 'afsdfhgghngfffg'
}
```

### 常见 Loader

建议掌握这些常见的 Loader 的功能、配置方法。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810134422976.png" alt="image-20220810134422976" style="zoom:80%;" />

思考题：

1. Loader 输入是什么？要求的输出是什么？
2. Loader 的链式调用是什么意思？如何串联多个 Loader?
3. Loader 中如何处理异步场景？

## 04. 进阶篇：Plugin 

插件是一种架构，很多知名工具都设计了插件架构。

- 能够提高整个应用的扩展性。

如果不使用插件，那么：

- 需要了解整个流程细节，上手成本高
- 功能迭代成本高，牵一发而动全身
- 功能僵化，作为开源项目而言缺乏成长性

**插件架构精髓：对扩展开放，对修改封闭。**

Webpack 本身的很多功能也是基于插件实现的。

### 插件使用过程

1. 引入插件
2. `new` 一个插件实例

```js
const DashboardPlugin = require("webpack-dashboard/plugin")
// dashboard 用于美化编译输出
module.exports = {
  // ...
	plugins:[new DashboardPlugin()];
  // ...
}
```

### 理解插件

插件围绕 **钩子** 展开。

```js
class SomePlugin {
	apply(compiler) {
    compiler.hooks.thisCompilation.tap('SomePlugin', (compilation) => {})
  }
}
```

**钩子的核心信息：**

1. **时机**：编译过程的特定节点，Webpack 会以钩子形式通知插件此刻正在发生什么事情。
2. **上下文**：通过 `tapable` 提供的回调机制，以参数方式传递上下文信息
   - Webpack 每次重新编译内容时，就会触发钩子，传入一个参数（上下文实例）`compilation` 对象
3. **交互**：在上下文参数对象中附带了很多存在 side effect 的交互接口，插件可以通过这些接口改变。`dependencyFactories.set`

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810135154977.png" alt="image-20220810135154977" style="zoom:80%;" />

**Webpack 的关键钩子：**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220810135039442.png" alt="image-20220810135039442" style="zoom:80%;" />

思考题：

1. Loader 与插件有什么区别和相同点？
2. 钩子有什么作用？如何监听 钩子函数？

## 05. 如何学习 Webpack

### 入门级：学会灵活应用

- 理解打包流程
- 熟练掌握常用配置项、Loader、插件的使用方法，能够灵活搭建集成常见工具的 Webpack 环境
- 掌握常见脚手架工具的用法，例如：`Vue-cli`、`create-react-app`

### 进阶：学会扩展 Webpack

- 理解 `Loader`、`Plugin` 机制，能够自行开发 `Webpack` 组件
- 理解常见性能优化手段，（如 `Tree Shaking`，`catch`），并能用于解决实际问题
- 理解前端工程化概念与生态现状

### 大师：源码级理解 Webpack 打包

阅读源码，理解 Webpack 编译、打包原理，甚至能够参与共建。


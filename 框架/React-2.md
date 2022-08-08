## Refs

### 字符串形式的ref

```jsx
<div ref='myDiv'></div>
```

```jsx
// 使用
this.refs.myDiv
```

在一个标签中定义 ref 属性，并赋予一个 key 值，会以键值对的形式存储在 this.refs 中。

**有效率问题**，不推荐使用

### 回调函数形式的 ref

```jsx
<div ref={(currentNode)=> this.myDiv = currentNode}></div>
this.myDiv
```

ref 回调函数参数为ref属性所在的真实结点，

render中的this指向实例对象，因此通过给 this 上面添加属性，可以把结点挂到实例身上

**内联回调函数在组件更新时会被渲染2次**

因为每一次调用都会创建一个新的方法，因此为了与之前的区分，防止数据遗留，

传入 null 进行一次清空，

第二次才传入参数，

可以使用绑定函数解决，但是这个问题其实无关紧要。

### createRef()

创建一个 ref 容器，存储被 ref 所标识的结点

```jsx
myRef = React.createRef();
```

通过将 真实结点 传入 myRef 可以将真实结点存储在 ref 容器中

```jsx
<div ref={thismyRef}></div>
```

结点会被存储在 ‘current’ 键中，

不能将多个节点存入容器，只能放入一个结点。

## P50

React 下只有一个 html 文件

Vue / React 都是写 SPA （Single Page Application) 单页面应用



>  <link *rel*="icon" *href*="%PUBLIC_URL%/favicon.ico" />

**用于引入图标**

其中 **%PUBLIC_URL%** 是 React 脚手架里的一个关键词

代表 public 文件夹的路径

优势体现在使用路由的时候

也可以使用相对路径

> \<meta name="viewport" content="width=device-width, initial-scale=1" />

**开启理想视口 ideal viewport，做移动端网页的适配**

> \<meta name="theme-color" content="#000000" />

用于配置安卓平台上 浏览器页签 / 地址栏 的颜色

>  <meta
>
>    *name*="description"
>
>    *content*="Web site created using create-react-app"
>
>   />

用于SEO优化，描述网页信息

>  <link *rel*="apple-touch-icon" *href*="%PUBLIC_URL%/logo192.png" />

**apple-touch-icon**	iPhone 添加网页至主屏幕时显示的图标

>  <link *rel*="manifest" *href*="%PUBLIC_URL%/manifest.json" />

**应用加壳时的配置文件**

配置 图标，名字，应用权限, api

用于 React Native

> \<noscript>You need to enable JavaScript to run this app.\</noscript>

浏览器不支持 JavaScript 时显示的应用。

#### robots.txt

爬虫规则

#### <React.StrictMode>

用于检查内部子组件编写是否合理，

比如一些要弃用的写法会被检查出来

与 ES5 的严格模式 没有关系



图片也可以作为一个模块引入

#### reportWebVitals 

页面渲染性能 的 记录/分析，

使用了 web-vitals 库

#### setupTest.js

用于组件测试

## P52

 React 脚手架构建

- public 存放静态资源
  - index.html
- src 存放源代码
  - index.js 入口文件

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220318232646726.png" alt="image-20220318232646726" style="zoom:80%;" />

- 使用分别暴露 导出 Component。
  - 因此可以通过 import {Component} from ‘react’ 的方式引入分别暴露的属性。
  - 分别暴露应该在要暴露的组件前面直接写 export
- 使用默认暴露导出 整个 React
  - 因此可以通过 import React from ‘react’，再通过React.Component 获取 React 内部的 Component 

一个组件文件夹下方可以有多个 js 文件

区分组件 与 普通 js 文件可以通过 将组件js文件修改后缀名为 **jsx**

App.js 也可以修改后缀名，不影响

引入时 js 与 jsx 都可以省略后缀名，可以只写文件名

命名为 index.js/css 可以直接省略文件名

## P53

### CSS 全局污染

两个编写了同 class 名的 css 文件会发生全局污染，因为经过 webpack 打包后会合并为一个 css 文件，因此有一个属性会被覆盖。

##### **解决方案**：

① 可以将 css 模块化，通过给 css 文件后缀前加上 .module即可

index.module.css

js 引入方式：

import css1 from ‘./index.module.css’

jsx 使用方式

\<tag className={css1.title}/> 

② 可以使用 less

## Todo-list 项目

#### defaultChecked 受控组件

使用 checked={true} 而且不提供 onChange 事件，checkbox将成为只读的

#### onKeyUp 

替代 onKeyDown, 避免出现长按的情况。

代表按键按完。

#### e.target 替代 ref

用于绑定事件的元素，与要操作的元素为同一个时。

#### state 数组添加元素

不能使用数组方法，如 unshift / push ，因为 setState 不支持。

可以使用 […oldArr, newItem]

#### 检查输入字段为空

if(value.trim() === ‘’)

#### 添加实例监听事件，并处理对应实例

可以使用函数柯里化，即通过闭包获取实例 id，

```js
handleEvent = (id) => {
​	return (event)=> {
​	}
}
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220319155247861.png" alt="image-20220319155247861" style="zoom:80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220319162106978.png" alt="image-20220319162106978" style="zoom:80%;" />

#### 删除数组对象元素

使用fliter

#### 条件统计

##### 1.reduce

```js
arr.reduce((pre,cur)=>pre + (cur.done?1:0),0)
```

##### 2.filter

```
arr.filter((item) => item.done).length
```

#### defaultChecked & checked

defaultChecked 只在第一次渲染时生效，后续不改变

checked 必须同时监听 onChange 事件

## GitHub 搜索项目

### PubSub 消息订阅与发布

用于在兄弟间进行通信。

#### subsribe

```js
PubSub.subscribe('订阅的消息'，callback)
```

其中 callback = function(msg , data)

**msg**：订阅的消息， 用于同一个回调区分不同的订阅

**data**：发布消息时携带的数据

#### publish

发布消息

```js
PubSub.publish('消息', data)
```

### fetch

web端，jQuery 和 axios 都是对 xhr 的封装。

axios 在服务端是对 http /  的封装

xhr api 设计使用体验不好，有回调地狱的问题。

#### fetch

promise 风格。

符合关注分离思想。

fetch 无需 xhr ，也可以发送 ajax 请求。



返回的是能否与服务器建立对话的校验结果，

通过调用 response.json() 返回包含 **数据 / 获取数据失败的原因 的promise**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220322134842242.png" alt="image-20220322134842242" style="zoom:80%;" />

进入error分支后，返回了 undefined ，会被包装为一个成功的回调，因此会继续执行下面的 .then

可以通过 返回一个空promise 解决

new Promise 始终处于 pending 状态。

## 路由

#### 1. History.createBrowserHistory()

```
let history = History.createBrowserHistory()
```

通过浏览器 HTML5 的 history 实现，较老的浏览器没有实现，因此不能操作历史记录

####  2. History.createHashHistory()

使用 hash 值实现。

会在 URL 后面新增一个#

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220322221348274.png" alt="image-20220322221348274" style="zoom:80%;" />

通过这种方式添加历史记录，会出现在 #/ 的后边

**锚点跳转**会产生历史记录，但不会引起页面刷新

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220322221553974.png" alt="image-20220322221553974" style="zoom:80%;" />

路由器用于管理路由

### 路由组件 & 一般组件 的区别

1. 写法：
   - 一般组件：\<Demo />
   - 路由组件：\<Route path='/demo' component={Demo} />
2. 存放文件夹：
   - 一般组件：components
   - 路由组件：pages
3. 接收到的 props 不同：
   - 一般组件：写组件标签时传递了什么，就能收到什么
   - 路由组件：三个固定的属性

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220322234410105.png" alt="image-20220322234410105" style="zoom:80%;" />

### NavLink

默认选中的Link项会追加一个 **active** class

可以通过 activeClassName 修改

### Switch

switch 包裹的路由，如果已经匹配到了一个，不会继续向下匹配。



### 多级路径刷新页面样式丢失问题

Localhost:3000 对应 public 文件夹

如果 url 所访问的资源在 public 文件夹中不存在，则返回 public 下的 index.html 文件。

由于 多级路径 http://localhost:3000/a/b

会将 http://localhost:3000/a 作为主机地址去访问资源，而css样式使用了相对路径的方式引入，

因此找不到 css 文件，返回了 index.html 资源。



#### 解决方案：

- 去掉相对路径 ./css/index.css 前面的.符号
- 使用 %PUBLIC_URL% 代替 ./
- 使用 hashRouter ，hash值不会被发送给服务器，也不会被认为是请求资源的路径

### 路由的严格匹配与模糊匹配

- 默认使用模糊匹配，输入路径包含匹配路径，且顺序相同。
- 通过 \<Route **exact={true}** path='/about' component={About}/> 开启严格匹配模式
- 开启严格匹配会导致无法开启二级路由

### Redirect

在 Switch / Router 中没有匹配到 路由 时，将路由重定向至

```js
<Redirect to='/about'/>
```

### 二级路由

二级路由 Link / Route 配置路径需要加上一级路由，

‘/message’ -> ‘/home/message’，

因为路由匹配 按照路由注册的顺序，

因此在一级路由中匹配不到直接写的二级路由，会重定向到 Redirect 的路由。



如果在二级路由中添加了一级路由，则会由于一级路由的 **模糊匹配** 进入到一级路由，然后就可以在一级路由中注册二级路由，并进行路由匹配。

### 路由组件传参

#### ajax请求携带数据的方式

- query ?id=xx&title=xx
- params
- body
  - urlencode
  - json

#### params 方式传递参数给路由组件

传递参数

路由链接：携带参数

注册路由：声明接收

```jsx
<Link to={`/path/${id}`}>
<Switch>
  <Route path='/path/:id' component>{data}</Route>
</Switch>
```

接收参数：

```js
this.props.match.params
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220323202138732.png" alt="image-20220323202138732" style="zoom:80%;" />

### search 参数

路由链接：携带参数

```jsx
<Link to={`/path?id=${id}`}></Link>
```

注册路由时无需声明接收。

```jsx
<Route path='/path' component></Route>
```

接收参数：

接收到的是字符串，需要将开头的问号截取，并转换为对象。

```js
this.props.location.search
```

![image-20220323204226032](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220323204226032.png)

### state 参数

路由链接：

```jsx
<Link to={{pathname:'/path',state={id:id}}}></Link>
```

注册路由时无需声明接收。

接收参数：

```
this.props.location.state || {}
```

![image-20220323204908552](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220323204908552.png)

路径中不会出现数据，

且刷新页面 history 会保存数据

location 为 history 的一个属性。

但如果之后清空了缓存，则数据会丢失，需要接受参数时在后面加入 ||{}

### replace

在 Link 添加 replace={{true}} / replace 属性可以将 push模式 替换为 replace模式

### 编程式路由导航

- this.props.history.goBack()

- this.props.history.goForward()

- this.props.history.go(n)
  - n为正数：前进n步
  - n为负数：后退n步
- this.props.history.push(path,state)
  - push方式压入栈中，会留下历史记录
  - state 参数用于 state方式
- this.props.history.replace(path,state)
  - 以 replace 方式替换栈顶元素

### withRouter

withRouter(class / func)

加工一般组件，让其具备路由组件特有的 Api

withRouter 的返回值是一个新组件。

### BrowserRouter 与 HashRouter 的区别

- 底层原理
  - BrowserRouter 使用 H5 的 history API，不兼容 IE9及以下
  - HashRouter 使用 URL 的 hash值
- path表现
  - BrowserRouter 的路径没有 #
  - HashRouter 路径包含#
- 刷新对路由state参数的影响
  - BrowserRouter 没有影响
  - HashRouter 刷新后会导致路由 state 参数的丢失
- HashRouter可以用于解决路径错误问题

## react-redux

### index.js

```jsx
import {Provider} from 'react-redux'
import store from '..创建的store';

<Provider store={store}>
	<App />
</Provider>
```

通过 Provider 将 store 传给任何需要 store 的地方，即容器组件

使用了 react-redux 之后无需再使用 **store.subsribe** 来更新状态。

```jsx
store.subscribe(()=>{
 ReactDOM.render(
  <React.StrictMode>
   	<BrowserRouter>
   		<App/>
   	</BrowserRouter>
   </React.StrictMode>
  document.getElementById('root')
 );
})
```

### 组件

```jsx
class ZhuJian extends Componnent{
	
}

export default connect(
  // 第一个参数 mapStateToProps
  // 默认会传入 store.getState() 的返回值
  // 该方法返回值为一个对象，作为传递给 UI 组件的状态
  state => ({key:state.value}),
  // 第二个参数 mapDispatchToProps
  // 传给UI组件操作状态的方法
  dispatch => ({
    func:prop => dispatch(funcYouImport(prop))
  })
  // 简写为：
  {
  	func:funcYouImport
  }
)()
```

connect 函数会返回一个容器组件，作为UI组件的父组件，在容器组件内默认渲染 UI 组件，并且会将参数传给UI组件。

在 UI 组件中通过 props 即可获取传过来的参数。

### combineReducers

```
const allReducer = combineReducers({
	state1: state1Reducer,
	state2: state2Reducer,
})
```

合并多个 reducers ，返回值作为 createStore 的参数

connect 中 mapStateToProps 方法中的 state 为多个 reducer 初始状态的 state 的合集。



更新数组时，状态比对的是数组的地址，因此不能直接修改preState数组，不能使用 push / shift 等方法。



reducer 需要是一个纯函数，

不能修改参数！

![image-20220403214833352](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220403214833352.png)

## React Router6

### Switch 变成了 Routes

```jsx
<NavLink className="" to="/page1">A</NavLink>
<NavLink className="" to="/page2">B</NavLink>
<Routes>
	<Route path="/page1" element={<Page1/>}></Route>
	<Route path="/page2" element={<Page2/>}></Route>
</Routes>
```

并且，component={Page} 需要修改为 element={<Page/>}。

之前不包裹 <Switch> 也可以，但 Router6 中不包裹 Routes 会报错。

使用 Switch 的原因是在路由匹配到了之后不会继续向下匹配。Routes 具有相同的效果。

<Route caseSensitive> 匹配时开启大小写区分

### Redirect 变成了 Navigate

没有匹配到路由时进行重定向：

```jsx
<Routes>
	<Route path="/page1" element={<Page1/>}></Route>
	<Route path="/page2" element={<Page2/>}></Route>
	<Route path="/" element={<Navigate to='/page1'/>}></Route>
</Routes>
```

路由切换

```jsx
function Home(){
  const [num, setNum] = useState(1);
  return (
  	<div>
      {num === 2 ? <Navigate to='/page'></Navigate>:<h4>当前num的值是：{num}</h4> }
      <button onClick={()=>setNum(2)}>点击切换路由</button>
    </div>
  )
}
```

只要 Navigate 组件被渲染，就一定会修改路径，切换视图

Navigate 组件一定要有 to 属性，否则会报错。

此外还有一个 replace 属性，即路由切换的模式是 push 还是 replace。

- replace = {true}，replace 模式，
- replace = {false}，push 模式。

### NavLink 高亮效果

NavLink 高亮默认是给组件的 classList 加上一个.active

Router5 中可以通过 activeClassName 进行修改，

Router6 中需要将 className 写成一个函数，

每次点击相应的路由链接，函数都会被调用。

```jsx
<NavLink className={(a) => {console.log(a)}}></NavLink>
```

参数 a 为一个对象：{isActive:true/false},

通过这个参数返回一个值来修改className

```jsx
<NavLink className={({isActive}) => {return isActive ? "link myActive":"link"}} to="/page1"></NavLink>
// 简写如下
<NavLink className={({isActive}) => isActive ? "link myActive":"link"} to="/page2"></NavLink>
```

每个NavLink 都需要写一遍，重复度较高，因此，需要将这个方法定义为一个函数：

```jsx
function computeClassName({isActive}){
	return	isActive ? "link myActive":"link";
}
<NavLink className={computeClassName} to=""></NavLink>
```

### useRoutes 路由表

```jsx
function App(){
	const elements = useRoutes([
		{
			path:'/about',
			element:<About/>
		},
		{
			path:'/home',
			element:<Home/>
		},
		{
			path:'/',
			element:<Navigate to="/about"/>
		}
	]);
  return (
  	<div>
      /* 路由链接 */
      <NavLink></NavLink>
      <NavLink></NavLink>
      
      /*注册路由*/
    	{elements}
    </div>
  )
}

```

其中的数组称为路由表，useRoutes 可以根据路由表生成 <Route> 的结构。

因此原先写 Route 的地方可以直接写 { elements }

可以将路由表定义在单独的文件中暴露，方便统一管理路由。

### 嵌套路由 + 路由表

```jsx
const routes = useRoutes([
		{
			path:'/about',
			element:<About/>
		},
		{
			path:'/home',
			element:<Home/>,
			children:[
        {
          path:'news',
          element:<News />
        },
         {
          path:'messages',
          element:<Messages />
        }
			]
		},
		{
			path:'/',
			element:<Navigate to="/about"/>
		}
	]);
```

```jsx
function App(){
	return(
  	<div>
    	<NavLink to="news">News</NavLink>
      <Outlet></Outlet>
    </div>
  )
}
```

Router6 在NavLink **to 中的路径可以不必带上父级路径**，

- 如果前面加上/ 表示这是根路径。
- ./news 表示在不破坏当前路径的前提下，加上子路径
- 或省略./不写，与上面等同。

NavLink 有一个 **end** 属性，如果子级路由匹配上了，则父级路由会取消高亮效果。

在 return 中的 <Outlet/> 标签指定路由组件的展示位置。



### 路由传递参数

#### params

设置路由链接

```jsx
<Link to={`detail/${id}`}></Link>
```

在路由表中声明接收

```jsx
{
	path:'detail/:id',
	element:<Detail />
}
```

接收参数，

router5 使用 this.props.match.params 取得

router6 在函数组件中要使用 useParams hook：

```jsx
function Detail(){
	const {id} = useParams()
}
```

也可以使用 **useMatch hook**，参数需要传入一个完整的 url，及所有占位的属性，返回的结果与 router5 的 this.props.match 一致:

```jsx
const x = useMatch('/home/message/detail/:id/:title/:content');
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220406125013204.png" alt="image-20220406125013204" style="zoom:80%;" />

#### search 参数

传递参数：

```jsx
<Link to={`detail?id=${id}&title=${title}`}></Link>
```

无需声明接收

接收参数，使用 **useSearchParams** hook：

与 useState 类似，需要用**数组解构**获取：

search ：传递的参数，

**但是是一个对象，需要通过search.get(‘id’)的方式获取具体参数的值**，

 setSearch ：更新收集到的 search 参数的方法，会更新url。

```
function Detail(){
	const [search, setSearch] = useSearchParams();
}
```

也可以像 Router5 一样从 this.props.location 上获取。

使用 useLocation hook，无需传入所有的参数。

```jsx
function Detail(){
	const location = useLocation() 
}
```

#### state 参数

router5 传递 state 参数：

```jsx
<Link to={{
    pathname:'detail',
    state:{}
}}></Link>
```

Router6

直接将 state 传给 state 属性

```jsx
<Link to="detail" state={{
    	id:id,
      title:title
  }}></Link>
```

无需声明接收

接收参数

使用 useLocation hook

```jsx
function Detail(){
	const {state} = useLocation();
}
```

### 编程式路由导航

router5 使用 this.props.history 对象实现，

一般组件可以通过withRouter()调用来获取 history, match, location 属性。

router 6 没有了 withRouter() 任何组件都可以使用 useNavigate hook

#### 路由跳转

第一个参数传入跳转的路由，第二个参数是一个具有 replace 和 state 的对象。.

params，search 参数直接写在路由中，state 参数可以通过第二个参数传递。

```jsx
function App(){
	const navigate = useNavigate();
  navigate("detail",{
    replace:false,
    state:{
      id:id
    }
  })
}
```

#### 前进/后退

通过navigate(1) / navigate(-1)  实现。

### useInRouterContext 

返回一个布尔值，表示是否处于路由导航的上下文中。

### useNavigationType

返回当前的导航类型，如何来到当前页面

- POP 在浏览器直接打开了这个路由组件，刷新页面
- PUSH
- REPLACE

### useOutlet

用来呈现当前组件中渲染的嵌套路由

```
const result = useOutlet()
console.log(result)
```

如果嵌套路由没有挂载，则 result === null

如果挂载了，则展示嵌套的路由对象

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220406132958866.png" alt="image-20220406132958866" style="zoom:80%;" />

### useResolvedPath

解析任意的 url

```jsx
useResolvedPath('/user?id=001&name=zirina#abc')
//{pathname:'/user', search:'?id=001&name=zirina',hash:'#abc'}
```

## Hook

### State Hook

```
const [state, setState] = React.useState(initValue);
```

参数：初始化时指定的值在内部作缓存，

返回值：包含两个元素的数组，

第一个为内部当前状态值，第二个为更新状态值的函数。

**修改状态：**

```
setState(newValue) 
```

直接指定新的状态值，会覆盖原先的状态

```
setState(value => newValue)
```

接收原先的状态值，返回值会作为新的状态值覆盖原先的状态。

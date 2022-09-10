# Vue Router

## 入门

### `router-link`

用于创建链接，使得 Vue Router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。

- 当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值 `.router-link-active`。

### `router-view`

显示与 URL 对应的组件，将这个组件嵌入在你的布局中。



创建路由实例的方式：

- `Vue Router v4` ：

  - ```js
    const router = VueRouter.createRouter({
    	history: VueRouter.createWebHashHistory(),
    	routes, // 使用路由表
    })
    ```

- `Vue Router v3`：

  - ```js
    const router = new VueRouter({
    	routes // 路由表
    })
    ```

    

```js
// 1. 定义路由组件
const Home = { template: '<div>Home</div>'}
const About = { template: '<div>About</div>'}

// 2. 定义路由表
const routes = [
  { path:'/', component: Home},
  {	path:'/about', component: About},
]

// 3. 创建路由实例并传递 路由表 配置
const router = VueRouter.createRouter({
  // 内部提供了 history 模式的实现，这里使用 hash 模式
  history: VueRouter.createWebHashHistory(),
  routes,
})

// 4. 创建并挂载根实例
const app = Vue.createApp({})
app.use(router)	// 确保使用路由实例 router 使整个应用支持路由

app.mount("#app")

// vue2+ :
const app = new Vue({
  router
}).$mount('#app')
```

- 通过使用 `app.use(router)`，
  - 我们可以在 **任意组件** 中通过 `this.$router` 的形式访问 **路由实例** `router`。
  - 以 `this.$route` 的形式访问 **当前路由**。
- `this.$router` 和 `router` 实例完全相同。
  - 使用 `this.$router` 是因为，不想在每个需要操作路由的组件中都导入路由。
- 要在 `setup` 函数中访问路由，请调用 `useRouter` 或 `useRoute` 函数。

```js
export default {
	computed: {
		username() {
			return this.$route.params.username
		}
	},
	methods: {
		goBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
		},
    goToDashboard(){
      if(isAuthenticated) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    }
	}
}
```

## 动态路由匹配

需要将给定匹配模式的路由映射到同一个组件。

在 Vue Router 中，我们可以在路径中使用一个 **动态字段** 来实现，称之为 **路径参数**：

```js
const User = {
	template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [
	{ path: '/users/:id', component: User }
]
```

路径参数用冒号 `:` 表示。

- 当一个路由被匹配时，它的 `params` 值将在每个组件中以 `this.$route.params` 的形式暴露出来。
-  可以在同一个路由中设置多个 路径参数，会映射到 `$route.params` 上的相应字段。

`$route` 对象还公开了其他有用的信息，如：

- `$route.query`：URL 中的参数
- `$route.hash`

### 响应路由参数的变化

如果使用带有参数的路由，从一个页面导航到另一个页面，映射的组件为同一个时，**相同的组件实例将被重复使用**。

- 意味着，组件的生命周期钩子不会被调用。

要对同一个组件中参数的变化做出响应的话，

① 可以简单地 watch `$route` 对象上的任意属性：

```js
// 💡vue3
const User = {
	template:'...',
	created() {
		this.$watch(
			() => this.$route.params,
			(toParams, previousParams) => {
				// 对路由变化做出响应……
			}
		)
	}
}
// 💡vue2
const User = {
  template:'...',
  watch:{
    $route(to, from) {
      // 对路由变化做出响应……
    }
  }
}
```

② 使用 `beforeRouteUpdate` 导航守卫，它也可以取消导航：

```js
// 💡vue3
const User = {
	template: '...',
	async beforeRouteUpdate(to, from) {
		// 对路由变化做出响应...
		this.userData = await fetchUser(to.params.id)
	}
}
// 💡vue2
const User = {
  template: '...',
  beforeRouteUpdate(to, from, next) {
    // 对路由变化做出响应...
    // 不要忘记调用 next()
  } 
}
```



### 捕获所有路由或 404 Not found 路由

`Vue Router v4`:

**常规参数** 只匹配 url 片段之间的字符，用 `/` 分隔。

如果我们想匹配 **任意路径**，我们可以使用自定义的 **路径参数 正则表达式**：

```js
const routes = [
	// 匹配所有内容并将其放在 $route.params.pathMatch
	{ path: '/:pathMatch(.*)*', name:'NotFound', component: NotFound },
  // 匹配以 `/user-` 开头的所有内容
  // 并将其放在 $route.params.afterUser 下
	{ path: '/user-:afterUser(.*)', component: UserGeneric }
]
```

- 在括号之间使用自定义正则表达式

- 可以将路径参数标记为可选可重复：

  - 在需要的时候，可以通过将 `path` 拆分为一个数组，直接导航到路由：

  - ```js
    this.$router.push({
    	name:'NotFound',
      // 删除第一个字符，避免目标 URL 以 '//' 开头。
    	params: { pathMatch: this.$route.path.substring(1).split('/')},
    	query: this.$route.query,
    	hash: this.$route.hash,
    })
    ```

`Vue Router v3` :

想匹配任意路径，可以使用通配符（`*`）。

- 含有通配符的路由应该放在最后。
- 路由 `{ path: '*' }` 通常用于客户端 404 错误。
- 当使用一个通配符时，`$route.params` 内会自动添加一个名为 `pathMatch` 参数。它包含了 URL 通过通配符被匹配的部分：

**高级匹配例子：**

https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js

**匹配优先级：**

同一个路径可以匹配多个路由。

此时匹配的优先级就按照路由的定义顺序：路由定义的越早，优先级就越高。

```js
const routes = [
	// 匹配所有路径
	{	path: '*' },
	// 会匹配以 '/user-' 开头的任意顺序
	{ path: '/user-*' }
]
```

```js
this.$router.push('/user-admin') // 匹配路由: '/user-*'
this.$route.params.pathMatch // 'admin'

this.$router.push('/non-existing') // 匹配路由: '*'
this.$route.params.pathMatch // '/non-existing'
```

## 路由的匹配语法

- 静态路由： /about
- 动态路由： /users/:userId

### 在参数中自定义正则

当定义像 `:userId` 这样的参数时，我们内部使用以下的正则表达式 `[^/]+` （至少有一个字符且不能有斜杠）来从 URL 中提取参数。

两个路由 `/:orderId` 和 `/:productName` 会匹配完全相同的 URL，我们需要有一种方法来区分它们。

- 在路径中添加一个静态部分：

  ```js
  const routes = [
  	{ path: '/o/:orderId' },
    { path: '/p/:productName' }
  ]
  ```

- 不想添加静态部分。由于 `orderId` 总是一个数字，而 `productName` 可以是任何东西：

  ```js
  const routes = [
  	// 仅匹配数字
  	{ path: '/:orderId(\\d+)'},
    { path: '/:productName' },
  ]
  ```

  - 其中 `\\d+` 第一个 `\` 为 **转义反斜杠（`\`）**。
  - `routes` 数组的顺序并不重要。

### 可重复的参数

如果你需要匹配具有多个部分的路由，如 `/first/second/third` ：

- `*` 参数可重复 0 个或多个
- `+`  参数可重复 1 个或多个

```js
const routes = [
	{ path: '/:chapters+' }, // 匹配 /one, /one/two, /one/two/three 等
	{ path: '/:chapters*' }, // 匹配 /, /one, /one/two, /one/two/three 等
]
```

将为你提供一个 **参数数组**，而不是一个字符串，

并且在使用 **命名路由** 时也需要你传递一个数组。

```js
const routes = [{ path: '/:chapters*', name:'chapters'}]

// 产生 /
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 产生 /a/b
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
```

```js
const routes = [{ path: '/:chapters+', name:'chapters'}]
// 抛出错误，因为 chapters 为空
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
```

也可以通过 **在右括号后** 添加它们与**自定义正则**结合使用：

```js
const routes = [
	{ path: '/:chapters(\\d+)+' }, // 匹配 /1, /1/2 ...
	{ path: '/:chapters(\\d+)*' }, // 匹配 /, /1, /1/2 ...
]
```

### Sensitive 与 strict 路由配置

默认情况下，所有路由是**不区分大小写**的，并且能匹配**带有或不带有尾部斜线**的路由。

例如， 路由 `/users` 将匹配 `/users` 、`/users/` 甚至 `/Users/`。

这种行为，可以通过 `strict` 和 `sensitive` 选项来修改。

- 既可以应用在整个全局路由上，又可以应用在当前路由上
- 当 `strict: true` ，不匹配带有尾部斜线的路由
- 当 `sensitive: true` ，路径大小写敏感

```js
const router = createRouter({
 	history: createWebHistory(),
 	routes: [
 		{ path: '/users/:id', sensitive: true },
  	{ path: '/users/:id?'}
 	],
  strict: true, // 应用到整个路由
})
```

### 可选参数

通过使用 `?` 修饰符（0 个或 1 个）将一个参数标记为可选：

-  `*` 在技术上也标志着一个参数是可选的，但 `?` 参数不能重复。

```js
const routes = [
	{ path: '/users/:userId?' }, // 匹配 /users 和 /users/zirina
	{ path: '/users/:userId(\\d+)?'}, // 匹配 /users 和 /users/41
]
```

  ## 嵌套路由

一些应用程序的 UI 由多层嵌套的组件组成。

可以使用 Vue Router 的嵌套路由配置来表达这种关系。

```html
<div id="app">
	<router-view></router-view>
</div>
```

```js
const User = {
	template:`
  <div class="user">
  	<h2>User {{ $route.params.id }}</h2>
  	<router-view></router-view>
  </div>`,
}

const routes = [
  { 
  	path: '/user/:id', 
    component: User,
    children: [
      // 当 /user/:id 匹配成功
      // UserHome 将被渲染到 User 的 <router-view> 内部
      { path: '', component: UserHome },
      {
        // 如果 /user/:id/profile 匹配成功
      	// UserProfile 将被渲染到 User 的 <router-view> 内部
        path:'profile',
        component: UserProfile, 
      },
      {
        path:'posts',
        component: UserPosts,
      }
    ]
  }
]
```

顶层的 `router-view` 渲染顶层路由匹配的组件。

一个被渲染的组件也可以包含自己嵌套的 `<router-view>`。要将组件渲染到这个嵌套的 `router-view` 中，需要在路由中配置 `children`。

**以 `/` 开头的嵌套路径会被当作根路径。**

- 可以充分的利用嵌套组件，而无需设置嵌套的路径。

### 嵌套的命名路由

在处理命名路由时，你通常会给子路由命名：

- 这将确保导航到 `/user/:id` 时始终显示嵌套路由。

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

如果希望导航到命名路由而不导航到嵌套路由：命名父路由

- 但重新加载页面将始终显示嵌套的子路由，
- 因为它被视为指向路径 `/users/:id` 的导航，而不是命名路由

```js
const routes = [
	{
    path: '/user/:id',
    name: 'user-parent',
    component: User,
    children: [{ path: '', name: 'user', component: UserHome}]
  }
]
```



## 编程式导航

除 `<router-link>` 定义导航链接，还可以借助 `router` 的实例方法，编写代码来实现。

### 导航到不同的位置 `router.push`

向 `history` 栈添加一个新的记录。

- 当用户点击浏览器后退按钮，可以回到之前的 URL。
- 当你点击 `<router-link>` 时，内部会调用这个方法。



参数可以是一个 **字符串路径**，或者是一个描述地址的**对象**。

- 如果对象提供了 `path` ， `params` 会被忽略，`query` 不会。
- 因此 `params` 一般与 `name` 一起使用，会自动进行 URL 编码。
  - 指定 `params` 时，可提供 `string` 或 `number` 参数（或者对于可重复的参数提供一个数组）。任何其他类型都会被自动**字符串化**。 
  - 对于可选参数，可以提供一个**空字符串**来跳过。

```js
router.push('/users/eduardo')
router.push({ path: '/users/eduardo' })

// 命名路由，并带上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```



属性 `to` 和 `router.push` 接受的对象种类相同，所以两者的规则完全相同。

`router.push` 和所有其他导航方法都会 **返回一个 Promise**。



[Vue Router v3] `router.push` 、`router.replace` 提供可选的 `onComplete`、`onAbort` 回调作为第二个和第三个参数。

- 这些回调会在导航**成功完成**（所有的异步钩子被解析之后） 
- 或**终止**（导航到相同的路由，在当前导航完成之前导航到另一个不同的路由）的时候调用。

 如果目的地和当前路由相同，只有参数发生了改变，你需要使用 `beforeRouteUpdate` 来响应这个变化 ( 比如抓取用户信息 )。 

### 替换当前位置 `router.replace`

在导航时，不会向 history 添加新记录，而是替换当前的记录。

也可以直接在传递给 `router.push` 的 `routeLocation` 对象中添加一个属性 `replace:true` :

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

|              声明式               |       编程式        |
| :-------------------------------: | :-----------------: |
|     `<router-link :to="...">`     |  `router.push(…)`   |
| `<router-link :to="..." replace>` | `router.replace(…)` |

### 跨越历史 `router.go`

该方法采用一个整数作为参数，表示在历史堆栈中前进或后退多少步。

- 类似于 `window.history.go(n)`。
- 如果没有那么多记录，静默失败。

```js
router.go(1) // 向前移动一条记录，与 router.forward() 相同
router.go(-1) // 返回一条记录，与 router.back() 相同
```



`router.push`、`router.replace` 和 `router.go` 是 `window.history.pushState` 、`window.history.replaceState` 和 `window.history.go` 的翻版。



## 命名路由

除了 `path` 之外，你还可以为任何路由提供 `name`。这有以下优点：

- 没有硬编码的 URL 
- `params` 的自动编码 / 解码
- 防止你在 url 中出现打字错误
- 绕过路径排序 

```js
const routes = [
	{
		path: '/user/:username',
		name: 'user',
		component: User
	}
]
```

要链接到一个命名的路由，可以向 `router-link` 组件的 `to` 属性传递一个对象：

```html
<router-link :to="{ name: 'user', params: { username: 'erina' }}"></router-link>
```

或者调用 `router.push()`：

```js
router.push({ name:'user', params:{ username: 'erina' } })
```

## 命名视图

**命名视图**：可以同时 (同级) 展示多个视图，而不是嵌套展示。

例如创建一个布局，有 `sidebar` (侧导航) 和 `main` (主内容) 两个视图。

如果 `router-view` 没有设置名字，那么默认为 `default`。

```html
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件：

- 确保正确使用 `components` 配置（要加上 `s`）：

```js
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			components: {
        default: Home,
        LeftSidebar,
        RightSidebar,
			}
		}
	]
})
```

### 嵌套命名视图

可能使用命名视图创建嵌套视图的复杂布局，这时也要命名用到的嵌套 `router-view` 组件。

## 重定向和别名

### 重定向

① 重定向也是通过路由表 `routes` 来配置。

```js
const routes = [{ path: '/home', redirect: '/' }]
```

② 重定向的目标也可以是一个命名路由：

```js
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
```

③ 可以动态返回重定向目标

```js
const routes = [
	{
		path: '/search/:searchText',
		redirect: to => {
      // 接收目标路由作为参数
      // return 重定向的字符串路径 / 路径对象
			return { path: '/search', query: { q: to.params.searchText } }
		},
	},
	{
		path: '/search',
		// ...
	}
]
```

**导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上。** 

在上面的例子中，在 `/home` 路由中添加 `beforeEnter` 守卫不会有任何效果。

在写 `redirect` 的时候，可以省略 `component` 配置，因为没有组件需要被渲染。

- 唯一的例外是嵌套路由：如果一个路由记录有 **`children`** 和 `redirect` 属性，他也应该有 `component` 属性。

### 相对重定向

也可以重定向到相对位置（路径不以 `/` 开头）：

```js
const routes = [
	{
		path: '/users/:id/posts',
		redirect: to => {
			return 'profile'
			// 或者 { path: 'profile' }
		}
	}
]
```

### 别名

将 `/` 别名为 `/home`，意味着当前用户访问 `/home` 时， URL 仍然是 `/home` ，但会被匹配为用户正在访问 `/`。

对应的路由配置为：

```js
const routes = [{ path: '/', component: Homepage, alias: '/home'}]
```

通过别名，可以自由地将 UI 结构映射到一个任意的 URL， 而不受配置的嵌套结构的限制。

- 别名以 `/` 开头，以使嵌套路径中的路径称为绝对路径。
- 也可以用一个数组提供多个别名：

- ```js
  const routes = [
  	{
  		path: '/users',
  		component: UsersLayout,
  		children: [
  			// 将为 3个 URL 呈现 UserList:
  			// - /users
  			// - /users/list
  			// - /people
  			{ path: '', component: UserList, alias: ['/people', 'list']}
  		]
  	}
  ]
  ```

- 如果路由有参数，请确保在任何绝对别名中包含它们：

  ```js
  const routes = [
  	{
      path: '/users/:id', // ⭐
      component: UsersByIdLayout,
      children: [
        { path: 'profile', component: UserDetails, alias: ['/:id', '']} // ⭐
      ]
    }
  ]
  ```

## 路由组件传参

在组件中使用 `$route` 会与路由紧密耦合，这限制了组件的灵活性，因为只能用于特定的 URL。

可以通过 `props` 配置来解除这种行为：

```js
const User = {
	template: '<div>User {{$route.params.id}} </div>'
}
const routes = [{ path: '/user/:id', component: User}]

// 替换为下面的做法：
const User = {
  props:['id'],
  template: '<div>User {{id}} </div>'
}
const routes = [{path:'/user/:id', component: User, props:true}]
```

### 布尔模式

当 `props` 设置为 `true` 时， **`route.params`** 将被设置为组件的 props。

### 命名视图

对于有命名视图的路由，必须为每个命名视图定义 `props` 配置：

```js
const routes = [
	{
		path: '/user/:id',
		components:{ default: User, sidebar: Sidebar},
		props: { default: true, sidebar: false}
	}
]
```

### 对象模式

当 `props` 是一个对象时，它将原样设置为组件 props。 当 props 是静态的时候很有用。

```js
const routes = [
	{
		path: '/promotion/from-newsletter',
		component: Promotion,
		props: { newsletterPopup: false }
	}
]
```

### 函数模式

可以创建一个返回 props 的函数。

- 这允许你将参数转换为其他类型
- 或是将静态值与基于路由的值相结合。

```js
const routes = [
	{
		path: '/search',
		component: SearchUser,
		props: route = > ({ query: route.query.q })
    // URL /search?q=vue 将传递 query:'vue' 作为 props 传给 SearchUser 组件
 	}
]
```

尽可能保持 `props` 函数为无状态的，因为它只会在路由发生变化时起作用。

如果你需要状态来定义 props，请使用包装组件，这样 Vue 才可以对状态变化做出反应。（？）

## 不同的历史模式

在创建 router 实例时， `history` 配置允许我们在不同的历史模式中进行选择。

### Hash 模式

hash 模式是用 `createWebHashHistory()` 创建的：

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: []
})
```

它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。

- 这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。
- 不过，它在 SEO 中确实有不好的影响。

### HTML5 模式

HTML5 模式通过 `createWebHistory()` 创建：

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
	
	]
})
```

- 由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问，就会得到一个 404 错误。
- 要解决这个问题，只要在服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面。


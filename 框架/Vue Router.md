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

当定义像 `:userId` 这样的参数时，我们内部使用以下的正则表达式 `[^/]+` （至少有一个字符不是斜杠）来从 URL 中提取参数。




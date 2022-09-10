## 导航守卫

主要用于通过跳转或取消的方式守卫导航。

这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

**参数 params 或查询 query 的改变并不会触发进入/离开的导航守卫。**

- 通过观察 `$route` 对象来应对这些变化。
- 可以使用 `beforeRouteUpdate` 的组件守卫。

### 全局前置守卫

可以使用 `router.beforeEach` 注册一个**全局前置守卫**：

```js
const router = createRouter({ ... })
// Vue Router v3 
const router = new VueRouter({ ... })

router.beforeEach((to, from) => {
  // 返回 false 以取消导航
	return false
})
```

- 当一个导航触发时，全局前置守卫按照创建顺序调用。
- 守卫是异步解析执行，此时导航在**所有守卫 resolve 完之前**一直处于**等待中**。

每个守卫方法接收两个参数：

- `to` ：即将要进入的目标（使用标准化的方式）
- `from` ：当前导航正要离开的路由（使用标准化的方式）

可以返回的值如下：

- `false`：取消当前的导航。

  - 如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 `from` 路由对应的地址。

- **一个路由地址**：通过一个路由地址跳转到一个不同的地址。

  - 就像调用 `router.push()` 一样，你可以设置诸如 `replace: true` 或 `name: 'home'` 之类的配置。
  - 当前的导航被中断，然后进行一个新的导航。
  - 如果遇到了意料之外的情况，可能会抛出一个 `Error` 。 这会取消导航并且调用 `router.onError()` 注册过的回调。

  ```js
  router.beforeEach(async (to, from) => {
  	if(
      // 检查用户是否已登录
  		!isAuthenticated &&
      // 避免无限重定向
  		to.name !== 'Login'
  	) {
      // 重定向至登录页面
      return { name: 'Login' }
    }
  })
  ```

- 返回 `undefined` 或返回 `true` ，则导航是有效的，并调用下一个导航守卫。

以上所有与 `async` 函数和 Promise 工作方式一样：

```js
router.beforeEach(async (to, from) => {
	const canAccess = await canUserAccess(to)
	if(!canAccess) return '/login'
})
```

#### 可选的第三个参数 `next`

确保 `next` 在任何给定的导航守卫中都被 **严格调用一次**。

- 它可以出现多于一次， 但是只能在**所有的逻辑路径都不重叠的**情况下，否则钩子永远都不会被解析或报错。

- 错误用例：

  ```js
  router.beforeEach((to, from, next) => {
  	if(to.name !== 'Login' && !isAuthenticated) 
      next({ name: 'Login' })
    // 如果用户未能验证身份，则 'next' 会被调用两次
  	next()
  })
  ```

- `next()` 进入管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed 确认的。
- `next(false)` 中断当前的导航。 URL 地址会被重置到 `from` 路由对应的地址。
- `next('/')` / `next({ path: '/' })`：跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。可以向 `next` 传递任意位置对象。
- `next(error)`：如果传入的 `next` 参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调。



### 全局解析守卫

可以使用 `router.beforeResolve` 注册一个全局守卫。

- 和 `router.beforeEach` 类似，在每次导航时都会触发。
- 但是确保在**导航被确认之前**，同时在**所有组件内守卫和异步路由组件被解析之后，**解析守卫会被正确调用。

```js
// 确保用户可以访问自定义 meta 属性 requiresCamera 的路由：

router.beforeResolve(async to => {
	if(to.meta.requiresCamera) {
		try {
			await askForCameraPermission()
		} catch (error) {
			if(error instanceof NotAllowedError) {
				// 处理错误，然后取消导航
				return false
			} else {
				// 意料之外的错误，取消导航并把错误传给全局处理器。
				throw error
			}
		} 
	}
})
```

### 全局后置钩子

与守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

- 它们对于<u>分析、更改页面标题、声明页面</u>等辅助功能以及许多其他事情都很有用。

```js
router.afterEach((to, from) => {
	sendToAnalytics(to.fullPath)
})
```

 navigation failures 作为第三个参数：

```js
router.afterEach((to, from, failure) => {
	if(!failure) sendToAnalytics(to.fullPath)
})
```

### 路由独享的守卫

可以直接在路由配置上定义 `beforeEnter` 守卫：

> 感觉主要用于修改 URL

```js
const routes = [
	{
		path: '/users/:id',
		component: UserDetails,
		beforeEnter: (to, from) => {
			return false
		}
	}
]
```

`beforeEnter` 守卫只在进入路由时触发。

- 不会在 `params`、`query` 或 `hash` 改变时触发。
- 只有从一个 **不同的路由** 导航时，才会被触发。

也可以将一个函数数组传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用：

- 也可以通过路径 meta 字段 和 全局导航守卫 来实现类似的行为。？

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

### 组件内的守卫

你可以在路由组件内直接定义路由导航守卫（传递给路由配置的）

#### 可用的配置 API

你可以为路由组件添加以下配置：

- `beforeRouteEnter`：在渲染该组件的对应路由被验证前调用
  - 不能访问 this，因为守卫在导航确认前被调用，组件实例还没被创建。
  - 不过可以通过传一个回调给 `next` 来访问组件实例。
  - 在导航被确认时执行回调，并且把**组件实例**作为回调方法的**参数**。
  - **`beforeRouteEnter` 是支持给 next 传递回调的唯一守卫**。
- `beforeRouteUpdate`：在当前路由改变，但是该组件被复用时调用
- `beforeRouteLeave`：在导航离开渲染该组件的对应路由时调用
  - 通常用来预防用户在还未保存修改前突然离开。
  - 该导航可以通过返回 `false` 来取消。

```js
const UserDetails = {
	template:`...`,
	beforeRouteEnter(to, from) {
		// 不能获取组件实例 this
		// 因为当守卫执行时，组件实例还没被创建
    // *在 beforeCreate 生命周期前触发*
    
    // 可以在这个守卫中请求服务端获取数据，当成功获取并能进入路由时，调用 next 并在回调中通过参数访问组件实例进行赋值等操作。
    // （*next 中函数的调用在 mounted 之后*：为了确保能对组件实例的完整访问）。
	},
	beforeRouteUpdate(to, from) {
		// 跳转前后路由对应的组件相同时会被调用
		// 因为此时组件已经挂载好了，导航守卫可以访问组件实例 this
	},
	beforeRouteLeave(to, from) {
		// 可以访问组件实例 this
	}
}
```

### 使用组合 API

可以通过 `onBeforeRouteUpdate` 和 `onBeforeRouteLeave` 分别添加 update 和 leave 守卫。

### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫最能够传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## 路由元信息

可以通过接收属性对象的 `meta` 属性，来将任意信息附加到路由上，如过渡名称，谁可以访问路由等。

并且 `meta` 属性可以在 **路由地址** 和 **导航守卫** 上被访问到。

### meta 属性配置

```js
const routes = [
	{
		path: '/posts',
		component:PostsLayout,
		children: [
			{
				path: 'new',
				component: PostsNew,
				// 需要经过身份验证
				meta: { requiresAuth: true }
			},
			{
				path: ':id',
				component: PostsDetail,
				// 任何人都可以
				meta: { requiresAuth: false }
			}
		]
	}
]
```

### 访问 meta 属性

**路由记录**：`routes` 配置中的每个路由对象。

路由记录可以是嵌套的，因此当一个路由匹配成功后，它可能匹配多个路由记录。

例如，`/posts/new` 这个 URL 将会匹配父路由记录（`path: '/posts'`） 以及子路由记录 （`path: 'new'`）。

一个路由匹配到的所有路由记录会暴露为 `$route` 对象（还有在导航守卫中的路由对象）的 `$route.matched` 数组。

- 我们需要遍历这个数组来检查路由记录中的 `meta` 字段

- 但是 Vue Router 还为你提供了一个 `$route.meta` 方法，是一个非递归合并所有 `meta` 字段的（从父字段到子字段）的方法。

  ```js
  router.beforeEach((to, from) => {
  	// 而不是去检查每条路由记录
    // to.matched.some(record => record.meta.requiresAuth)
  	if(to.meta.requiresAuth && !auth.isLoggedIn()) {
  		return {
  			path: '/login',
        // 保存我们所在的位置，以便以后再来。
  			query: { redirect: to.fullPath },
  		}
  	}
  })
  ```

### TypeScript

可以通过扩展 `RouteMeta` 接口来输入 meta 字段：

```tsx
import 'vue-router'
declare module 'vue-router' {
	interface RouteMeta {
		isAdmin?:boolean
		requiresAuth:boolean
	}
}
```





## 数据获取

有时候，进入某个路由后，需要从服务器获取数据。

例如，在渲染用户信息时，需要从服务器获取用户的数据。可以通过两种方式来实现：

- **导航完成之后获取**：
  - 先完成导航，然后在接下来的组件生命周期钩子中获取数据。
  - 在数据获取期间显示“加载中”之类的指示。
- **导航完成之前获取**：
  - 导航完成前，在路由进入的守卫中获取数据，
  - 在数据获取成功后执行导航。

### 导航完成后获取数据

在组件的 created 钩子中获取数据。

这让我们有机会在数据获取期间展示一个 loading 状态，还可以在不同视图间展示不同的 loading 状态。

```vue
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

```js
export default {
	data() {
		return {
			loading: false,
			post: null,
			error: null,
		}
	},
	created() {
		// watch 路由的参数，以便再次获取数据
		this.$watch(
			() => this.$route.params,
			() => {
				this.fetchData()
			},
      // 组件创建完后获取数据
      // 此时 data 已经被 observed 了
      { immediate: true }
		)
	},
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if(err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    },
  }
}
```

### 在导航完成前获取数据

在组件的 `beforeRouteEnter` 守卫中获取数据，当数据获取成功后只调用 `next` 方法：

```js
export default {
	data() {
		return {
			post: null,
			error: null,
		}
	},
	beforeRouteEnter(to, from, next) {
		getPost(to.params.id, (err, post) => {
			next(vm => vm.setData(err, post))
		})
	},
  // 路由改变前，组件就已经渲染完了
  async beforeRouteUpdate(to, from) {
    this.post = null
    try  {
      this.post = await getPost(to.params.id)
    } catch (error) {
      this.error = error.toString()
    }
  }
}
```

在为后面的视图获取数据时，用户会停留在当前的界面，因此建议在数据获取期间，显示一些进度条或者别的指示。如果数据获取失败，同样有必要展示一些全局的错误提醒。

## Vue Router 和 组合式 API

我们需要使用一些新的函数来代替访问 this 和组件内导航守卫。

### 在 `setup` 中访问路由和当前路由

因为我们在 `setup` 里面没有访问 `this`，所以我们不能再直接访问 `this.$router` 或 `this.$route`。 

作为替代，我们使用 `useRouter` 函数：

```js
import { useRouter, useRoute } from 'vue-router'

export default {
	setup() {
		const router = useRouter()
		const route = useRoute()
		
		function pushWithQuery(query) {
			router.push({
				name: 'search',
				query: {
				 ...route.query
				}
			})
		}
	}
}
```

`route` 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该避免监听整个 `route` 对象。在大多数情况下，你应该直接监听你期望改变的参数。

```js
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const userData = ref()
  	
    watch(
    	() => route.params.id,
      async newId => {
        userData.value = await fetchUser(newId)
      }
    )
   }
}
```

在模板中，我们仍然可以访问 `$router` 和 `$route`，所以不需要在 `setup` 中返回 `router` 或 `route`。

### 导航守卫

虽然你仍然可以通过 `setup` 函数来使用组件内的导航守卫，但 Vue Router 将 **更新** 和 **离开守卫** 作为 组合式 API 函数公开：

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

export default {
	setup() {
		onBeforeRouteLeave((to, from) => {
			const answer = window.confirm('...')
			if(!answer) return false
		})
		
		const userData = ref()
		
		onBeforeRouteUpdate(async (to, from) => {
			if(to.params.id !== from.params.id) {
				userData.value = await fetchUser(to.params.id)
			}
		})
	}
}
```

组合式 API 守卫也可以用在**任何由 `<router-view>` 渲染的组件**中， 它们不必像组件内守卫那样直接用在路由组件上。（？）



### `useLink`

Vue Router 将 **RouterLink** 的**内部行为**作为一个**组合式 API 函数**公开。提供了与 `v-slot` API 相同的访问属性：

```js
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

export default {
	name: 'AppLink',
	props: {
    // 如果使用 TypeScript，请添加 @ts-ignore
		...RouterLink.props,
		inactiveClass:String,
	},
  
  setup(props) {
    const { route, href, isActive, isExactActive, navigate } = useLink(props)
    
    const isExternalLink = computed(
    	() => typeof props.to === 'string' && props.to.startsWith('http')
    )
    
    return { isExternalLink, href, navigate, isActive }
  }
}
```


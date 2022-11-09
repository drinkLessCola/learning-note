## 创建一个 Vue 应用

### 应用实例

```js
import { createApp } from 'vue'

const app = createApp({
	// 根组件选项
})
```

### 根组件

如果使用的是单文件组件，可以直接从另一个文件中导入根组件：

```js
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)
```

### 挂载应用

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

应用实例在调用了 `.mount()` 方法后才会渲染出来。

该方法接收一个容器：

- 一个实际的 DOM 元素
- CSS 选择器字符串

根组件的内容会被渲染在容器元素里面，容器不会被视为应用的一部分。

`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用。

- 😥**它的返回值是根组件实例而非应用实例**。

### DOM 中的根组件模板

未采用构建流程的情况下使用 Vue 时，可以在挂载容器中直接书写根组件模板：

```html
<div id="app">
	<button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

// 传入 createApp 的是根组件
// createApp 的返回值 app 是应用实例
const app = createApp(/*根组件*/{
	data(){
    return {
      count:0
    }
  }
})
// 返回值是根组件实例
app.mount('#app')
```

根组件没有设置 `template` 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板。

### 应用配置

#### config

应用实例会暴露一个 `.config` 对象允许我们配置一些**应用级的选项**。

- 例如定义一个应用级的错误处理器，它将捕获所有由子组件抛出而未被处理的错误：

  ```js
  app.config.errorHandler = (err) => {
  	// 处理错误
  }
  ```

#### component

应用实例还提供了一些方法来**注册应用范围内可用的资源**，如注册一个组件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

这使得 `TodoDeleteButton` 在应用的任何地方都是可用的。

### 多个应用实例

应用实例不只限于一个。 

`createApp` 允许在同一个页面中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于 **配置** 和 **全局资源** 的**作用域**。

```js
const app1 = createApp({...})
app1.mount('#container1')

const app2 = createApp({...})
app2.mount('#container2')
```

## 模板语法

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并 **应用最少的 DOM 操作**。

也可以结合可选的 JSX 直接手写渲染函数，而不采用模板。这将不会享受到和模板同等级别的编译时优化。

https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes

### 原始 HTML

Mustache 语法会将数据插值为纯文本，而不是 HTML。

若想插入 HTML，需要使用 `v-html` 指令：

- 将此元素的 innerHTML 与 `rawHtml` 属性保持同步。
- 数据绑定将会被忽略。
- 😥不能使用 `v-html` 来拼接组合模板，因为 **Vue 不是一个基于字符串的模板引擎**。应当使用组件作为 UI 重用和组合的基本单元。
- 在网站上动态渲染任意 HTML 非常容易造成 **XSS 漏洞**。

```vue
<span v-html="rawHtml"></span>
```

指令以 `v-` 作为前缀，表明它们是一些由 Vue 提供的特殊 attrivute，为渲染的 DOM 应用特殊的响应式行为。

### Attribute 绑定

不能在 HTML attribute 中使用 Mustache。想要响应式地绑定一个 attribute，应该使用 `v-bind` 指令：

```vue
<div v-bind:id="dynamicId"></div>
```

`v-bind` 指令指示 Vue 将元素的特性与组件的 属性保持一致。

- 如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。
- 简写为`:id="dynamicId"`

### 布尔型 Attribute

依据 true / false 值来决定 **attribute 是否应该存在与该元素上**。

- 当值为 **真值 / 空字符串** 时，元素会包含这个 attribute。
- 为其他假值时 attribute 将被忽略。

```vue
<button :disabled="isButtonDisabled"></button>
```

### 动态绑定多个值

通过不带参数的 `v-bind` ，你可以将一个包含多个 attribute 的 JavaScript 对象绑定到单个元素上：

```js
const objectOfAttrs = {
	id: 'container',
  class: 'wrapper'
}
```

```vue
<div v-bind="objectOfAttrs"></div>
```

### 使用 JavaScript 表达式

```vue
{{ number + 1 }}
{{ ok? 'YES' : 'NO' }}
{{ message.split("").reverse().join('') }}
<div :id="`list-${id}`"></div>
```

这些表达式都会被作为 JavaScript，以组件为作用域解析执行。

在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：

- 在文本插值 Mustache 中
- 在任何 Vue 指令 attribute 的值中

仅支持**单一表达式**，即一段能够被求值的 JavaScript 代码。

#### 调用函数

可以在绑定的表达式中使用一个组件暴露的方法：

- 绑定在表达式中的方法在组件每次更新时都会被**重新调用**。
- ==**方法不应该产生任何副作用**==，如**改变数据**或**触发异步操作**。

```vue
<span :title="toTitleDate(Date)">
	{{ formatDate(date) }}
</span>
```

#### 受限的全局访问

模板中的表达式将被沙盒化，仅能够访问到**有限的全局对象列表**。该列表中会暴露常用的**内置全局对象**，比如 `Math` 和 `Date`。

没有显式包含在列表中的全局对象，将不能在模板内表达式中访问。

- 如用户附加在 `window` 上的属性。
- 可以自行在 `app.config.globalProperties` 上显式地添加它们，供所有的 Vue 表达式使用。

### 指令 Directives

指令是带有 `v-` 前缀的特殊 attribute。 Vue 提供了许多内置指令。

指令的期望值为一个 JavaScript 表达式。

- 除了 `v-for`、`v-on` 、`v-slot`。

指令的任务时在其表达式的值发生变化时响应式地更新 DOM。

#### 参数 Arguments

某些指令需要一个参数，在指令名后通过一个冒号隔开做标识。

- 例如用 `v-bind` 指令来响应式地更新一个 HTML attribute：

  ```vue
  <a v-bind:href="url">...</a>
  <a :href="url">...</a>
  ```

- `v-on` 指令监听 DOM 事件：

  ```vue
  <a v-on:click="handleClick"></a>
  <a @click="handleClick"></a>
  ```

#### 动态参数

同样在指令参数上也可以使用一个 JavaScript 表达式，需要包含在一对方括号内：

```vue
<a v-bind:[attributeName]="url"></a>
<a :[attributeName]="url"></a>
<!-- 也可以将一个函数绑定到动态的事件名称上 -->
<a v-on:[eventName]="doSomething"></a>
<a @[eventName]="doSomething"></a>
```

attributeName 会作为一个 JavaScript 表达式被动态执行，计算得到的值会被用作最终的参数。

##### 动态参数值的限制

动态参数中表达式的值应当是一个字符串，或者是 `null`。

- 特殊值 `null` 意为显式移除该绑定。
- 其他非字符串的值会触发警告。

##### 动态参数语法的限制

动态参数表达式因为某些字符的缘故有一些语法限制，比如**空格**和**引号**，在 HTML attribute 名称中都是不合法的。

- 例如下面的示例：

  ```vue
  <a :['foo' + bar]="value"></a>
  ```

- 如果需要传入一个复杂的动态参数，推荐使用**计算属性**替换复杂的表达式。

但使用 **DOM 内嵌模板** （直接写在 HTML 文件里的模板）时，我们需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写：

```vue
<a :[someAttr]="value"></a>
```

上面的例子会在 DOM 内嵌模板中被转换为 `:[someattr]`。如果组件拥有 someAttr 属性而非 someattr ，这段代码将不会工作。

**单文件组件内的模板不受此限制**。

#### 修饰符 Modifiers

修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。

- 如 `.prevent` 修饰符会告知 `v-on` 指令对触发的事件调用 `event.preventDefault()`：

  ```vue
  <form @submit.prevent="onSubmit"></form>
  ```



![指令语法图](E:\js\java-script-learning-notes\框架\Untitled.assets\directive.69c37117-16629615410802.png)

## 响应式基础

### 声明响应式状态

我们可以使用 `reactive()` 函数创建一个响应式对象或数组：

```vue
<script>
import {reactive} from 'vue'
const state = reactive({count: 0})
</script>
```

响应式对象其实是 **JavaScript Proxy**，其行为表现与一般对象相似。不同之处在于 Vue 能够跟踪响应式对象属性的访问和更改操作。

要在组件模板中使用响应式状态，需要在 `setup()` 函数中定义并返回。

```js
import { reactive } from 'vue'

export default {
  // setup 是一个专门用于组合式 API 的特殊钩子函数
  setup() {
    const state = reactive({ count: 0 })
    
    function increment() {
      state.count++
    }
    // 暴露 state 和 increment 函数到模板
    return { 
      state,
    	increment
    }
  }
}
```

暴露的方法通常会被用作事件监听器：

```vue
<button @click="increment">
	{{ state.count }}
</button>
```

#### `<script setup>`

在 `setup()` 函数中手动暴露大量的状态和 方法非常繁琐。我们可以通过使用构建工具来简化该操作。

当使用**单文件组件（SFC）**时，我们可以使用 `<script setup>` 来大幅度简化代码。

- `<script setup>` 中的**顶层**的 **导入和变量声明** 可以在同一组件的模板中直接使用。
- 可以理解为模板中的表达式与 `<script setup>` 中的代码处在同一个作用域中。

```vue
<script setup>
	import {reactive} from 'vue'
  
  const state = reactive({ count: 0 })
  function increment() {
    state.count++
  }
</script>
<template>
	<button @click="increment">
    {{ state.count }}
  </button>
</template>
```

#### DOM 更新时机

当你更改响应式状态后，DOM 也会自动更新。 DOM 的更新并不是同步的，相反， Vue 将缓冲它们直到更新周期的 “下个时机”，**以确保无论你进行了多少次声明更改，每个组件都只需要更新一次。**

若要等待一个状态改变后的 DOM 更新完成，你可以使用 `nextTick()` 这个**全局 API**：

```vue
import { nextTick } from 'vue'
function increment() {
	state.count++
	nextTick(() => {
		// 访问更新后的 DOM
	})
}
```

#### 深层响应性

在 Vue 中，状态都是默认深层响应式的。这意味着即使**在更改深层次的对象或数组**，你的改动也能被检测到。

```js
import { reactive } from 'vue'

const obj = reactive({
	nested: { count: 0 },
	arr: ['foo', 'bar']
})

function mutateDeeply() {
  obj.nested.count++
  obj.arr.push('baz')
}
```

也可以直接创建一个浅层响应式对象。它们仅在顶层具有响应性，一般仅在某些特殊场景中需要。

https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive

#### 响应式代理 vs. 原始对象

`reactive()` 返回的是一个原始对象的 Proxy，它和原始对象是不相等的：

- 只有代理对象是响应式的，更改原始对象不会触发更新。
- 因此，使用 Vue 响应式系统的最佳实践是 **仅使用你声明对象的代理版本。**

```js
const raw = {}
const proxy = reactive(raw)

// 代理对象和原始对象不是全等的
console.log(proxy === raw) // false
```

为保证访问代理的一致性：

- 对同一个原始对象调用 `reactive()` 总是会返回同样的代理对象。 
- 对一个已存在的代理对象调用 `reactive()` 会返回其本身。

```js
console.log(reactive(raw) === proxy) // true
console.log(reactive(proxy) === proxy) // true
```

依靠深层响应性，响应式对象内的嵌套对象依然是代理：

```js
const proxy = reactive({})
const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

#### `reactive()` 的局限性

`reactive()` API 有两条限制：

1. **仅对对象类型有效**（对象、数组和 `Map`、`Set` 这样的集合类型），而对 `string` 、`number`、`boolean` 这样的原始类型无效。

2. 😵因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须 **始终保持对该响应式对象的相同引用**。这意味着我们不可以随意地“替换”一个响应式对象，这将导致对初始引用的响应性连接丢失。

   ```js
   let state = reactive({ count: 0 })
   // 上面的引用将不再被追踪，响应性连接已丢失。
   state = reactive({ count: 1 })
   ```

   - 因此，当我们将响应式对象的属性**赋值或解构到本地变量**时，或是将**该属性传入一个函数**时，我们会失去响应性。

   - ```js
     const state = reactive({ count: 0 })
     
     // 不影响原始的 state
     let n = state.count
     n++ 
     
     let { count } = state
     count++ 
     
     // 无法跟踪 state.count 的变化
     callSomeFunc(state.count)
     ```

     

### 用 `ref()` 定义响应式变量

`reactive` 的种种限制归根结底是因为 JavaScript 没有可以作用于所有值类型的 “引用” 机制。

为此， Vue 提供了 `ref()` 方法允许我们创建可以使用任何值类型的响应式 ref。

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象：

```js
const count = ref(0)

console.log(count)	// { value: 0 }
console.log(count.value) // 0

count.value ++
console.log(count.value) // 1
```

- ref 的 `.value` 属性也是响应式的。
- 当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。

😣一个包含对象类型值的 ref 可以响应式地替换整个对象：

```js
const objectRef = ref({ count: 0 })
// 响应式的替换
objectRef.value = { count: 1 }
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```js
const obj = {
	foo: ref(1),
	bar: ref(2)
}
// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)
// 仍然是响应式的
const { foo, bar } = obj
```

`ref()` 让我们能创造一种对任意值的引用，并能够在不丢失响应性的前提下传递这些引用。

- 经常用于将逻辑提取到组合函数中。

#### ref 在模板中的解包

当 ref 在模板中作为顶层属性被访问时，它们会自动 “解包”，所以不需要使用 `.value`。

- 仅当 ref 是**模板渲染上下文的顶层属性**时才适用自动解包。
  - foo 是顶层属性， object.foo 不是。
- 如果一个 ref 是文本插值计算的**最终值**，它也将被解包。

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
function increment(){
  count.value++
}
</script>
<template>
	<button @click="increment">
    {{ count }} <!-- 无需.value -->
  </button>
</template>
```

```js
const object = { foo: ref(1) }
{{ object.foo + 1 }} // 不会像预期的那样工作
// 渲染的结果是 [object Object] ，因为 object.foo 是一个 ref 对象。
// 可以通过将 `foo` 改成顶层属性来解决这个问题：
const { foo } = object
{{ foo + 1 }}

{{ object.foo }} // 会自动解包
// 相当于 {{ object.foo.value }}，是文本插值的第一个方便功能
```

#### ref 在响应式对象中的解包

当一个 ref 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样：

- 只有当嵌套在一个深层响应式对象内，才会发生 ref 解包，当其作为浅层响应式对象的属性被访问时不会解包。

```js
const count = ref(0)
const state = reactive({
	count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref：

```js
const otherCount = ref(2)
state.count = otherCount

console.log(state.count) // 2
// 原始 ref 已经和 state.count 失去联系	
console.log(count.value) // 1
```



#### 数组和集合类型的 ref 解包

跟响应式对象不同，当 ref 作为响应式数组或像 Map 这种原生集合类型的元素被访问时，不会进行解包。需要使用 .value

```js
const books = reactive([ref('Vue')])
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
console.log(map.get('count').value)
```

### 响应性语法糖

相对于普通的 JavaScript 变量，我们不得不用相对繁琐的 `.value` 来获取 ref 的值。这是一个受限于 JavaScript 语言限制的缺点。然而，通过编译时转换，我们可以让编译器帮我们省去使用 `.value` 的麻烦。 

```vue
<script setup>
let count = $ref(0)
function increment() {
  // 无需 .value
  count++
}
</script>
```

https://cn.vuejs.org/guide/extras/reactivity-transform.html

## 计算属性

使用计算属性来描述依赖响应式状态的复杂逻辑。

```vue
<script setup>
import { reactive, computed } from 'vue'
  
const author = reactive({
  name: 'John Doe',
  books:[
    '1',
    '2',
    '3'
  ]
})
// 计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
	<p>Has published books:</p>
	<span>{{ publishedBooksMessage }}</span>
</template>
```

`computed()` 方法期望接收一个 getter 函数，返回值为一个 **计算属性 ref**。

- 和其他一般的 ref 类似，你可以通过 `.value ` 访问计算结果。
- 计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 `.value`。

计算属性会自动追踪响应式依赖。

### 计算属性缓存 vs 方法

在表达式中调用一个函数也会获得和计算属性相同的结果。

```vue
<p>{{ calcBookMsg() }}</p>
```

```js
function calcBookMsg() {
  return author.books.length > 0 ? 'Yes' : 'No'
})
```

不同之处在于：

- **计算属性值会基于其响应式依赖被缓存**。
  - 一个计算属性仅会在其响应式依赖更新时才重新计算。
  - 依赖没有发生改变时，无论多少次访问计算属性值，都会返回先前的计算结果，而不用重复执行 getter 函数。
- 方法调用**总是**会在重渲染发生时再次执行函数。

 下面的计算属性永远不会更新，因为 `Date.now()` 并不是一个响应式依赖：

```js
const now = computed(() => Date.now()) 
```



### 可写计算属性

计算属性默认只能通过计算函数得出结果。如果尝试修改一个计算属性，将会收到一个运行时警告。

可以通过同时提供 getter 和 setter 来创建：

```vue
<script setup>
import { ref, computed } from 'vue'
  const firstName = ref('John')
  const laseName = ref('Doe')
  
  const fullName = computed({
    get() {
      return firstName.value + ' ' + lastName.value
    },
    set(newValue) {
      [firstName.value, lastName.value] = newValue.split(' ')
    }
  })
</script>
```

### 最佳实践

#### 计算函数不应有副作用

不要在计算函数中做异步请求或者更改 DOM！

#### 避免直接修改计算属性值

从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的。

## Class 与 Style 绑定

数据绑定的一个常见需求场景是操纵元素的 CSS class 列表和内联样式。

Vue 专门为 `class` 和 `style` 的 `v-bind` 用法提供了特殊的功能增强。

- 表达式的值可以是**字符串、数组、对象**。

### 绑定 HTML class

#### 绑定对象

**① 绑定一个对象字面量：**

```vue
<div :class="{ active: isActive }"></div>
```

- active 是否存在，取决于数据属性 `isActive` 的真假值。

`:class` 指令可以和一般的 `class` attribute 共存。

```js
const isActive = ref(true)
const hasError = ref(false)
```

```vue
<div 
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>

<!-- 渲染结果为 -->
<div class="static active"></div>
```

**② 直接绑定一个对象：**

```js
const classObject = reactive({
	active: true,
	'text-danger': false
})
```

```vue
<div :class="classObject"></div>
```

**③ 绑定一个返回对象的计算属性**

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
	active: isActive.value && !error.value,
	'text-danger': error.value && error.value.type === 'fatal'
}))
```

#### 绑定数组

绑定一个数组来渲染多个 CSS class:

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

```vue
<div :class="[activeClass, errorClass]"></div>
<!-- 渲染的结果： -->
<div class="active text-danger"></div>
```

三元表达式：有条件地渲染某个 class

```vue
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

在数组中嵌套对象：

```vue
<div :class="[{ active: isActive }, errorClass ]"></div>
```

#### 在组件上使用

对于**只有一个根元素的组件**：当你使用了 `class`  attribute 时，这些 class 会被添加到根元素上，并与该元素上已有的 class 合并。

```vue
<!-- 子组件模板 -->
<p class="foo bar"> HI! </p>
<!-- 在使用组件时 -->
<MyComponent class="baz boo" />
<!-- 渲染出的 HTML -->
<p class="foo bar baz boo"> HI! </p>
```

如果组件有**多个根元素**，需要指定哪个根元素来接收这个 class。

- 可以通过组件的 `$attrs` 属性来实现指定：

```html
<!-- 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>

<!-- 在使用组件时 -->
<MyComponent class="baz"></MyComponent>

<!-- 渲染的 HTML -->
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

### 绑定内联样式

#### 绑定对象

`:style` 支持绑定 JavaScript 对象值。

- 推荐使用 camelCase，但也支持 kebab-cased 形式的 CSS 属性 key

  ```js
  const activeColor = ref('red')
  const fontSize = ref(30)
  ```

  ```vue
  <div :style="{ color: activeColor, fontSize: fontSize + 'px'}"></div>
  
  <div :style="{'font-size': fontSize + 'px'}"></div>
  ```

- 直接绑定一个样式对象：

  ```js
  const styleObject = reactive({
  	color: 'red',
  	fontSize: '13px'
  })
  ```

  ```vue
  <div :style="styleObject"></div>
  ```

- 也可以使用返回样式对象的计算属性。

#### 绑定数组

还可以给 `:style` 绑定一个**包含多个==样式对象==的数组**，这些对象会被**合并**后渲染到同一元素上：

```vue
<div :style="[baseStyles, overridingStyles]"></div>
```

#### 自动前缀

`:style` 中使用的需要浏览器特殊前缀的 CSS 属性时， Vue 会自动为他们加上相应的前缀。

- Vue 在运行时检查该属性是否支持在当前浏览器中使用。
- 如果浏览器不支持某个属性，那么将测试加上各个浏览器特殊前缀，以找到哪一个是被支持的。

#### 样式多值

可以对一个样式属性提供多个（不同前缀的）值：

- 数组仅会渲染**浏览器支持的最后一个值**。

```vue
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex']}"></div>
```

## 条件渲染

### `v-if`

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染。

```vue
<h1 v-if="show">show</h1>
```

### `v-else`

也可以使用 `v-else` 为 `v-if` 添加一个 “else 区块”。

- 一个 `v-else` 元素必须跟在一个 `v-if` 或者 `v-else-if` 元素后面，否则它将不会被识别。

```vue
<h1 v-if="yes"></h1>
<h1 v-else>no</h1>
```

 #### `v-else-if`

提供相应于 `v-if` 的 “else if 区块”。可以连续多次重复使用。

### `template` 上的 `v-if`

在 `<template>` 元素上使用 `v-if`，这只是一个不可见的包装器元素，最后渲染的结果并不会包含这个 `<template>` 元素。

### `v-show`

`v-show` 会在 DOM 渲染中保留该元素，仅切换了该元素上名为 `display` 的 CSS 属性。

- `v-show` 不支持在 `<template>` 元素上使用。
- 也不能和 `v-else` 搭配使用。

### `v-if` vs `v-show`

`v-if` ：

- 在切换时，条件区块内的**事件监听器**和**子组件**都会被销毁和重建。
- **惰性的**，如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。

`v-show`:

- 元素无论初始条件如何，始终会被渲染。
- 只有 CSS `display` 属性会被切换。

 `v-if` 有更高的切换开销，`v-show` 有更高的初始渲染开销。

- 如果需要频繁切换，则使用 `v-show` 较好

### `v-if` 和 `v-for`

同时使用 `v-if` 和 `v-for` 是不推荐的，因为这样二者的优先级不明显。

- **当 `v-if` 和 `v-for` 同时存在于一个元素上时， `v-if` 会首先被执行**。
- `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名。

```vue
<li v-for="todo in todos" v-if="!todo.isComplete">
	{{ todo.name }}
</li>

```

这会抛出一个错误，因为属性 todo 此时没有在该实例上定义。

解决办法：

```vue
<template v-for="todo in todos">
	<li v-if="!todo.isComplete">
		{{ todo.name }}
	</li>
</template>


```



## 列表渲染

### `v-for` 

使用 `v-for` 指令基于一个数组来渲染一个列表，`v-for` 指令的值需要使用 `item in items ` 的形式的特殊语法。

- `items` 源数据的数组
- `item` 迭代项的别名

```js
const items = ref([{message: 'Foo' }, { message: 'Bar' }])
```

```vue
<li v-for="item in items">
	{{ item.message }}
</li>
```

在 `v-for` 块中可以完整地访问**父作用域内的属性和变量**。(作用域示例↓)

<img src="E:\js\java-script-learning-notes\框架\Untitled.assets\image-20220913175246670.png" alt="image-20220913175246670" style="zoom: 80%;" />

`v-for` 也支持使用可选的第二个参数表示当前项的位置索引。

- 类似于调用 `forEach((item, index) => {})`

```js
const parentMsg = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

```vue
<li v-for="(item, idx) in items">
	{{ parentMsg }} - {{ idx }} - {{ item.message }}
</li>
```

也可以在定义 `v-for` 的变量别名时使用解构：

```vue
<li v-for="{ message } in items">
	{{ message }}
</li>
<li v-for="({ message }, idx) in items">
	{{ message }} {{ idx }}
</li>
```



多层嵌套的 `v-for` ，作用域的工作方式和函数的作用域很类似。

- 每个 `v-for` 作用域都可以访问到父级作用域：

```vue
<li v-for="item in items">
	<span v-for="childItem in item.children">
		{{ item.message }} {{ childItem }}
	</span>
</li>
```

也可以使用 `of` 作为分隔符来替代 `in` ，这更接近 JavaScript 的迭代器语法：

```vue
<div v-for="item of items"></div>
```

### `v-for` 与对象

可以使用 `v-for` 来遍历一个对象的所有属性。

- 遍历的顺序会基于该对象调用 `Object.keys()` 的返回值来决定。

```js
const myObj = reactive({
	title: 'How to do lists',
	author: 'Zirina',
	date: '2022-09-13'
})
```

```vue
<ul>
  <li v-for="value in myObj">
  	{{ value }}
  </li>
</ul>
```

可选的第二个参数表示属性名，第三个参数表示位置索引：

```vue
<li v-for="(value, key, index) in myObj">
  {{index}}, {{key}}: {{value}}
</li>
```

### 在 `v-for` 里使用范围值

`v-for` 可以直接接收一个整数值。

- `n` 的初值是从 `1` 开始而非 `0`。

```vue
<span v-for="n in 10">{{ n }}</span>
```

### `<template>` 上的 `v-for`

在 `<template>` 标签上使用 `v-for` 来渲染一个包含多个元素的块。

```vue
<ul>
  <template v-for="item in items">
  	<li>{{item.msg}}</li>
		<li class="divider" role="presentation"></li>
  </template>
</ul>
```

### 通过 key 管理状态

Vue **默认**按照 “就地更新” 的策略来更新通过 `v-for` 渲染的元素列表。

当数据项的顺序改变时，**Vue 不会随之移动 DOM 元素的顺序**，而是**就地更新每个元素**，确保它们在原本指定的索引位置上渲染。

默认模式是高效的，但**只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态（如表单输入值）的情况**。



可以提供一个跟踪每个节点的标识，从而**重用和重新排序**现有的元素，需要为每个元素的块提供一个唯一的 `key` attribute：

```vue
<div v-for="item in items" :key="item.id"></div>
```

当使用 `<template v-for>` 时， `key` 应该被放置在这个 `<template> ` 容器上：

```vue
<template v-for="todo in todos" :key="todo.name">
	<li>{{ todo.name }}</li>
</template>
```



推荐为 `v-for` 提供一个 `key` attribute：

- 除非所迭代的 DOM 内容非常简单（不包含组件或有状态的 DOM 元素）
- 或者有意采用默认行为来提高性能。



`key` 绑定的值期望是一个**基础类型的值**，如 **字符串** 或 **number** 类型。

不要使用对象作为 `v-for` 的 `key`。

### 组件上使用 `v-for`

```vue
<MyComp v-for="item in items" :key="item.id" />
```

但是，这不会自动将任何数据传递给组件，因为 **组件有自己独立的作用域**。为了将迭代后的数据传递到组件中，我们还需要传递 props：

不自动将 `item` 注入组件的原因是：

- 这会使组件与 `v-for` 的工作方式紧密耦合。
- 明确其数据的来源可以使组件在其他情况下重用。

```vue
<MyComp v-for="(item, index) in items"
	:item="item"
	:index="index"
	:key="item.id"
/>
```

### 数组变化侦测

#### 变更方法

Vue 能够侦听响应式数组的**变更方法**，并在它们被调用时触发相关的更新。这些变更方法包括：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`



- 变更方法：会对调用它们的原数组进行变更。
- 不可变方法：不会更改原数组，而总是返回一个新数组。

#### 替换一个数组

使用数组的非变更方法时，需要将旧的数组替换为新的。

```js
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

- Vue 不会丢弃现有的 DOM 重新渲染整个列表，而是实现了一些巧妙的方法来最大化对 DOM 元素的重用。
- 因此用另一个包含部分重叠对象的数组来做替换，仍会是一种非常高效的操作。

## 事件处理

### 监听事件

可以使用 `v-on` 指令（简写为 `@`）来监听 DOM 事件，并在事件触发时执行对应的 JavaScript。

事件处理器的值可以是：

- 内联事件处理器：事件被触发时执行的内联 JavaScript 语句。
- 方法事件处理器：一个指向组件上定义的方法的属性名或是路径。

### 内联事件处理器

```js
const count = ref(0)
```

```vue
<button @click="count++">Add</button>
<p>Count is: {{ count }}</p>
```

### 方法事件处理器

方法事件处理器会自动接收原生 DOM 事件并触发执行。

```vue
<button @click="greet">greet</button>
```

```js
const name = ref('Zirina')
function greet(event) {
 alert(`Hello ${name.value}!`)
 
 if(event) alert(event.target.tagName)
}
```

#### 方法与内联事件判断

模板编译器会通过检查 `v-on` 的值是否是合法的 JavaScript 标识符或属性访问路径来断定是何种形式的事件处理器。

- 方法事件处理器：`foo`，`foo.bar`，`foo['bar']`
- 内联事件处理器：`foo()`，`count++`

### 在内联处理器中调用方法

允许我们向方法中传入自定义参数以替代原生事件：

```js
function say(msg) {
	alert(msg)
}
```

```vue
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

### 在内联事件处理器中访问事件参数

可以通过向处理器方法传入特殊的 `$event` 变量，或者使用内联箭头函数，访问原生 DOM 事件。

```vue
<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>

<button @click="(event) => warn('Form cannot be submitted yet.', event)">Submit</button>
```

```js
function warn(message, event) {
	if(event) {
		event.preventDefault()
	}
	alert(message)
}
```

### 事件修饰符

`v-on` 提供了**事件修饰符**。

修饰符是用 `.` 表示的指令后缀，包含以下这些：

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue
<!-- 停止冒泡 -->
<a @click.stop="doThis"></a>
<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>
<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<div @click.self="doThat">...</div>
```

使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的

- `@click.prevent.self` 会阻止**元素及其子元素的所有点击事件的默认行为**
- `@click.self.prevent` 只会阻止对元素本身的点击事件的默认行为



`.capture`、`.once` 和 `.passive` 修饰符与原生 `addEventListener` 事件相对应：

- `.passive` 修饰符一般用于触模事件的监听器，可以用来改善移动端设备的滚屏性能。
- 请勿同时使用 `.passive` 和 `.prevent`，因为 `.passive` 已经向浏览器表明了你**不想阻止事件的默认行为**。 
- 如果同时使用，`.prevent` 会被忽略，并且浏览器会抛出警告。

```vue
<!-- 捕获模式 -->
<div @click.capture="func"></div>

<!-- 点击事件最多被触发一次 -->
<div @click.once="func"></div>

<!-- 滚动事件的默认行为将立即发生，而非等待 onScroll 完成 -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll"></div>
```



### 按键修饰符

可以在 `v-on` / `@` **监听按键事件** 时添加按键修饰符。

仅在`$event.key` 为按键修饰符指定的按键时调用事件处理。

```vue
<input @keyup.enter="submit" />
```

可以直接使用 `keyboardEvent.key` 暴露的按键名称作为修饰符，但需要转为 kebab-case 形式。

```vue
<input @keyup.page-down="onPageDown"/>
```



#### 按键别名

Vue 为一些常用的按键提供了别名：

- `.enter`
- `.tab`
- `.delete` (捕获 “Delete” 和 “Backspace” 两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

#### 系统按键修饰符

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

```vue
<input @keyup.alt.enter="clear"/>
<!-- ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

系统按键修饰符 与 `keyup` 事件一起使用时，只会在**仍然按住 `ctrl`  但松开了另一个键**时被触发。

单独松开 `ctrl`  键将不会触发。

#### `.exact` 修饰符

`.exact` 修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符。

```vue
<button @click.ctrl="onClick"></button>

<!-- 按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick"></button>

<!-- 没有按下任何系统按键时触发 -->
<button @click.exact="onClick"></button>
```

### 鼠标按键修饰符

- `.left`
- `.right`
- `.middle`

## 表单输入绑定

手动连接值绑定和更改事件监听器：

```vue
<input :value="text" @input="event => text = event.target.value">
```

`v-model` 指令简化了这个步骤：

```vue
<input v-model="text">
```

`v-model` 还可以用于各种不同类型的输入：`<textarea>`、`<select>` 元素。

- 文本类型的 `<input>` 和 `<textarea>` 元素会绑定 `value` property 并侦听 `input` 事件。
- `<input type="checkbox">` 和 `<input type="radio">` 会绑定 `checked` property 并监听 `change` 事件。
- `<select>` 会绑定 `value` property 并侦听 `change` 事件。

`v-model` 会忽略任何表单元素上初始的 `value`、`checked`、`selected` attribute。始终将当前绑定的 JavaScript 状态视为数据的正确来源。



### 基本用法

#### 文本

对于需要使用 IME 的语言，`v-model` 不会在 IME 输入还在拼字阶段时触发更新。

```vue
<input v-model="msg" placeholder="edit"/>
```

#### 多行文本

```vue
<textarea v-model="msg" placeholder="edit"></textarea>
```

在 `<textarea>` 中**不支持插值表达式**，请使用 `v-model` 替代。

#### 复选框

单一复选框：绑定布尔类型值。

```vue
<input type="checkbox" id="checkbox" v-model="checked"/>
<label for="checkbox">{{ checked }}</label>
```

多个复选框：绑定到同一个数组或集合的值。

```js
const checkedNames = ref([])
```

```vue
<input type="checkbox" id="a" value="a" v-model="checkedNames"/>
<label for="a">a</label>

<input type="checkbox" id="b" value="b" v-model="checkedNames"/>
<label for="b">b</label>

<input type="checkbox" id="c" value="c" v-model="checkedNames"/>
<label for="c">c</label>
```

`checkedNames` 数组将始终包含所有当前被选中的框的值。



#### 单选按钮

```vue
<input type="radio" id="one" value="One" v-model="picked"/>
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked"/>
<label for="two">Two</label>
```

`picked` 值为选中项的 value。

#### 选择器

<select v-model="selected">
	<option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

单个选择器：

- 如果 `v-model` 表达式的初始值不匹配任何一个选择项，`<select>` 元素会渲染成一个 ”未选择“ 的状态。在 iOS 上，这将导致用户无法选择第一项，因为 iOS 在这种情况下不会触发一个 change 事件。
- 因此，建议提供一个**空值的禁用选项**。

```vue
<select v-model="selected">
	<option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

多值：值绑定到一个数组

```vue
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

### 值绑定

对于单选按钮，复选框和选择器选项，`v-model` 绑定的值通常是静态的字符串（或者**对复选框是布尔值**）：

可以通过使用 `v-bind` 将值绑定到组件实例上的动态数据，并使我们可以将选项值绑定为非字符串的数据类型。

#### 复选框

```vue
<input type="checkbox" v-model="toggle"
			 true-value="yes" false-value="no" />
```

- `true-value` 和 `false-value` 仅支持与 `v-model` 配套使用。
  - `toggle` 属性的值会在选中时被设为 `‘yes’`，取消选中时设为 `‘no’` 。
  - 可以通过 `v-bind` 绑定为其他动态值。
- `true-value` 和 `false-value` 不会影响 `value`  attribute，因为浏览器在表单提交时，**不会包含未选择的复选框**。
  - 要保证这两个值的其中之一被表单提交，请使用单选按钮作为替代。

#### 单选按钮

```vue
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

#### 选择器选项

```vue
<select v-model="selected">
	<option :value="{ number: 123 }">123</option>
</select>
```

`v-model` 同样支持**非字符串类型的值绑定**。



### 修饰符

#### `.lazy`

默认情况下，`v-model` 会在每次 `input` 事件后更新数据。

你可以添加 `lazy` 修饰符来改为在每次 `change` 事件后更新数据。

```vue
<input v-model.lazy="msg"/>
```

#### `.number`

让用户输入自动转换为数字。

- 如果值无法被 `parseFloat()` 处理，那么将返回原始值。
- `number` 修饰符会在输入框有 `type="number"` 时自动启用。

```vue
<input v-model.number="age"/>
```

#### `.trim`

自动去除用户输入内容中两端的空格。

```vue
<input v-model.trim="msg" />
```

## 生命周期钩子

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤：

- 设置好数据侦听，编译模板，挂载实例到 DOM
- 以及在数据改变时更新 DOM。

在此过程中，会运行生命周期钩子。



### 注册周期钩子

- `onMounted` 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码：

  - 当调用 `onMounted` 时， Vue 会自动将**回调函数**注册到当前正在被初始化的组件实例上。
  - 这意味着这些钩子应该在**组件初始化时被同步注册** (在 `setup()` 阶段被同步调用)。

  ```vue
  <script setup>
  import { onMounted } from 'vue'
  
  onMounted(() => {
  	console.log('...')
  })
  </script>
  ```

  - 异步注册时当前组件实例已丢失

  ```js
  setTimeout(() => {
  	onMounted(() => {
  	
  	})
  }, 100)
  ```

  - `onMounted` 的调用不一定要放在 `setup()` / `<script setup>` 内的词法上下文中。
  - 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 `setup()` 就可以。

- `onUpdated`

- `onUnmounted`

![image-20220924141755955](E:\js\java-script-learning-notes\框架\Vue3.assets\image-20220924141755955.png)

## 侦听器

### `watch`

- 在状态变化时执行一些副作用：如更改 DOM。
- 或根据异步操作的结果去修改另一处状态。

可以使用 `watch` 函数在每次响应式状态发生变化时触发回调函数：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('')

// 直接侦听一个 ref
watch(question, async (newQue, oldQue) => {
	try {
    const res = await fetch('https://yesno.wtf/api')
    answer.value = (await res.json()).answer
  } catch (error) {
    answer.value = 'error'
  }
})
</script>
```

#### 侦听数据源类型

`watch` 的第一个参数可以是不同形式的“数据源”：

- ref / 计算属性
- 响应式对象
- getter 函数
- 多个数据源组成的数组

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
	...
})

// getter 函数
watch(
	() => x.value + y.value,
  (sum) => console.log(sum)
)
  
// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(newX, newY)
})
```



不能直接侦听响应式对象的属性值：

```js
const obj = reactive({ count: 0 })
// 错误，因为 watch 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(count)
})
```

解决方法：使用返回该属性的 getter 函数

```js
watch(
	() => obj.count,
	(count) => {
		console.log(count)
	}
)
```

#### 深层侦听器

直接给 `watch()` 传入一个**响应式对象**，会隐式地创建一个深层侦听器

- 该回调函数在所有嵌套的变更时都会被触发

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
	// 在嵌套的属性变更时触发
	// 此时 newVlaue 和 oldValue 指向同一个对象 obj。
})

obj.count++
```

相比之下，一个返回响应式对象的 **getter 函数**，只有在返回不同的对象时，才会触发回调：

```js
watch(
	() => state.someObject,
	() => {
		// 仅当 state.someObject 被替换时触发
	}
)
```

可以给例子显式地加上 `deep` 选项，强制将其转换成深层侦听器：

```js
watch(  
  () => state.someObject,
  (newValue, oldValue) => { 
    // 此处 newValue 和 oldValue 相等
    // 除非 state.someObject 被整个替换
  },
  { deep: true }
)
```

#### 谨慎使用

深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。



### `watchEffect()`

`watch()` 是懒执行的：仅当数据源变化时，才会执行回调。

如果我们希望在创建侦听器时，立即执行一遍回调：

- 如请求一些初始数据，然后在相关状态更改时重新请求数据。

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 立即获取
fetchData()
// 再侦听 url 变化
watch(url, fetchData)
```

可以使用 `watchEffect` 函数来简化上面的代码。

`watchEffect()` 会**立即执行一遍回调函数**，如果这时函数产生了副作用， Vue 会**自动追踪副作用的依赖关系，自动分析出响应源**。

```js
watchEffect(async () => {
	const response = await fetch(url.value)
  data.value = await response.json()
})
```

`watchEffect` 仅会在其**同步**执行期间，才追踪依赖。

在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。

#### `watch` vs. `watchEffect`

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。

它们之间的主要区别是 追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的数据源。
  - 不会追踪任何在回调中访问到的东西。
  - 仅在数据源确实改变时才会触发回调。
  - 会避免在发生副作用时追踪依赖。
- `watchEffect` 会在**副作用发生期间**追踪依赖。
  - 会在同步执行过程中，自动追踪所有能访问到的响应式属性。

### 回调的触发时机

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

默认情况下，用户创建的侦听器回调，都会在 Vue 组件**更新前**被调用。这意味着你在侦听器回调中访问的 DOM 将是 Vue 更新之前的状态。

如果想要**在侦听器回调**中能访问 **Vue 更新后的 DOM**，你需要指明：`flush: 'post'` 选项：

```js
watch(source, callback, {
	flush: 'post'
})

watchEffect(callback, {
	flush: 'post'
})
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'
watchPostEffect(() => {
 // 在 Vue 更新后执行
})
```

### 停止侦听器

在 `setup()` 或 `<script setup>` 中用**同步语句**创建的侦听器，会**自动绑定到宿主组件实例上**，并且**会在宿主组件卸载时自动停止**。

如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，必须手动停止它，以防内存泄漏。

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
import { watchEffect } from 'vue'

const unwatch = watchEffect(() => {})
unwatch()
```

尽可能选择同步创建，如果需要等待一些异步数据，可以使用条件式的侦听逻辑：

```js
const data = ref(null)

watchEffect(() => {
	if(data.value) {
		// 数据加载后执行某些操作
	}
})
```

## 模板引用

使用 `ref` 来直接访问底层 DOM 元素。

```vue
<input ref="input">
```

`ref` 是一个特殊的 attribute，允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。

- 如在组件挂载时将焦点设置到一个 input 元素上
- 或在一个元素上初始化一个第三方库

### 访问模板引用

为了通过组合式 API 获得该模板引用，我们需要声明一个同名的 ref：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const input = ref(null)

onMounted(() => {
	input.value.focus()
})
</script>

<template>
	<input ref="input" />
</template>
```

如果不使用 `<script setup>`，需确保从 `setup()` 返回 ref：

```js
export default {
	setup() {
		const input = ref(null)
		
		return {
			input
		}
	}
}
```

只可以在 **组件挂载后** 才能访问模板引用。如果你想在模板中的表达式上访问 `input`，在初次渲染时会是 `null`。

如果要侦听一个模板引用 ref 的变化，确保考虑到**其值为 `null` 的情况**：

```js
watchEffect(() => {
	if(input.value) {
		input.value.focus()
	} else {
		// 此时还未挂载，或此元素已经被卸载(如通过 v-if 控制)
	}
})
```

### `v-for` 中的模板引用

当在 `v-for` 中使用模板引用时，对应的 ref 中包含的值是一个**数组**，它将在元素被挂载后包含**对应整个列表的所有元素**：

- ref 数组并不保证与源数组相同的顺序。

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([ /* ... */ ])
const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
	<ul>
    <li v-for="item in list" ref="itemRefs">
  		{{ item }}
  	</li>
  </ul>
</template>
```

### 函数模板引用

除了使用字符串值作名字，`ref` attribute 还可以绑定为一个**函数**。

- 会在每次组件更新时都被调用。
- 该函数会收到 **元素引用** 作为其第一个参数：

```vue
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量*/}"
```

- 当绑定的元素卸载时，**函数也会被调用一次，此时的 `el` 参数会是 `null`。**
- 也可以绑定一个组件方法。

### 组件上的 ref

模板引用也可以被用在一个子组件上。

这种情况下**引用中获得的值是组件实例：**

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'
  
const child = ref(null)
onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
	<Child ref="child"></Child>
</template>
```

如果一个子组件使用的是**选项式 API** 或**没有使用** `<script setup>`，被引用的组件实例和**该子组件的 `this`** 完全一致，这意味着**父组件对子组件的每一个属性和方法都有完全的访问权。**

- 大多数情况下，应该首先使用标准的 **props 和 emit** 接口来实现父子组件交互。
- 只有在绝对需要时才使用组件引用。

使用了 `<script setup>` 的组件是**默认私有**的：

- 一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西。
- 除非子组件在其中通过 `defineExpose` 宏显式暴露：

```vue
<script setup>
import { ref } from 'vue'
  
const a = 1
const b = ref(2)

defineExpose({ a, b })
</script>
```

当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }`（ref 都会自动解包，和一般的实例一样）。

## 组件基础

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。在实际应用中，组件常常被组织成层层嵌套的树状结构。

### 定义一个组件

使用构建步骤时，我们会将 Vue 组件定义在一个单独的 `.vue` 文件中，称为单文件组件（简称 SFC）：

- 组件将会以默认导出的形式被暴露给外部。

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
	<button @click="count++">
    You clicked {{count}} times.
  </button>
</template>
```

当不使用构建步骤时，一个 Vue 组件以一个包含 Vue 特定选项的 JavaScript 对象来定义：

- 模板：
  - 是一个内联的 JavaScript 字符串，Vue 会在运行时编译它。
  - 也可以使用 ID 选择器来指向一个元素。
    - 通常是原生的 `<template>` 元素。
    - Vue 会使用其内容作为模板来源。

```js
import {ref} from 'vue'

export default {
	setup() {
		const count = ref(0)
		return {count}
	},
	template: `
		<button @click="count++">
			You clicked me {{count}} times.
		</button>
	`
  // or `template: '#my-template-element'`
}
```

### 使用组件

通过 `<script setup>` 导入的组件在模板中直接可用。

也可以全局地注册一个组件，使得它在当前应用中的任何组件上都可以使用，而不需要额外再导入。

每使用一个组件，就创建了一个新的实例。

- 推荐为子组件使用 `PascalCase` 的标签名
- 可以使用 `/>` 来关闭一个标签。



### 传递 props

Props 是一种特别的 attributes，你可以在组件上声明注册。

使用 `defineProps` 宏：

- `defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。
- 声明的 props 会自动暴露给模板。
- `defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props

```vue
<script setup>
defineProps(['title'])
</script>

<template>
	<h4>{{ title }}</h4>
</template>
```

```js
const props = defineProps(['title'])
console.log(props.title)
```

如果没有使用 `<script setup>`，props 必须以 `props` 选项的方式声明， props 对象会作为 `setup()` 函数的第一个参数被传入：

```js
export default {
	props:['title'],
	setup(props) {
		console.log(props.title)
	}
}
```

默认情况下，所有 prop 都接受任意类型的值。

当一个 prop 被注册后，可以以自定义 attribute 的形式传递数据给它：

```vue
<BlogPost title="something"/>
```

### 监听事件

组件实例提供了一个自定义事件系统。

- 父组件可以通过 `v-on` / `@` 选择性地监听子组件上抛的事件，就像监听原生 DOM 事件那样：

  ```vue
  <BlogPost @enlarge-text="postFontSize += 0.1"/>
  ```

- 子组件可以调用内置的 `$emit` 方法，通过传入事件名称来抛出一个事件：

  ```vue
  <template>
  	<div class="blog-post">
    	<h4>{{ title }}</h4>
      <button @click="$emit('enlarge-text')">Enlarge text</button>
    </div>
  </template>
  ```

可以通过 `defineEmits` 宏来声明需要抛出的事件：

- `defineEmits` 仅可用于 `<script setup>` 之中，并且不需要导入。
- 返回一个等同于 `$emit` 方法的 `emit` 函数。
- 可以被用于在组件的 `<script setup>` 中抛出事件，因为此处无法直接访问 `$emit`。

```vue
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

如果没有使用 `<script setup>`，可以通过 `emits` 选项定义组件会抛出的时间。

可以从 `setup()` 函数的第二个参数，即 setup 上下文对象上访问到 `emit` 函数：

```js
export default {
  emits:['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

### 通过插槽来分配内容

向组件中传递 HTML 片段，可以通过 Vue 的自定义 `<slot>` 元素来实现。

使用 `<slot>` 作为一个占位符，父组件传递进来的内容就会渲染在这里。

### 动态组件

有的场景需要在两个组件间来回切换，比如 Tab 界面。

可以通过 Vue 的 `<component>` 元素和特殊的 `is`  attribute 实现：

- `:is` 的值可以是以下几种：
  - 被注册的组件名
  - 导入的组件对象
- 也可以使用 `is` attribute 来创建一般的 HTML 元素。😣😵

```vue
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。

- 可以通过 `<keepAlive>` 组件强制被切换掉的组件仍然保持 “存活” 的状态。



### DOM 模板解析注意事项

直接在 DOM 中编写模板的情况才会出现下列限制。

以下来源的字符串模板无需考虑这些限制：

- 单文件组件
- 内联模板字符串（`template: '...'`）
- `<script type="text/x-template">`

#### 大小写区分

HTML 标签和属性名是不区分大小写的，浏览器会将任何大写的字符解释为小写。

- 当使用 DOM 内的模板时，无论是 Pascal Case 形式的组件名称、camelCase 形式的 prop 名称还是 v-on 的事件名称，**都需要转换为相应等价的 kebab-case 形式。**

```js
const BlogPost = {
	props:['postTitle'],
	emits:['updatePost'],
	template:`
		<h3>{{postTitle}}</h3>
	`
}
```

```vue
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

#### 闭合标签

Vue 模板解析器支持任意标签使用 `/>` 作为标签关闭的标志。

然而在 DOM 模板中，我们必须显式地写出关闭标签。

- 因为 HTML 只允许一小部分特殊的元素省略其关闭标签，如 `<input>` 和 `<img>`。
- 对于其他的元素来说，如果省略了关闭标签，原生的 HTML 解析器会认为开启的标签永远没有结束。

#### 元素位置限制

某些 HTML 元素对于放在其中的元素类型有限制，如 `<ul>`, `<ol>`, `<table>` 和 `<select>`。

相应的，某些元素仅在放置于特定元素中时才会显示，如 `<li>`, `<tr>` 和 `<option>` 。

```vue
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义组件将作为无效的内容被忽略。

- 可以使用 `is`  attribute 作为一种解决方案：

  ```vue
  <table>
    <tr is="vue:blog-post-row"></tr>
  </table>
  ```

- 使用在原生 HTML 元素上时， `is` 的值必须加上前缀 `vue:` 才可以被解析为一个 Vue 组件。

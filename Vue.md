### 插值语法

```
<div>{{prop}}</div>
```

给标签体（innerHTML）动态地绑定值

### 指令语法

```
<div v-bind:key="prop"></div>
```

用于给标签的attribute特性动态的绑定值

上述都可以读取 data 中的所有值，在语法中的都是 JS 表达式

### el 的两种写法

```
new Vue({
	el:"#root",
	data:{}
})
```

```
const v = new Vue({});
v.$mount('#root')
// 是原型链上的方法
```

### data 的两种写法

```vue
new Vue({
	el:
	data:{
		k:v,
	}
})
```

```vue
new Vue({
	data:function(){
		return {
			k:v,
		}
	}
	// or
	data(){
		console.log(this);
		return {
			k:v,
		}
	}
})
```

普通函数，函数中的 this 值指向 Vue 实例。

箭头函数，指向初始化时上一级作用域的 this，不再指向Vue实例。

### MVVM 模型

- **model 数据**
  - 我们在 Vue 实例中定义的 data 对象中的键值对

- **View 视图**
  - 我们写的模板

- **View Model 视图模型**
  - 即 vue 实例，负责将 model 数据绑定到 view 视图，以及监听 view 视图发生的变化并作出相应。

data 数据之所以能够通过 插值语法 展示到页面上，

**配置对象**传入的 data，会赋值给 Vue 实例的 **_data** 属性，即 **vm.\_data = options.data**

- 配置对象即通过构造函数创建一个 Vue 实例时，传入的对象

Vue模板 能够访问到所有 Vue 实例以及原型链上的属性。



### 实现数据代理

数据代理：通过一个对象代理对另一个对象中属性的操作。

使用 Object.defineProperty(obj, key, {描述符对象}) 定义一个访问器属性：

```js
let num = 1;
let obj = {
	
}

Object.defineProperty(obj, 'value', {
	get(){
		return num;
	}
	set:function(value){
		num = value;
	}
})
```

之后访问 obj.value 时，返回的就是 num 的值，

且修改 obj.value 会修改 num 的值。

#### Object.defineProperty()

Object.defineProperty(obj, key, {描述符对象}) 

使用一些内部特性来描述属性的特征 -> 描述符对象。

其中属性包括 

##### 数据属性

- [[Configurable]]：
  - 属性是否可以删除和重新创建
  - 是否可以修改属性的特性
    - 如果 writable:true 仍然可以写值，且可以将其改为 false
    - 修改其他属性会发生错误
  - 是否可以修改属性为 **访问器** 属性
- [[Enumerable]]:
  - 属性是否可被枚举
- [[Writable]]:
  - 属性的值是否可被写入
- [[value]]:
  - 属性的值

在对象字面量，或是直接定义的属性：

- 前三个特性默认为 true
- [[value]] 没有定义默认为 undefined

##### 访问器属性

- [[Configurable]]
- [[Enumerable]]
- [[get]]
- [[set]]

可以通过在对象字面量中定义 getter / setter 直接定义：

```js
let obj = {
	get value(){}
	set value(){}
}
```

也可以通过Object.defineProperty(obj, key, {包括 get() 和 set() 的描述符对象}) 创建。

不能同时在一个属性上拥有 [[get]] [[set]] 和 [[value]]。

严格模式下，写入只有 获取函数的属性会发生错误。



#### Vue 中的数据代理

通过 Vue 实例对象来代理 data对象中属性的操作。

- 可以更加方便地操作 data 中的数据
  - 否则要通过 _data.value 来获取
- 原理是
  - 配置对象中的 data 属性会被赋值给 Vue 实例的 _data 属性。
  - 通过 Object.defineProperty 将 _data 对象中的所有属性添加在实例对象身上。 
  - 每一个添加到 Vue 实例对象上的属性都是访问器属性，具有 getter 和 setter，操作 _data 中对应的属性。 

- 实际上，_data 对象中的属性不是简单的属性，还进行了数据劫持，以在数据发生改变时重新渲染到页面上。

### 事件的基本使用

1. 使用 v-on:func 或 @func 绑定事件
2. 事件的回调要配置在 method 对象中，最终会在 Vue 实例上
3. methods 中配置的函数，都是 vue 管理的函数
   - 普通函数 this 指向 Vue 实例
4. @click=“func” 与 @click=“func($event)” 一致，后者可以传参

### 事件修饰符

1. prevent
   - event.preventDefault() 阻止默认行为
     - 比如a标签的跳转
     - 复选框的选中行为
2. stop
   - event.stopPropagation() 阻止事件冒泡
   - 点击子元素时事件不会冒泡到父元素
3. once
   - 事件只触发一次
4. capture
   - 使用事件的捕获模式
5. self
   - 只当 event.target 为当前事件监听器所在元素，即 this 时才触发事件
6.  passive
   - 事件的默认行为立即执行，向浏览器保证不会调用preventDefault()
   - 无需等待事件回调执行完毕。
   - 如wheel事件，会等待回调执行完毕才执行默认行为。

### 键盘事件

#### Vue 中常用的按键别名

- 回车 enter
- 删除/退格 delete
- 退出 esc
- 空格 space
- 换行 tab
  - 必须配合 keydown 使用，否则只会执行默认行为
- 上 up
- 下 down
- 左 left
- 右 right

#### Vue 未提供别名的按键，可以用按键原始的key值绑定

驼峰命名要转成 kebab-case 短横线命名。

#### 系统修饰键

- 如 `ctrl`, `alt`, `shift`, `meta`。
- 配合 keyup 使用
  - 按下修饰键的同时，再按下其他键，然后释放其他键，事件才被触发
  - @keyup.ctrl.z -> 监听 ctrl + z 键盘事件
- 配合 keydown 使用
  - 正常触发事件

#### 可以使用 keyCode 去指定具体按键，但不推荐

因为 keyCode 可能要被移除。

@keyup.13 = “func”

#### 通过配置对象自定义键名

```vue
Vue.config.keyCodes.自定义键名 = 键码;
```



### 计算属性

数据改变会引起模板的重新解析，模板中的插值方法会被重新调用。

#### 插值语法

不适合用于复杂的表达式

```vue
<div id="root">
  <input type="text" v-model="first">
  <input type="text" v-model="second">
  <span>{{first}}-{{second}}</span>
</div>
```

#### methods

插值语法中调用函数要加小括号，

在事件绑定时才可以不加。

```vue
<div id="root">
  <input type="text" v-model="first">
  <input type="text" v-model="second">
  <span>{{getTotal()}}</span>
</div>
```

```js
new Vue({
  el:"#root",
  data:{
    first:12,
    second:34
  },
  methods:{
    getTotal(){
      return this.first + "-" + this.second;
    }
  }
})
```

#### Computed 计算属性

```js
new Vue({
  el:"#root",
  data:{
    first:12,
    second:34
  },
  computed:{
  	fullValue:{
  		get(){
  			return this.first + "-" + this.second;
      },
  		set(){
  		
  		}
  	}
  }
})
```

##### 1.使用一个对象来定义计算属性，且具有 get() 和 set() 方法。

当访问计算属性时，会调用其 get() 方法。

底层使用 **Object.defineProperty** 实现。

##### 2.计算属性 get / set 方法中的 this 值被绑定到了 vm 实例

##### 3.计算属性会进行缓存

- get 什么时候被调用？

  - 初次读取时

    - 发生多次读取只会在第一次读取时，调用一次 get()，

      之后的读取会直接从缓存中取值。

  - 依赖的数据发生变化时



##### 4.计算属性会出现在 vm 实例

Vue 会将计算属性 get 方法的**返回值**赋值到 vm 实例上的对应属性，因此可以**直接读取**使用。

##### 5.直接修改计算属性会调用 set 方法

修改 vm 实例上的计算属性时，会调用相应的 set 方法。

在 set 方法中需要引起**计算时依赖的数据**发生改变。

#### 计算属性的简写形式

确定计算属性只需要读取时，可以采用其简写形式：

即将计算属性写成一个函数，不必写成一个对象。

这个函数会被当做计算属性的 getter,

函数的返回值会赋值给 vm 上的对应属性。

属性名为函数名。

```js
new Vue({
  el:"#root",
  data:{
    first:12,
    second:34
  },
  computed:{
  	fullValue:function{
  		return this.first + "-" + this.second;
  	}
   // or
   fullValue(){
   		return this.first + "-" + this.second;
   }
  }
})
```

### 监视属性 watch

- 当被监视的属性变化时，回调函数自动调用，进行相关操作。
- 监视的属性必须存在，才能进行监视，但不会报错。
- 监视的两种写法：
  - new Vue 时传入 watch 配置
  - 通过 vm.$watch 监视

#### new Vue 时传入 watch 配置

```js
const vm = new Vue({
	el:'#root',
	data:{
		value:123,
	},
	watch:{
		value:{
			immediate:true,
				// 在初始化的时候是否调用 handler 一次
			handler(newValue, oldValue){
				// 接收两个参数，变化时新的值和旧的值
			}
		}
	}
})
```



#### 通过 vm.$watch 监视

```js
const vm = new Vue({
	el:"#root",
	data:{
		value:123,
	}
})

// 第一个参数传入一个 key 的字符串
// 第二个参数传入一个配置对象
vm.$watch("value",{
	immediate:true,
	handler(newValue, oldValue){
		
	}
})
```

#### 监视对象中的某一项的变化

key 其实是字符串！

因此可以写成一个字符串的对象访问属性形式：obj.a。

```js
new Vue({
	el:"#root",
	data:{
		value:{
			a:1,
			b:2
		}
	},
	watch:{
		value:{
			handler(newValue, oldValue){}
		},
		"value.a":{
			handler(newValue, oldValue){}
		}
	}
})
```

不能使用计算属性。

![image-20220420194506224](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220420194506224.png)

#### 深度监视

- Vue实例自身可以检测对象内部值的改变，**但 vue 中的 watch 默认不监测对象内部值的改变**，只监测标识符指向的对象地址是否发生改变。
- 通过配置 ==**deep:true**== 可以监测对象内部值的改变。

```js
new Vue({
	el:"#root",
	data:{
		value:{
			a:1,
			b:2
		}
	},
	watch:{
		value:{
      deep:true,
			handler(newValue, oldValue){}
		},
		"value.a":{
			handler(newValue, oldValue){}
		}
	}
})
```

#### 监视属性的简写形式

##### new Vue 时传入 watch 配置对象

简写法无法配置 immediate / deep 配置项，默认都不开启。

```js
// 正常写法
watch:{
	data:{
		immediate:true,
		deep:true,
		handler(newValue, oldValue){}
	}
}
// 简写
watch:{
  data(newValue, oldValue){}
}
```

##### 通过 vm.$watch 监视

```js
// 正常写法
vm.$watch("data",{
	immediate:true,
		deep:true,
		handler(newValue, oldValue){}
})

// 简写
// 不能写成箭头函数，会造成 this 指向错误
vm.$watch("data",function(newValue, oldValue){})
```

#### 计算属性 与 watch 的比较

- 计算属性可以完成的功能， watch 都可以完成
- watch 能完成一些异步任务，但 computed 不可以。

### 绑定样式

#### class 样式

通过 class=“” 定义固定的样式，然后通过 :class = “” 定义需要动态改变的样式。

Vue 会将这两个所定义的样式汇总在一起。

##### 字符串形式

适用于**样式的类名不确定**，需要动态指定的情况。

```html
<div id="root">
	<div class="basic" :class="classStr" @click="changeStyle"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		classStr:"class1"
	}
})
</script>
```

##### 数组形式

适用于要绑定的样式**个数不确定，名字也不确定**。

```html
<div id="root">
	<div class="basic" :class="classArr" ></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		classArr:["class1", "class2", "class3"]
  }
})
</script>
```

```html
<div id="root">
	<div class="basic" :class="[classA,classB]" @click="changeStyle"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		classA:"red",
		classB:"blue"
	}
})
</script>
```

可以通过数组方法动态改变。

##### 对象形式

适用于要绑定的样式个数确定，名字确定，但需要决定是否使用的情况。

```html
<div id="root">
	<div class="basic" :class="classObj"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		classObj: {
			class1:true,
			class2:false,
		}
	}
})
</script>
```

```html
<div id="root">
	<div class="basic" :class="{select:isSelected, focus:isFocused}"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		isSelected:true,
		isFocused:false
	}
})
</script>
```

#### style 样式

##### 对象形式

```html
<div id="root">
	<div class="basic" :style="{fontSize:fsize + 'px'}"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		fsize:20,
	}
})
</script>
```

```html
<div id="root">
	<div class="basic" :style="styleObj"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		styleObj:{
      color:'black',
      fontSize:'40px'
    },
	}
})
</script>
```

##### 数组形式

其中数组元素为样式对象，即合并多个样式对象为一个 style。

样式对象的 key 必须是存在的，且使用驼峰式

```html
<div id="root">
	<div class="basic" :style="[style1, style2]"></div>
</div> 
<script>
new Vue({
	el:"#root",
	data:{
		style1:{
      color:'red',
    },
    style2:{
    	backgroundColor:"#fff",
    }
	}
})
</script>
```

### 条件渲染

#### 1. v-show

- 底层使用 display:none
- 不展示的 DOM 元素 只是通过样式隐藏起来了，并未真正移除。
- 适用于切换频率较高的场景。

```vue
<div v-show:"false or 可以转换为布尔值的表达式"></div>
```

#### 2.v-if

- 这些 DOM 元素会作为一个整体在判断
- 不展示的 DOM 元素会直接被移除。
- 适用于切换频率较低的场景。

```html
<div v-if:"表达式"></div>
<div v-else-if:"表达式"></div>
<div v-else></div>
```

#### v-if 与 template 配合使用

```html
<template v-if="表达式">
  <div></div>
  <div></div>
  <div></div>
</template>
```

template 不影响结构，页面渲染时不会渲染 template 外层结构。

只能配合 v-if 使用

### 列表渲染

- 用于展示列表数据
- 在需要遍历渲染的 DOM 元素上使用 v-for
- 可用于遍历 对象，数组，字符串，以及遍历一定次数
- 列表渲染时每个元素需要加上一个唯一的 key 。

#### 遍历数组

```html
<div id="root">
  <ul>
    <li v-for="(item, index) in arr" :key="index"></li>
  </ul>
</div>
```

v-for 可以接收两个参数，一个是遍历的元素，另一个是索引。

可以使用 in / of 操作符。

#### 遍历对象

```html
v-for="(value,key) of obj"
```

#### 遍历字符串

```
v-for="(char,index) of str"
```

#### 遍历指定次数

```
v-for="(number,index) of 10"
```

其中，number 从1开始计数。

### 列表渲染中 key 的内部原理

#### 1.虚拟DOM 中 key 的作用

key 是虚拟 DOM 对象的标识，当数据发生变化时，Vue会根据 新数据 生成 新的虚拟DOM。

随后 Vue 进行 【新的虚拟 DOM】 与【旧的虚拟 DOM】 的差异比较。

#### 2.对比规则

- **旧虚拟 DOM** 中找到了与 **新虚拟 DOM** 相同的 key：
  - 若虚拟 DOM 中内容没变，直接使用之前的真实DOM
  - 若虚拟 DOM 中的内容变了，则生成新的真实 DOM，随后替换掉页面中之前的 真实 DOM
- **旧虚拟 DOM** 中未找到 **新虚拟 DOM** 相同的 key：
  - 创建新的真实 DOM，渲染到页面。

#### 3. 用 index 作为 key 可能会引发的问题

- 若对数据进行：逆序添加、逆序删除等**破坏顺序**的操作：
  - 会产生没有必要的真实 DOM 更新
- 如果结构中还包含输入类 DOM
  - 会产生错误的 DOM 更新
  - 因为在真实 DOM 中的输入内容 value 不会在虚拟 DOM 中展现。

#### 4.key 的选择

- 最好使用数据的唯一标识作为 key
- 如果不存在对数据的逆序添加 / 删除等破坏顺序的操作，仅用于渲染列表作展示，使用 index 作为 key 也是没有问题的。

### 条件渲染

#### watch 监视属性

```js
new Vue({
	el:"#root",
	data:{
		arr:[],
		resArr:[],
		keyWord:""
		
	},
	watch:{
		keyWord:{
      immediate:true, // 初始化时渲染整个列表
			handler(newVal){
				this.resArr = this.arr.filter(i => i.indexOf(this.newVal) !== -1);
			}
		}
	}
})
```

需要在 data 中新增一个属性，用于存储条件渲染后的结果。

并监视索引条件的改变

#### computed 计算属性

```js
new Vue({
	el:"#root",
	data:{
		arr:[],
		keyWord:""
	},
	computed:{
		newArr(){
			return this.arr.filter(i => i.indexOf(this.newVal) !== -1);
		}
	}
})
```

只需在 computed 中定义属性，来存储条件渲染后的结果。

每当依赖的数据改变时，都会调用 computed 。

### Vue 数据监测

1. Vue 会监视 data 中所有层次的数据。
2. 如何监测对象中的数据？
   - 通过 **setter** 实现监视，且要在 **new Vue** 时就传入要监测的数据。
   - 如需给**后添加的属性**做响应式，请使用如下 API：
     - Vue.set(target, propertyName/index, value)
     - vm.$set(target,propertyName/index, value)
     - **上述 api 不能给 vm / vm 的根数据对象vm._data 添加属性。**
3. 如何监测数组中的数据？
   - **数组中的索引key 都没有使用 getter / setter 劫持**
     - 因此不能直接通过索引给数组元素赋值，Vue 不能监听到变化
     - Vue 封装了自己的 数组原地修改元素的方法，在这些方法中去重新解析模板 / 渲染 DOM 元素 / 更新页面。
   - 通过包裹 数组更新元素的方法 实现**更新数组元素**：
     - 调用原生对应的方法对数组进行更新。
     - 重新解析模板，进而更新页面。
4. 修改数组中的某个元素使用如下方法：
   - 原地修改数组的 api： pop, push, shift, unshift, sort, splice, reverse
   - Vue.set() / vm.$set()

### 收集表单数据

1. \<input type="text" />
   - v-model 收集的是 **value** 值
2. \<input type="radio"/>
   - v-model 收集的是 **value** 值，没有给标签配置 value 值，为 null
3. \<input type=“checkbox”>
   - v-model 收集的数据根据 v-model 的初始值决定：
     - 为字符串 / 没有配置，收集 checked 值，即 true / false
       - 如果有好几个绑定相同v-model 的多选框，则勾选其中一个会导致其他都被勾选上
     - 为数组，收集 value 值
4. v-model 的三个修饰符
   - lazy：失去焦点再收集数据
   - number：输入字符串转为有效的数字
     - 给 input 元素配置 type=“number” 设置不能输入除数字以外的其他值
     - 给 v-model 配置 .number 会在收集数据时将文本转换为数字。
   - trim：输入首尾空格过滤

### 过滤器 filters

对要显示的数据进行特定格式化后再显示，适用于简单逻辑的处理。

#### 局部过滤器

**注册**：

```js
new Vue({
	el
	data
	filters:{
  	// 默认第一个参数传入的是 管道符前 的值。
  	// 会将调用时传入的参数收集在第一个参数之后
		mySlice(value,args...){
			return value.slice(0,4);
		},
		otherFilter(value, rule){
			return 使用 rule 格式化 value
		}
	}
})
```

**使用**：

```html
<div>{{data | mySlice}}</div>
<div>{{data | otherFilter(rule)}}</div>
<div :val="data | mySlice"></div>
```

- 过滤器默认接收管道符前的数据，可以接收额外的参数
- 多个过滤器可以串联
- 并没有改变原本的数据，是产生了新的对应的数据

### 内置指令

#### 常用

- **v-bind** 单向绑定解析表达式 简写 :xxx
- **v-model** 双向数据绑定
- **v-for** 遍历 数组 / 对象 / 字符串
- **v-on** 绑定事件监听  简写为 @xxx
- **v-if ** 条件渲染
- **v-else**   条件渲染（控制节点是否存在）
- **v-show**   条件渲染（控制节点是否显示）

#### v-text

- 将所在的节点中渲染文本内容，插入 html语法 仍然作为普通文本渲染，不会被解析
- 会替换掉标签内的所有内容。
  - 插值语法则不会。

#### v-html

- 会将文本内容解析为 html 结构

#### v-cloak

```html
<style>
  [v-cloak]{
    display:none;
  }
</style>


<body>
  <div id="#root">
    <div v-cloak>
      {{用到插值语法的元素}}
    </div>
  </div>
</body>
```

解决未加载 vue 时，页面上会显示未解析的 html 模板的问题。

- 给模板中的元素加上 v-cloak 属性
- 在 css 中使用 v-cloak 属性选择器隐藏元素。

在 vue 已经加载完成后，解析模板时会将所有的 v-cloak 属性移除，使被隐藏的元素重新出现。

### v-once

v-once 所在节点在**初次动态渲染后**，就会被视为**静态内容**。

以后数据改变不会引起 v-once 所在结构的更新。

可以用于优化性能。

```
<div v-once>{{data}}</div>
```

#### v-pre

- 跳过其所在节点的编译过程
- 可利用它跳过：没有使用指令语法 / 插值语法的结点
- 加快编译

### 自定义指令

#### 自定义指令何时被调用

- 初始化阶段，指令与元素成功绑定时
- 指令所处的模板被重新解析时

#### 自定义指令的定义形式

##### 函数式

接收到两个参数：

1. 指令所处的 DOM 元素
2. 指令与元素的关联对象

```html
<div v-big="n"></div>
```

```js
new Vue({
	el:"#root",
  data:{
    n:1
  },
  directives:{
    // 在自定义指令中需要自行操作 DOM 元素！
    // 第一个参数为指令所在的元素
    // 第二个参数为指令与元素之间的关联关系
    // 通过 binding.value 可以获取数据
    big(element,binding){
      element.innetHTML = binding.value * 10
    }
  }
})
```

##### 对象式

包含三个回调函数，会在三个阶段分别被调用：

1. **指令与元素成功绑定时**（此时还未将 DOM 元素 element 插入到页面上）

   ```js
   bind(element, binding){
   	// 进行元素的初始化操作
   	// 如设置样式，设置元素内容，绑定事件
   }
   ```

2. **指令所在元素被插入页面时**

   ```js
   inserted(element, binding){
   	element.focus()
   	// 此时可以执行诸如获取焦点，获取父元素等操作
   }
   ```

3. **指令所在的模板被重新解析时**

   ```js
   update(element, binding){
   	// 模板重新解析时的操作
   }
   ```

函数式实际上只定义了 bind 和 update 阶段的操作。

##### 局部指令

```js
new Vue({
	directives:{
		指令名:配置对象
		// or
		指令名(){}
	}
})
```

##### 全局指令

```
Vue.directive(指令名，配置对象)
```

#### 备注

指令不建议使用 camelCase 命名，建议使用 kebab-case 方式。

kebab-case 方式使用的指令，通过字符串引号包裹的形式创建：

“some-directive”:{}

### 生命周期

通过 template 选项作为模板解析时，

会使用通过 template 解析得到的真实 DOM 替换整个el 元素。

#### React 中的生命周期引例

```react
Class Life extends React.Component{
  // 数据定义在实例的 state 属性上！
  state = { 
    opacity:1,
  }
  // 类式组件中的方法，如果是被用作回调函数，如用作事件处理
  // 就需要写成 箭头函数的 形式
  // 使 this 指向正确
  death = () => {
    
  }  
  // React 帮助调用的是通过 Life 实例.render() 调用的
  // 不需要通过箭头函数使 this 始终指向实例。
  // 通过 react 调用 render 方法来将组件渲染到页面上
  // 调用 setState 时会重新渲染！
  render(){
    setInterval(()=>{
      let {opacity} = this.state
      opacity -= 0.1
      if(opacity <= 0) opacity = 1;
      this.setState({opacity}, 200)
    })
    return (
    	<div>
        <h2 style={{opacity:this.state.opacity}}></h2>
      </div>
    )
  }
}
```

#### Vue 中的生命周期引例

```html
<div id="root">
  {{change()}} // 通过在模板解析的时候运行一个函数！ Vue 实例会自动调用，开启一个定时器
  <h2 :style="{opacity}"></h2>	// 通过指令语法使用实例中的属性。
</div>
```

```js
new Vue({
	el:"#root",
  // 数据定义在实例的 data 属性上！
	data:{
		opacity:1, 
	},
	methods:{
		change(){
      setInterval(()=>{
        this.opacity -= 0.01;	// 数据发生改变，触发模板的重新解析
      }, 16)
    }
	}
})
```

#### React 的生命周期

##### 初次挂载时：

由 ReactDOM.render 触发

1. Constructor 构造器
2. ComponentWillMount
3. render
4. ComponentDidMount

##### setState()

组件内部 this.setState()  触发。

1. shouldComponentUpdate
   - 返回值为 true / false
   - 为 true 会发生组件的更新
   - 为 false 组件将不会更新
   - 没有定义钩子，默认的始终返回true
2. componentWillUpdate
3. render
4. componentDidUpdate

##### forceUpdate() 强制更新

可以无需对数据做出任何修改

**不需通过 shouldComponentUpdate** 判断是否需要更新。

1. componentWillUpdate
2. render
3. componentDidUpdate

##### 组件再次接收到新的 props

组件挂载时不会执行这个钩子，等到 props 发生改变时才会执行

由父组件 render 触发

1. componentWillReceiveProps
2. shouldComponentUpdate
3. componentWillUpdate
4. render
5. componentDidUpdate

##### 组件卸载：

通过 ReactDOM.unmountComponentAtNode(document.getElementById…) 触发

1. ComponentWillUnmount

![img](https://pics4.baidu.com/feed/8326cffc1e178a82ce2d329deca68a84a977e82d.png?token=a2c4791342aa72ef25c446f96e4cbad2)

#### React 新生命周期

即将废弃 3 个钩子：

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

增加了两个钩子

- getDerivedStateFromProps(props, state)
  - 用法罕见：state 取决于 props 传入的值
  - 在 render 调用前调用
  - 返回值会更新 state，返回 null 不更新任何内容。
- getSnapshotBeforeUpdate(prevProps, prevState)
  - 在最近一次渲染提交到 DOM 节点之前调用。
  - 使得组件能在发生更改之前从 DOM 中捕获一些信息。
  - 返回值会作为参数传递给 componentDidUpdate(prevProps, prevState, snapshot)

<img src="https://pics7.baidu.com/feed/a08b87d6277f9e2fe28f379a0595102db999f31d.png?token=4e9b2021e96e652ba18349d930001301" alt="img" style="zoom:80%;" />

#### Vue 生命周期

1. **beforeCreate**

   - vue 实例已经创建完成，已经初始化了生命周期，事件（如 v-once 的处理规范）。
   - 还未进行**数据代理和数据监听**。
   - 访问不到 _data，和 methods 中的方法

2. **created**

   - 已经完成了 **数据监测** 和 **数据代理**
     - 为数据添加 getter / setter
     - 数组原地修改方法的包装
   - 可以通过 vm 访问 data 中的数据和 method 中的方法

3. Vue 解析模板，在内存中生成虚拟 DOM， 还未将生成真实 DOM

   1. 判断是否有 el 选项 
      - 如果没有 el 选项就等待 vm.$mount(el) 方法被调用才继续流程
   2. 判断是否有 template 选项
      - 如果有，就解析 template 模板，使用内部 render 函数将生成的 DOM 元素替换掉 el 元素。
        - template 若需要换行，使用模板字符串。
        - 只能有一个根结点
        - 不能使用 template 标签作为组件的根元素！
      - 如果没有，就将 el 作为 template 模板，解析 el 的 outerHTML 。
        - el 根元素本身也是模板的一部分

4. **beforeMount**

   - 此时页面上的仍为未经 Vue 编译的模板

5. **mounted**

   - 已经将内存中的虚拟 DOM 转为 真实 DOM 插入页面
   - 可以在此做一些初始化操作：
     - 开启定时器
     - 发送网络请求
     - 订阅消息
     - 绑定自定义事件。
   - 通过 $el 存储真实 DOM 的根结点，方便后续 Diff 算法更新页面

6. **beforeUpdate**

   - 数据是新的，但还未重新解析模板，页面为旧的。
   - 之后会发生 新旧虚拟 DOM 比较，完成页面更新

7. **updated**

   - 已经完成了页面更新。

8. vm.$destroy() 被调用时，进入销毁流程

   - 销毁后，DOM 还在，但是 Vue 不再管理
   - 完全销毁一个实例，清理与其它实例(子组件)的连接，解绑全部指令和 **自定义事件**监听器。
   - 原生事件监听器还存在，能够被响应。

9. **beforeDestroy**

   - 此时 vm 中所有的 data，methods，指令等都处于可用状态
   - 一般在这里做收尾操作：
     - 关闭定时器
     - 取消订阅消息
     - 解绑自定义事件
   - 此时再操作 data 中的数据不再触发更新流程

10. **destroyed**

    

![](https://img2022.cnblogs.com/blog/2763631/202203/2763631-20220306180208408-853707112.png)

### Vue 组件

#### 定义组件

使用 Vue.extend(options) 创建，其中 options 和 new Vue(options) 传入的配置对象基本一致，差异如下：

- 不要定义 el 配置项
  - 因为组件最后服务于哪个容器是不确定的
  - 需要由 vm 实例的 el 来最终决定
- data 配置项要写成函数形式
  - 防止组件复用时，组件实例的数据都是同一个对象的引用
- 使用 template 配置组件结构

#### 注册组件

##### 局部注册：

靠 new Vue(options) 时在 options 配置对象中注册：

```js
new Vue({
	component:{
		组件名:注册的组件,
	},
})
```

##### 全局注册：

```js
Vue.component("组件名", 注册的组件)
```

##### 编写组件标签

```html
<componentName></componentName>
```

#### 组件名

一个单词组成：

- component
- Component

多个单词组成

- kebab-case：my-component
- **CamelCase: MyComponent**
  - 需要 Vue 脚手架支持

组件名尽可能回避 HTML 中已有的元素名称：h2 H2 都不行，会被解析为 HTML 已有的元素。

可以在定义组件的配置项中，用 **name** 指定组件在开发者工具中呈现的名字。

#### 组件标签

- \<component>\</component>
- **\<component/>**
  - 需要 脚手架 支持
  - 否则会导致后续的组件都无法渲染

#### 简写形式

```js
const c = Vue.extend(options)
// 简写为
const c = options
```

会在组件注册时 内部调用 extend 方法。

### VueComponent

组件本质上是一个名为 VueComponent 的构造函数，由 Vue.extend 生成的。

每次调用 Vue.extend，返回的都是一个全新的 VueComponent。

```js
function extend(){
	var xx = function VueComponent(){}
	return xx;
}
```

在**模板**中的自定义组件元素，Vue 在解析时会帮我们创建该 **构造函数的实例对象**。

new VueComponent(options)

#### this 指向

- 在**组件配置**中的 data 函数 / methods 中的函数 /  watch 中的函数 / computed 中的函数，this 都指向 **VueComponent 实例对象**。
- 在 new Vue(options) 配置中，this 都指向 **Vue 实例对象**。

#### vc.\__proto__

**==VueComponent.prototype.\__proto__ \=\== Vue.prototype==**

VueComponent.prototype 为 Object 的一个实例，

Vue 强制改变了 VueComponent.prototype 的 \__proto__，

使其指向 Vue.prototype ，因此 可以访问其上面的 $watch 等方法。

### Vue 脚手架

引入的 vue 为阉割版的，没有模板解析器。

因此在 main.js 中new Vue(options) 不能使用 **template** 字段定义模板，因为无法解析

但可以在 App.vue 等组件中使用 \<template>\</template> 标签，因为引入了另外的库用于解析这个标签中的模板。

#### 更改 Vue 脚手架的默认配置项

新建一个文件 vue.config.js

该文件使用 common.js 的暴露，因为 webpack 基于 Node.js

```
module.exports = {}
```

最后会与 webpack 中已有的配置进行合并。

```js
module.exports = {
	pages:{
		index:{
			// 入口文件
			entry:'src/index/main.js',
		}
	},
	lintOnSave:false;
	//关闭语法检查
}
```

### ref属性

```vue
<template>
	<h1 ref="h"></h1>
	<MyComponent ref="mc"></MyComponent>
</template>

<script>
	this.$refs.h // 获取真实DOM元素
  this.$refs.mc // 获取组件实例对象
</script>
```

- 用于给元素 / 子组件注册引用信息。
- 应用在 html 标签上，通过 ref 属性的值可以获取到真实 DOM 元素
- 应用在组件标签上，获取的是组件实例对象 vc

### props属性

#### 传递 props

父组件给子组件传值。

```vue
<template>
	<MyComponent name="zirina" :age="19"></MyComponent>
</template>
```

#### 接收 props使用配置项 props

1. 只接收

   - ```js
     props:[“name”]
     ```

2. 限制类型

   - ```js
     props:{
     	name:String,
     	age:Number
     }
     ```

3. 限制类型，必要性 和 指定默认值

   - ```js
     props:{
     	name:{
     		type:String, 		// 类型 
     		required:true,  // 必要性
     		default:"孜然",	 // 默认值
     		}
     }
     ```



props 是只读的， Vue 底层会监测你对 props 的修改，如果进行了修改，就会发出警告。

可以通过将 props 的值复制一份到 data 中，然后修改 data 中的数据解决。



props 的优先级比 data 更高，props先被处理配置好。

- 因此可以在 data 中使用 this.prop项
- 如果 data 与 props 有重名项了，会报错，但展示的是 props 的数据！



```vue
<script>
	export default Vue.extend({
    // 可以省略 Vue.extend
    // 因为 如果组件是一个对象， Vue 会自动调用 Vue.extend 并传入这个对象
    name:"MyComponent",
    // data 必须为一个方法，返回一个 data 数据对象
    // 防止创建多个组件实例对象时，它们的数据都是同一个对象的引用
    data(){
      return {
        myAge:this.age
      }
    },
    methods:{
      updateAge(){
        this.myAge++;
      }
    },
    // 声明接收
    props:{
      name:String,
      age:Number
    }
  })
</script>
```

### mixin 混入

- 可以将多个组件共用的配置提取为一个混入对象，实现复用。

- 定义混合：

  - ```js
    //📁mixin.js
    // 使用分别暴露
    
    // 可以是 data，methods，生命周期钩子！
    export const mixin1 = {
    	data(){....},
    	methods:{.......},
    	....
    }
    ```

- 使用混入

  - 全局混入

    - ```js
      //📁main.js
      Vue.mixin(mixin)
      ```

  - 局部混入 

    - ```vue
      //📁MyComponent.vue
      <script>
        import {mixin,...} from '../mixin'
        export default {
          mixins:[mixin,...]
        }
      </script>
      ```

- 混入时冲突项的合并

  - 如果是 data，methods 以在组件中配置的为主，覆盖了 mixin 的数据
  - 如果是 生命周期钩子，则都会执行，并且先执行 mixin 的函数。



### 插件

- 可以用于增强 Vue
- 是一个包含 install 方法的对象
  - 第一个参数为 Vue，其他参数为使用者传入的数据
  - 使用插件时 Vue 会自动调用 install方法

#### 定义插件：

```js
对象.install =  function （Vue,options){
	// 可以添加全局过滤器
	Vue.filter()
	// 可以添加全局指令
	Vue.directive()
	// 配置全局混入
	Vue.mixin()
	// 添加 Vue 原型属性
	Vue.prototype.$myMethod = function(){}
	Vue.prototype.$myProperty = xxxx
}
```

#### 使用插件

```js
//📁main.js
Vue.use(插件)
```

### Style scoped

- 让样式只在组件内部生效，组件内的组件也不会应用样式。

  - 防止多个同级组件中有冲突的样式名，
  - 若有冲突，则最后都应用了最后导入的组件的冲突样式。

- ```vue
  <style scoped>
  </style>
  ```

- Vue 实际上是将定义了 scoped style 的组件的最外层元素加了一个随机的特性：data-v-xxxxx，然后将定义的 style 变成了 .className[data-v-xxxxx]{}，配合属性选择器就完成了控制。

- App.vue 不适合使用 scoped

  - 一般在 App.vue 中定义的样式都是全局使用的。

### Style lang

- 设定样式所用的语言

- ```vue
  <style lang="css/less"> //不写 lang 特性默认为 css
  </style>
  ```

### 自定义事件

一种组件间通信的方式，适用于子组件给父组件传参。

通过在子组件上绑定自定义事件，在父组件中定义事件回调。然后子组件触发事件即可调用父组件中的事件回调。

#### 绑定自定义事件

##### 1.在子组件实例上绑定自定义事件

**父组件**

```vue
<template>
	<ChildComponent @eventName="eventFunc">	</ChildComponent>
</template>
<script>
export default {
  methods:{
    eventFunc(){...}
  }
}
</script>
```

**子组件**

```vue
<template>
	<div @click="emitFunc(args)"></div>
</template>
<script>
export default {
  methods:{
    emitFunc(...args){
    	this.$emit("eventName",)
    }
  }
}
</script>
```

因为自定义事件是被定义在 vc 子组件实例身上的，可以通过 this 访问到，然后使用 $emit 方法，

- 第一个参数为自定义事件的名称，
- 之后的参数可以传入触发自定义事件的形式参数

##### 2.在父组件中绑定自定义事件

动态绑定

```vue
<template>
	<ChildComponent ref="child">	</ChildComponent>
</template>
<script>
export default {
  methods:{
    eventFunc(){...},
  },
    mounted(){
      this.refs.child.$on("eventName", this.eventFunc())
    }
}
</script>
```

#### 解绑自定义事件

```vue
// 子组件
<script>
export default {
  methods:{
    unbind(){
      this.$off("eventName");// 解绑一个自定义事件
      this.$off(["eventName1","eventName2"])// 解绑多个自定义事件
      this.$off() // 解绑全部自定义事件
    }
  }
}
</script>
```

在组件实例销毁的时候，子组件和自定义事件都会被销毁，但内置的事件仍然可以使用。

#### 在父组件上配置回调函数要注意

回调要么写在 **methods** 中，要么在生命周期钩子进行消息订阅时，使用**箭头函数**。

因为 this 在 methods 中保证指向组件实例，

在父组件的生命周期钩子中进行消息订阅时，消息发出时调用的函数，若不使用箭头函数定义，**则 this 会默认指向触发事件的组件实例，即子组件**。

使用箭头函数的话，则会指向定义箭头函数时的上下文中的 this。

#### 在组件上使用原生事件

在组件上定义的事件默认都是自定义事件。

通过加上 `native` 修饰符可以使用原生事件。

```vue
<ChildComponent @click.native="func"></ChildComponent>
```

### 全局事件总线

全局事件总线需要满足两个条件：

- 能够被所有组件访问到
  - 应该在组件原型上
- 能够使用 `$emit` `$on` `$off`
  - 那么必须是 vm / vc

因此全局事件总线必须在 Vue 的原型上。（vc 的原型的原型为 Vue 的原型）

可以使用 Vue 实例 vm 来作为事件总线。

#### 创建全局总线

```vue
<script>
new Vue({
	beforeCreate(){
		Vue.prototype.$bus = this
	}
})
</script>
```

#### 使用事件总线

##### 接收数据

```vue
<script>
export default { 
	methods(){
		func(data){
			....
		}
	},
	mounted(){
		this.$bus.$on("xxxx", this.func)
	}
  beforeDestroy(){
    this.$bus.$off("xxxx")
  }
}
</script>
```

##### 提供数据

```js
this.$bus.$emit("xxxx", data);
```

### nextTick

1. `this.$nextTick(callback)`
2. 在下一次 DOM 更新结束后执行其指定的回调
3. 当改变事件后想要基于更新后的 DOM 元素进行某些操作时，要在 nextTick 所指定的回调函数中执行

### Vue 封装的过渡与动画

1. 在插入、更新或移除 DOM 元素时，在合适的时候给元素添加样式类名。

2. 准备样式：

   - 进入
     - v-enter：进入的起点
     - v-enter-active：进入过程中
     - v-enter-to：进入的终点
   - 离开
     - v-leave：离开的起点
     - v-leave-active：离开过程中
     - v-leave-to：离开的终点

3. 使用 `<transition>` 包裹要过渡的元素，并配置 name 属性：

   - ```vue
     <transition name="hello">
       	<div v-show="isShow"></div>
     </transition>
     ```

   - 更改了 name 属性后，需要将 css 的 v- 改成 name-

4. 若有多个元素需要过渡动画，则要将 `transition` 改为 `transition-group`，并且每一项都要配置 key

![image-20220501124849108](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220501124849108.png)

使用 animation 只需用到 v-enter-acttive:

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220501125229888.png" alt="image-20220501125229888" style="zoom:80%;" />

### Vue 脚手架 配置代理

#### 简单配置

在 vue.confing.js 中添加如下配置：

```js
devServer:{
	proxy:"http://localhost:5000"
}
```

1. 优点：配置简单，请求资源时直接发给前端即可。
2. 缺点：
   - 不能配置多个代理，devServer 中不能有多个 proxy 项
   - 不能灵活控制请求是否走代理
     - 在本地端口中如果找到了该资源，则直接返回，不会走代理（优先匹配前端资源）
     - 只有请求了前端不存在的资源，才会将请求转发给服务器。

#### 具体配置

```js
module.exports = {
	devServer: {
		proxy:{
			//匹配所有以 'api1' 开头的请求路径
			'/api1':{
        // 代理目标的基础路径
				target:'http://localhost:5000'
        // 更改请求头中的 host 与请求服务器一致
        // 默认为 true
        changeOrigin:true
        // 重写路径
        pathRewrite:{
        	'^/api1':''
      	}
			},
    	//匹配所有以 'api2' 开头的请求路径
			'/api1':{
			 target:'http://localhost:5001'
        changeOrigin:true
        pathRewrite:{
        	'^/api2':''
      	}
			}
		}
	}
}
```

1. 优点：可以配置多个代理，且可以灵活的控制请求是否走代理
2. 缺点：配置略微繁琐，请求资源时必须加前缀

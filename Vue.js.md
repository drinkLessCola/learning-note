# Vue.js

## vue.js安装

### CDN引入

开发环境版本 包含了有帮助的命令行警告

<script src = “http://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

生产环境版本 优化了尺寸和速度

<script src = “http://cdn.jsdelivr.net/npm/vue"></script>

### 下载和引入

### npm安装

## MVVM

model ViewModel View

View 页面视图 / html

ViewModel  vue 通过 data binding 和 dom listener 实时改变View渲染的内容

model 服务器端传来的数据或是写死的数据，放在vue对象的data中。

## 创建Vue实例传入的options

### el

- 类型：String | HTMLElement
- 作用：决定Vue实例管理哪一个DOM。

如果类型为String就通过 el:‘#app’

如果类型为HTMLElement，el就通过document.querySelector()来找到对应的DOM元素。

### data

- 类型：Object | Function
- 作用：Vue实例对应的数据对象

组件当中data必须是一个函数。

### methods

- 类型：{[key:string]:Function}
- 作用：定义属于Vue的一些方法，可以在其他地方调用，也可以在指令中使用。

## 生命周期

![Vue 实例生命周期](https://cn.vuejs.org/images/lifecycle.png)

在某些特定步骤完成后会执行回调函数，可以通过这些回调函数在特定步骤后进行请求发送等操作。

## 插值操作-mustache语法

即{{}}

其中可以加入变量名/表达式。

{{data1 + “ ” + data2}} 可以拼接两个字符串

\<div>{{data1}} {{data2}} \</div> 或是这样

但是不能放在标签内。

## 插值操作-其他指令使用

### v-once

\<div v-once>{{message}}\</div>

只展示第一次得到的数据，之后若data中相应变量改变，页面不响应修改。

### v-html

如果data中有一个url字段，接收来自服务器的信息为

\<a href="http://……..">\</a>

如果直接通过mustache传入dom元素中，将整段以字符串的形式展示，因此需要通过v-html

\<div v-html="url">其他文字\</div>

执行vue后，其他文字会被覆盖为url中a标签内的内容。

### v-text （不如{{}}）

\<div v-text=“message”>其他文字\<\div>

执行vue后，其他文字会被覆盖为message的内容。



### v-pre

在html中，<pre></pre>中的内容会被原封不动的展示。

预格式化的文本，保留空格和换行，常用于表示计算机的源代码。

若想直接显示{{message}}而不进行解析，可以通过

\<div v-pre>{{message}}\</div>

### v-cloak

用于解决插值闪烁的问题。（现在已经没有这个问题了）

因为浏览器先渲染html的内容，此时若还未执行vue解析，或发生了卡顿，则会展示出{{message}}语法

```html
<style>
  [v-cloak]{
    display:none;
  }
</style>
<div id="app" v-cloak>
{{message}}
</div>
```

在vue解析之前，div中会存在v-cloak属性，而解析之后，该属性会移除。

## v-bind的基本使用

前面的指令主要用于将值插入到模板的内容中，用于动态决定标签的属性。

比如动态绑定a元素的href属性，img元素的src属性。

### 语法糖

:

### 参数 

Object (without argument) 

any (with argument)

```html
<img src="{{imgURL}}" alt="">
```

mustache语法只在content部分起作用，在标签中不会被解析。

（小程序可以）

```html
<img v-bind:src="imgURL">
<a v-bind:href="AHref"></a>
...
<script>
  ...在vue中
data:{
imgURL:'http://...xxx.png',
AHref:'http://baidu.com',
}
</script>
```

v-bind使src可以动态绑定，imgURL成为一个变量，会根据这个变量在vue实例中找到对应的地址，将src中的变量替换为地址。

## v-bind 动态绑定class属性

除了具有特殊含义的属性如src / href可以动态绑定，

还有一些属性如class也可以动态绑定。

可以用于动态修改元素的class。

### 对象语法

```vue
<style>
.red{
color:red;
}
</style>
<div>
  <h2 class="otherClass" v-bind:class="{class1:true , class2:false}">
  
  </h2>
</div>
```

可以向class中传入一个对象，其中键值对为

类名：boolean

boolean 为 true,类被添加到class上，为false则不被添加。

可以用变量替换boolean，实现动态修改。

会与普通的class合并，并不冲突。

```
<h2 v-bind:class="getClasses()"></h2>
或者
<h2 v-bind:class="getClasses"></h2>

methods:{
	getClasses:function(){
		return {class1:this.isClass1,class2:this.Class2}
	}
}
```

### 数组语法

```vue
<h2 :class="['class1','class2']"></h2>
```

可以使用数组来增加元素的class，不影响普通class，但由于数组内类名加上了引号，因此是作为字符串被解析的，是写死的，用处不大。

如果去掉引号，会作为变量解析，替换为data内变量存储的内容。

和对象语法一样，也可以通过函数传输数组。

## v-bind 动态绑定style属性

```vue
<h2 :style="{fontSize:value(属性值)}">
<h2 :style="{fontSize:50px}">
  //50px 会被当成变量解析
<h2 :style="{fontSize:'50px'}">
   //正确方法，但没必要
<h2 :style="{fontSize:finalSize}">
  finalSize = '100px';
  //或传入一个变量
 <h2 :style="{fontSize:finalSize + 'px'}">
   finalSize = 100,
   //字符串拼接 + 隐式转换
```

不能使用font-size，会报错。

## 计算属性的基本使用

```vue
<div id="app">
	<h2>{{fullName}}</h2>
	//这里直接使用函数名即可，不用添加小括号
</div>
<script>
const app = new Vue({
el:'#app',
data:{
	firstName:'Jay',
	lastName:'Chou'
},
//也是定义函数,计算属性(),起名尽量起属性名
computed:{
	fullName：function(){
		return this.firstName + ' ' + this.lastName;
	}
},
methods:{}
})
</script>
```

计算属性在多次调用的时候只调用一次。而methods调用几次就执行几次。
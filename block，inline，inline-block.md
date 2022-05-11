# block，inline，inline-block

## #block

特点：**block元素会独占一行。**左右不允许有其它元素与它并排。

​			并且可以设置宽度和高度。

**宽度**默认会填充**父容器的可用空间**。

**高度**视block元素里面的内容而定。



常见默认为 block 的 HTML标签 有：\<div> \<p> \<h1> 至 \<h6> \<ul>等。



源码内字与字之间有多于一个空格的时候，最终结果都只会显示为一个空格。

如果要显示连续的空格，就需要用到专门的空格表示字符 **&nbsp**（non-breaking space）。



## #inline

特点：inline 元素不会独占一行。**左右可以与其它 inline 元素并排**。

​			inline 元素的宽度是根据它所包含的内容而定的。

​			==**width 和 height 的设定对于 inline 元素而言是无效的**。==

​			**inline 元素在水平方向的 padding / margin 可以应用，在垂直方向的不会生效。**

常见默认为 inline 的 HTML 标签有：\<span> \<a> \<strong> \<em>等。

如下面的strong标签。

```html
<p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, ducimus earum? Reprehenderit sapiente, modi <strong>mollitia</strong> eum in, inventore accusantium autem ea nulla consequuntur pariatur asperiores ex beatae deserunt dicta officia?</p>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110234108383.png" alt="image-20220110234108383" style="zoom:80%;" />



## #inline-block

特点：**既可以设定宽度和高度，又可以与其它 inline 元素并排。**



## #各display居中对齐的方法。

```html
<div>Block</div>
<span>Inline</span>
<br>
<strong>Inline-Block</strong>
```

```css
div{
	width:50%;
}
span{

}
strong{
	display:inline-block;
}

div, span, strong{
	background-color:black;
	color:white;
}
body{
  text-align:center;
}
```

#### 为父容器添加 **text-align** ，那么 **inline** 与 **inline-block** 就会被水平居中。

它们整个元素都被理解为与文字一样，因此可以通过父容器的text-align设定，将它们对齐。

而block就只有里面的文字被水平居中了，是因为block本身没有设置 text-align 属性，因而继承了父容器的 text-align 设定。

#### 修改 block 的 margin 属性，可以将 block 水平居中。

```css
div{
  margin-left:auto;
  margin-right:auto;
}
/* 或者 */
div{
  margin:0 auto;
}
```



## #补充

所有 HTML 元素都可以通过更改 display 属性，将它设定为 block、inline 或 inline-block。



**display:none** 使元素在画面中隐藏。

**display:flex** 运用 Flexbox 排版。

**display:grid** 运用 Grid 排版。



## Margin 塌陷

- 两个元素的 margin 相互接触时，会发生 margin 塌陷的现象，两个 margin 会被合并为一个。
- 两个 margin 都为正数：取最大的 margin 为合并后的 margin
- 两个 margin 都为负数：取绝对值最大的 margin 为合并后的 margin
- 一正一负：合并后的 margin = 两个 margin 之和

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111233715879.png" alt="image-20220111233715879" style="zoom:80%;" />

## padding

- padding 不能有负值，只能为 0 或 正数
- background 会被应用到 padding 区域。但可以通过 background-clip 来改变这个默认行为。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111234126521.png" alt="image-20220111234126521" style="zoom: 80%;" />

# Float 布局

特点：不用考虑浏览器兼容问题，ie6也支持。

最初是为了解决绕图排文的问题而诞生的。

## 绕图排文

给图片设置 **float:left;**

如果同时设置了 **display:block；**也不会影响浮动排版。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110225712537.png" alt="image-20220110225712537" style="zoom:80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110225939225.png" alt="image-20220110225939225" style="zoom:80%;" />

给文字设置 **text-align:justify;** 让文字左右均匀分布。

## 三个段落并排

```css
.left{
	float:left;
	width:33.3%;
}
.middle{
	float:left;
	width:33.3%；
}
.right{
	float:right; // 或者left
	width:33.4%;
}
```

如果将三个段落的浮动都设置为float:right;

那么第一个段落由于首先向右浮动，将会在最右边。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110230352268.png" alt="image-20220110230352268" style="zoom: 80%;" />

## 浮动塌陷

如果浮动的元素总的宽度不足100%，那么下面不是浮动布局的元素也会受影响。

表现为浮动塌陷。

如下图，在三个浮动段落下方添加一个段落，该段落将会补充在浮动右边空白的位置。

解决的办法有三个。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110230527014.png" alt="image-20220110230527014" style="zoom: 80%;" />

### #clearFix

#### div标签法

在浮动元素下方新增一个div标签，对这个div标签设置clear:both。

```html
<div class = "container">
	.....一些浮动元素
</div>
<div class = "clearfix"></div>
```

```css
.clearfix{
	clear:both;
}
```

#### 伪元素法

```html
<div class = "container">
	.....一些浮动元素
</div>
```

```css
.container::after{
	content:'';
	clear:both;
	display:block;
}
```

### #overflow

将 **container** 的 **overflow** 属性设置为 **visible 以外的任何有效的设定值**。

此时**.container**就会变为一个**BFC（Block Formatting Context 块级可视化上下文）**。

会形成一个局部的块级，达到“隔断”的效果。

```css
.container{
	overflow:auto/hidden;
}
```

### #display

是将**container**设定为**BFC**的另一种方法。

**但要考虑浏览器兼容的问题，所有的ie都不兼容。**

```css
.container{
display:flow-root;
}
```


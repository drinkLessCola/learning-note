# Grid 布局

布局大致有 table , Float , Flex , Grid 四种。

Flexbox 属于一维的排版方式，即一个 Flexbox 容器只能控制一个方向，水平或垂直。如果要控制另一方向则需要再添加一层 Flexbox 容器。

Grid 属于二维的排版方式，一次可以控制两个方向，就可以直接定义容器内元素的位置。

## grid container

**#grid-template-rows** 垂直方向的分割

**#grid-template-columns **水平方向的分割

```html
<div id = "grid-container">
	<div class = "cell-1"></div>
 	<div class = "cell-2"></div>
</div>
```



```css
#grid-container{
	display:grid;
	width:500px;
	height:500px;
	grid-template-rows:100px 100px 100px 100px 100px;
  grid-template-columns:100px 100px 100px 100px 100px;
}
```



## grid item

**#grid-row** ：a/b 设置 内容 从第 a 条横线到第 b 条横线 

**#grid-column**： a/b 设置从第 a 条纵线到第 b 条纵线



也可以拆分为 grid-column-start 和 grid-column-end。

并且 grid-column-start 可以大于 grid-column-end。

grid-column-start 可以使用负值，即从倒数第几根竖线开始。

grid-column-end / start 其中有一个明确标明时，另一个可以使用 span 2，表示占两列。



grid item 也可以使用 order。

## grid lines

可以给 grid 的分割线，即grid lines 起名字。

使用[name] 100px 来命名

```css
#grid-container{
	display:grid;
	width:500px;
	height:500px;
  grid-template-rows: [y1] 100px [y2] 100px [y3] 100px [y4] 100px [y5] 100px [y6];
  grid-template-columns:[x1] 100px [x2] 100px [x3] 100px [x4] 100px [x5] 100px [x6];
}
```

## grid area

可以直接给 grid 中的一个或多个方格起名字。

**grid-template-areas**

```css
#grid-container{
	display:grid;
	width:500px;
	height:500px;
  grid-template-rows:repeat(5,1fr);
  grid-template-columns:repeat(5,1fr);
  grid-template-areas:
    "header header header header header"
    "nav main main main main"
    "nav main main main main"
    "nav main main main main"
		" . footer footer footer .";
}
```

**可以使用 ==.== 忽略一些方格**。

在元素中使用

**grid-area**:main 可以将grid元素占满在main区域。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220112205950455.png" alt="image-20220112205950455" style="zoom: 50%;" />

在 **container** 中设置 **row-gap + column-gap** 可以添加区域之间的间隔。

如果使用 fr 来分隔，则 grid 中方格的大小会减小。

如果使用具体的像素单位分隔，则会超出父容器的大小。

即在具体大小的格子之间会添加 设置大小 的间距。

因此增加的高度 / 宽度 = （ 行数 / 列数 - 1）* gap的大小。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220112210042479.png" alt="image-20220112210042479" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220112210416741.png" alt="image-20220112210416741" style="zoom:50%;" />

## fr & repeat()

**fr** 可以相对地按比例分配剩余空间。（父容器-间隔大小）

可以使用 **fr** 配合 **repeat** 函数

```css
#grid-container{
	display:grid;
	width:500px;
	height:500px;
  grid-template-rows: 3fr repeat(4,1fr);
  grid-template-columns:repeat(5,1fr);
}
```

**repeat() 不适用于 grid-template-areas**。


### BFC、IFC、GFC、FFC概念理解、布局规则、形成方法、用处浅析

1、Box

　　一个页面是由很多个 `Box` 组成的，元素的类型和 `display` 属性决定了这个 `Box` 的类型。不同类型的 Box，会参与不同的 Formatting Context。

`　　Block level`的box会参与形成BFC，比如`display`值为`block，list-item，table`的元素。

`　　Inline level`的box会参与形成IFC，比如`display`值为`inline，inline-table，inline-block`的元素。

2、FC（Formatting Context）

　　它是W3C CSS2.1规范中的一个概念，定义的是**页面中的一块渲染区域**，并且有一套渲染规则，它**决定了其子元素将如何定位**，以及**和其他元素的关系和相互作用**。

　　常见的`Formatting Context` 有：`Block Formatting Context`（**BFC | 块级格式化上下文**） 和 `Inline Formatting Context`（**IFC |行内格式化上下文**）。

　　下面就来介绍IFC和BFC的布局规则。

3、IFC布局规则：

> 在行内格式化上下文中，框(boxes)一个接一个地水平排列，起点是包含块的顶部。
>
> 水平方向上的 `margin`，`border` 和 `padding`在框之间得到保留。
>
> 框在垂直方向上可以以不同的方式对齐：它们的顶部或底部对齐，或根据其中文字的基线对齐。
>
> 包含那些框的长方形区域，会形成一行，叫做行框。

 4、BFC布局规则：

> 1. 内部的Box会在垂直方向，一个接一个地放置。
> 2. Box垂直方向的距离由`margin`决定。属于同一个BFC的两个相邻Box的`margin`会发生**重叠**
> 3. 每个元素的左外边缘（`margin-left`)， 与包含块的左边（`contain box left`）相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。除非这个元素自己形成了一个新的BFC。
> 4. BFC的区域不会与`float box`重叠。
> 5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
> 6. 计算BFC的高度时，浮动元素也参与计算

参考：
[W3C文档inline-formatting](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting)
[W3C文档block-formatting](https://www.w3.org/TR/CSS2/visuren.html#block-formatting)

5、怎样形成一个BFC？

　　块级格式化上下文由以下之一创建：

> 1. 根元素或其它包含它的元素
> 2. 浮动 (元素的 `float` 不是 `none`)
> 3. 绝对定位的元素 (元素具有 `position` 为 `absolute` 或 `fixed`)
> 4. 非块级元素具有 `display: inline-block，table-cell, table-caption, flex, inline-flex`
> 5. 块级元素具有`overflow` ，且值不是 `visible`

　　整理到这儿，对于上面第4条产生了一个疑问：为什么`display: inline-block;`的元素是`inline level` 的元素，参与形成IFC，却能创建BFC？后来觉得答案是这样的：inline-block的元素的**内部是一个BFC**，但是它**本身可以和其它inline元素一起形成IFC**。

6、BFC用处

　　防止`margin`发生重叠

　　防止发生因浮动导致的高度塌陷

　　自适应布局等

7、**`GFC(GridLayout Formatting Contexts)`**

　　直译为"**网格布局格式化上下文**"，当为一个元素设置**`display`**值为`grid`的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器`（grid container）`上定义网格定义行`（grid definition rows）`和网格定义列`（grid definition columns）`属性各在网格项目`（grid item）`上定义网格行`（grid row）`和网格列`（grid columns）`为每一个网格项目`（grid item）`定义位置和空间。

`　　GFC`将改变传统的布局模式，他将让布局从**一维布局变成了二维布局**。简单的说，有了`GFC`之后，布局不再局限于单个维度了。这个时候你要实现类似九宫格，拼图之类的布局效果显得格外的容易。

8、**`FFC(Flex Formatting Contexts)`**

　　直译为"**自适应格式化上下文**"（也即是现在的flex布局：display:flex;），`display`值为`flex`或者`inline-flex`的元素将会生成自适应容器`（flex container）`。

`　　Flex Box` 由伸缩容器和伸缩项目组成。通过设置元素的 `display` 属性为 `flex` 或 `inline-flex` 可以得到一个伸缩容器。**设置为 `flex` 的容器被渲染为一个块级元素，而设置为 `inline-flex` 的容器则渲染为一个行内元素。**

　　伸缩容器中的每一个子元素都是一个伸缩项目。伸缩项目可以是任意数量的。伸缩容器外和伸缩项目内的一切元素都不受影响。简单地说，`Flexbox` 定义了伸缩容器内伸缩项目该如何布局。

9、FFC与BFC的区别

`　　FFC`与`BFC`有点儿类似，但仍有以下几点区别：

- Flexbox 不支持 `::first-line` 和 `::first-letter` 这两种伪元素
- `vertical-align` 对 `Flexbox` 中的子元素 是没有效果的
- `float` 和 `clear` 属性对 `Flexbox` 中的子元素是没有效果的，也不会使子元素脱离文档流(但是对`Flexbox` 是有效果的！)
- 多栏布局（`column-*`） 在 `Flexbox` 中也是失效的，就是说我们不能使用多栏布局在 `Flexbox` 排列其下的子元素
- `Flexbox` 下的子元素不会继承父级容器的宽

原文地址：https://www.cnblogs.com/goloving/p/12859462.html
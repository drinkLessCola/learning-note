# Document - 2

## 元素大小和滚动

margin 不是元素本身的一部分。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116124918858.png" alt="image-20220116124918858" style="zoom:80%;" />

**width = contentWidth + scrollBarWidth**

- 浏览器通过从内容中获取空间来为滚动条保留空间。

### 几何

这些属性的值是数字，默认的单位为像素。

#### offsetParent

**offsetParent** 是最接近的祖先。

- 元素自身为 fixed 定位，offsetParent 的结果为 **null**。
  - 元素自身为 fixed 固定定位时，我们知道固定定位的元素相对于窗口进行定位，此时没有定位父级，offsetParent 结果为 null。
  - firefox 浏览器 没有考虑固定定位的问题，offsetParent 为 \<body>。
- 元素自身无 fixed 定位，且父级元素都未经过定位，offsetParent 的结果为 \<body>。
- 元素自身无 fixed 定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的**经过定位的父级元素**。**（position = absolute / relative / fixed）**

#### offsetLeft / offsetTop

属性 **offsetLeft / offsetTop** 提供相对于 **offsetParent** 左上角的 x/y 坐标。

```html
<main style = "position:relative" id = "main">
	<article>
  	<div id = "example" style = "position:absolute;left:180px;top:180px"></div>
  </article>
</main>
<script>
	alert(example.offsetParent.id); // main
  alert(example.offsetLeft); // 180
  alert(example.offsetTop); // 180
</script>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116132544519.png" alt="image-20220116132544519" style="zoom:80%;" />

#### offsetWidth / Height

这两个属性是最简单的。它们提供了元素的 外部 width / height。

即元素包括 边框 （border / padding）。

**offsetWidth / Height = width/height + padding * 2 + border * 2**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116133020307.png" alt="image-20220116133020307" style="zoom:80%;" />

#### 对于未显示的元素，几何属性为 0 / null

仅针对显示的元素计算几何属性。

**如果一个元素（或其任何祖先）具有 display:none 或不在文档中**，则所有的几何属性均为 0（offsetParent 为 null）。

可以使用这个特性来检查一个元素是否被隐藏：

```js
function isHidden(elem){
	return !elem.offsetWidth && !elem.offsetHeight;
}
```

对于在屏幕上显示， 但大小为 0 的元素。（例如空的 \<div> ）它们的 isHidden 返回 true。

#### clientTop / Left

在元素内部，我们有边框（border）。

为了**测量边框，可以使用 clientTop 和 clientLeft**。

- clientLeft = 25 左边框宽度
- clientTop = 25 上边框宽度

准确来说，这些属性是内侧与外侧的相对坐标。

当文档从右到左显示（操作系统为 阿拉伯语/希伯来语）时，滚动条在左边，

此时 **clientLeft 包含了滚动条的宽度**。

在这种情况下，clientLeft 的值将不是 25，而是加上滚动条的宽度 25+16 = 41。

#### clientWidth / Height

这些属性提供了**元素边框内**区域的大小。

包括了 “contentWidth” 和 ”padding”，但**不包括滚动条的宽度**。

**clientWidth / Height = width / height + padding * 2 -scrollBarWidth/Height**

**offsetWidth / Height = width / height + padding * 2 + border * 2**

获取滚动条的宽度：

**scrollBarWidth = offsetWidth - clientWidth - border * 2 **

如果元素没有 padding ：

**clientWidth / Height = width / height -scrollBarWidth/Height**

即是content区域的宽度和高度。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116134711812.png" alt="image-20220116134711812" style="zoom:80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116135051378.png" alt="image-20220116135051378" style="zoom:80%;" />

因此，没有 padding 时，可以使用 clientWidth / Height 来获取内容区域的大小。

#### scrollWidth / Height

这些属性类似于 clientWidth / clientHeight，但还包括 已经滚动出页面的部分 和 还未滚动进页面的部分。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116135813379.png" alt="image-20220116135813379" style="zoom: 80%;" />

- scrollHeight 内容区域的完整内部高度，包括滚动出的部分。
- scrollWidth 完整的内部宽度，这里我们**没有水平滚动，因此它等于 clientWidth**。

可以使用这些属性将元素展开到整个 width / height。

```js
element.style.height = `${element.scrollHeight}px`;
```

#### scrollLeft / scrollTop

- scrollLeft / Top 就是“已经滚动了多少”。
- ==**scrollLeft / scrollTop 是可修改的**==。
  - 大多数几何属性是只读的，但是 scrollLeft / scrollTop 是可修改的，并且浏览器会滚动该元素。
  - **将 scrollTop 设置为 0 或一个 特别大的值，如 1e9 ，则元素将会滚动至顶部 / 底部。**
  - **scrollBottom = scrollHeight - scrollTop - clientWidth**   

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116140154272.png" alt="image-20220116140154272" style="zoom: 80%;" />

#### 不要从 CSS 中获取 width / height

我们可以通过 getComputedStyle 计算属性 来读取 CSS-width/height。

但是最好使用几何属性，原因如下：

- CSS width / height 取决于另一个属性：**box-sizing**，它定义了什么是 CSS 宽度和高度，出于 CSS 目的对 box-sizing 的更改会破坏此类 JavaScript 操作。

- CSS 的 width / height 可能为 **auto，如内联元素(inline)**：

  - ```html
    <span id = "elem">Hello!</span>
    <script>
    	alert(getComputedStyle(elem).width); // auto
    </script>
    ```

  - 我们想要获得的是一个 确切的 px 大小，因此 这里的 CSS 宽度没什么用。

- 有**滚动条**的情况使用 **getComputedStyle(elem).width**：有些浏览器 如 Chrome 返回的是**实际内部宽度 - 滚动条宽度**，而某些浏览器 如 Firefox 返回的是 **CSS 宽度（忽略了滚动条）**。这种跨浏览器的差异是不使用 getComputedStyle 而依靠几何属性的原因。



### CSS width 和 clientWidth 的不同点

- clientWidth 值为数值，而 getComputedStyle(elem).width返回一个以 px 作为后缀的字符串。
- **getComputedStyle** 可能会返回非数值的 width，如内联元素的 auto。
- **clientWidth** 是元素的**内部内容区域加上 padding**，而 CSS width （具有标准的 box-sizing） 是**内部内容区域**，**不包括 padding**。
- 如果有**滚动条**，并且浏览器为其保留了空间。那么某些浏览器就会从 **CSS width** 中减去该空间，而clientWidth 属性总是相同的，如果为滚动条保留了空间，那么将减去滚动条的大小。

## Window 大小和滚动

### 窗口的 width / height（文档可见部分 / 内容区域）

为了获取窗口（window）的宽度和高度，

可以使用 **document.documentElement 的 clientWidth / clientHeight**。

浏览器也支持 **window.innerWidth / innerHeight** 这样的属性

- 如果存在一个滚动条，那么 clientWidth / clientHeight 会提供没有滚动条的 width / height。因此，返回的是可用于内容的可见部分的 width / height。

- **window.innerWidth / innerHeight 包括了滚动条**。

- ```js
  alert(window.innerWidth); // 整个窗口的宽度
  alert(documentElement.documentElement.clientWidth); // 减去滚动条宽度之后的窗口宽度
  ```

#### DOCTYPE 很重要

当 HTML 中没有 \<!DOCTYPE HTML> 时，顶层级（top-level）几何属性的工作方式可能就会有所不同。可能会出现一些稀奇古怪的情况。

在现代 HTML 中，我们始终都应该写 DOCTYPE。

### 文档的 width / height （包括滚动出去 / 未显示的部分）

从理论上讲，由于**根文档元素 document.documentElement 包围了所有的内容**，因此我们可以通过使用 **documentElement.scrollWidth / scrollHeight** 来测量文档的完整大小。

但是**在该元素上，对于整个文档，这些属性均无法正常工作**。

在 Chrome / Safari / Opera 中， 如果没有滚动条，documentElement.scrollHeight 甚至可能小于 documentElement.clientHeight。

为了可靠地获得完整的文档高度，应该采用以下这些属性的最大值：

```js
let scrollHeight = Math.max(
	document.body.scrollHeight , document.documentElement.scrollHeight,
	document.body.offsetHeight , document.documentElement.offsetHeight,
	document.body.clientHeight , document.documentElement.clientHeight
)
```



### 获得当前滚动

DOM 元素的当前滚动状态在其 scrollLeft / scrollTop 属性中。

对于文档滚动，在大多数浏览器中，我们可以使用 **document.documentElement.scrollTop**,

但在较旧的基于 Webkit 的浏览器中， **==例如在 Safari 中，我们应该使用 document.body。==**

以上特性不必记住，因为滚动在 **window.pageXOffset / pageYOffset **中可用。

这些属性是 **只读** 的。

==**不能通过修改上面两个属性来使页面滚动**==。

### 滚动：scrollTo ，scrollBy，scrollIntoView

※ 必须**在 DOM 完全构建好**了之后才能通过 JavaScript 滚动页面。

我们如果尝试在\<head>中的脚本滚动页面，将无法工作。



可以通过更改 scrollTop / scrollLeft 属性来滚动常规元素。

可以通过 **document.documentElement.scrollTop / scrollLeft **对页面进行相同的操作

- Safari 除外，应该使用 **document.body.scrollTop / scrollLeft** 代替。

或者，有一个更简单的通用解决方案：

- **scrollBy(x,y)**  — 将页面滚动至 **相对于当前位置** 的 (x , y) 位置。
  - 例如 window.scrollBy(0,10) 会将页面向下滚动 10px。
- **scrollTo(pageX,pageY)** — 将页面滚动至**绝对坐标**，使得**可见部分的左上角**相对于文档左上角的坐标为（pageX，pageY）。就像设置了 scrollLeft / scrollTop。
  - 滚动到页面顶部 window.scrollTo(0,0)

这些方法适用于所有浏览器。

### scrollIntoView

**elem.scrollIntoView(top) **滚动页面以使 elem 可见。

- 如果 top = true（默认值） 页面滚动，使**elem出现在窗口顶部**。
- 如果 top = false ，页面滚动，使 **elem 出现在窗口底部**。



### 禁止滚动

只需设置 **document.body（或其他元素）.style.overflow = “hidden”**。

该页面将冻结在当前滚动位置上。

```js
document.body.style.overflow = 'hidden';
document.body.style.overflow = ''; // 恢复！
```

该方式的缺点是会使滚动条消失。

如果滚动条占用了一些空间，它原本占用的空间就会空出来，填充内容。

我们可以在 document.body 中滚动条原来的位置处通过**添加 padding 来替代滚动条**，这样问题就解决了。保持滚动条冻结前后文档内容宽度相同。

## 坐标

两种坐标系：

- **相对于窗口** — 类似于 position:fixed，从窗口的顶部/左侧边缘计算得出。
  - 我们将这些坐标表示为 clientX / clientY
  - 当文档滚动时， clientY 发生变化，因为同一个点越来越靠近窗口顶部。
- **相对于文档** — 与文件根（document root）中的 position:absolute 类似，从文档的顶部/左侧边缘计算得出。
  - 我们将这些坐标表示为 pageX / pageY
  - 当文档滚动时，pageY 保持不变，仍然是从文档顶部开始计算，即使已经滚动出去。

当页面在最开始，未发生滚动时，窗口的左上角恰好为文档的左上角，它们的坐标相等。

但在文档开始发生滚动之后，元素的窗口相对坐标会发生变化，而元素在文档中的相对坐标保持不变。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116183155512.png" alt="image-20220116183155512" style="zoom:80%;" />

### 元素坐标：getBoundingClientRect

方法 **elem.getBoundingClientRect()** 返回最小矩形的窗口坐标，该矩形将 elem 作为内建 **DOMRect** 类的对象。

主要的 DOMRect 属性：

- **x / y** — 矩形原点相对于窗口的 X / Y 坐标。
- **width / height** — 矩形的 width / height。 **==可以为负==**

派生属性：

- **top / bottom** — 顶部 / 底部矩形边缘的 Y 坐标。
- **left / right ** — 左 / 右矩形边缘的 X 坐标。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116183830310.png" alt="image-20220116183830310" style="zoom:80%;" />

x / y / width / height 可以计算出派生属性：

- left = x
- top = y
- right = x + width
- bottom = y + height

1. 坐标可能是小数。
2. 坐标可能为负数，例如滚动页面使 elem 位于窗口的上方，则 elem.getBoundingClientRect().top 为负。

#### 派生属性 top / left 的意义：

从技术上讲，width / height 可能为负数，从而允许 定向的 矩形（即从右下开始的矩形）。

负的 width / height 表示矩形从其右下角开始，然后向左上方增长。

==**此时 x / y 不等同于 top / left。**==

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220116184241480.png" alt="image-20220116184241480" style="zoom: 80%;" />

但是实际上，elem.getBoundingClientRect() 总是返回正数的 width / height。

#### IE浏览器不支持 x / y

由于历史原因，但我们可以写一个 polyfill

**在DomRect.prototype 中添加一个 getter**，

或者**使用 top / left**，因为对于正值的 width / height 来说，它们的 x / y 一直是一样的。

#### 坐标的 right / bottom 与 CSS position 属性不同

相对于窗口（window）的坐标 和 CSS position:fixed 之间有明显的相似之处。

**在 CSS定位中， right 属性表示距右边缘的距离，而 bottom 属性表示距下边缘的距离。**



### elementFromPoint(x,y)

对 document.elementFromPoint(x,y) 的调用会返回 **在==窗口坐标==（x,y） 处嵌套最多的元素**。

```js
let elem = document.elementFromPoint(x,y);
```

由于使用的是窗口坐标，所以元素可能会因为当前滚动位置而有所不同。

#### ==对于在窗口之外的坐标，elementFromPoint 返回 null==

方法 **document.elementFromPoint(x,y)** 只对在可见区域内的坐标（x,y）起作用。

如果任何==**坐标为负**或者**超过了窗口的 width / height**==，那么该方法会返回 null。



### 用于 “fixed” 定位

```js
let elem = document.getElementById("coords-show-mark");

function createMessageUnder(elem,html){
	let message = document.createElement('div');
	message.style.cssText = "position:fixed;color:red;";
	
	let coords = elem.getBoundingClientRect();
	message.style.left = coords.left + "px";
	message.style.top = coords.bottom + "px";
	
	message.innerHTML = html;
	return message;
}
```

使用 **position:absolute** 来使页面滚动时，元素也滚动。

### 文档坐标

没有标准方法来获取元素的文档坐标，但是写起来很容易：

这两个坐标系统通过以下公式相连接：

- pageY = clientY + 文档的垂直滚动出的部分。
- pageX = clientX +文档的水平滚动出的部分。

函数 getCoords(elem) 将 获取元素的文档坐标。

```js
function getCoords(elem){
	let box = elem.getBoundingClientRect();
	return {
		top: box.top + window.pageYOffset,
		left: box.left + window.pageXOffset,
		bottom:box.bottom + window.pageYOffset,
		right:box.right + window.pageXOffset,
	};
}
```

### 获取区域的窗口坐标（带 padding + border）

- 左上的外顶点：
  -  field.getBoundingClientRect().top / left
- 左上的内顶点：
  - field.getBoundingClientRect().top + field.clientTop
  - field.getBoundingClientRect().left + field.clientLeft
- 右下的外顶点：
  - field.getBoundingClientRect().right / bottom
- 右下的内顶点：
  - field.getBoundingClientRect().top + field.clientHeight + field.clientTop
  - field.getBoundingClientRect().left + field.clientWidth + field.clientLeft
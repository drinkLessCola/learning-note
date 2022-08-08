# BFC 块级格式上下文

- BFC 是 CSS 布局的一个概念，是一个独立的渲染区域。

- 规定了内部 box 如何布局

- 并且这个区域的子元素不会影响到外部的元素

  

## BFC 的布局规则

- 内部的 box 在垂直方向一个接一个的放置。
- box 垂直方向的距离由margin决定。属于同一个BFC的两个相邻box的margin 会发生重叠
- BFC 区域不会与 float box 重叠
- BFC 是一个独立容器，容器里面的子元素不会影响到外面元素
-  计算 BFC 的高度时，浮动元素也参与计算高度

## 创建 BFC

- 根元素，即 HTML 元素
- float 的值不为 none
- position 为 absolute 或 fixed
- display 的值为 inline-block、table-cell、table-caption，flex，inline-flex
- overflow 的值不为 visible

## BFC 的使用场景

- 解决 margin 重叠现象
- 清除浮动（BFC 计算高度会包含 浮动元素）
- 避免多列布局由于宽度计算四舍五入而自动换行




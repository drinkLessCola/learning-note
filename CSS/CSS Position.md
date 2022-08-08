# CSS Position

## static

- 所有元素 position 的默认值都为 static。
- 对 left / top / bottom / right 的设定不会生效。
- 处在文档流中，会跟随HTML排版的流程移动。 (flow)

## Absolute

- 有 left / right / top / bottom ，位置相对于除 static 外的最近的父容器（如 relative / absolute）。
- 脱离文档流，固定在设定的位置，不会随 HTML 排版而移动。
- 如果 absolute 所处的容器有滚动条，会随页面滚动。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220113000713047.png" alt="image-20220113000713047" style="zoom: 80%;" />

## relative

- 与 static 很相似，会根据 HTML 的排版流程移动。
- 相对于static 拥有 left / right /top / bottom，在排版之余可以通过这些属性调整位置，相对于自己原先的位置。
- 子元素为 absolute 会根据 relative 的位置去定位。



## fixed

- 脱离文档流，在页面中处在固定的位置，不随页面滚动而滚动。
- 位置相对于整个页面（body）。
- 如果 fixed 元素的父容器为 relative，在 fixed 元素不设置 top / bottom / left / right 属性的时候，会固定在 relative 父容器的左上角，而如果设置了属性，则会脱离 relative 。



## sticky

- 如果设置 top = 0，则会在元素到达顶部（与上方相距 0 px）的时候触发，吸附于顶部。
- IE 所有版本都不支持




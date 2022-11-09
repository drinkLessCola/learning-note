# Transition

```css
transition: <property> <duration> <timing-function> <delay>;

// transition-delay 默认为 0
// transition-property 默认为 all
// transition-timing-function 默认为 ease
```

### `Transition` & `Animation`

- `Transition` 侧重于表现一次过渡效果，从开始到结束的变化。
- `Animation` 不需要变化，可以循环播放。

### 有的属性变化没有过渡效果

1. 有的 CSS 属性只支持枚举值，没有中间状态：
   - `visibility`
   - 在浏览器上的表现： duration 到了之后元素立即突变为结束状态。
2. 有的 CSS 属性虽然是可计算数值，但不能有过渡效果：
   - `transition-delay`
   - `transition-duration`
   - 立即生效。
   - 如果只有在 `hover` 伪类选择器中有 `transition`，那么只有 hover 时有动画，移出时没有动画。
3. 可过渡的属性，也可能因为无法计算中间状态而失去过渡效果。
   - 如 `box-shadow` 属性虽然支持 transition 动画，但从 `outset` 切换到 `inset`，效果也是突变的。
4. 如果某个属性值是连续可计算的数值，但是变化前后变成散列的枚举值，过渡也不会生效。
   - 例如 `height: 100px` => `height: auto` 没有过渡效果。

## Transition 动画没有生效

```js
const btn = document.querySelector("#button");
const popup = document.querySelector("#popup");

if (!popup.classList.contains("active")) {
    popup.style.display = "block";
    popup.classList.add("active");
} else {
    popup.style.display = "none";
    popup.classList.remove("active");
}
```

```less
#popup {
  display: none;
  opacity: 0;
  transform: translateY(-8px);
  transition: 1s;

  &.active {
    opacity: 1;
    transform: translateY(0%);
  }
}
```

当样式变更事件发生时，浏览器必须根据变更的属性执行过渡动画，但如果 **样式变更事件发生时** 或 **上一次样式变更事件期间** ==**元素不在文档**==中，则不会为该元素启动过渡动画。

`style.display='block'` 不是同步生效的，要在下一次渲染的时候才会更新到 Render Tree。

![image.png](E:\js\java-script-learning-notes\CSS\Untitled.assets\5a42f551c25b47789e0a792f30b8bb2ctplv-k3u1fbpfcp-zoom-in-crop-mark3024000.awebp)

### 方案一：setTimeout

唤起一次 MacroTask，等 EventLoop 执行回调函数时，浏览器已经完成了一次渲染，此时才可以执行过渡动画。

```js
btn.addEventListener("click", () => {
  if (!popup.classList.contains("active")) {
    popup.style.display = "block";
    setTimeout(() => {
      popup.classList.add("active");
    }, 0);
  } else {
    popup.classList.remove("active");
    setTimeout(() => {
      popup.style.display = "none";
    }, 600);
  }
});
```

### 方案二：requestAnimationFrame

回调函数在 Style/Layout 阶段之后执行。

将流程强制转变为两次渲染，开启过渡效果。

![image.png](E:\js\java-script-learning-notes\CSS\Untitled.assets\fa700f391fc44007b7b549afdeea541dtplv-k3u1fbpfcp-zoom-in-crop-mark3024000.awebp)

```js
if (!popup.classList.contains("active")) {
    popup.style.display = "block";

    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
}
```

### 方案三：Force Reflow

浏览器还会在两种情况下会产生样式变更事件：

- 屏幕刷新频率（requestAnimationFrame）
- JavaScript 需要获取最新的样式布局信息
  - 如 `offset*`、`client*`、`getBoundingClientRect`、`scroll`……
  - 通过这些方法可以强制同步触发重排重绘，频繁调用通常会成为性能瓶颈。

### 优化：监听过渡结束事件 onTransitionEnd

transition 事件同样也有冒泡、捕获的特性。

```js
if (!popup.classList.contains("active")) {
    popup.style.display = "block";
    popup.scrollWidth;
    popup.classList.add("active");
} else {
    popup.classList.remove("active");
    popup.addEventListener('transitionend', () => {
        popup.style.display = "none";
    }, { once: true })
}
```


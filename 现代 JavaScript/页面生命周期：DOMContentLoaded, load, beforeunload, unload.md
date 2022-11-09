# 页面生命周期：DOMContentLoaded, load, beforeunload, unload

HTML 页面的生命周期包含三个重要事件：

- `DOMContentLoaded`：浏览器已完全加载 HTML，并构建了 DOM 树，但像 `<img>` 和样式表之类的外部资源可能尚未加载完成。
  - DOM 已经就绪，因此应用程序可以查找 DOM 结点，并初始化接口。
- `load`：浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等。
  - 外部资源已加载完毕，样式已被应用，图片大小也已知了。
- `beforeunload/ unload`：当用户正在离开页面时。
  - `beforeunload`：可以检查用户是否保存了更改，并询问他是否真的要离开。
  - `unload` ：用户几乎已经离开了，但是我们仍然可以启动一些操作，如发送统计数据。

## DOMContentLoaded

`DOMContentLoaded` 事件发生在 `document` 对象上。

我们必须使用 `addEventListener` 来捕获：

```js
document.addEventListener('DOMContentLoaded', ready)
// 不能使用 document.onDOMContentLoaded = 
```

```html
<script>
	function ready() {
    alert('DOM is ready')
    // 图片目前尚未加载完成（除非已经被缓存），所以图片的大小为 0x0
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`)
  }
  document.addEventListener("DOMContentLoaded", ready)
</script>
<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

### DOMContentLoaded 和脚本

浏览器处理一个 HTML 文档，并在文档中遇到 `<script>` 标签时，就会在继续构建 DOM 之前运行它。

这是一种防范措施，因为

- 脚本可能想要修改 DOM，
- 甚至对其执行 `document.write` 操作，

所以 `DOMContentLoaded` 必须等待脚本执行结束。

因此，`DOMContentLoaded` 会在所有脚本执行结束之后发生：

```html
<script>
  document.addEventListener("DOMContentLoaded", () => {
    alert("DOM ready!")
  })
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"></script>

<script>
  alert("Library loaded, inline script executed");
</script>
```

 #### 不会阻塞 DOMContentLoaded 的脚本

- 有 `async` 特性的脚本不会阻塞 `DOMContentLoaded`。
- 使用 `document.createElement('script')` 动态生成并添加到网页的脚本也不会阻塞 `DOMContentLoaded`。

### DOMContentLoaded 和样式

外部样式表不会影响 DOM。因此 `DOMContentLoaded` 不会等待它们。

但是如果在样式后面有一个脚本，那么该脚本必须等待样式表加载完成。

- 因为脚本可能想要 **获取元素的坐标** 和 **其他与样式相关的属性**。
- 当 `DOMContentLoaded` 等待脚本时，它也在等待脚本前面的样式。

### 浏览器内建的自动填充

Firefox, Chrome 和 Opera 都会在 `DOMContentLoaded` 中自动填充表单。

例如，如果页面有一个带有登录名和密码的表单，并且浏览器记住了这些值，那么在 `DOMContentLoaded` 上，浏览器会尝试自动填充它们（如果得到了用户允许）。

## window.onload

当整个页面，包括样式、图片和其他资源被加载完成时，会触发 `window` 对象上的 `load` 事件。

可以通过 `onload` 属性获取此事件。

```html
<script>
	window.onload = function() {
    alert('Page loaded')
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`)
  }
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

## window.onunload

当访问者离开页面时，`window` 对象上的 `unload` 事件就会被触发。

我们可以在这里做一些不涉及延迟的操作，例如关闭相关的弹出窗口。

或者发送分析数据。

特殊的 `navigator.sendBeacon(url, data)` 方法可以满足这种需求。

- 它在后台发送数据，转换到另一个页面不会有延迟
- 浏览器离开页面，仍然在执行 `sendBeacon`

```js
let analyticsData = {}

window.addEventListener("unload", () => {
	navigator.sendBeacon("/analytics", JSON.stringify(analyticsData))
})
```

- 请求以 POST 方式发送。
- 不仅能发送字符串，还能发送表单以及其他格式的数据。通常是一个字符串化的对象。
- 数据大小限制在 64kb。

当 `sendBeacon` 请求完成时，浏览器可能已经离开了文档，因此无法获取服务器响应。

还有一个 `keep-alive` 标志，该标志用于在 fetch 方法中为通用的网络请求执行此类 “离开页面后” 的请求。

如果我们要取消跳转到另一页面的操作，可以使用另一个事件 `onbeforeunload`。

## window.onbeforeunload

如果访问者触发了离开页面的导航或试图关闭窗口，`beforeunload` 处理程序将要求进行更多确认。

如果我们取消事件，浏览器会询问用户是否确定。

```js
window.onbeforeunload = function() {
	return false;
  // or
  return 'ssafsdfsfsdd'
}
```

**由于历史原因，返回非空字符串也被视为取消事件。**

- 在以前，浏览器曾经将返回值显示为 Alert 内容。
- 由于有些网站通过显示误导性和恶意信息滥用了此事件处理程序。因此现在无法自定义显示给用户的消息。

### event.preventDefault() 在 beforeunload 处理程序中不起作用

大多数浏览器都会忽略 `event.preventDefault()`。

```js
window.addEventListener("beforeunload", (event) => {
  // 下面的代码将不起作用
	event.preventDefault()
  // 起作用，与在 window.onbeforeunload 中 return 值的效果是一样的
  event.returnValue = "有未保存的值，确认要离开吗？"
})
```

## readyState

如果在文档加载完成之后设置 `DOMContentLoaded` 事件处理程序，将永远不会运行。

在某些情况下，我们不确定文档是否已经准备就绪。

- 我们希望我们的函数在 DOM 加载完成时执行，无论是现在还是以后。

`document.readyState` 属性可以为我们提供当前加载状态的信息。可能值如下：

- `loading`：文档正在被加载。
- `interactive`：文档被全部读取。
- `complete`：文档被全部读取，并且所有资源（例如图片等）都已加载完成。

因此可以检查 `document.readyState` 并设置一个处理程序，或在代码准备就绪时立即执行它。

```js
function work() {}

if (document.readyState == 'loading') {
	// 仍在加载，等待事件
	document.addEventListener('DOMContentLoaded', work)
} else {
	// DOM 已就绪
	work()
}
```

### readystatechange 事件

`readystatechange` 事件会在状态发生改变时触发，因此我们可以打印所有这些状态：

- 是跟踪文档加载状态的另一种机制，很早就存在了，但很少被使用。

```js
console.log(document.readyState)

document.addEventListener('readystatechange', () => console.log(document.readyState))
```

## 完整的事件流

```html
<script>
  log('initial readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

典型输出：

1. [1] initial readyState: loading
2. [2] readyState: interactive
3. [2] DOMContentLoaded
4. [3] iframe onload
5. [4] img onload
6. [4] readyState:complete
7. [4] window onload

- 在 `DOMContentLoaded` 之前，`document.readyState` 会立即变成 `interactive`。它们的意义实际上是相同的。
- 当所有资源（`iframe` 和 `img`）都加载完成后，`document.readyState` 变成 `complete`。
  - 与 `img.onload`(最后一个资源) 和 `window.onload` 几乎同时发生。
  - 转换到 `complete` 状态的意义与 `window.onload` 相同。
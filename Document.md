# Document

## 浏览器环境，规格

JavaScript在浏览器中运行时的鸟瞰示意图：

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110141138731.png" alt="image-20220110141138731" style="zoom:80%;" />

**根对象window**：

- JavaScript代码的全局对象。

  - ```js
    function sayHi(){ alert("Hello"); }
    window.sayHi(); 
    //全局函数是全局对象的方法
    ```

- 代表”浏览器窗口“，并提供控制它的方法。

  - ```js
    alert(window.innerHeight);//内部窗口高度
    ```

### 文档对象模型（DOM）

==**DOM规范**==：描述文档的结构、操作和事件。

将所有页面内容表示为可以修改的对象。

document 对象是页面的主要入口点。可以使用它来更改或创建页面上的任何内容。

```js
document.body.style.background = "red";
setTimeout(() => document.body.style.background = "" , 1000);
```

#### DOM不仅仅用于浏览器。

DOM 规范解释了文档的结构，并提供了操作文档的对象。有的非浏览器设备也使用DOM。

例如，下载HTML文件并对其进行处理的服务器端脚本也可以使用DOM，但可能只支持部分规范中的内容。

#### 用于样式的CSSOM

==**CSSOM 规范**==：描述样式表和样式规则，对它们进行的操作，以及它们与文档的绑定。

另外也有一份针对于CSS规则和样式表的，单独的规范 CSS Object Model(CSSOM)，这份规范解释了如何将CSS表示为对象，以及如何读写这些对象。

当我们修改文档的样式规则时，CSSOM和DOM是一起使用的。但实际上，很少需要CSSOM，因为我们很少需要从JavaScript中修改CSS规则，**通常只是添加/移除一些CSS类，而不是直接修改其中的CSS规则**。

### 浏览器对象模型（BOM）

浏览器对象模型（Browser Object Model），表示由浏览器（主机环境）提供的用于处理文档document之外的所有内容的其他对象。

- **navigator 对象**提供了有关浏览器和操作系统的背景信息。navigator有许多属性，最广为认知的两个属性是：
  - **navigator.userAgent** 关于当前浏览器
  - **navigator.platform** 关于平台，**可以区分Windows/Linux/Mac**。
- **location 对象**允许我们读取当前URL，并且可以将浏览器重定向到新的URL。

```js
alert(location.href);//显示当前URL
if(confirm("Go to Wikipedia?")){
	location.href = "https://wikipedia.org";
	//将浏览器重定向到另一个URL
}
```

函数 alert/confirm/prompt 也是BOM的一部分，它们与文档document没有直接关系，但它代表了与用户通信的纯浏览器方法。

#### BOM是通用HTML规范的一部分。

HTML规范不仅是关于“HTML语言”（标签，特性）的，还涵盖了一堆**对象，方法和浏览器特定的DOM扩展**。这就是“广义的HTML”。

==**HTML规范**==：描述**HTML语言（例如标签）以及BOM（浏览器对象模型）**——各种浏览器函数：**setTimeout** / alert / location等。



## DOM 树

HTML文档的主干为标签（tag）。

根据文档对象模型（DOM），

- 每个**HTML标签**都是一个对象。
- **嵌套的标签**是闭合标签的“子标签”。
- 标签内的**文本**也是一个对象。

所有这些对象都可以通过JavaScript来访问，可以使用它们来修改页面。

document.body是表示<body>标签 的对象。

我们可以使用style.background来修改document.body的背景颜色，以及一些其他的属性：

- innerHTML 节点的HTML内容。
- offsetWidth 节点宽度（以像素度量）

### DOM 的例子

DOM将HTML表示为标签的树形结构：

```html
<!DOCTYPE HTML>
<html>
<head>
  <title>About elk</title>
</head>
<body>
  The truth about elk.
</body>
</html>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110145422490.png" alt="image-20220110145422490" style="zoom:80%;" />

1. 标签被称为**元素节点**（或仅仅是元素），并形成了树状结构：<html>在根结点，<head>和<body>是其子项。

2. 元素内的文本形成**文本节点**，被标记为 #text。一个文本节点只包含一个字符串。它没有子项，并且总是树的叶子。例如<title>标签里有文本“About elk”。

3. 文本节点中的特殊字符：空格和换行符都是完全有效的字符，它们形成**文本节点**并成为DOM的一部分。

   - 所以，例如在上面的例子中，<head>标签中的<title>标签前面包含了一些空格，并且并且该文本变成了一个#text节点（只包含一个换行符和一些空格）

   - 换行符：`↵`（在 JavaScript 中为 `\n`）
   - 空格：`␣`

**只有两个顶级排除项：**

1. 由于历史原因，**\<head>之前**的**空格和换行符**均被忽略。
2. 如果我们在\</body>之后放置一些东西，那么它会**被自动移动到body内**，并处于body中的最下方，**因为HTML规范要求所有内容必须位于\<body>内**。所以\</body>之后不能有空格。

其他情况下，如果文档中有空格，将成为DOM中的文本节点。

没有空格的文本节点：

```js
<!DOCTYPE HTML>
<html><head><title>About elk</title></head><body>The truth about elk.</body></html>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110150521309.png" alt="image-20220110150521309" style="zoom:80%;" />

#### 字符串开头/结尾处的空格，以及只有空格的文本节点，通常会被工具隐藏。

与DOM一起使用的浏览器工具，通常不会在文本的开始/结尾显示空格，并且在标签之间也不会显示空文本节点（换行符）。

开发者工具通过这种方式节省屏幕空间。

### 自动修正

如果浏览器遇到格式不正确的HTML，它会在形成DOM时自动更正它。

#### 补充必要的标签

例如，**顶级标签总是\<html>**。

即使它不存在于文档中，也会出现在DOM中，因为浏览器会创建它。对于\<body>也是一样。

如果一个HTML文件中只有一个单词“Hello”，浏览器则会把它**包装到\<html>和\<body>**中，并且会添加所需的**\<head>**。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110151109704.png" alt="image-20220110151109704" style="zoom:80%;" />

#### 添加关闭标签

一个没有关闭标签的文档，将成为一个正常的DOM，因为浏览器在读取标签时会填补缺失的部分。

#### 表格永远有\<tbody>

按照DOM规范，表格必须有\<tbody>，但HTML文本却忽略了它。然后浏览器在创建DOM时，自动创建了\<tbody>

```js
<table id = "table"><tr><td>1</td></tr></table>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110151516231.png" alt="image-20220110151516231" style="zoom:80%;" />

### 其他节点类型

除了元素和文本节点外，还有其他的节点类型，如**注释节点：comment node**。

被标记为**#comment**，在两个文本节点之间。

```html
<!DOCTYPE HTML>
<html>
<body>
  The truth about elk.
  <ol>
    <li>An elk is a smart</li>
    <!-- comment -->
    <li>...and cunning animal!</li>
  </ol>
</body>
</html>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110152941643.png" alt="image-20220110152941643" style="zoom:80%;" />

**HTML中的所有内容，甚至注释，都会成为DOM的一部分。**

甚至**HTML开头的==<!DOCTYPE…>指令==也是一个DOM节点**，它在DOM树中位于\<html>之前，但我们不会触及那个节点。

**表示整个文档**的**document对象**，形式上也是一个DOM节点。

一共有12种节点类型。实际上，我们通常用到的是其中4种：

1. **document** DOM的入口点。
2. **元素节点** HTML标签，树构建块。
3. **文本节点** 包含文本。
4. **注释** 



### 与控制台交互

**在控制台中获取元素Elements选项卡中的节点。**

1. 
   - 在元素（Elements）选项卡中选择第一个\<li>。
   - 按下Esc 它将在元素（Elements）选项卡下方打开控制台（Console）。
   - 现在最后选中的元素可以通过**$0**来进行操作，上一个选择的是**$1**。
2. 如果存在引用DOM节点的变量，那么我们可以在控制台中使用命令 **inspect(node)** ，来在元素选项卡中查看它。
3. 可以直接在控制台输出DOM节点，如document.body。

## 遍历 DOM

对DOM的所有操作都是以document对象开始。

它是DOM的主“入口点”，从它我们可以访问任何节点。

对象间的链接描述如下：

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110155918060.png" alt="image-20220110155918060" style="zoom:80%;" />

### 在最顶层： documentElement 和 body

最顶层的树节点可以直接作为document的属性来使用：

**\<html> = document.documentElement**

最顶层的document节点。

**\<body> = document.body**

**\<head> = document.head**

#### ==document.body的值可能为null==

**脚本无法访问在运行时不存在的元素。**

如果一个脚本是在\<head>中，那么脚本是访问不到document.body元素的，因为浏览器还没有读到它。

> 刚掉的坑，外部引入的js要放在body后面

在DOM中，null意味着不存在。



### 子结点：childNodes，firstChild，lastChild

- **子节点** 对应的是直系的子元素，它们被完全嵌套在给定的元素中。
- **子孙元素** 嵌套在给定元素中的所有元素，包括子元素，子元素的子元素。

**# childNodes **集合列出了所有的==子节点==，包括文本节点。

**# firstChild 和 lastChild **属性是访问第一个和最后一个子元素的快捷方式。

```js
elem.childNode[0] === elem.firstChild
elem.childNodes[elem.childNodes.length - 1] === elem.lastChild
```

**# elem.hasChildNodes()** 用于检查节点是否有子节点。

 

### DOM 集合

**childNodes 是一个集合**，一个**类数组的可迭代对象**，而不是数组。

> 可以使用下标访问，也可以使用for of 迭代（因为提供了所需要的 symbol.iterator 属性），但是不能使用数组方法。

==**可以使用Array.from从集合创建一个真数组。**==

```js
alert(Array.from(document.body.childNodes).filter);//function
```

##### ==DOM集合是只读的==

所有的导航navigation属性都是只读的。

**不能通过类似childNodes[i] = … 的操作来替换一个子节点**。

修改子节点需要使用其他方法。

##### DOM集合是实时的

几乎所有的DOM集合都是实时的。

如果我们保留一个对 **elem.childNodes** 的引用，然后向DOM中添加/移除节点。那么这些节点的更新会自动出现在集合中。

##### 不要使用 for..in 来遍历集合

**for..in 循环遍历的是==所有可枚举的（enumerable）属性==。**

集合中还有一些“额外的”很少被用到的属性，这些属性也是我们不期望得到的。

并且节点将会显示为0,1，…

还有一些属性，如length,item,keys,values,entries,forEach



### 兄弟节点和父节点

兄弟节点（Sibling）是指有同一个父节点的节点。

例如\<head>和\<body>就是兄弟节点。

```html
<html>
  <head>...</head><body>...</body>
</html>
```

- \<body>可以说是\<head>的“下一个”或者“右边”兄弟节点。
- \<head>可以说是\<body>的“前一个”或者“左边”兄弟节点。

**#nextSibling** 下一个兄弟节点。

**#previousSibling** 上一个兄弟节点。

**#parentNode** 访问父节点。

```js
alert(document.body.parentNode === document.documentElement); //true
alert(document.head.nextSibling);//HTMLBodyElement;
alert( document.body.previousSibling); //HTMLHeadElement
```

### 纯元素导航

上面的导航navigation属性引用所有节点。例如，在childNodes中，我们可以看到文本节点，元素节点，甚至是注释节点。

只考虑**元素节点**的导航链接：

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110165605823.png" alt="image-20220110165605823" style="zoom:80%;" />

- **children**  仅那些作为**元素节点**的子代的节点
- **firstElementChild，lastElementChild** 第一个和最后一个子元素。
- **previousElementSibling，nextElementSibling** 兄弟元素。
- **parentElement** 父元素。

#### 父节点不是元素的例子：

**根节点 document.documentElement 的父节点为 ==document==**，但document不是一个元素节点。

```js
alert(document.documentElement.parentNode);// document
alert(document.documentElement.parentElement);// null
```

因为根节点document.documentElement的父节点是document。但document不是一个元素节点。

当我们想从任意节点 elem到 \<html>，而不是到document时：

```js
//向上，直到<html>
while(elem = elem.parentElement){
	alert(elem);
}
```

| 对于所有节点    | 仅对于元素节点         |
| --------------- | ---------------------- |
| parentNode      | parentElement          |
| childNodes      | children               |
| firstChild      | firstElementChild      |
| lastChild       | lastElementChild       |
| previousSibling | previousElementSibling |
| nextSibling     | nextElementSibling     |



### 表格

某些类型的DOM元素可能会提供特定于其类型的其他属性。

**#\<table> 元素支持(除了上面给出的，)以下这些属性：**

- **table.rows**  \<tr>元素的**集合**。
- **table.caption/tHead/tFoot** 引用元素\<caption>，\<thead>,\<tfoot>。
- **table.tBodies**  \<tbody>元素的**集合**(根据标准还有很多元素，但是这里至少会有一个，即使没有被写在HTML源文件中，浏览器也会将其放入DOM中）。

**#\<thead>,\<tfoot>,\<tbody>元素提供了 rows 属性**

- **tbody.rows** 表格内部\<tr>元素的集合。

**#\<tr>**

- **tr.cells** 在给定的 \<tr> 中的 **\<td> 和 \<th> 单元格的集合**。 
- **tr.sectionRowIndex**  给定的\<tr> 在封闭的 \<thead>/ \<tbody>/\<tfoot> 中的位置（索引）。
- **tr.rowIndex**  在整个表格中\<tr>的编号（包括表格的所有行）。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110174910868.png" alt="image-20220110174910868" style="zoom:80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220110174929284.png" alt="image-20220110174929284" style="zoom:80%;" />

**#\<td>和\<th>**

- **td.cellIndex** 在封闭的\<tr>中单元格的编号。

```js
let td = table.rows[0].cells[1];
//第一行+第二列
td.style.backgroundColor = //一些修改
```

## 搜索：getElement\*，querySelector*

### document.getElementById 或只使用id

```js
let elem = document.getElementById('elem');
```

此外，还有一个通过id命名的全局变量，它引用了元素

```js
elem.style.background = "red";//直接使用，elem是对带有"id=elem"的DOM元素的引用
```

如果id内有连字符，例如“elem-content”，它不能成为一个变量。当我们可以通过方括号访问：

```js
window['elem-content'].style...
```

**除非我们声明一个具有相同名称的JavaScript变量，否则它具有优先权**。

##### 请不要使用以id命名的全局变量来访问元素

在实际开发中，document.getElementById是首选。

##### id 必须是唯一的

在文档中，只能有一个元素带有给定的id。

如果有多个元素都带有同一个id，那么使用它的方法的行为是不可预测的，例如 document.getElementById可能会随机返回其中一个元素。

##### 只有document.getElementById

不存在 anyElem.getElementById，**方法只能被在document对象上调用**，会在整个文档中查找给定的id。

### querySelectorAll

最通用的方法为 elem.querySelectorAll(css)，它返回elem中与给定**CSS选择器**匹配的所有元素。

查找所有为最后一个子元素的\<li>元素

```js
let elem = document.querySelectorAll('ul > li:last-child');
```

##### 也可以使用伪类

CSS选择器的伪类，如:hover和:active也都是被支持的。

**document.querySelectorAll(‘:hover’)**将会返回**鼠标指针现在已经结束的**元素的集合。（==**按嵌套顺序**==，从最外层\<html>到嵌套最多的元素）

### querySelector

elem.querySelector(css) 调用会返回给定CSS选择器的第一个元素。

结果与elem.querySelectorAll(css)[0]相同，但后者会查找所有元素，并从中选取一个，而**elem.querySelector只会查找一个**，因此它在速度上更快，并且写起来更短。

### matches

elem.matches(css)**不会查找**任何内容，

它只会**检查elem是否与给定的CSS选择器匹配**。

返回true或false。

当我们遍历元素并试图过滤那些我们感兴趣的元素时，这个方法会很有用。

```js
for(let elem of document.body.children){
	if(elem.matches('a[href$="zip"]')){
    alert("The archive reference:" + elem.href);
  }
}
```

> $=xx 搜索href为以xx结尾的值的元素
>
> ^= xx 以xx开头
>
> = 全等
>
> *= 关键字搜索

### closest

元素的祖先是：父级，父级的父级，…。祖先们一起组成了从元素到顶端的父级链。

**elem.closest(css)** 方法会**查找与CSS选择器匹配的最近的祖先。**

==**elem自己也会被搜索。**==

方法closest在元素中得到了提升，并检查每个父级。如果它与选择器匹配，**则停止搜索**并返回该祖先。

```html
<h1>Contents</h1>

<div class="contents">
  <ul class="book">
    <li class="chapter">Chapter 1</li>
    <li class="chapter">Chapter 1</li>
  </ul>
</div>

<script>
let chapter = document.querySelector(".chapter");//LI

alert(chapter.closest('.book'));//UL
alert(chapter.closest('.contents'));//DIV
alert(chapter.closest('h1'));//null
</script>
```

### getElementsBy*

还有其他通过标签、类等查找节点的方法。

如今，它们大多成为了历史。

- **elem.getElementsByTagName(tag)** 查找具有给定标签的元素，并返回它们的==**集合**==。
  - tag的参数也可以是表示“任何标签”的**通配符“*”**。
- **elem.getElementsByClassName(className)** 返回具有给定**CSS类**的元素。
- **==document==.getElementsByName(name)** 返回在**文档范围**内具有**给定name特性**的元素。很少使用。

```js
let inputs = document.getElementsByTagName('input');
for(let input of inputs){
  alert(input.value + ':' + input.checked);  //xxx: true
}
```

#### 都是返回集合！

### 实时的集合

所有的 **“getElementsBy\*”** 方法都会返回一个**实时**的集合。这样的集合会在文档发生更改时自动更新。

```html
<div>First div</div>
<script>
  let divs = document.getElementsByTagName('div');
  alert(divs.length); // 1
</script>
<div>Second div</div>
<script>
  alert(divs.length); // 2
</script>
```

- 第一个脚本创建了对\<div>的集合的引用。
- 在第二个脚本中，浏览器又遇到了一个\<div>，因此长度+1。

相反，==**querySelector** 返回的是一个**静态**的集合==，就像元素的固定数组。

```html
<div>First div</div>
<script>
  let divs = document.querySelectorAll('div');
  alert(divs.length); // 1
</script>
<div>Second div</div>
<script>
  alert(divs.length); // 1
</script>
```

| 方法名                 | 搜索方式     | 能否在元素上调用 | 实时？ |
| ---------------------- | ------------ | ---------------- | ------ |
| querySelector          | CSS-selector | √                | -      |
| querySelectorAll       | CSS-selector | √                | -      |
| getElementById         | id           | 否               | √      |
| getElementsByName      | name         | **否**           | √      |
| getElementsByTagName   | tag or ‘*‘   | √                | √      |
| getElementsByClassName | class        | √                | √      |



### 另一种用来检查子级和父级之间关系的方法：

如果**elemB在elemA内（是elemA的后代）**，

或者**elemA==elemB**，

**elemA.contains(elemB)**将返回true。



## 节点属性：type，tag 和 content

### DOM 节点类

不同的 DOM 节点有不同的属性。

- \<a>标签对应的元素节点具有链接相关的属性
- \<input> 相对应的元素节点具有与输入相关的属性。

文本节点 和 元素节点 对应的DOM节点之间也存在共有的属性和方法，因为所有类型的 DOM 节点都形成了一个单一层次的结构（single hierarchy）。

每个 DOM 节点都属于相应的内建类。

层次结构（hierarchy）的根节点是 EventTarget，

Node 继承自它，其他 DOM 节点继承自 Node。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220113155300466.png" alt="image-20220113155300466" style="zoom:80%;" />



- **EventTarget** 是根的**抽象类**，该类的对象从未被创建。
  - 作为一个基础，使所有的 DOM 节点都支持所谓的事件 event。
- **Node** 也是一个**抽象类**，该类的对象从未被创建。
  - 充当 DOM 节点的基础，提供**树的核心功能**： parentNode，nextSibling，childNodes 等（都是 getter）。
  - 但有一些继承自它的具体的节点类：
    - 文本节点的 Text
    - 元素节点的 Element
    - 更多异域类（exotic） 如注释节点的 comment
- **Element** 是 DOM 元素的基本类
  - 提供了**元素**级的导航（navigation）： nextElementSibling ，children
  - 提供**搜索方法**：getElementsByTagName，querySelector
  - 充当更多特定类的基本类：**SVGElement**，**XMLElement** 和 **HTMLElement**。
- **HTMLElement** 最终是所有 HTML 元素的基本类，各种 HTML 元素均继承自它：
  - **HTMLInputElement**  \<input> 元素的类
  - **HTMLBodyElement** \<body> 元素的类
  - **HTMLAnchorElement** \<a> 元素的类
  - 每个标签都有自己的类，这些类可以提供特定的属性和方法。

因此，给定节点的全部属性和方法都是继承的结果。

并且都继承自 Object ，因此像 hasOwnProperty 这样的“普通对象” 方法也是可用的。

我们可以通过回调来查看 DOM 节点类名，因为对象通常都具有 constructor 属性。

引用类的 constructor，constructor.name 就是它的名称。

```js
alert(document.body.constructor.name); // HTMLBodyElement
```

 或者我们可以对其使用 toString 方法：

```js
alert( document.body );// [object HTMLBodyElement]
```

还可以使用 instanceof 来检查继承：

```js
alert( document.body instanceof HTMLBodyElement);
alert( document.body instanceof HTMLElement);
alert( document.body instanceof Element);
alert( document.body instanceof Node);
alert( document.body instanceof EventTarget);
```

在浏览器中可以使用 console.dir(elem) 输出元素来查看。

#### 规范中的 IDL

在规范中， DOM 类不是使用 JavaScript 来描述的，而是一种特殊的 **接口描述语言**（Interface description language ， IDL)

在 IDL 中，所有属性以其类型开头。 例如 DOMString 和 boolean 。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220114004415750.png" alt="image-20220114004415750" style="zoom:80%;" />

### “nodeType” 属性

**nodeType** 属性提供了另一种过时的用来获取 DOM 节点类型的方法。

它有一个数值型值：

- 对于元素节点 elem.nodeType == 1,
- 对于文本节点 elem.nodeType == 3,
- 对于 document 对象 elem.nodeType == 9

```html
<body>
  <script>
  let elem = document.body;
    
    alert(elem.nodeType); // 1 => element
    alert(elem.firstChild.nodeType) // 3 => text
    alert(document.nodeType); // 9
  </script>
</body>
```

现在，我们可以使用 **instanceof** 和**其他基于类**的检查方法来查看节点类型，但有时 nodeType 可能更简洁，我们只能获取 nodeType 而不能修改它。

### 标签：nodeName 和 tagName

给定一个 DOM 节点 ，我们可以从 nodeName 或者 tagName 属性中读取它的标签名：

```js
alert(document.body.nodeName);//BODY
alert(document.body.tagName);//BODY
```

- tagName 属性仅适用于 Element 节点，该属性起源于 Element 类。
- nodeName 属性为任意 Node 定义：
  - 对于元素，它的意义和 tagName 相同。
  - 对于其他节点类型（ comment，text 等），它拥有一个对应节点类型的字符串。

```html
<body><!-- comment -->
  <script>
  	// for comment
    alert( document.body.firstChild.tagName ); // undefined
    alert( document.body.firstChild.nodeName ); // #comment
    
    // for document
    alert( document.tagName ); // undefined
    alert( document.nodeName ); // #document
  </script>
</body>
```

如果是处理元素，那么两种方法没有区别。

#### 标签名始终是大写的，除非在 XML 模式下

浏览器有两种处理文档（document）的模式： HTML 和 XML。

通常，HTML 模式用于网页。

只有当浏览器接收到带有 header **Content-Type: application/xml+xhtml** 的 XML-document 时，XML 模式才会被启用。

**在 HTML 模式下， tagName / nodeName 始终是大写的**：是 BODY 而不是\<body> / \<BoDy>

**在 XML 模式下，大小写保持原样。**

### innerHTML : 内容

innerHTML 属性允许将元素中的 HTML 获取为 **字符串形式 **。

我们可以修改它，因此它是更改页面的有效方式之一。

```html
<body>
  <p>A paragraph</p>
  <div>A div</div>
  
  <script>
  	alert( document.body.innerHTML); 
    document.body.innerHTML = 'The new BODY!';
  </script>

</body>
```

- 如果插入的 HTML 是无效的，浏览器会修复我们的错误，如添加闭合标签。
- 如果插入 JavaScript 脚本，它不会执行。

#### innerHTML += 会进行完全重写

可以使用 elem.innerHTML += “more html” 将 HTML 附加到元素上。

但我们所做的不是附加内容，而是完全重写。

- 移除旧的内容。
- 将新旧结合出的内容写入。

==**因为内容重写，因此所有的图片或其他资源都将重写加载。**==

- 如果内容较多，页面重载的过程很容易被看见。
- 如果有文本被鼠标选中了，那么大多数浏览器都会在重写 innerHTML 时删除选定状态。
- 如果有一个带用户输入内容的文本的\<input> ，那么输入的文本将被移除。

### outerHTML：元素的完整 HTML

outerHTML 属性包含了元素的完整HTML。

等同于 元素本身 + 元素的 innerHTML。

```html
<div id = "elem">
  Hello <b>World</b>
</div>
<script>
	alert(elem.outerHTML); //<div id = "elem">Hello <b>World</b></div>
</script>
```

 **与 innerHTML 不同，写入 outerHTML 不会改变==元素==。而是在 ==DOM== 中替换它。**

```html
<div>Hello, World!</div>

<script>
	let div = document.querySelector('div');
	div.outerHTML = "<p>A new element</p>";
	alert(div.outerHTML);//<div>Hello, World!</div>
</script>
```

在外部文档（DOM）中，**我们可以看到的是新的内容**。而旧的 div 变量并没有发生改变。

outerHTML 赋值不会修改 DOM 元素，即在 HTML 中被引用的元素对象。而是将其从 DOM 中删除，并在其位置插入新的 HTML 。

-  div 被从文档（document）中移除。
- 另一个 HTML 片段被插入其位置。
- div 仍拥有其旧的值。即引用的对象仍然存在，但不在 HTML 中。新的 HTML没有被赋值给任何变量。

我们可以向 elem.outerHTML 写入内容，但要记住，它不会改变我们所写的元素对象。我们可以通过查询 DOM 来获取对新元素的引用。

### nodeValue/data：文本节点内容

**innerHTML** 属性仅对元素节点有效。

其他节点类型，例如文本节点，具有它们的对应项：nodeValue 和 data 属性。这两者在实际使用中几乎相同。

```html
<body>
  Hello
  <!-- Comment -->
  <script>
  	let text = document.body.firstChild;
    alert(text.data); // Hello
    
    let comment = text.nextSibling;
    alert(comment.data); // Comment
  </script>
</body>
```

我们可以通过 data / nodeValue 读取和修改它们。

读取和修改注释：有时开发者会将信息或模板说明嵌入到 HTML 的注释中：

```html
<!-- if isAdmin -->
	<div>Welcome, Admin!</div>
<!-- /if -->
```

然后 JavaScript 可以从 data 属性中读取它，并处理嵌入的指令。

### textContent：纯文本

textContent 提供了对元素内 **文本** 的访问权限：仅文本，去掉所有\<tags>

```html
<div id = "news">
  <h1>HeadLine!</h1>
  <p>Martians attack people!</p>
</div>

<script>
	alert(news.textContent);
	// Headline! Martians attack people!
</script>
```

用到这样的文本读取的场景非常少，但写入 textContent 非常有用。

因为它允许以安全方式写入文本。

- **使用 innerHTML** 我们将其作为 HTML 插入，带有所有的 HTML 标签。
- **使用 textContent** 我们将其作为文本插入，所有符号都按字面意义处理。

### “hidden” 属性

“hidden” 特性（attribute） 和 DOM 属性（property）指定元素是否可见。

我们可以在 HTML 中使用它，或者使用 JavaScript 对其进行赋值，如下所示：

```html
<div hidden>With the attribute "hidden"</div>
<div id = "elem">JavaScript assigned the property "hidden"</div>

<script>
	elem.hidden = true;
</script>
```

从技术上说，hidden 和 style = “display:none” 做的是相同的事。

blinking 元素：

```html
<div id = "elem">A blinking element</div>
<script>
	setIntervel(() => elem.hidden = ! elem.hidden , 1000);
</script>
```

### 更多属性

DOM 元素还有其他属性，特别是那些依赖于 class 的属性。

- value — \<input> \<select> \<textarea> 的 value。
- href — \<a> 的 href。
- id — 所有元素（HTMLElement）的 “id”特性的值。

```html
<input type = "text" id = "elem" value = "value">
<script>
	alert(elem.type); // text
	alert(elem.id); // elem
	alert(elem.value); // value
</script>
```



## 特性 Attributes 和属性 properties

浏览器加载页面时会读取 / 解析 HTML 并从中生成 DOM 对象。

对于元素节点，大多数标准的 HTML 特性会自动变成 DOM 对象的属性。

如果标签是 **\<body id = “page">**，那么 DOM 对象就会有 **body.id = “page”**。

但是 特性 与 属性 的映射关系不是一一对应的。

### DOM 属性

除了内建的 DOM 属性，我们可以添加自己的。

DOM 节点是常规的 JavaScript 对象。

**我们可以创建新的属性 / 方法 ，还可以修改内建属性的原型。**

```js
document.body.myData = {
	name:'Caesar',
	title:'Imperator'
};

alert(document.body.myData.title);
```

```js
document.body.sayTagName = function() {
	alert(this.tagName);
}
document.body.sayTagName();
```

```js
Element.prototype.sayHi = function(){
	alert(`Hello, I'm ${this.tagName}`);
};

document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi();// Hello, I'm BODY
```

所以，DOM 属性和方法的行为就像常规的 JavaScript 对象一样。

- 它们可以有很多值
- 是**大小写敏感**的



## HTML 特性

在 HTML 中，标签可能拥有特性（attribute）。

当浏览器解析 HTML 文本，并根据标签创建 DOM 对象时，浏览器会辨别 **标准的** 特性并以此创建 DOM 属性。

所以，当一个元素有 id 或其他标准的特性，那么就会**生成对应的 DOM 属性**。但是**非 标准的** 特性则不会。

```html
<body id = "test" something = "non-standard">
  <script>
  	alert(document.body.id); // test
    alert(document.body.something); // undefined
  </script>
</body>
```

不同类型的元素，其具有的标准特性不同。

例如 “type” 是 \<input> 的一个标准的特性，但对于 \<body> 来说则不是。

因此，如果一个特性不是标准的，那么就没有相对应的 DOM 属性。

**所有的特性都可以通过以下方法进行访问：**

- **elem.hasAttribute(name) **— 检查特性是否存在。
- **elem.getAttribute(name) **— 获取这个特性值。
- **elem.setAttribute(name,value) **— 设置这个特性值。
- **elem.removeAttribute(name)** — 移除这个特性。

这些方法操作的实际上是 **HTML 中的内容**。

- **elem.attributes** 读取所有特性：
  - 属于**内建 Attr 类**的对象的**集合**，具有 **name** 和 **value** 属性。
  - 是**可迭代对象**。

```html
<body something="non-standard">
  <script>
    alert(document.body.getAttribute('something')); 
  </script>
</body>
```

HTML 特性有以下几个特征：

- 它们的名字是**大小写不敏感的**。 id 和 ID 相同。
  - 可以使用含大写字符的字符串作为 get/setAttribute 的参数，会找到/写入对应小写字母的特性。 
- 它们的值总是**字符串类型**的。
  - 一般而言，写入特性的值会变为字符串。
- 所有特性，包括我们自己设置的，在 **outerHTML 中都是可见**的。

### 属性 — 特性同步

当一个标准的特性被改变，对应的属性也会自动更新（除了几个特例），反之亦然。

```html
<input>
<script>
	let input = document.querySelector('input');
  // 特性 => 属性
  input.setAttribute('id','id');
  alert(input.id); // id
  
  // 属性 => 特性
  input.id = 'newId';
  alert(input.getAttribute('id')); // newId
</script>
```

- input.value 只能从特性同步到属性，反过来则不行：

  - ```html
    <input>
    <script>
    	let input = document.querySelector('input');
    	
      input.setAttribute('value','text');
      alert(input.value); // text
      
      input.value = 'newValue';
      alert(input.getAttribute('value')); // text （没有更新）
    </script>
    ```

  - > 这个 attribute 中的 input 的 value 相当于一个 **value 的默认值**。
    >
    > 不论是**用户在 input 中输入了值**，还是**开发者使用 JavaScript 对 input 的 value 进行赋值**，这个 input 的 attribute 是不会跟着变的。（DOM 元素的 属性不能同步到 HTML 特性！）
    >
    > 而在 input 的显示上是会**优先显示特性 property**，所以 attribute 中的 value 值就相当于一个**默认值**而已。

  - 用户行为可能导致 value 更改，然后在这些操作之后，想从 HTML 中恢复“原始值”，该值就会在特性中。

### DOM 属性是多类型的

DOM 属性不总是字符串类型的。

1. input.checked 属性

   - ```html
     <input id = "input" type = "checkbox" checked> checkbox
     
     <script>
     	alert(input.getAttribute('checked')); // 特性值是 空字符串
       alert(input.checked); // 属性值是 true
     </script>
     ```

2. style 特性是字符串类型的，但 style 属性是一个对象：

   - ```html
     <div id = "div" style = "color:red;font-size:120%">
       Hello
     </div>
     
     <script>
       // 字符串
     	alert(div.getAttribute('style')); // color:red;font-size:120%
       // 对象
       alert(div.style); // [object CSStyleDeclaration]
       alert(div.style.color); // red
     </script>
     ```

大多数 DOM 属性都是字符串类型的。

有一种非常少见的情况，即使一个 DOM 属性是字符串类型的，它可能和 HTML 特性也是不同的。

- href DOM 属性一直是一个 **完整的 URL**。即使该特性包含一个相对路径或包含一个 **#**

  - ```html
    <a id = "a" href = "#hello">link</a>
    <script>
      //特性
    	alert(a.getAttribute('href'));// #hello
      //属性
      alert(a.href); // http://site.com/page#hello 形式的完整 URL
      
    </script>
    ```

如果我们需要 href 特性的值，或者其他与 HTML 中所写的完全相同的特性，则可以使用 **getAttribute**。

### 非标准的特性，dataset

非标准的特性 可以用于 将自定义的数据 从 HTML 传递至 JavaScript，或者用于为 JavaScript 标记 HTML 元素。

```html
<div show-info = "name"></div>
<div show-info = "age"></div>

<script>
	let user = {
    name:"Pete",
    age:25
  };
  
  for(let div of document.querySelectorAll('[show-info]')){
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field];
  }
</script>
```

还可以用来设置元素的样式。

```html
<style>
.order[order-state = "new"]{	color:green;	}
.order[order-state = "pending"]{	color:blue;	}
.order[order-state = "canceled"]{	color:red;	}
</style>

<div class = "order" order-state = "new">
  A new order.
</div>
<div class="order" order-state="pending">
  A pending order.
</div>
<div class="order" order-state="canceled">
  A canceled order.
</div>
```

相比于创建三个class，使用特性值将更容易管理，并且可以轻松地更改状态，比删除旧的或者添加一个新的类要简单一些。

为了避免 HTML 发展一些自定义的特性名出现在标准中，存在 data-* 特性。

**所有以“data-”开头的特性均被保留供程序员使用。**

它们可以在 **dataset** 属性中使用。

```html
<body data-about = "Elephants">
<script>
 	alert(document.body.dataset.about); // Elephants 
</script>
```

像 data-order-state 这样的多词特性可以以驼峰式进行调用：dataset.orderState。

使用 data-* 特性是一种合法且安全的传递自定义数据的方式。

我们不仅可以读取数据，还可以修改数据属性。然后 CSS 会更新相应的视图。



## 修改文档（document）

 ### 创建一个元素

- **document.createElement(tag)**

  - 用给定**标签**（字符串）创建一个新的 **元素节点（element node）**

  - ```js
    let div = document.createElement('div');
    ```

- **document.createTextNode(text)**

  - 用给定文本创建一个 **文本节点**

  - ```js
    let textNode = document.createTextNode('Here I am');
    ```

### 插入方法

- **node.append(…nodes or strings)**
  - 在 node **末尾** 插入节点或字符串。
- **node.prepend(…nodes or strings)**
  - 在 node **开头** 插入节点或字符串。
- **node.before(…nodes or strings)**
  - 在 node **前面 **插入节点或字符串。
- **node.after(…nodes or strings)**
  - 在 node **后面** 插入节点或字符串。
- **node.replaceWith(…nodes or strings)**
  - 将 node 替换为 给定的节点或字符串。

可以插入任意的 DOM 节点列表，或文本字符串（会被**自动转换为文本节点**）。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220115144422466.png" alt="image-20220115144422466" style="zoom:80%;" />

这些方法可以在 **单次调用** 中插入多个 节点列表 和 文本片段。

```html
<div id = "div"></div>
<script>	
	div.before('<p>Hello</p>',document.createElement('hr'));
</script>
```

==**插入的文字都将作为文本节点插入，而不是 HTML 代码**==。

因此像 <、> 这样的符号都将会被转义处理来保证正确的显示。

因此只能用来插入 **DOM节点 或 文本片段** 。

### 插入 HTML 片段：insertAdjacentHTML / Text / Element

- **elem.insertAdjacentHTML(where, html)**
  - 该方法第一个参数是代码字（code word) 指定相对于 elem 插入的位置。
    - **“beforebegin”** 将 html 插入到 elem 之前，
    - **“afterbegin”** 将 html 插入到 elem 的开头，
    - **“beforeend”** 将 html 插入到 elem 的末尾，
    - **“afterend”** 将 html 插入到 elem 之后，
  - 第二个参数是 HTML 字符串，该字符串会被 **作为 HTML** 插入
  - <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220115150003539.png" alt="image-20220115150003539" style="zoom:80%;" />
- **elem.insertAdjacentText(where,text)**
  - 将 text 字符串作为文本插入而不是作为 HTML。
- **elem.insertAdjacentElement(where,elem)**
  - 插入一个元素

后面两个方法的存在主要是为了使语法 “统一”。

实际上，大多数时候只使用 **insertAdjacentHTML**。

因为对于元素 和 文本，我们有 append / prepend / before / after 方法。

### 节点移除：node.remove()

**node.remove()**

==**如果我们将一个元素移动到另一个地方，则无需从原来的位置中删除。**==

例如，进行元素交换：

```html
<div id = "first">First</div>
<div id = "second">Second</div>
<script>
  // 无需调用 remove
	second.after(first);
</script>
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220115151015977.png" alt="image-20220115151015977" style="zoom:80%;" />

### 克隆结点：cloneNode

获取一个类似的元素，我们可以通过创建一个函数，将代码放在其中，另外一种方法是克隆现有的 div。

当有一个很大的元素时，克隆的方式可能更快更简单。

- **elem.cloneNode(true)** —创建一个元素的**深克隆**。
  - 具有所有的**特性（attribute）**和**子元素**。
- **elem.cloneNode(false)** 
  - 克隆不包括 **子元素**

```js
let div2 = div.cloneNode(true); // 克隆
div2.querySelector('strong').innerHTML = '...'; // 修改克隆
div.after(div2); // 插入克隆节点
```

### DocumentFragment

DocumentFragment 是一个特殊的 **DOM 节点**，用作来**传递节点列表的包装器（wrapper）**。

我们可以向其附加其他节点，但是当我们将其插入某个位置时，则会插入其内容，DocumentFragment则会与位置的父节点融为一体。

```html
<ul id = "ul"></ul>
<script>
	function getListContent(){
    let fragment = new DocumentFragment();
    for(let i = 1 ;i <= 3 ; i++){
      let li = document.createElement('li');
      li.append(i);
      fragment.append(li);
    }
    return fragment;
  }
  
  ul.append(getListContent());
</script>
```

最后一行我们附加的 DocumentFragment 与ul 融为一体了。

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

DocumentFragment 很少被显式使用。因为如果可以返回一个节点数组，就没有必要附加到特殊类型的节点上：

```html
<ul id = "ul"></ul>
<script>  
  function getListContent(){    
    let result = []; 
    for(let i = 1 ;i <= 3 ; i++){     
      let li = document.createElement('li');      
      li.append(i);     
      result.push(li);    
    }   
    return result; 
  }   
  ul.append(...getListContent());
</script>
```

不过 DocumentFragment 上面还有一些概念，例如 template 元素。



### 老式的 insert / remove 方法

- **parentElem.appendChild(node)**

  - 将 node 附加为 parentElem 的**最后一个子元素**。

  - ```html
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>
    <script>
    	let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello,world';
      
      list.appendChild(newLi);
    </script>
    ```

- **parentElem.insertBefore(node,nextSibling)**

  - 在 parentElem 的 nextSibling 前插入 node。

  - ```html
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>
    <script>
    	let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello,world';
      
      list.insertBefore(newLi,list.children[1]);
    </script>
    ```

  - 将 newLi 插入为第一个元素：list.insertBefore(newLi，list.firstChild);

- **parentElem.replaceChild(node,oldChild)**

  - 将 parentElem 的 **后代** 中的 oldChild 替换为 node。

- **parentElem.removeChild(node)**

  - 从 parentElem 中删除 **后代**节点node

所有这些方法都会**返回 插入/删除 的节点**。

### document.write

非常古老的向网页添加内容的方法：document.write。

语法如下：

```html
<p>Somewhere in the page...</p>
<script>
	document.write('<b>Hello from JS</b>');
</script>
<p>The end</p>
```

调用 document.write(html) 意味着将 html 就地马上 写入页面。

html字符串可以是动态生成的，因此它很灵活。我们可以使用JavaScript 创建一个完整的页面并对其进行写入。

这个方法来自于没有 DOM ，没有标准的上古时期。

由于以下重要的限制，现代脚本中很少看到它：

**document.write 调用只在==页面加载时==工作。**

如果我们稍后调用它，那么**现有文档内容将被擦除**。

因此，它在加载完成阶段是不可用的。

它有一个好处，从技术上说，当在浏览器正在读取 传入的HTML 时调用 document.write 方法，它直接被写入到页面文本中，而此时 DOM 尚未构建。

**所以它运行起来非常快，不涉及 DOM 修改**。

因此，如果我们需要向 HTML 动态地添加大量文本，并且我们正处于页面加载阶段，并且速度很重要，那么它可能会有帮助。



### 任务

#### createTextNode vs innerHTML vs textContent

向一个空 DOM 元素 elem 中插入字符串 text时

- elem.append(document.createTextNode(text)) 
- elem.textContent = text 
- alem.append(text)

做的是相同的事情， 都是作为文本插入。

- elem.innerHTML(text)
- elem.insertAdjacentHTML(“afterbegin”,text) 

都是作为 HTML 片段插入。



#### 清除元素

错误做法：

```js
function clear(elem){
	for(let i = 0 ;i < elem.childNodes.length ; i++){
    elem.childNodes[i].remove();
  }
}
```

这是行不通的，因为调用 remove() 会从**首端开始移除 **elem.childNodes 集合中的元素。

然后，原先第二个元素的索引会变为 0。

因此，元素每次都从索引 0 开始。但 i 持续增加，因此元素会被跳过。

**使用 for..of 循环的结果也跟上面一样**。（ 因为 for..of 使用的是Symbol.iterator 本质上也是依靠索引的持续增加 ）

**正确的做法**：

```js
function clear(elem){
	while(elem.firstChild){
		elem.firstChild.remove();
	}
}
```

```js
function clear(elem){
	elem.innerHTML = '';
}
```

#### \<table>\</table>中不允许直接出现文本

```html
<table id = "table">
  aaa
  <tr>
  	<td>Test</td>
  </tr>
</table>

<script>
	alert(table);
  table.remove();//但是 aaa 仍然会存在于文本中
</script>
```

浏览器会自动修复错误的 HTML，

根据规范，\<table>\</table>中只允许特定于表格的标签。（如 td tr th），不允许直接出现文本，因此，aaa 被添加到了\<table>的前面。

#### 向元素节点中的内容附加文本

```js
elem.firstChild.data/nodeValue += "other value"
```

firstChild 可能为文本节点。

**文本节点没有 innerHTML 属性。**

也不能直接使用elem.firstChild += 

**因为所有的导航属性都是只读的。**

#### 将 HTML 插入到列表之中

\<li>2\</li>\<li>3\</li>

像这样的一个字符串中包含多个 Element ，应该使用 elem.insertAdjacentHTML(html)

### 对表格根据某一列进行排序

```js
function sortTable(table){
	let sortedRows = Array.from(table.tBodies[0].rows);
	sortedRows.sort((row1,row2)=> row1.cells[0].innerHTML.localeCompare(row2.cells[0].innerHTML))
  table.tBodies[0].append(...sortedRows)
}
```

- 使用 Array.from 来将获取到的\<tr>集合(**使用 table.tBodies[0].rows**)转换为数组
- 使用数组方法 sort
- 比较器使用 str1.localeCompare(str2)
- 将排序好的 tr 数组 追加回表格中，在交换位置时，原来位置的tr会自动被从旧位置删除。

## 样式和类

JavaScript 既可以修改 html attribute 中的 style，也可以修改类。

相较于将样式写入 style 属性，我们应该首选通过 CSS 类的方式来添加样式。仅当类“无法处理”时，才选择使用 style 属性的方式。

如果我们动态地计算元素的坐标，并希望通过 JavaScript 来设置它们，

那么使用 style 是可以接受的。

```js
elem.style.left = left;
elem.style.top = top;
```

### className 和 classList

在很久以前，JavaScript 有一个限制：像 “class” 这样的保留字不能用作对象的属性。

因此，对于类，引入了“className”。

elem.className 对应于 “class” 特性（attribute）。

```html
<body class = "main page">
  <script>
  	alert(document.body.className); // main page
  </script>
</body>
```

如果我们对 elem.className 进行赋值，它将**替换类中的整个字符串**。

但通常我们希望添加 / 删除单个类。

**elem.classList** 是一个特殊的对象，它具有 add / remove / toggle ==**单个类**==的方法。

```html
<body class = "main page">
	<script>
  	document.body.classList.add('article');
    alert(document.body.className); // main page article
  </script>
</body>	
```

- elem.classList.**add/remove(class)** — 添加/移除类。
- elem.classList.**toggle(class)** — 如果类不存在就添加类，存在就移除它。
- elem.classList.**contains(class)** — 检查给定类，返回 true / false。

**classList **是可迭代的。因此，可以使用 let..of 列出所有类。

```html
<body class = "main page">
  <script>
  	for(let name of document.body.classList){
      alert(name);
    }
  </script>
</body>
```

### 元素样式

elem.style 属性是一个对象。对应于 “style” 特性中所写的内容。

elem.style.width = “100px” 等价于 在 style 特性中有一个 width:100px 的字符串。

对于**多词属性**，使用驼峰式：

```js
background-color  => elem.style.backgroundColor
z-index           => elem.style.zIndex
border-left-width => elem.style.borderLeftWidth
```

**前缀属性**

像 -moz-border-radius 和 -webkit-border-radius 这样的浏览器前缀属性，也遵循同样的规则：**连字符 - 表示大写**。

```js
button.style.MozBorderRadius = '5px';
button.style.WebkitBorderRadius = '5px';
```

### 重置样式属性

通过 JavaScript 分配了一个样式属性之后，若想要移除，应将它赋值为一个空字符串。

```js
document.body.style.display = "none";
document.body.style.display = "";
```

设置为空字符串之后，浏览器通常会应用 CSS 类以及内建样式，就好像没有这样的 style 属性一样。

#### 用 style.cssText 进行完全的重写

通常，使用 style.* 来对各个样式属性进行赋值。

不能像 div.style = “color:red;width:200px” 设置完整的属性。

**==因为 div.style 是一个对象，并且是只读的。==**

想要使用字符串的形式设置完整的样式，可以使用 **style.cssText**：

```html
<div id = "div">Button</div>
<script>
	div.style.cssText = `color:red !important;
	background-color:yellow;
	width:100px;`;
  
  alert(div.style.cssText);
</script>
```

赋值会删除所有的现有样式，如果我们知道我们不会删除现有样式的时候，可以安全地将其用于新元素。

**可以通过设置一个特性（attribute）来实现同样的效果**

**div.setAttribute(‘style’，‘color:red…’)**

### 注意单位

将 elem.style.top 设置为一个数字不会生效。应设置为字符串 **“10px”**。

```html
<body>
  <script>
  	document.body.style.margin = 20;
    alert(document.body.style.margin); // ''空字符串，赋值被忽略了。
    
    document.body.style.margin = '20px';
    alert(document.body.style.margin); // 20px
    alert(document.body.style.marginTop);// 20px
    alert(document.body.style.marginLeft); // 20px
  </script>
</body>
```

浏览器在最后几行代码中对属性 style.margin 进行了解包，并从中推断出 style.marginLeft 和 style.marginTop。

### 计算样式： getComputedStyle

**style 属性仅对 “style” 特性的值起作用，而没有任何 CSS 级联**

> 即如果一个元素的宽度没有在 **style attribute** 中设置或是继承而来的，则没办法从style属性中获取。

因此我们无法使用 elem.style 读取来自**CSS类**的任何内容。

```html
<head>
  <style> body { color:red ; margin: 5px;}</style>
</head>
<body>
  	 The red text
  <script>
  	alert(document.body.style.color); // 空的
    alert(document.body.style.marginTop); // 空的
  </script>
</body>
```

但如果我们需要将 margin **增加** 20px，就需要使用计算属性的方式：

**getComputedStyle**

```js
getComputedStyle(element,[pseudo])
```

- **element** 需要被读取样式值的元素。
- **pseudo** 伪元素，例如 ::before 
  - **空字符串**或**无参数**则意味着**元素本身**。

结果是一个具有样式属性的**对象**，像 elem.style，但现在包括所有 CSS 类。

```html
<head>
  <style> body { color:red; margin: 5px;}</style>
</head>
<body>
  <script>
  	let computedStyle = getComputedStyle(document.body);
    alert(computedStyle.marginTop); // 5px
    alert(computedStyle.color); // rgb(255,0,0)
  </script>
</body>
```

#### 计算值和解析值

- **计算（computed）**样式值是所有CSS规则和CSS继承都应用后的值，是 CSS 级联的结果。比如 height: 1em  font-size:125%
- **解析（resolved）**样式值是最终应用于元素的样式值。具有绝对单位。如height:20px font-size:16px。 可能有浮点，是根据计算样式值 计算而来的。

很久之前，getComputedStyle 用于获取计算样式值。但后来由于 解析样式值 更方便，因此getComputedStyle 现在返回的是属性的解析值。

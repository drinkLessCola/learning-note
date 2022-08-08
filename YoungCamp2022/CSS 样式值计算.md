# CSS 选择器

- 通配符选择器 `*`
- 标签选择器 `tag`
- id 选择器 `#id`
- class 选择器 `.class`
- 属性选择器
  - `[disabled]`{}
  - `input[type=“password”]`{}
  - `a[href^=“#”]`{} `^=`以某个字符串开头
  - `a[href$=“.jpg”]`{} `$=`以某个字符串结尾
  - `a[href *= "facebook"]`{} 含有某个字符串
- 伪类选择器
  - 状态伪类
    - `:link`
    - `:visited`
    - `:hover`
    - `:active` 鼠标按下后的状态
    - `:focus`
  - 结构性伪类（根据 DOM 元素）
    - `:first-child`
    - `:last-child`
- <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220723115015967.png" alt="image-20220723115015967" style="zoom:80%;" />

# CSS 样式如何计算

![value](C:\Users\Zirina\Downloads\value.svg)

## 1.filtering  -> 声明值

`filtering`：对应用到该页面的规则用以下条件进行筛选：

- 选择器匹配
- 属性有效
- 符合当前 media

得到 **声明值**。

**声明值 Declared Values**：一个元素的某属性可能有 0 到多个声明值。

## 2、cascading  -> 层叠值

`Cascading`：找出某个元素某个属性的所有 **声明值**，并选出优先级最高的一个属性值。

按照如下顺序选择**优先级**最高的：

- 样式来源
- 选择器特异度
- 书写顺序

最终选出来的声明值 作为 **层叠值**。

<hr>

#### 2.1 样式的来源：

- 网页开发者的 CSS 样式表
- 用户的浏览器设置（如最小字体大小 / 字体）
- 浏览器的预设样式表

其中优先级是 **开发者样式** 最高， **浏览器内置样式** 最低。

开发者样式中，**内联样式 > 外部样式表 = 内部样式表**。



如果上述三个属性都具有 !important，那么此时

含 **!important 的浏览器内置样式** 优先级最高， 

含 **!important 的开发者样式** 最低。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220726123814874.png" alt="image-20220726123814874" style="zoom:80%;" />

#### 2.2 选择器的特异度（Specificity）

1. 计算选择符中 **ID 选择器**的个数 `a`
2. 计算选择符中**类选择器**、**属性选择器**以及**伪类选择器**的个数之和 `b`，
3. 计算选择符中 **标签选择器** 和 **伪元素选择器** 的个数之和 `c`。

按特异度 `a`、`b`、`c` 的顺序依次比较大小，大的则优先级高，相等则比较下一个。

若最后两个的选择符的特异度 `a`、`b`、`c` 都相等，则按照" **就近原则** "来判断：按照样式书写顺序，后面的优先级高。



## 3. Defaulting 默认值策略 -> 指定值

`Defaulting`：当层叠值为空的时候，使用继承或初始值作为 **指定值**。

- 属性可以继承，从父元素继承 **计算值** 作为指定值。
- 属性不可继承，使用 **初始值** 作为指定值。

层叠值不为空时，即使用层叠值作为**指定值**。

最终指定值一定不为空。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220726125721303.png" alt="image-20220726125721303" style="zoom:80%;" />

### 3.1 继承

- 只有某些属性是可以继承的
- 如果一直到根元素还没有继承到，使用**初始值**
- CSS 中可以使用 inherit 显式从父级继承

#### 3.1.1 css可以继承的属性：

1. 字体系列属性
   - `font`：组合字体
   - `font-family`：规定元素的字体系列
   - `font-weight`：设置字体的粗细
   - `font-size`：设置字体的尺寸
   - `font-style`：定义字体的风格
2. 文本系列属性
   - `text-indent`：文本缩进
   - `text-align`：文本水平对齐
   - `line-height`：行高
   - `word-spacing`：字(单词)间隔
   - `letter-spacing`：字符间距
   - `text-transform`：控制文本大小写
   - `direction`：规定文本的书写方向
   - `color`：文本颜色
3. 元素可见性：`visibility`
4. 表格布局属性：
   - `caption-side`
   - `border-collapse`
   - `border-spacing`
   - `empty-cells`
   - `table-layout`
5. 列表属性：
   - `list-style-type`
   - `list-style-image`
   - `list-style-position`
   - `list-style`
6. 光标属性：`cursor`

##### 初始值 对于 继承属性 与 非继承属性：

- 对于继承属性，初始值只能用于没有指定值的根元素上
- 对于非继承属性，初始值可以被用于没有指定值的任何元素上

允许使用 initial 关键词显式从父元素继承。

#### 3.1.2 使 不可继承的属性（如 box-sizing）显式继承的方法：

- 使用**通配符选择器** `*` 将 不可继承属性 设置为：inherit 显式继承。
- 为一个父级元素如 `html` 设置 该属性 为特定值，则该值会被其所有子元素显式继承。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220723161204338.png" alt="image-20220723161204338" style="zoom:80%;" />

<hr>

### 3.2 初始值

- 每个 CSS 属性都有一个规定的初始值。
- 层级链上没有找到的属性，会使用初始值。
- 可以使用 initial 关键字显式设置为初始值。

## 4. Resolving -> 计算值

`Resolving`：将一些相对值或关键字转化为绝对值，得到 **计算值**。

- 将相对值转换成绝对值，如 `em` 转为 `px`
- 处理特殊的值 `inherit` `initial` `unset` `revert`
- 相对路径转为绝对路径

**计算值 Computed Value**：浏览器在不进行实际布局的情况下，能得到的最具体的值。

- 有些元素的百分比值是相对于需要布局后才能知道的值：如`width`、`margin-right`、`text-indent`、`top`。
- `line-height` 的属性值为不带单位的相对比值。

这些相对比值会在 **使用值** 确定后再被转换为绝对数值。

## 5.Formatting  -> 使用值

`Formatting`：将计算值进一步转换，比如**关键字、百分比**等都转为绝对值，得到 **使用值**。

- 某些相对值无法单纯地通过 CSS 规则计算得出。如 body { width:90%; }
- 实际进行布局的时候才能将这些值转化 为**使用值**。

**使用值 Used Value**：进行文档布局使用的理论值，**不会再有相对值或关键字**。如400.2 px。

对于不依赖布局的 CSS 属性，其计算值与使用值一致。

**解析值 Resolved Value**：`Window.getComputedStyle()` 返回的值。

- 对于大多数属性，解析值等于其**计算值**。
- 对于一些旧属性，解析值等于 **使用值**。

## 6. Constraining -> 实际值

`Constraining`：将小数像素值转为整数，得到实际值。

- 计算出来的值受限制，需要经过处理
  - 小数点像素 -> 整数
  - 字体小于 12px
  - min-width / max-width 等

**实际值 Actual Value：**渲染时实际生效的值，如 400 px。



## 参考

1. [CSS Cascade](https://slides.com/fe-fairy/cascade#/)
2. [聊聊css属性值的计算过程](https://www.jianshu.com/p/2b88de19d3f7)
3. [刨根究底CSS（2）：CSS中的各种值——初始值，就是默认值吗？](https://zhuanlan.zhihu.com/p/267617607)

# font CSS 属性

`font`: style weight size/height family

`text-align`：文字对齐

`letter-spacing`

`word-spacing`

`text-indent`：首行缩进大小。

`text-decoration: none / underline/ line-through/ overline`

`white-space`：

- normal 
  - 连续空白符会被合并
  - 换行符当作空白符处理。
- nowrap 
  - 连续空白符会被合并
  - 换行符无效。
- pre  
  - 连续空白符会被保留
  - 在遇到换行符或\<br> 才换行。
- pre-wrap 
  - 连续空白符会被保留
  - 在遇到换行符或\<br> ，或由于填充需要才会换行。
- pre-line 
  - 连续空白符会被合并
  - 在遇到换行符或\<br> ，或由于填充需要才会换行。

# 布局相关技术：

- 常规流
  - 行级
  - 块级
  - 表格布局
  - FlexBox
  - Grid 布局
- 浮动
  - 图文绕排
- 绝对定位

## 盒模型

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220723163010196.png" alt="image-20220723163010196" style="zoom:80%;" />

容器 height:auto; 根据内容计算，元素设置 height 为一个百分比，会形成循环计算，不会生效。

### margin:auto

### margin collapse

边距合并，取一个较大的边距。



盒子内的元素全部为行级元素，则会创建一个行级格式化上下文。



overflow-wrap：break-word;


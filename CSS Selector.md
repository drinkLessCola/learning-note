# CSS Selector

## id Selector

格式：#id-selector{ … }

第一个字符必须为字母。

一个标签只能有一个id。

## Class Selector

格式： .class-selector{ … }

```html
<div class = "class1 class2"></div>
```

一个标签可以有多个class，使用空格分隔。

## Tag Selector

直接用html标签的名字选择。

p{} 选择所有的p标签。

#### 与id Selector/class Selector 一起使用

```css
div.class1 {
	...
}
```

只选择 class为 “class1”  且 标签为div 的元素。

其他class为“class1”而非div标签的元素不会被选择。

## 运用空格

```css
.className div{}
```

选取 **class为“className”** 的 html元素 的所有的 **div子元素**。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108234153732.png" alt="image-20220108234153732" style="zoom:80%;" />

不包括**class为“className”** 的 html元素本身。

而div.className不会选择子元素，只会选择class符合的html元素本身。

## 大于符号

```css
.className > div
```

选择**class = “className”**的html元素 的 **第一层子元素** 中的所有 **div**。

## 加号

```css
.className + div{}
```

选择 **class = “className”** 的html元素紧接着的下一个div。

如果下一个元素不是div元素，则不会选择任何东西。

## 波浪号

```css
.className ~ div{}
```

选取 与 **class=“className” 的html元素 处于同一层**（下方的兄弟元素中所有的div），且**在它之后**的**所有div**。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220109001502477.png" alt="image-20220109001502477" style="zoom:80%;" />

## 星号

即任何HTML标签。

```css
.className ~ *{}
```

选取 **class=“className”的html元素**下面的所有元素。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220109002109545.png" alt="image-20220109002109545" style="zoom:80%;" />

## Attribute Selector 属性选择器

通过html标签的属性去选取。

```html
<a href = "https://www.apple.com" title="Apple">Apple</a>
<a href = "https://www.google.com">Google</a>
<a href = "https://www.facebook.com">Facebook</a>
```

```css
a[title]{}
```

选取带有title属性的<a>标签。

```css
a[href = "https://www.google.com"]{}
a[href ^= "https"]{} //选取href值以"https"开头的a标签元素
a[href $= "e.com"]{} //搜索href值以..结尾的值
a[href *= "facebook"]{}//以关键字"facebook"搜索href中包含关键字的a标签元素
```

选取属性的值匹配的标签元素。

## 伪类 Pseudo Classes

```css
a:visited{} //设置浏览过的超链接的颜色
a:hover{} //鼠标悬浮于元素上时
```

选取一组多个html元素中的特定的某几个子标签元素，可以使用nth-child()

```css
.className div:nth-child(2){}
ul > li:last-child{} // ul中最后一个li
```

填写数字n为选取第n个。

填写even选取双数

填写3n[+0]选取3的倍数

## 逗号

选择符合其中一个或多个的元素。

# Flexbox

flexbox 是第一套专门用于网页布局的 CSS 方法。

许多 CSS 框架都使用 Flexbox 作为基础。



Flex 布局主要分为两个角色

- 一是 Flex Container（ Flex 容器 ） 设置 **display:flex;**
- 二是 Flex Item（ Flex 项目 ）

## flex-container 的设定

### #flex-direction

用于定义里面的 flex items 的排序方向。

默认值：**row** 横向排列  

 #主轴 main-axis ：row  

 #交叉轴 cross-axis：column

可选值：

- **column** 直向排列

  -  #主轴 main-axis ：column

     #交叉轴 cross-axis：row

- **row-reverse** 横向排列 + 倒转排列顺序

- **column-reverse**

### #justify-content & align-items

#### **justify-content**：设置主轴的排序方向。

- **center** ：flex-item 在主轴方向上居中排列。
- **flex-start** ：从起始方向开始排列。
- **flex-end** ：从结束方向开始排列。

#### **align-items**：设置交叉轴的排序方向。

- **center** ：flex-item 在交叉轴方向上居中排列。

### #flex-wrap

多个flex元素，如果总的宽度超过了flex-container的宽度，元素会自动压缩宽度，始终排在一行。

是由于 **flex-wrap** 的预设值为 **nowrap**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111101739364.png" alt="image-20220111101739364" style="zoom:80%;" />

**flex:wrap** ：超出宽度的box会被移到下一行

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111102904105.png" alt="image-20220111102904105" style="zoom:80%;" />

### #flex-flow（flex-direction + flex-wrap）

**flex-flow: row wrap** 即为 

- **flex-direction:row** 

- **flex-wrap:wrap**

### #align-content

当 flex-wrap 的设定值为 wrap 时，有多于一行 flex items 时才生效。

用于设置多行 flex items 行与行之间的对齐方式。

- flex-start：紧凑排列在起始方向
- flex-end：紧凑排列在结束方向
- center：紧凑排列在中间
- initial：初始排列？
- space-between：交叉轴方向前后不留空间，行之间均匀分配剩余空间
  - <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111104641073.png" alt="image-20220111104641073" style="zoom: 33%;" />

- space-evenly：交叉轴方向 行与行之间均匀分配剩余空间，包括开头和结尾
  - <img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111104824291.png" alt="image-20220111104824291" style="zoom:33%;" />
- space-around：行与行之间均匀分配剩余空间，开头和结尾只分配中间间隔的一半
  - space-around 和 space-evenly 的区别![image-20220111105057178](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111105057178.png)



## flex item 的设定

### #order

用于调整 flex item 的排序位置。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111105518395.png" alt="image-20220111105518395" style="zoom:80%;" />

**flex item 的 order 预设值为 0。**

排序是根据 order **由小至大**排列，小的在前。

因此在其他 item 都为默认的情况下，

将某一元素的 order 改为 -1，它会排到最前面。

将某一元素的 order 改为 1，它会排到最后。

因此 item 在 HTML 中的排列顺序 不决定 显示时的顺序。

### #align-self

用于覆写 flex container 的 align-items 设定。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111114225471.png" alt="image-20220111114225471" style="zoom:50%;" />

### #flex-basis

设定 flex-item 在主轴方向的大小。

flex-direction:row 时 为设置 flex item 的宽度

flex-direction:column 时 为设置 flex item 的高度

设定 flex-basis 之后原有的宽度或高度设定就会失效。



**flex-basis:0** ，只要没有 flex item 没有设置 overflow:hidden

那么相当于 width:0 ，大小取决于内容的大小。

**flex-basis:auto** 按照原来宽度/高度设定的大小。



### #flex-grow

当flex-container 在主轴方向有剩余空间的时候，flex-grow 为 flex item 沿主轴方向扩大的设定

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111115109381.png" alt="image-20220111115109381" style="zoom: 80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111115147256.png" alt="image-20220111115147256" style="zoom:80%;" />

由于三个 box 的 flex-grow 都等于1，它们各自占有剩余空间120px中的一份，

每个 box 便向主轴方向扩大了 40px。

**flex-grow = 0** 即保持原有的大小不扩大。



###  #flex-shrink

当 flex items 在主轴方向的大小总和超出了 flex container 的宽度时，

flex-shrink 会设置flex item 沿主轴方向怎样缩小的设定。



当我们将 flex-wrap 设置为 nowrap 时，如果 flex container宽度较小，

则每个 flex item 都会缩小相同的宽度，这是由于 **flex-shrink** 的**预设值为1**。

将 **flex-shrink** 设置为 0，则即使主轴方向空间不够，也不会缩小对应flex item。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111145059529.png" alt="image-20220111145059529" style="zoom:80%;" />

如果 **flex-shrink:1** 则每一个 flex item 都分担一份被缩小的空间，每个 box 减去 

**（超出 flex container 的宽度 ）/ flex items** 个数 的宽度。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111145428611.png" alt="image-20220111145428611" style="zoom:80%;" />

### #flex

**= flex-grow + flex-shrink + flex-basis**

**flex: 1 1 auto;**   flex item 会按照 flex container 的宽度平均分配空间去扩大或缩小。

**flex: 0 1 150px;** 每一个flex item 的宽度最多是 150 px，只会因为 flex container 的空间不足而缩小

而在flex container 有剩余空间的时候不会扩大。

**flex: 0 0 200px;** 每一个 flex item 的宽度都为 200 px，不扩大也不缩小。



## 应用

### #导航栏

```html
<ul>
  <li><a href="#">home</a></li>
  <li><a href="#">timetable</a></li>
  <li><a href="#">scadule</a></li>
  <li><a href="#">more</a></li>
  <li><a href="#">personal</a></li>
</ul>
```

```css
* {
  padding: 0;
  margin: 0;
}
ul {
  width: 100%;
  padding: 8px 0;
  background-color: #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
li {
  list-style: none;
}
ul > li > a {
  display: block;
  color: black;
  text-decoration: none;
  padding: 4px 8px;
}
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220111152119298.png" alt="image-20220111152119298" style="zoom:80%;" />

## 其他

flex-wrap 有个属性为 wrap-reverse 可以将元素顺序翻转。
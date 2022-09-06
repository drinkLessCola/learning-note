# 初识 WebGL

## html 中与绘图相关的 api：

`svg` 

`canvas`

- `canvas2d`
- `3d`
  - `webgl 3d`是`webgl`的子集
  - `webgup`

**通用 GPU** ：GPU 运算具有并发性，可以大规模地进行 AI 相关的计算。

## Why WebGL / Why GPU？

`WebGL` 是什么？

- `GPU` ≠ `WebGL` ≠ `3D`

### 现代图形系统

#### 如何将一个图像显示在显示设备上：

- `光栅（Raster）`：几乎所有的现代图形系统都是基于光栅来绘制图形的，**光栅是指构成图像的像素阵列**。
  - 图像都是点阵
- `像素（Pixel）`：一个像素对应图像上的一个点，它通常保存图像上的某个具体位置的**色彩、透明度**等信息。
- `帧缓存（Frame Buffer）`：在绘图过程中，**像素信息被存放于帧缓存中**，**帧缓存是一块内存地址**。
- `CPU（Central Processing Unit）`：中央处理单元，负责逻辑计算
- `GPU（Graphics Processing Unit）` ：图形处理单元，负责图形计算

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816095130901.png" alt="image-20220816095130901" style="zoom:80%;" />

#### **图形绘制的过程：**

1. `轮廓提取 / meshing`
   - 对轮廓进行**网格化**
   - 平面图形通常使用**三角网格**，称为**三角剖分**
   - 对 3D 的面通常有各种网格化的方法，比较常见也是使用三角网格，也有其他的多边形网格
2. `光栅化` 
   - 对网格的图源对应地进行**光栅化**
   - 将**点阵**的数据对应送至**帧缓存**之中
3. `帧缓存`
4. `渲染`
   - 读取**帧缓存**的内容，对应地显示到显示设备上

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816095236094.png" alt="image-20220816095236094" style="zoom:80%;" />

将数据处理为**光栅 / 像素阵列**，这个过程称为**渲染管线**。

不同的系统可以定制不同的渲染管线，<u>不过渲染管线是一个流程化的过程：</u>

- **将图源拼接起来，存储在帧缓存中**，最终批量渲染至设备上。



#### **为什么将处理单元分为 CPU 与 GPU？**

- `CPU：` 处理能力与运算能力比较强大的处理单元
  - 内核越多，同时处理的并发能力越强

一个图像上有很多的光栅 / 像素，`CPU` **不可能同时处理这么多的像素**，

但**每个像素对应的处理过程都非常简单**：只要计算当前像素的颜色即可。

即使 `CPU` 非常强大，但它的每个内核还是进行**串行处理**，进行图形处理，效率比较低。

**因此需要更换一种处理结构：**

- `GPU` 与 `CPU` 不同，是由**大量的小运算单元**构成的
- **每个运算单元只能处理很简单的计算**
- 每个运算单元彼此独立，因此所有计算可以**并行处理**

### WEBGL & OpenGL

`WebGL` 是 `OpenGL` 的子集，是 `OpenGL` 在浏览器端的实现。

对 `OpenGl` 的 API 做了一些剪裁。

## WebGL Startup

1. 创建 `WebGL` 上下文
2. 创建 `WebGL Program`
   - 编写 GPU 如何运算变为 像素点的颜色与透明度 等信息
   - 使用代码进行计算，`GLS` 语言
   - 具有渲染管线提供的处理代码：**折射器（Shader）**
3. 将数据存入缓冲区
4. 将缓冲区数据读取至 GPU
5. GPU 执行 WebGL 程序，输出结果

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816101027975.png" alt="image-20220816101027975" style="zoom:80%;" />

## 创建 WebGL 上下文

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816101315631.png" alt="image-20220816101315631" style="zoom:80%;" />

旧浏览器的兼容代码：

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816101327929.png" alt="image-20220816101327929" style="zoom:80%;" />

## The Shaders

WebGL 标准管线中有两个折射器：

- **顶点折射器**：处理图形轮廓
- **片源折射器**：轮廓处理好之后，光栅化之后将像素点映射到片源折射器中，以进行颜色处理。

![image-20220816101646255](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816101646255.png)

![image-20220816101655154](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816101655154.png)

## 创建 Program

利用**顶点折射器**与**片源折射器**编写创建 Program ：

`attachShader` 关联 折射器与 `program`

将 `program` link 至 `WebGL` 上下文

通过 `useProgram` 即可使用当前 `program` 去处理要渲染的图像

```js
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertex)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragment)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attackShader(program, vertexShader)
gl.attackShader(program, fragmentShader)
gl.linkProgram(program)

gl.useProgram(program)
```



## Data to Frame Buffer

**坐标系**：

- `HTML` 左上角为坐标原点
- `WebGL`：以 `Canvas` 的中心点为坐标原点，`X` 轴向右， `y` 轴向上，3d `Z` 轴向外。坐标值是归一化的，每个坐标轴上的最小坐标为 `-1`，最大坐标为 `+1`。

`WebGL` 操作数据是通过 JS 中的 `TypedArray` 存储信息。

`bindBuffer` 进行数据绑定

`bufferData` 将数据送至缓冲区

```js
const bufferId = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
gl.bufferData(gl.ARRAY_BUFFER, gl.STATIC_DRAW)
```

## 将帧缓冲 Frame Buffer 送至 GPU

获得某个变量的指针：`getAttribLocation()`

图形的多个顶点在 `WebGL` 中是同时并行计算，

因此只需一个向量进行表示，顶点折射器被同时执行了顶点数次。

position 第一次等于 数组第一项，第二次等于 数组第二项，以此类推。

```js
// 获取顶点着色器中的 position 变量的地址
const vPosition = gl.getAttribLocation(program,'position')
// 给变量设置长度和类型
gl.vertexAttributePointer(vPosition, 2, gl.FLOAT, false, 0, 0)
// 激活这个变量
gl.enableVertexAttribArray(vPosition)
```

```js
attribute vec2 position;
void main() {
	gl_PointSize = 1.0;
	gl_Position = vec4(position, 1.0, 1.0)
}
```

## Output

- 清除颜色缓冲区
- `drawArray` 绘制送入缓冲区的数据

```js
l.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2)
```

`WebGL` 支持 **点、线、三角形** 的图源

`Shader` 将内部区域的像素的处理传递给片段折射器 `Fragment`

使用 `RGBA` 进行颜色表示，但 `WebGL` 中是浮点数表示，最大值是1，最小值是0



## WebGL

### 2D Canvas vs WebGL

```js
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

ctx.beginPath()
ctx.moveTo(250, 0)
ctx.lineTo(500, 500)
ctx.fillStyle = 'red'
ctx.fill()
```

`canvas` 的坐标系与 web 一致

坐标原点在左上角。

### 2D

2D 底层也是使用 GPU 进行绘制。

如果需要对每个点的颜色进行计算，

- Canvas 需要使用一个 **for 循环**，性能较差
- WebGL 可以**通过 Shader 并行渲染**

如果需要绘制多个图形，

- `Canvas / 2d` 是一个指令系统，仍然需要使用 for 循环进行渲染，且需要人工传入每个三角形的位置。
- `WebGL` 只需将多个图形的顶点取出来，存在一个大数组中
  - 对数组进行压缩，将顶点全部结构化之后
  - 将顶点的每个批次直接传递给渲染管线，在渲染管线的顶点折射器中同时处理多个像素点，片源折射器同时处理所有图形像素点的颜色，直接渲染出来，只需一次绘制。

性能差别很大。

## 绘制多边形

2D 支持 `path`。

多边形通用是进行**三角剖分**，可以对 WebGL 进行一个封装。 `mesh.js`。

`WebGL` 没办法绘制多边形，但可以通过三角剖分将它们转换为三角形：

- 常见的多边形都有成熟的三角剖分的算法。
- 多边形分为：凹多边形，凸多边形，复杂多边形（边有互相交叉）
- 将顶点扁平化之后，使用Earcut 进行三角剖分，将图形变为若干个三角形，
- 再传入 WebGL 对每个图源进行绘制。



<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816105900898.png" alt="image-20220816105900898" style="zoom: 80%;" />

使用 Earcut 进行三角剖分：

```js
const vertices = [
	[-0.7, 0.5],
	[-0.4, 0.3],
	[-0.25, 0.71],
	[-0.1, 0.56],
	[-0.1, 0.13],
	[0.4, 0.21],
	[0, -0.6],
	[-0.3, -0.3],
	[-0.6, -0.3],
	[-0.45, 0.0],
]
const points = vertices.flat()
const triangles = earcut(points)
```

## 3D Meshing

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816110406566.png" alt="image-20220816110406566" style="zoom:80%;" />

不会实时对一个3D 图形进行三角剖分，而是使用离线工具制作模型，导出三角形的数据，再导入 WebGL 的代码里。

WebGL 支持将复杂图形通过三角剖分分解为多个三角形，在WebGL中对多个图源进行渲染。

## Transforms

**平移：**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816110621522.png" alt="image-20220816110621522" style="zoom:80%;" />

**旋转：**

![image-20220816111126427](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816111126427.png)

**缩放：**

![image-20220816111211136](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816111211136.png)

旋转与缩放是线性变换，可以写作矩阵计算。

平移不是一个线性计算，通过齐次矩阵将其与其他变换统一起来。

若干次线性变换的结果得到的新矩阵作为线性变换的矩阵。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816111351931.png" alt="image-20220816111351931" style="zoom:80%;" />

旋转缩放平移 = 线性变换 + 平移

也可以写成矩阵形式。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816111403144.png" alt="image-20220816111403144" style="zoom:80%;" />

2D 的线性变换需要写成 三维线性矩阵进行处理。

## 3D Matrix

3D 标准模型的四个齐次矩阵（mat4）

1. **投影矩阵 Projection Matrix**
   - 处理坐标系，设定坐标系的最大值/最小值，是左手系还是右手系，方向
2. **模型矩阵 Model Matrix**
   - 对模型的顶点做线性变换，改变图形的大小，位置，旋转方向
3. **视图矩阵 View Matrix**
   - 3D 绘图里的视角问题，模拟一个摄像机，在某个位置进行观察，可以不去改变物体的模型矩阵，
   - 对复杂图形进行转换，需要计算数量巨大的点的变换，不如改变摄像机的位置
4. **法向量矩阵 Normal Matrix**
   - 3D 物体表面的每个点，都有一个垂直向外的法线
   - 通过法向量矩阵来定义法线的信息
   - 计算光照的信息，通过光线与法线的夹角来计算这个位置接收到的光照，赋予对应的颜色
   - 可以模拟光照在不是平面的物体上的效果。

##  crypto 应用

```js
const { randomBytes } = require("crypto")

#version 300 es
precision highp float;
```

### 使用条件分支语句

#### 使左边半个矩形与右边半个矩形的颜色不同：

```js。
uniform vec2 dd_resolution; // 二维矩阵
out vec4 fragColor;	// 四维矩阵 颜色
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution // 得到归一化的 st 的坐标
  if(st.x > 0.5) {
    fragColor = vec4(1,1,1,1)
  }
}
```

#### 左上角与右下角颜色不同

```js
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution
  if(st.x > st.y) { // 右下三角
    fragColor = vec4(1,1,1,1)
  }
}
```

### 直接使用数值

用 if 语句处理不是很好，并行计算使用条件分支有额外开销

可以直接使用数值。

#### 使左边半个矩形与右边半个矩形的颜色不同：

```js
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution // 得到归一化的 st 的坐标
  fragColor = vec4(vec3(step(0.5, st.x)),1)
  // step 是一个阶梯函数，当 x 大于 0.5 时，step 的值是 1，否则是 0
}
```

#### 左上角与右下角颜色不同

```js
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution
  fragColor = vec4(vec3(step(st.y, st.x)),1)
}
```

#### 绘制很多的 10 * 10 的黑白三角形

直接渲染，不会有性能开销

```js
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution
  st *= 10.0 // copy了十份
  st = fract(st); // 对每份都取了 0-1 的小数部分
  fragColor = vec4(vec3(step(st.y, st.x)),1)
}
```

### 绘制一条线

#### 竖线

```js
void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution // 得到归一化的 st 的坐标
  fragColor = vec4(vec3(step(0.49, st.x) - step(0.51, st.x)),1)
}
```

#### 斜线

**计算点到线的距离:**

`| BC x BA | = |BC| * |BA| * sinθ`

几何意义上相当于两条向量作为邻边构成的平行四边形的面积。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220812084125210.png" alt="image-20220812084125210" style="zoom:50%;" />

除以底边的长度，即可得到对应的高，即点到线的距离。

```js
// 求解点到线的距离
float distance(vec2 a, vec2 b, vec2 st){
  vec2 p = b - a; 	// AB
  vec2 q = st - a; 	// AC
  float d = (p.x * q.y - p.y * q.x) / length(p)
  return abs(d);
}

void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution
  // 计算 st 到 -1,-1 1,1 的距离
  // 通过改变向量的值可以绘制其他直线 vec2(-1,-1.5) vec2(0.5, 1)
  float d = distance(vec2(-1), vec2(1), st)
  // 到对角线距离小于 0.01 的为 1，其余为 0
  fragColor.rgb = vec3(step(d, 0.01))
  fragColor.a = 1.0
}
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220812083658210.png" alt="image-20220812083658210" style="zoom:80%;" />

### 绘制线段

1. 垂线 CD 刚好落在线段 AB 上 = 到直线的距离
2. 垂线 CD 落在线段 AB 的延长线上
3. 垂线 CD 落在线段 AB 的反向延长线上

![image-20220816123434010](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816123434010.png)

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816123546617.png" alt="image-20220816123546617" style="zoom:50%;" />

**如何判断是否落在延长线上：**通过 投影的长度 与 AB 向量的符号来判断。

`AB * AC`  = AC 在 AB 上的投影 * AB 的长度

`|AB| * |AC| * cosθ`

```js
float sdf_lineSeg(vec2 a, vec2 b, vec2 st) {
  vec2 p = b - a		// AB
  vec2 q = st - a		// AC
  vec2 r = st - b		// BC

  float l = length(p)	// |AB|
  float d = distance(a, b, st)	// C 到线段 AB 的距离
  float proj = (p.x * q.x + p.y * q.y) / l // AC 在 AB 上投影的长度
  // 落在线段上
  if(proj >= 0.0 && proj < l) return d

  return min(length(q), length(r))
}

void main(){
  vec2 st = gl_FragCoord.xy / dd_resolution;
  // 左下角为原点
  float d = sdf_lineSeg(vec2(0.2), vec2(0.6), st)
  fragColor.rgb = vec3(step(d, 0.01))
  fragColor = vec4(vec2(step(0.4, st.x) - step(0.5, st.x)), rand(st.x + st.y * 0.03), 1)
  fragColor.a = 1.0
}
```

![image-20220812084012031](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220812084012031.png)



### Shader 实现伪随机数

```js
float rand(float x){
  // 取了小数点后面的 4 位
  float r = fract(10000.0 * abs(sin(x)))
  return r
}
```

原理 sin 值在小数点后9位可以看作是随机的。

![image-20220816123622419](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220816123622419.png)

## 噪声

随机的值是不连续的，在随机的两个数之间进行线性插值，使它们连续。

常用于模拟自然界山川，河流的运动。

有序与无序的结合。局部是无序的，但在整体上是有一定规律性的。

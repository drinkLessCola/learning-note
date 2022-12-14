### 数据类型 

#### 基本数据类型

- Number
- String
- Boolean
- undefine
- null

ES6新增

- BigInt
- Symbol

#### 引用数据类型

- object
- function

存储在堆中，引用地址操作

### 执行环境栈  ECStack

浏览器提供的运行JS代码的环境 栈内存

#### EC(G) 全局执行上下文 Execution Context Global

##### VO(G) 全局变量对象 Variable Object Global

```js
let a = 12  
//先创建一个基本数据类型的值 12，
//直接存在执行环境栈，即栈内存中，
//然后创建一个全局变量a，让a与12关联。

let b = a
//创建全局变量b,然后让b的值与a的值关联
b=13; 
//创建值13，然后让b和13关联，没有改变a的值。
```

```js
let a={n:12};
//开辟一个单独的堆内存，获取一个16进制的地址
//将键值对保存到堆内存中
//将堆内存的地址放到栈内存里面，供变量调用
//让a与地址关联到一起
let b=a;
//b也与地址关联到一起
b['n']=13;
//通过关联的地址找到堆内存，将属性名为n的成员的值改为13
console.log(a.n);
//a受到了影响
```

## 闭包

```js
let a=0,
	b=0;
function A(a){
	A = function(b){
		console.log( a + b ++);
		
	};
	console.log(a++);
}
A(1);
A(2);
```

> --------------------------------------
>
> EC(G) 全局执行上下文
>
> ------------------------------------------------------
>
> > VO(G) 全局变量对象
> >
> > | a    | 0                                         |
> > | ---- | ----------------------------------------- |
> > | b    | 0                                         |
> > | A    | ~~AAAFFF000~~  BBBFFF000 （赋值操作更改） |
> >
> > --------------------------------------------------
> >
> > A(1) 	//第一次执行函数A
> >
> > A(2) 	//BBBFFF000执行
> >
> > --------------------------------------------------



函数会开辟一个堆内存

创建函数的时候就已经**声明了作用域**：创建时候所在的上下文

> #函数堆 AAAFFF000（地址）
>
> -----------
>
> 作用域[[scope]]:EC(G)
>
> 形参：a
>
> 代码字符串：“A=function…”
>
> --------------------------------------------------

**每一个函数执行都会形成一个全新的==私有上下文==**

函数执行第一件事情：初始化作用域链

分为两个部分：

- 链的左端是自己的上下文，

- 右端是**当前函数创建时所在的作用域**

（当前上下文+上级上下文）

在代码执行过程中如果遇到一个变量，首先看是否是自己的私有变量，如果不是就找上级上下文

EC(A1)

> -----------------------------------
>
> 私有变量对象 AO(A1) (Active Object)
>
> ----------------------------------------------
>
> 作用域链：<EC(A1)，EC(G)>
>
> 形参赋值： 
>
> a    →      ~~1~~ 2
>
> 代码执行：
>
> ​	A=function(b){…} //赋值操作先创建值，有一个自己的堆内存
>
> ​	//执行赋值操作，让A等于函数的地址
>
> ​	//在作用域链找A，发现不是自己上下文的私有变量，因此按照	作用域链往上级的上下文中查找，修改了全局下的A
>
> ​	console.log(a++);
>
> ​	=> 1

私有上下文代码执行完毕，

发现**私有上下文创建**的堆BBBFFF000

被**当前上下文以外**的全局下的A占用了

因此当前上下文不能被释放，形成了闭包。

==**闭包：当前函数执行，形成一个私有的上下文，当函数执行完，当前私有上下文中的某些内容，被上下文以外的内容占用，那么当前上下文就不能被释放。**==

**==闭包的作用：==**

- 保护它的私有变量不受外界干扰，
- 保存私有变量

函数堆 BBBFFF000

> [[scope]]:EC(A1)
>
> 形参：b
>
> “console.log(…)”

EC(A2) 私有上下文

> AO(A2)
>
> b       →          ~~2~~ 3
>
> ---------------
>
> 作用域链：<EC(A2)，EC(A1)>
>
> 形参赋值：b=2
>
> 代码执行：
>
> console.log(a+b++)
>
> //EC(A2)中没有a这个变量，往上级上下文中寻找，
>
> //a为EC(A1)中的私有变量 a=2
>
> ​			a EC(A1)  2
>
> ​			b EC(A2)  2
>
> => 4

EC(A2)的上下文执行完成后，

没有内容被外部变量占用，则默认释放掉。
# JavaScript

如今，JavaScript 不仅可以在浏览器中执行，也可以在服务端执行，甚至可以在任意搭载了 [JavaScript 引擎](https://en.wikipedia.org/wiki/JavaScript_engine) 的设备中执行。

浏览器中嵌入了 JavaScript 引擎，有时也称作“JavaScript 虚拟机”。

不同的引擎有不同的“代号”，例如：

- [V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) —— Chrome 和 Opera 中的 JavaScript 引擎。
- [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) —— Firefox 中的 JavaScript 引擎。
- ……还有其他一些代号，像 “Chakra” 用于 IE，“ChakraCore” 用于 Microsoft Edge，“Nitro” 和 “SquirrelFish” 用于 Safari，等等。

网页中的 JavaScript 不能读、写、复制和执行硬盘上的任意文件。它没有直接访问操作系统的功能。

现代浏览器允许 JavaScript 做一些文件相关的操作，但是这个操作是受到限制的。仅当用户做出特定的行为，JavaScript 才能操作这个文件。例如，用户把文件“拖放”到浏览器中，或者通过 `<input>` 标签选择了文件。

不同的标签页/窗口之间通常互不了解。有时候，也会有一些联系，例如一个标签页通过 JavaScript 打开的另外一个标签页。但即使在这种情况下，如果两个标签页打开的不是同一个网站（域名、协议或者端口任一不相同的网站），它们都不能相互通信。

这就是所谓的“同源策略”。为了解决“同源策略”问题，两个标签页必须 **都** 包含一些处理这个问题的特定的 JavaScript 代码，并均允许数据交换。本教程会讲到这部分相关的知识。

## 基础知识

### Hello World

#### Script 标签

#### 标签的特性 attribute

- type： 在 HTML 4 标准中要求script标签要有type特性，<Script type="text/javascript">
- ~~language：显示脚本使用的语言，默认为JavaScript,不再使用。~~

- src：引入外部JavaScript文件
  - 如果设置了src，script标签内容将会被忽略
    - script src="file.js">alert(1);</script //此内容会被忽略
  - 绝对路径
    - script src="/path/to/script.js"></script
  - 相对路径
    - script src="script.js"> 
      表示当前文件夹中的"script.js"文件
    - 也可以使用URL地址    script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script
    - 附加多个脚本 使用多个标签
    - 简单的脚本嵌入HTML中 复杂的脚本存放在单独的文件中，浏览器会下载独立文件，保存到浏览器的缓存中，之后，其他页面想要相同的脚本就会从缓存中获取，而不是重复下载。——这样可以节省流量，使页面加载的更快。

### 代码结构

JavaScript将换行符理解成隐式的分号

①但如果是未完成的表达式则不会。

②alert(“…”)

[1,2].forEach(alert)

无分号的变体（variant）会出现报错，是因为 JavaScript 并不会在方括号 `[...]` 前添加一个隐式的分号。

### 变量

#### JavaScript 的变量命名有两个限制：

1. 变量名称必须仅包含字母，数字，符号 `$` 和 `_`。
2. 首字符必须非数字。
3. 单独的‘$’和‘_’可以作为变量名。
4. 允许非英文字母，但不推荐

#### 声明变量

let,var

不声明启用use strict 严格模式，可以通过赋值来声明变量。

num=5; //如果变量‘num’不存在，就会被创建

#### 常量

const xxx=123,

未知常量可以使用常规命名，页面加载后进行初始赋值

const pageLoadTime=/\*网页加载所需的时间\*/

不能修改

已知常量（“硬编码（hard-coded）”的常量）命名，使用大写字母和下划线来命名这些常量

const COLOR_RED=“#F00”；

### 数据类型

JavaScript有8种基本的数据类型，包括7中原始类型和1种引用类型。

“动态类型”（dynamically typed）的编程语言

允许我们将任何类型的值存入变量。

#### -原始类型

##### number

代表整数和浮点数。

特殊数值：

- Infinity 无穷大 
- -Infinity
- NaN        not a number
  - ==是粘性的，任何对NaN的进一步操作都会返回NaN==

数学运算是安全的，脚本不会因为一个致命的错误而停止，最坏只会得到NaN的结果。

##### BigInt

在JavaScript中，“number”类型无法表示大于（2^53^-1)或小于（-2^53^-1）的整数。

有时需要很大的数字 如用于加密或微秒精度的时间戳。

BigInt用于表示任意长度的整数。

==可以通过将n附加到整数字段的末尾来创建BigInt值。==

const bigInt=1234567890123456789012345678901234567890n;

**兼容性问题**

==IE不支持BigInt。==

##### String

JavaScript中，有三种包含字符串的方式。

- 双引号：“Hello”

- 单引号：‘Hello’

- 反引号：\`Hello`

  - 反引号是功能扩展引号，允许我们将==变量和表达式==包装在${…}中，来将它们嵌入到字符串中。

  - ```js
    let name=“John”
    alert(`Hello,${name}!`);//嵌入变量
    alert(`the result is ${1+2}`);//嵌入表达式
    ```

JavaScript中没有character类型。只有string 一个字符串可以包含零个（为空）、一个或多个字符。

##### Boolean

只包含 true和 false

布尔值也可作为比较的结果

```js
let isGreater = 4 > 1;
alert( isGreater );
```

##### null

只有一个 null 值的独立类型。

##### undefined

 只有一个 undefined 值的独立类型。

一个变量已被声明但未被赋值，那么他的值就是undefined

可以将undefined显式的赋值给变量，但不建议。

通常使用null将一个‘空’或者‘未知’的值写入变量中，而 `undefined` 则保留作为未进行初始化的事物的默认初始值。

### 引用类型

#### object      symbol

其他所有的数据类型都被称为“原始类型”，因为它们的值只包含一个单独的内容。相反，object则用于储存数据类型集合和更复杂的实体。

symbol类型用于创建对象的唯一标识符。

#### typeof 运算符

以字符串的形式返回参数的数据类型，可以用于分别处理不同类型值，或者想快速进行数据类型检验时。

两种语法：

- 作为运算符 typeof x
- 函数形式 typeof(x)

typeof undefined // "undefined"

typeof 0 // "number"

typeof 10n // "bigint"

typeof true // "boolean"

typeof "foo" // "string"

typeof Symbol("id") // "symbol"

typeof Math // "object"  (1) Math是一个提供数学运算的内建object

typeof null // "object"  (2) 特殊情况

typeof alert // "function"  

​				(3) alert是JavaScript语言的一个函数。隶属于object类型

### 交互：alert、prompt、confirm

#### alert

显示信息。

弹出一个模态窗 “modal” 意味着用户不能与页面的其他部分进行交互，直到他们处理完窗口

==返回值为undefined。==

#### prompt

显示信息要求用户输入文本。

result=prompt(title,[default]);

显示一个带文本消息的模态窗口，还有input框和确定/取消按钮。

#title 显示给用户的文本

#default 可选的第二个参数，指定input框的初始值

==prompt将返回用户在input框内输入的文本，赋值给result==

==如果用户取消了输入，则返回null。==

##### IE浏览器会提供默认值

- 第二个参数是可选的，如果不提供，IE会把“undefined”插入prompt.

- 所以在ie中建议始终提供第二个参数
  - let test=prompt(“Test”,‘’)；

#### confirm

显示信息等待用户点击确定或取消。

result=confirm(question);

显示一个带有question以及确定和取消两个按钮的模态窗口。

==点击确定返回true，点击取消返回false。==

### 类型转换

大多数情况下，运算符和函数会自动将赋予他们的值转换为正确的类型。

比如，alert 会自动将任何值都转换为字符串以进行显示。

算术运算符会将值转换为数字。

#### 字符串转换

- 输出内容时，如alert(value)，隐式转换value的类型为字符串。

- 显式调用String(value)

#### 数字型转换

- 算术操作时隐式转换。
  - alert(“6”/“2”);  //3
  - 字符串转换为数字时，会忽略字符串的首尾处的空格字符。在这里，整个字符串由空格字符组成，包括 `\t`、`\n` 以及它们之间的“常规”空格。因此，类似于空字符串，所以会变为 `0`。
- ==通过一元运算符+ 转换== （等效于Number(value))

- 显式调用Number(Value)

  - 从String类型源（如文本表单）中读取一个值，但期望输入一个数字时，通常需要进行显式转换。

  - 如果该字符串不是一个有效的数字，转换的结果为NaN

  - 转换规则

    | 值         | 变成……                                                       |
    | ---------- | ------------------------------------------------------------ |
    | underfined | NaN                                                          |
    | null       | 0                                                            |
    | true/false | 1/0                                                          |
    | string     | 去掉首尾空格后的纯数字字符串中含有的数字。①如果剩余字符串为空，转换结果为0，②否则会从剩余字符串中读取数字，③当类型转换出现error时返回NaN。 |

#### 布尔型转换

- 逻辑运算中隐式转换
- 显式调用Boolean(value)
  - 转换规则：
    - 直观上为空的值(“假值（falsy）”)：0 空字符串“” null undefined NaN 变为false
    - 其他值变为true 包括“0” “ ”



### 基础运算符

#运算元：运算符应用的对象，5*2有两个运算元 左运算元5和右运算元2 又称参数

一元运算符：一个运算符对应的只有一个运算元。如一元负号运算符‘-’

二元运算符：一个运算符对应两个运算元。如减号‘–’

#### 数学

+，-，*，/，%，**求幂

##### 求幂**

a**b      a的b次方

4**（1/2） 对幂的定义也适用于非整数  平方根是以1/2为单位的求幂



#### 用二元运算符+连接字符串

- 合并字符串
  - 只要有任意一个运算元为字符串，那么另一个运算元也被转化为字符串
  - alert(‘1’+2);//“12”
  - alert(2+‘1’); //“21”
  - alert(2+2+‘1’);//“41”
    - 运算符按顺序工作
- 只有二元+这样支持字符串，其他算术运算符只对数字起作用，并且总是将其运算元转换为数字
  - alert(6-‘2’); //“4”
  - alert(‘6’/‘2’); //“3”

#### 数字转换 一元运算符+

- +单个值 对数字没有任何作用
- 运算元不是数字 +会将其转换为数字，与Number()等效
  - alert(+true); //1
  - alert(+“”); //0

let apples = "2";
let oranges = "3";

alert( apples + oranges ); // "23"，二元运算符加号合并字符串

// 在二元运算符加号起作用之前，所有的值都被转化为了数字

//==一元运算符优先级高于二元运算符==

alert( +apples + +oranges ); // 5

// 更长的写法
// alert( Number(apples) + Number(oranges) ); // 5



#### 运算符优先级

- 一元运算符>二元运算符
- 相同优先级从左向右

#### 赋值运算符

##### 赋值=返回一个值

x=value 将值value写入x然后返回x

*let c = 3 - (a = b + 1);*

### 值的比较

比较结果为boolean类型

比较字符串使用“字典顺序”(Unicode编码顺序)按字符逐个进行比较。

#### 不同类型间的比较

JavaScript会首先将其转化为数字再判断大小。

#### 严格相等

区分0和false，空字符串

严格相等运算符===在进行比较时不会做任何的类型转换

如果a，b属于不同的数据类型，那么a===b不会做任何的类型转换而立刻返回false

严格不相等 !==



#### 对null和undefined进行比较

- ==null`==`undefined== 

  - JavaScript的特殊规则，仅仅等于对方而不等于其他任何值
  - undefined 和 null 在相等性检查 == 中不会进行任何的类型转换

- null!==undefined  因为属于不同的类型

- 当使用数学式或其他比较方法`< > <= >=`时 

  - null/undefined 会被转化为数字0/NaN

    - ```javascript
      alert( null > 0 );  // (1) false
      alert( null == 0 ); // (2) false
      alert( null >= 0 ); // (3) true
      ```

    - 因为相等性检查 `==` 和普通比较符 `> < >= <=` 的代码逻辑是相互独立的。进行值的比较时，`null` 会被转化为数字，因此它被转化为了 `0`。这就是为什么（3）中 `null >= 0` 返回值是 true，（1）中 `null > 0` 返回值是 false。

    - ==`undefined` 和 `null` 在相等性检查 `==` 中不会进行任何的类型转换==，它们有自己独立的比较规则，所以除了它们之间互等外，不会等于任何其他的值。这就解释了为什么（2）中 `null == 0` 会返回 false。



### 条件分支

#### 多个‘?’

let age = prompt('age?', 18);

let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';

alert( message );

#### ‘?’的非常规使用（不推荐）

使用?来代替if语句：

let company = prompt('Which company created JavaScript?', '');

(company == 'Netscape') ?
   alert('Right!') : alert('Wrong.');

### 逻辑运算符

#### || 或

##### 或||运算寻找第一个真值

result=value1 || value2 || value3;

从左到右依次计算操作数

处理每一个操作数将其转化为布尔值，结果如果为true，就停止计算，返回这个操作数的初始值。

如果所有的操作数都被计算过，结果都为false，则返回最后一个操作数。

==返回的值是操作数的初始形式，不会做布尔转换。==

##### 用法

###### 获取变量列表或者表达式中的第一个真值。

alert( a || b || c || “Anonymous” );

###### 短路求值

操作数可以为表达式（变量赋值或函数调用）

true || alert("not printed");
false || alert("printed");

只有||左侧条件为假时才执行命令。

#### && 与

##### 与&&运算寻找第一个假值

result = value1 && value2 && value3;

从左到右依次计算操作数

处理每一个操作数将其转化为布尔值，结果如果为false，就停止计算，返回这个操作数的初始值。

如果所有的操作数都被计算过，结果都为true，则返回最后一个操作数。

==与运算 && 的优先级比或运算 || 要高。==



#### ！ 非

将操作数转化为布尔类型，返回相反的值。

==两个非运算!!有时候用来将某个值转化为布尔类型。==

==等效于Boolean()函数。==

alert(!!null); //false



==优先级在所有逻辑运算符中最高，总是在&&和||之前执行。==

### 空值合并运算符 ??

**a??b** 的结果是

- 如果a为已定义的，则结果为a，

- 如果a不是已定义的(即a为 null/undefined)，则结果为b

相当于(a!\==null&&a!==undefined)?a:b;

#### 使用场景

##### 为可能未定义的变量提供一个默认值

let user;

alert(user??“Anonymous”)；

##### 从一系列的值（列表）中选出第一个非null/undefined（已定义）的值。

alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder

##### 与||比较

重要区别是

-  || 返回第一个真值。
- ??返回第一个已定义的值。

换句话说，==`||` 无法区分 `false`、`0`、空字符串 `""` 和 `null/undefined`==。它们都一样 —— 假值（falsy values），但实际的数据可能为有效值0 ， 空字符串。如果其中任何一个是 `||` 的第一个参数，那么我们将得到第二个参数作为结果。

不过在实际中，我们可能只想在变量的值为 `null/undefined` 时使用默认值。也就是说，当该值确实未知或未被设置时。

#### 优先级

优先级很低，在‘?’和‘=’之前计算，但在大多数其他运算符之后计算，使用的时候记得加括号。



#### ??和&&或||一起使用

==JavaScript禁止将??运算符与&&和||一起使用，除非用括号明确指定了优先级。==

*它被添加到语言规范中是为了避免人们从 `||` 切换到 `??` 时的编程错误。*



### 循环

continue指令利于减少嵌套

禁止 break /continue 在 ? 的右边

- (i > 5) ? alert(i) : *continue*; // continue 不允许在这个位置

#### break /continue 标签

labelName:for(…){

…….

break labelName; //跳出循环至标签处

}

### Switch

被比较的值必须是相同数据类型才能进行匹配。（严格相等）



### 函数

函数对外部变量拥有全部的访问权限。函数也可以修改外部变量。

> 闭包的机制？

#### 参数

作为参数传递给函数的值，会被复制到函数的局部变量。

#### 默认值

如果未提供某一个参数，那么其默认值为 undefined

##### 设置默认值：

​	function fun(a,==text=“no text given”==){}

也可以为一个更复杂的表达式

​	function fun2(a, ==text = anotherFunction()==) {}

##### 后备的默认参数：

function showMessage(text) {
①  if (text === undefined) {
    text = 'empty message';
  }…

② text = text || 'empty';

③ **text=text??'empty';**//0 / 空字符串会被视为正常值

==**空值合并运算符  ？？**== 

}

#### 返回值

1. **空值return（return;） 或 没有 return 的函数返回值为 undefined**
2. **不能在return与返回值之间添加新行**，因为JavaScript会默认在return后面加上分号。如果我们想要将返回的表达式写成跨多行的形式，那么应该在 `return` 的同一行开始写此表达式。或者至少按照如下的方式放上左括号：

```js
return (
  some + long + expression + or +
	whatever * f(a) + f(b)
  )
```



### 函数表达式

#### 函数声明

在主代码流中 **声明为单独的语句**  的函数.

```
function sayHi() {
  alert( "Hello" );
}

*alert( sayHi ); // 显示函数代码
```

在 JavaScript 中，函数是一个值，所以我们可以把它当成值对待。

上面代码显示了一段字符串值，即函数的源码。

let func=sayHi;

func(); //Hello

也可以复制函数到其他变量。

#### 函数表达式

**作为表达式的一部分创建的** 函数。下面这个函数是在赋值表达式 `=` 右侧创建的：

let sayHi = function() {
  alert( "Hello" );
};

==结尾有一个分号==

#### 回调函数

```js
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

function showOk() {
  alert( "You agreed." );
}

function showCancel() {
  alert( "You canceled the execution." );
}

// 用法：函数 showOk 和 showCancel 被作为参数传入到 ask
ask("Do you agree?", showOk, showCancel);
```

==ask两个参数值 showOK, showCancel 可以被称为回调函数，或简称回调。==

我们传递一个函数，并期望在稍后必要时将其回调。

```js
function ask(question, yes, no) {
  if (confirm(question)) yes();
  else no();
}

ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
```

这里==直接在 ask(...) 调用内进行函数声明。这两个函数没有名字，所以叫 **匿名函数**。==

这样的函数在 ask 外无法访问（因为没有对它们分配变量），不过这正是我们想要的。

JS预编译 会寻找全局函数声明，并创建这些函数，处理完全部函数声明后，代码才会执行。

函数在被声明前也是可见的。

如果是函数表达式，就只有变量的声明被提前，而不进行 变量的赋值，即函数表达式的执行。

### 箭头函数

let func=(arg1,arg2,…,argN)=>expression

相当于：

```
let func = function(arg1, arg2, ...argN) {
  return expression;
};
```

如果只有一个参数，还可以省略掉参数外的圆括号

let double=n=>n*2;

如果没有参数，括号为空，但仍应保留

let sayHi =()=>alert(“hello!”);

可以像函数表达式一样使用，如动态创建一个函数：

let welcome =(age<18)?

()=>alert(‘Hello’):

()=>alert(‘Greetings!’);

#### 多行的箭头函数

let sum=(a,b)=>{

let result=a+b;

return result;//需要显式地return

};

### JavaScript特性

即使我们在某处添加了「额外的」分号，这也不是错误。分号会被忽略的。

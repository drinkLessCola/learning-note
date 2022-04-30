# Object 对象 基础知识

## 对象

### 大纲

对象是具有一些特殊特性的关联数组。

它们存储属性（键值对）：

- 属性的键必须是字符串或者symbol
- 值可以是任何类型

访问属性的方式：

- 点符号 obj.property
- 方括号 obj[“property”] 允许从变量中获取键

其他操作：

- 删除属性 delete obj.prop
- 检查是否存在给定键的属性 “key” in obj
- 遍历对象 for(let key in obj)

以上为普通对象（Plain object)

JavaScript 中很多其他类型的对象：

- Array 用于存储**有序数据集合**。
- Date 用于存储时间日期。
- Error 用于存储错误信息。





通过带有可选**属性列表**的花括号{…}来创建对象。

一个属性就是一个==键值对==(“key:value”)

- key是一个==**字符串**==（也叫属性名）
- value可以是任何值。

创建一个空的对象：

```js
let user =new Object();//构造函数的语法

let user={};//字面量的语法
```

==使用花括号的方式，称为字面量。==

### 文本和属性

我们可以在创建对象的时候，立即将一些属性以键值对的形式放到{…}中。

```JS
let user = {
  name:"John",
  age:30
};
```

键(名字/标识符):值

 访问属性值：user.name

添加属性：user.isAdmin=true;

移除属性：delete user.age；

==也可以用多字词语来作为属性名，但必须给它们加上引号：==

```js
let user={
  “likes birds”:true,
};
```

列表中最后一个属性应以逗号结尾：

这叫做尾随（trailing）或悬挂（hanging）逗号。这样便于我们添加、删除和移动属性，因为所有的行都是相似的。

### 使用const声明的对象是可以被修改的

```js
const user = {
  name: "John"
};

user.name = "Pete"; // (*)

alert(user.name); // Pete
```

const声明只**固定了user的值**，而不是值（该对象）里面的内容。

仅当我们尝试将 user=… 作为一个整体进行赋值时，const会抛出错误。

==有另一种将对象属性变为常量的方式。==

### 方括号

对于多词操作，点操作就不能用了：

```js
// 这将提示有语法错误
user.likes birds = true
```

点符号要求key时有效的变量标识符。这意味着：不包含空格，不以数字开头，也不包含特殊字符（允许使用$和_）

方括号可以用于任何字符串：

```js
let user={};
//设置
user["likes birds"]=ture;
//读取
alert(user["likes birds"]);
//删除
delete user["likes birds"];
```

方括号中的字符串要放在引号中，单引号或双引号都可以。

#### 方括号允许从变量中获取键

方括号同样提供了一种可以通过任意表达式来获取属性名的方法 —— 跟语义上的字符串不同 —— 比如像类似于下面的变量：

```js
let key = "likes birds";

// 跟 user["likes birds"] = true; 一样
user[key] = true;
```

在这里，变量 key 可以是程序运行时计算得到的，也可以是根据用户的输入得到的。

然后我们可以用它来访问属性。这给了我们很大的灵活性。

**点符号不能以类似的方式使用**

### 计算属性

当创建一个对象时，可以在对象字面量中使用方括号。

==这叫做**计算属性**==

```js
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // 属性名是从 fruit 变量中得到的
};
/*等同于*/
let bag = {};
// 从 fruit 变量中获取值
bag[fruit] = 5;
/*---*/

alert( bag.apple ); // 5 如果 fruit="apple"
```

我们可以在方括号中使用更复杂的表达式：

```js
let fruit = 'apple';
let bag = {
  [fruit + 'Computers']: 5 // bag.appleComputers = 5
};
```

方括号比点符号更强大。它允许任何属性名和变量，但写起来也更加麻烦。

所以，大部分时间里，当属性名是已知且简单的时候，就使用点符号。如果我们需要一些更复杂的内容，那么就用方括号。



### 属性值简写

通过变量生成属性，如果属性名与变量名一样，可以采取属性值简写的方式。

也可以把属性名简写方式和正常方式混用。

```
function makeUser(name, age) {
  return {
    name, // 与 name: name 相同
    age,  // 与 age: age 相同
    // ...
  };
}
```

### 属性名称限制

变量名不能是某个保留字，如for let return 

==但对象的属性名不受此限制。==

属性命名没有限制，可以是任何字符串或者symbol，

==**其他类型会被自动地转换为字符串。**==

例如，当数字 `0` 被用作对象的属性的键时，会被转换为字符串 `"0"`：

```js
let obj = {
  0: "test" // 等同于 "0": "test"
};

// 都会输出相同的属性（数字 0 被转为字符串 "0"）
alert( obj["0"] ); // test
alert( obj[0] ); // test (相同的属性)
```

==一个名为 `__proto__` 的属性。我们不能将它设置为一个非对象的值：==

```js
let obj = {};
obj.__proto__ = 5; // 分配一个数字
alert(obj.__proto__); // [object Object] — 值为对象，与预期结果不同
```

### 属性存在性测试  “in”操作符

JavaScript 的对象有一个需要注意的特性：能够被访问任何属性。即使属性不存在也不会报错！

==读取不存在的属性只会得到 `undefined`。==所以我们可以很容易地判断一个属性是否存在：

- 与undefined进行比较
  - if(user.noSuchProperty===undefined);
- 还可以使用“in”操作符
  - “key” in object

```js
let user={name:“John”,age:30,};

alert(“age” in user);//true
alert(“blabla” in user);//false
```

in的左边必须是属性名，通常是一个带引号的字符串，

如果省略引号，意味着左边是一个变量，应该包含要判断的实际属性名。

let key = "age"; 

alert( *key* in user ); 

#### in 与 undefined

如果属性存在，但存储的值为undefined时：

- 使用in操作符判断，会得到正确结果
- 使用undefined，则不行

这种情况很少发生，因为通常情况下不应该给对象赋值 `undefined`。我们通常会用 `null` 来表示未知的或者空的值。因此，`in` 运算符是代码中的特殊来宾。

 

### “for…in”循环

为了遍历一个对象的所有键，可以使用一个特殊形式的循环：==for..in==

for(key in object){

}

```js
let user = {
  name: "John",
  age: 30,
  isAdmin: true
};

for (let key in user) {
  // keys
  alert( key );  // name, age, isAdmin
  // 属性键的值
  alert( user[key] ); // John, 30, true
}
```

所有的 “for” 结构体都允许我们在循环中定义变量，像这里的 let key。

同样，我们可以用其他属性名来替代 key。例如 "for(let prop in obj)" 也很常用。

### 对象的排序

对象有特别的顺序：

- **整数属性**会被进行排序
- 其他属性则按照创建的顺序显示

```js
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};

for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
```

对象可用于面向用户的建议选项列表。

如果我们的网站主要面向德国观众，那么我们可能希望 `49` 排在第一。

但如果我们执行代码，会看到完全不同的现象：

- USA (1) 排在了最前面
- 然后是 Switzerland (41) 及其它。

因为这些电话号码是整数，所以它们以升序排列。所以我们看到的是 `1, 41, 44, 49`。

#### 整数属性

==指的是一个可以在不做任何更改的情况下与一个整数进行相互转换的字符串。==

```js
// Math.trunc 是内置的去除小数部分的方法。
alert( String(Math.trunc(Number("49"))) ); // "49"，相同，整数属性
alert( String(Math.trunc(Number("+49"))) ); // "49"，不同于 "+49" ⇒ 不是整数属性
alert( String(Math.trunc(Number("1.2"))) ); // "1"，不同于 "1.2" ⇒ 不是整数属性
```

所以，为了解决电话号码的问题，我们可以使用**非整数属性名**来 欺骗程序。只需要给每个键名加一个加号 `"+"` 前缀就行了。

像这样：

```js
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for (let code in codes) {
  alert( +code ); // 49, 41, 44, 1
}
```



### 检查空对象

```js
function isEmpty(obj)
{
	for(let key in obj)
        // 如果进到循环里面，说明有属性。
		return false;
	return true;
}
```

## 对象方法 this

存储在对象属性中的函数被称为方法。

方法可以将对象引用为this。

方法可以简写

```js
user = {
  sayHi: function() {
    alert("Hello");
  }
};

// 方法简写看起来更好，对吧？
let user = {
  sayHi() { // 与 "sayHi: function()" 一样
    alert("Hello");
  }
};
```

调用方式

- user.f()
- user\[‘f’]();





### 方法中的“this”

this的值是在代码运行的时候计算出来的，它取决于代码上下文。

以“方法”的语法调用函数时：object.method(),调用过程中this值是object。

在没有对象的情况下调用：

- 严格模式下 this==undefined
- 非严格模式 this==全局变量（浏览器中的window）

### 箭头函数没有自己的“this”

```js
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```



在箭头函数中引用this，this值取决于外部“正常的”函数。

当我们并不想要一个独立的this,反而想从外部上下文中获取时很有用。

## 构造器和操作符“new”

常规的{…}语法允许创建一个对象，但需要创建许多类似对象，如多个用户或菜单项的时候，可以使用构造函数和“new”操作符来实现。

构造器的主要目的：实现可重用的对象创建代码。

### 构造函数

构造函数在技术上是常规函数

- 命名以大写字母开头。
- 只能由“new”操作符来执行。

```js
function User(name)
{
     // this = {};（隐式创建）
	this.name=name;
    this.isAdmin=false;
      // return this;（隐式返回）
}
let user = new User("Jack");
alert(user.name);//Jack
alert(user.isAdmin);//false
```

==当一个函数被使用new操作符执行时，它按照以下步骤：==

1.一个新的空对象被创建并分配给this

2.函数体执行。通常会修改this，为其添加新的属性。

3.返回this的值。



从技术上讲，任何函数（除了箭头函数，它没有自己的this)都可以用作构造器。即可以通过new来运行，它会执行上面的算法。

==首字母大写是一个共同的约定==，以明确表示一个函数将被使用new来运行。



### 创建单个复杂对象

如果我们有许多行用于创建**单个复杂对象**的代码，我们可以将它们封装在一个立即调用的构造函数中，像这样：

```javascript
let user = new function() {
  this.name = "John";
  this.isAdmin = false;

  // ……用于用户创建的其他代码
  // 也许是复杂的逻辑和语句
  // 局部变量等
};
```

==这个构造函数不能被再次调用==，因为它不保存在任何地方，只是被创建和调用。因此，这个技巧旨在封装构建单个对象的代码，而无需将来重用。

### 构造器模式测试：new.target

在一个函数内部，可以使用new.target属性来检查它是否被使用new进行调用了。判断该函数是被通过new调用的“构造器模式”，还是没被通过new调用的“常规模式”。

==对于常规调用，它为空，对于使用new的调用，则等于该函数。==

```js
function User() {
  alert(new.target);
}

// 不带 "new"：
User(); // undefined

// 带 "new"：
new User(); // function User { ... }
```

**也可以让new调用和常规调用做相同的工作**

```js
function User(name){
	if(!new.target) return new User(name)；
	this.name=name;
}

let john=User("John");
alert(john.name);//John
```

### 构造器的return

通常，构造器没有return语句，它们的任务是将所有必要的东西写入this，并自动转换为结果。

构造器的return：

- 如果return返回的是一个对象，则返回这个对象，而不是this.
- 如果return返回的是一个原始类型，则忽略，返回this。

```js
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" };  // <-- 返回这个对象
}
alert( new BigUser().name );  // Godzilla，得到了那个对象

function SmallUser() {
  this.name = "John";
  return; // <-- 返回 this
}
alert( new SmallUser().name );  // John

```

`如果没有参数，我们可以省略new后的括号`

```js
let user = new User; // <-- 没有参数
// 等同于
let user = new User();
```

### 构造器中的方法

```js
function User(name) {
  this.name = name;

  this.sayHi = function() {
    alert( "My name is: " + this.name );
  };
}
let john = new User("John");
john.sayHi(); // My name is: John
```

JavaScript为许多内置的对象提供了构造函数，比如日期Date、集合Set……

## 可选链“?.”

是一种访问嵌套对象属性的安全的方式，即使中间属性不存在，也不会出现错误。

可选链 `?.` 语法有三种形式：

1. `obj?.prop` —— 如果 `obj` 存在则返回 `obj.prop`，否则返回 `undefined`。
2. `obj?.[prop]` —— 如果 `obj` 存在则返回 `obj[prop]`，否则返回 `undefined`。
3. `obj.method?.()` —— 如果 `obj.method` 存在则调用 `obj.method()`，否则返回 `undefined`。

### “不存在的属性”的问题

如果用户没有提供某一个对象属性，当我们尝试获取的时候，会得到错误。

在web开发中，我们可以通过dom方法以对象的形式获取一个网页元素，如果没有这种对象，则返回null。

let html =document.querySelector(‘.elem’).innerHtml;

如果该元素不存在，访问null的.innerHtml会出错。

### 解决

#### 使用if或者条件运算符？对该值进行检查

```js
let user = {}; // user 没有 address 属性

alert(user.address ? user.address.street ? user.address.street.name : null : null);
```

对于嵌套层次更深的属性就会出现更多次这样的重复。

每一层都需要检查。

#### 使用&&运算符

```js
alert( user.address && user.address.street && user.address.street.name ); // undefined（不报错）
```

依次对整条路径上的属性使用与运算进行判断，以确保所有节点是存在的（如果不存在，则停止计算），但仍然会重复写好几遍对象属性名。

### 可选链

如果可选链==?.==前面的部分是undefined 或者 null ，它会停止运算并返回该部分。

例如`value?.prop`：

- 如果 `value` 存在，则结果与 `value.prop` 相同，
- 否则（当 `value` 为 `undefined/null` 时）则返回 `undefined`。

下面是一种使用?.安全地访问user.address.street的方式：

```js
let user={};

alert(user?.address?.street);//undefined
```

即使 对象 `user` 不存在，使用 `user?.address` 来读取地址也没问题：

```javascript
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```

`?.` 语法使其前面的值成为可选值，但不会对其后面的起作用。

例如，在 `user?.address.street.name` 中，`?.` 允许 `user` 为 `null/undefined`，但仅此而已。更深层次的属性是通过常规方式访问的。如果我们希望它们中的一些也是可选的，那么我们需要使用更多的 `?.` 来替换 `.`

#### 不要过度使用可选链

我们应该只将 `?.` 使用在一些东西可以不存在的地方。

例如，如果根据我们的代码逻辑，`user` 对象必须存在，但 `address` 是可选的，那么我们应该这样写 `user.address?.street`，而不是这样 `user?.address?.street`。

所以，如果 `user` 恰巧因为失误变为 undefined，我们会看到一个编程错误并修复它。否则，代码中的错误在不恰当的地方被消除了，这会**导致调试更加困难**。

#### ?.前的变量必须已声明

如果未声明变量user，那么user?.anything 会触发一个错误。

==可选链只适用于已声明的变量==

### 短路效应

如果?.左边部分不存在，就会立即停止运算。

### 其它变体：?.() , ?.[]

==可选链?.不是一个运算符，而是一个特殊的语法结构。==

####  ?.()用于调用一个可能不存在的函数(方法)。

```js
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};

let userGuest = {};

userAdmin.admin?.(); // I am admin

userGuest.admin?.(); // 啥都没有（没有这样的方法）
```

首先使用点符号（`userAdmin.admin`）来获取 `admin` 属性，因为用户对象一定存在，因此可以安全地读取它。

然后 `?.()` 会检查它左边的部分：如果 `admin` 函数存在，那么就调用运行它（对于 `userAdmin`）。否则（对于 `userGuest`）运算停止，没有错误。



#### ?.[]用于从一个可能不存在的对象上安全地读取属性。

```js
let user1 = {
  firstName: "John"
};

let user2 = null; // 假设，我们不能授权此用户

let key = "firstName";

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined

alert( user1?.[key]?.something?.not?.existing); // undefined
```



#### 我们可以使用?.来安全地读取或删除，但不能写入

** `?.` 跟 `delete` 一起使用：**

```javascript
delete user?.name; // 如果 user 存在，则删除 user.name
```



## Symbol类型

根据规范，对象的属性键只能是字符串类型或者Symbol类型。

### Symbol

“Symbol”值表示唯一的标识符。

可以使用Symbol()来创建这种类型的值。

```js
// id 是 symbol 的一个实例化对象
let id = Symbol();
```

创建时，我们可以给Symbol一个描述（也称为Symbol名）

```js
// id 是描述为 "id" 的 Symbol
let id = Symbol("id");
```

Symbol保证是唯一的，即使我们创建了许多具有相同描述的Symbol，它们的值也是不同，描述只是一个标签，不影响任何东西。

```js
let id1 = Symbol("id");
let id2 = Symbol("id");

alert(id1 == id2); // false
```

#### **Symbol 不会被自动转换为字符串**

```js
let id = Symbol("id");
alert(id); // 类型错误：无法将 Symbol 值转换为字符串。
```

这是一种防止混乱的“语言保护”，因为字符串和 Symbol 有本质上的不同，不应该意外地将它们转换成另一个。

如果我们真的想显示一个 Symbol，我们需要在它上面调用 `.toString()`，如下所示：

```js
let id = Symbol("id");
alert(id.toString()); // Symbol(id)，现在它有效了
```

或者获取 symbol.description属性，只显示描述（description）

```js
let id = Symbol("id");
alert(id.description); // id
```

### “隐藏”属性

Symbol允许我们创建对象的“隐藏”属性，代码的任何其他部分都不能意外访问或重写这些属性。

```js
let user = { // 属于另一个代码
  name: "John"
};

let id = Symbol("id");

user[id] = 1;

alert( user[id] ); // 我们可以使用 Symbol 作为键来访问数据
```

使用 `Symbol("id")` 作为键，比起用字符串 `"id"` 来有什么好处呢？

因为 `user` 对象属于其他的代码，那些代码也会使用这个对象，所以我们不应该在它上面直接添加任何字段，这样很不安全。

但是你添加的 Symbol 属性不会被意外访问到，第三方代码根本不会看到它，所以使用 Symbol 基本上不会有问题。

另外，假设另一个脚本希望在 `user` 中有自己的标识符，以实现自己的目的。这可能是另一个 JavaScript 库，因此脚本之间完全不了解彼此。

然后该脚本可以创建自己的 `Symbol("id")`，像这样：

我们的标识符和它们的标识符之间不会有冲突，因为 Symbol 总是不同的，即使它们有相同的名字。

……但如果我们处于同样的目的，使用字符串 `"id"` 而不是用 symbol，那么 **就会** 出现冲突：

```javascript
let user = { name: "John" };

// 我们的脚本使用了 "id" 属性。
user.id = "Our id value";

// ……另一个脚本也想将 "id" 用于它的目的……

user.id = "Their id value"
// 砰！无意中被另一个脚本重写了 id！
```

如果我们想要向“属于”另一个脚本或者库的对象添加一个属性，我们可以创建一个 Symbol 并使用它作为属性的键。

- Symbol 属性不会出现在 `for..in` 中，因此它不会意外地被与其他属性一起处理。

- 并且，它不会被直接访问，因为另一个脚本没有我们的 symbol。

因此，该属性将受到保护，防止被意外使用或重写。

### 对象字面量中的Symbol

如果我们要在对象字面量 `{...}` 中使用 Symbol，则需要使用方括号把它括起来。

就像这样：

```javascript
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```

这是因为我们需要变量 `id` 的值作为键，而不是字符串 “id”。

### Symbol在for…in中会被跳过

Symbol属性不参与for..in循环。

例如：

```js
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key); // name, age (no symbols)

// 使用 Symbol 任务直接访问
alert( "Direct: " + user[id] );
```

Object.keys(user)会忽略它们，

相反**Object.assign** 会同时复制字符串和symbol属性。

```js
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

当我们克隆或者合并一个object时，通常希望所有属性被复制，包括像id这样的Symbol。

### 全局symbol

正如我们所看到的，通常所有的 Symbol 都是不同的，即使它们有相同的名字。但有时我们想要==名字相同的 Symbol 具有相同的实体==。例如，应用程序的不同部分想要访问的 Symbol `"id"` 指的是完全相同的属性。

为了实现这一点，这里有一个 **全局 Symbol 注册表**。我们可以在其中创建 Symbol 并在稍后访问它们，它可以确保每次访问相同名字的 Symbol 时，返回的都是相同的 Symbol。

==要从注册表中读取（不存在则创建）Symbol，请使用 Symbol.for(key)。==

该调用会检查全局注册表，如果有一个描述为 `key` 的 Symbol，则返回该 Symbol，否则将创建一个新 Symbol（`Symbol(key)`），并通过给定的 `key` 将其存储在注册表中。

例如：

```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 Symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 Symbol
alert( id === idAgain ); // true
```

注册表内的 Symbol 被称为 **全局 Symbol**。如果我们想要一个应用程序范围内的 Symbol，可以在代码中随处访问 —— 这就是它们的用途。

### Symbol.keyFor

Symbol.for(key)按名字返回一个Symbol,

Symbol.keyFor为反向调用，通过全局Symbol返回一个名字。使用全局Symbol注册表来查找Symbol的键，所以不适用于非全局Symbol。

```js
// 通过 name 获取 Symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 通过 Symbol 获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

如果Symbol不是全局的，它将无法找到它并返回undefined。

也就是说，任何Symbol都具有description属性。

```js
let globalSymbol = Symbol.for("name");
let localSymbol = Symbol("name");

alert( Symbol.keyFor(globalSymbol) ); // name，全局 Symbol
alert( Symbol.keyFor(localSymbol) ); // undefined，非全局

alert( localSymbol.description ); // name
```

### 系统Symbol

JavaScript 内部有很多“系统” Symbol，我们可以使用它们来微调对象的各个方面。

它们都被列在了 [众所周知的 Symbol](https://tc39.github.io/ecma262/#sec-well-known-symbols) 表的规范中：

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.iterator`
- `Symbol.toPrimitive`
- ……等等。

我们将使用 Symbol.iterator 来进行 迭代 操作，使用 Symbol.toPrimitive 来设置 对象原始值的转换 等等。

从技术上说，Symbol 不是 100% 隐藏的。

有一个内置方法 Object.getOwnPropertySymbols(obj) 允许我们获取所有的 Symbol。

还有一个名为 Reflect.ownKeys(obj) 的方法可以返回一个对象的 所有 键，包括 Symbol。

所以它们并不是真正的隐藏。但是大多数库、内置方法和语法结构都没有使用这些方法。

## 对象 — 原始值转换

1. 所有的对象==在布尔上下文（context）中均为 true==。所以对于对象，不存在 to-boolean 转换，只有字符串和数值转换。
2. 数值转换发生在对象相减或应用数学函数时。例如，`Date` 对象（将在 [日期和时间](https://zh.javascript.info/date) 一章中介绍）可以相减，`date1 - date2` 的结果是两个日期之间的差值。
3. 至于字符串转换 —— 通常发生在我们像 `alert(obj)` 这样输出一个对象和类似的上下文中。

### ToPrimitive

当一个对象被用在需要原始值的上下文中时，例如，在 `alert` 或数学运算中，对象会被转换为原始值。

下面是三个类型转换的变体，被称为 “hint”。

#### “string”

对象到字符串的转换，当我们对期望一个字符串的对象执行操作时，如 “alert”：

```javascript
// 输出
alert(obj);

// 将对象作为属性键
anotherObj[obj] = 123;
```

#### “number”

对象到数字的转换，例如当我们进行数学运算时：

```javascript
// 显式转换
let num = Number(obj);

// 数学运算（**除了二元加法**）
let n = +obj; // 一元加法
let delta = date1 - date2;

// 小于/大于的比较
let greater = user1 > user2;
```

#### “default”

在运算符不确定期望值的类型时。

① 二元加法+可用于字符串连接，也可用于数字，所以字符串和数字这两种类型都可以。

==当二元加法得到对象类型的参数时，它将依据 `"default"` hint 来对其进行转换。==

② 如果==对象被用于与字符串、数字或 symbol 进行 `==` 比较==，这时到底应该进行哪种转换也不是很明确，因此使用 `"default"` hint。

```js
// 二元加法使用默认 hint
let total = obj1 + obj2;

// obj == number 使用默认 hint
if (user == 1) { ... };
```

③ 大于/小于 比较运算符，也可以同时用于字符串和数字。不过，它们使用“number”hint,而不是“default”。

除了一种情况（`Date` 对象，我们稍后会学到它）之外，通常对于内建对象，`"default"` hint 的处理方式与 `"number"` 相同，因此在实践中，最后两个 hint 常常合并在一起。

### 转换方法

1. 调用obj\[Symbol.toPrimitive](hint)——带有symbol键 Symbol.toPrimitive 的方法，如果该方法存在。
2. 如果hint为“string”，尝试obj.toString()和obj.valueOf()。
3. 如果hint为“number”或者”default”——尝试obj.valueOf() 和 obj.toString() 

### Symbol.toPrimitive

内建symbol，用来给转换方法命名。

```js
obj[Symbol.toPrimitive]=function(hint){

 // 返回一个原始值  // hint = "string"、"number" 和 "default" 中的一个

}
```

```javascript
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

从代码中我们可以看到，根据转换的不同，`user` 变成一个自描述字符串或者一个金额。单个方法 `user[Symbol.toPrimitive]` 处理了所有的转换情况。

### toString/valueOf

是常规的字符串命名的方法。

如果没有Symbol.toPrimitive，JavaScript将尝试找到它们，并且按照下面的顺序进行尝试。

- 对于“string”hint , toString->valueOf。
- 其他情况，valueOf -> toString。

这些方法必须返回一个原始值。如果 `toString` 或 `valueOf` 返回了一个对象，那么返回值会被忽略。

默认情况下，普通对象具有 `toString` 和 `valueOf` 方法：

- `toString` 方法返回一个字符串 `"[object Object]"`。
- `valueOf` 方法返回对象自身。

```js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
```

```js
let user = {
  name: "John",
  money: 1000,

  // 对于 hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // 对于 hint="number" 或 "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

通常我们希望有一个“全能”的地方来处理所有原始转换。在这种情况下，我们可以只实现 `toString`，就像这样：

```javascript
let user = {
  name: "John",

  toString() {
    return this.name;
  }
};

alert(user); // toString -> John
alert(user + 500); // toString -> John500
```

如果没有 `Symbol.toPrimitive` 和 `valueOf`，`toString` 将处理所有原始转换。

### 返回类型

原始转换方法不一定会返回“hint”的原始值。

没有限制 `toString()` 是否返回字符串，或 `Symbol.toPrimitive` 方法是否为 hint “number” 返回数字。

唯一强制性的事情是：这些方法必须返回一个原始值，而不是对象。



由于历史原因，如果 `toString` 或 `valueOf` 返回一个对象，则不会出现 error，但是这种值会被忽略（就像这种方法根本不存在）。这是因为在 JavaScript 语言发展初期，没有很好的 “error” 的概念。

相反，`Symbol.toPrimitive` **必须** 返回一个原始值，否则就会出现 error。

### 进一步的转换

我们已经知道，许多运算符和函数执行类型转换，例如乘法 `*` 将操作数转换为数字。

如果我们将对象作为参数传递，则会出现两个阶段：

1. 对象被转换为原始值（通过前面我们描述的规则）。
2. 如果生成的原始值的类型不正确，则继续进行转换。


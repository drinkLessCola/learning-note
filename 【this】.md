# this

##

this 是一个关键字，被自动定义在所有函数的作用域中。

### 为什么使用 this

要在不同的上下文对象中使用相同的函数，可行的方式有：

- **针对每个对象编写不同版本的函数** 
- **通过函数参数显式传递上下文对象**。

而 this 提供了一种方式来隐式传递一个对象引用，因此可以将 API 设计得更加**简洁**并且**易于复用**。

### this 指向

this 不指向函数自身。

this 不指向函数的作用域。

this 在任何情况下都不指向函数的词法作用域，因为词法作用域存在于引擎内部。

#### 在函数内部引用自身

1. 具名函数：通过指向函数对象的词法标识符（变量）来引用。
2. 匿名函数：arguments.callee 引用当前正在运行的函数对象。（已被弃用）
3. 显式绑定 this，使用 .call()



**this 在运行时绑定，值只取决于函数调用时的各种条件。**

当一个函数被调用时，会创建一个**活动记录**（**执行上下文**）。

该记录包括 **this，函数的调用栈，调用方式，传入的参数** 等信息。



# this 全面解析

调用位置：在当前正在执行的函数的前一个调用中。

## 2.2 绑定规则

### ① 默认绑定

应用场景：

- 独立函数调用。
- 无法应用其他规则时的默认规则。

this 指向全局对象。

- 非严格模式 指向 window
- 函数运行在严格模式下 指向 undefined

### ② 隐式绑定

应用场景：函数引用有上下文对象时。

this 值指向上下文对象上。

- 对象属性引用链只有最后一层在调用位置中起作用。

#### 隐式丢失

- 隐式绑定的函数赋值给另一个变量
- 回调函数

此时应用默认绑定。

### ③ 显式绑定

应用场景：**call() / apply()**。

直接指定 this 的绑定对象。

- 如传入原始值，会自动装箱。

- 仍然存在绑定丢失的问题。

**硬绑定**：显式的强制绑定。解决绑定丢失的问题。

- 创建一个包装函数，在包装函数中 调用 func.call(obj)

- bind() 返回一个**硬编码**的新函数。

  - 会将指定的参数设置为 this 的值并调用原始函数。

  - ```js
    //polyfill
    // 会判断硬绑定函数是否被 this 调用，
    // 是的话会使用新创建的 this 替换硬绑定的 this。
    if(!Function.prototype.bind){
    	Function.prototype.bind = function (oThis){
    		if(typeof this !== 'function'){
          // isCallable()
          throw new TypeError()
        }
        
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function(){},
            fBound = function(){
              return fToBind.apply(
                (
                	this instanceof fNOP && oThis ? this : oThis
              	),
                aArgs.concat(
                  Array.prototype.slice.call(arguments)
                );
              )
            }
        	fNOP.prototype = this.prototype
        	fBound.prototype = new fNOP();
        	return fBound
    	}
    }
    ```

    

**API 调用的上下文**：内置函数提供的可选参数，指定回调函数的 this 。

### ④ new 绑定

构造函数：被 new 操作符调用的普通函数。

构造函数调用：通过 new 进行函数调用。

- 创建一个新对象。
- 将新对象的 [[prototype]] 值指定为构造函数的原型对象。
- 将该新对象绑定到函数调用的 this。
- 执行函数体代码。
- 如果函数返回的不是非空对象，则自动返回这个新的对象。

构造一个新对象并绑定到函数调用的 this 上。



## 2.3 优先级

1. new 绑定
2. 显式绑定
3. 隐式绑定
4. 默认绑定

在 new 中使用硬绑定函数：柯里化，预先设置函数的一些参数。

```js
function foo(p1,p2){
	this.val = p1 + p2
}
var bar = foo.bind(null, "p1")
var baz = new bar('p2')
baz.val; //p1p2
```

## 2.4 绑定例外

### 1. 忽略 this

将 null / undefined 传入 call / apply / bind，将会使用**默认绑定**。

传入 null 的场景：

- apply 展开数组，并当作参数传入函数
  - ES6 可以使用 展开运算符 替代。
- bind 参数柯里化

更安全的 this:

Object.create(null) 创建出来的空对象 比 {} 更空，不具有原型 Object.prototype。

### 2. 间接引用

```js
function foo(){	console.log(this.a) }
var a = 2
var o = {a: 3, foo}
var p = {a: 4}
(p.foo = o.foo)() //2
```

赋值表达式的返回值` (p.foo = o.foo)` 为目标函数的引用，因此调用位置为 foo()。

### 3. 软绑定

给默认绑定指定一个 全局对象和 undefined 以外的值。

同时保留隐式绑定或显式绑定修改 this 的能力。

```
if(!Function.prototype.softBind){
	Function.prototype.softBind = function(obj){
		var fn = this;
		var curried = [].slice.call(arguments, 1)
		var bound = fucntion (){
			return fn.apply(
				(!this || this === (window || global))? obj : this,
				curried.concat.apply(curried, arguments)
			)
		}
		bound.prototype = Object.create(fn.prototype)
		return bound
	}
}
```

## 2.5 this 词法

箭头函数 根据**外层作用域来决定 this**。

**箭头函数的绑定无法被修改。**

两种代码风格：

- 只使用词法作用域并完全抛弃 this 风格的代码。
- 完全采用 this 风格，在必要时使用 bind()，尽量避免使用 self = this 和箭头函数。


# this

this 是一个指针，指向调用函数的对象。

## this 绑定规则

1. 默认绑定
2. 隐式绑定
3. 硬绑定
4. new 绑定

## 默认绑定

不能应用其他绑定规则时使用的默认规则，通常是独立函数调用。

this 指向全局对象，非严格模式下为 window，严格模式下为 undefined。

## 隐式绑定

函数的调用是在某个对象上触发的，在调用位置存在上下文对象。

调用时会使用调用者的上下文来引用函数，把函数调用中的 this，绑定到这个上下文对象。

- 对象属性链中只有最后一层会影响到调用位置。

- 隐式绑定很容易丢失。

  - 如回调函数：

  ```js
  var obj = {
  	sayHi:function(){
      setTimeout(function(){
        console.log('Hello', this.name)
      })
      // setTimeout 的回调函数使用的是默认绑定，指向 window
    }
  }
  ```

  ```js
  function sayHi(){
  	console.log('hello, ', this.name);
  }
  var obj2 = {
  	name:'a',
  	sayHi:sayHi
  }
  // person2.sayHi 被赋值给了一个变量，之后执行了变量。
  setTimeout(person2.sayHi, 100);
  ```

## 显式绑定

通过 `call`，`apply`，`bind` 的方式，显式地指定 this 所指向的对象。

- 第一个参数，为对应函数的 this 所指向的对象。
- `call` 和 `apply` 作用一样，并且都会执行对应的函数，只是传参方式不同。
- `bind` 方法不会执行函数。

bind 又称硬绑定。

### 显式绑定时传入 null、undefined

如果将 null 或者 undefined 作为 this 的绑定对象传入 call、apply、bind

这些值在调用的时候会被忽略，实际应用的是默认绑定规则。

## new 绑定

使用 new 调用函数的时候，会将创建的新实例绑定到函数的 this 上。

## 绑定优先级

new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定

## 箭头函数

箭头函数没有自己的 this。

- 不能用 new 调用箭头函数，否则会抛出错误。
- 箭头函数没有自己的 this，不能通过显式绑定的方式改变 this 的指向。
- 箭头函数没有 arguments 对象。
- 不能使用 yield 指令，因此箭头函数不能用作 Generator 函数。


# 箭头函数中的 this

箭头函数中的 this 在其定义时就已经确定，即为其定义时所在的作用域的this（指向的对象）。

箭头函数的 this 不能通过 bind/call/apply 进行更改



### 普通函数中的 this

func(args) === func.call(undefined, args)

obj.func(args) === obj.func.call(obj, args)

### 构造函数中的 this

构造函数在通过 new 调用之后会返回一个对象，这个对象就是 this，也就是  context 上下文。

### setTimeout / setInterval 函数中的 this

默认为 window 对象， 可以通过 call/apply 改变。

```js
let p = {
  a: function () {
    var obj = {
      i: 10,
      b: () => {console.log(this.i, this)},
      c: function () {
        console.log(this.i, this)
      }
    }
    obj.b()
  }
}
p.a()
```

箭头函数的 this 指向function a 作用域的this，即调用 a 的对象 p 
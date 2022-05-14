## useCallback

需要与 子组件的 `React.memo` 和 `shouldComponentUpdate` 一起配合使用。

使用场景：

函数式组件每次渲染都会重新创建函数。

向子组件的 props 传递了函数，那么当子组件使用  `React.memo` 和 `shouldComponentUpdate` 时，依赖的 props 发生了改变，会进行不必要的渲染。

而使用 useCallback 可以在依赖项不变的情况下，返回旧的函数，使函数的引用没有发生变化。

此时，子组件的优化操作才可以生效。



## useMemo

useCallback 返回一个函数，而 useMemo 返回一个值，可以替代 useCallback 使用。

```js
useCallback(()=>{},[deps])
useMemo(()=> (() => {})),[deps])
```

使用场景：

超级耗费CPU 的函数，可以使用 useMemo ，只有依赖项改变时才执行函数。



## useRef

用于创建在函数各个生命周期都可以获取到的值。

且获取的不是某个作用域的值，会得到更新的最新结果。

使用场景：

useEffect 中使用异步操作时，异步操作最终执行时的值是从作用域中获取的，如果发生了组件的更新，那么新的值将存在于新的作用域中。

将异步操作使用的值通过 useRef 存储，可以得到最新的值。






## MVVM

MVVM（`Model-View-ViewModel`），其中，`Model` 表示数据模型层，`View` 表示视图层，`ViewModel` 是 `Model` 与 `View` 层的桥梁。

- Model 数据绑定到 `ViewModel` 层并自动渲染到页面中。
- View 层视图变化通知 `ViewModel` 层更新数据。

## 响应式数据原理

Vue2 ： 通过 `Object.defineProperty` 重新定义 `data` 中的所有可配置 & 可枚举的属性，通过对象访问器属性 `getter` 和 `setter` 拦截对数据的读取和设置，在 `getter` 中进行依赖收集，在 `setter` 中通知所有收集的依赖。

1. 通过 `initData` 初始化用户传入的参数
   - 主要是判断 `data` 的类型是否正确，是否和 `props` / `methods` 中的属性重名。
   - 并将 data 代理到 vm 上。访问 `this.xxx` 时相当于直接访问了 `this._props.xxx`。
2. 通过 `observer` 方法，使用 `new Observer` 对数据进行监视。
   - **如果数据是对象类型**
     - 就调用 `this.walk()` 遍历所有属性
     - 对每个属性，用 `defineReactive` 添加响应式，核心还是使用 `Object.defineProperty` 重新定义数据。
     - 并对每个属性值调用 `observe()`，不断向下递归。
   - **如果是数组类型**，
     - 就重写该数组实例的原型（实际上重写了数组原地修改的方法）
       - 判断环境是否支持 `__proto__` 属性，支持就修改**原型**。
       - 不支持则通过 `Object.defineProperty` 的方式将重写的方法定义为 **实例属性**。
       - 修改后的数组方法：先执行原生方法，然后判断是否增加了元素，为新增的元素添加响应性，并通知依赖执行。
     - 因为数组元素有可能为对象，因此需要对数组的每一项执行 `observe` ，如果数组元素为对象，则通过 `new Observer` 监视该对象。

Vue 3：改用 `Proxy`，可以直接监听对象和数组的变化。

## Vue 事件绑定原理


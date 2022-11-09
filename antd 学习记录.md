Unicode 汉字编码范围：`\u4e00-\u9fa5`

检测是不是两个字符的汉字：`/^[\u4e00-\u9fa5\{2}$/`



## Context

> 直接给忘记了这个 API

Context 提供了一种在组件之间共享值的方式，而不必显式地通过组件树的逐层传递 props。

```jsx
// 默认值为 light
const ThemeContext = React.createContext('light')
class App extends React.Component {
  render() {
    return (
      // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
      // 无论多深，任何组件都能读取这个值。
    	<ThemeContext.Provider value="dark">
      	<Toolbar />
      </ThemeContext.Provider>
    )
  }
}

function Toolbar() {
  return (
  	<div>
    	<ThemedButton />
    </div>
  )
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context
  // React 会往上找到最近的 theme Provider，然后使用他的值。
  static contextType = ThemeContext
  render() {
    return <Button theme={this.context}></Button>
  }
}
```

Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。

如果只是想避免层层传递一些属性，组件组合比 context 更好。

### React.createContext

```jsx
const MyContext = React.createContext(defaultValue)
```

创建一个 Context 对象。

只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 才会生效。

- 此默认值有助于在不使用 Provider 包装组件的情况下**对组件进行测试**。
- 传递 undefined 给 Provider 的 value，消费组件的 defaultValue 不会生效。

### Context.Provider

```jsx
<MyContext.Provider value={ /* 某个值*/ }>
```

每个 Context 对象都会返回一个 Provider 组件，允许消费组件订阅 context 的变化，

- Provider 接收一个 `value`  属性，传递给消费组件。
- 一个 Provider 可以与多个消费组件有对应关系。
- 多个 Provider 可以嵌套，里层的会覆盖外层的数据。

Provider 的 value 值发生变化时，**内部的所有消费组件都会重新渲染。**

- 从 Provider 到其内部 consumer 组件（包括 `.contextType` 和 `useContext` ）的传播不受制于 `shouldComponentUpdate` 函数。
- 因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

通过新旧值检测来确定变化，使用了与 `Object.is` 相同的算法。

## React.FC 

`React.FC` 是函数式组件，是 TypeScript 使用的一个泛型。

可以写成 `React.FunctionComponent`。

- 包含 `PropsWithChildren` 的泛型，为 children 提供了隐式的类型（`ReactElement | null`），不用显式地声明 props.children 的类型。

  ```tsx
  const SomeComponent: React.FC = () => <div>xxx</div>
  <SomeComponent>yyyy</SomeComponent>
  ```

  - `@types/react@18` 引入了 break change，去掉了 React.FC 默认属性`children`。

- 无法使用 `defaultProps` 的默认值。

- 提供了类型检查和自动完成的静态属性： displayName, propTypes 和 defaultProps。

  - defaultProps 和 `React.FC` 结合使用会存在一些问题。

与 **普通声明 + PropsWithChildren** 的区别：

- `React.FC<>` 显式地定义了返回类型，普通函数版本是隐式推导的。



```tsx
import React, { useState } from 'react';

interface IProps {
    test?: any;
}
const Index: React.FC<IProps> = (props) => {
    let [count, setCount] = useState(0);
    return(
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>Click</button>
        </div>
    );
};
export default Index;
```

### 使用 PropsWithChildren ：

- 自动设置 children 类型为 ReactNode。

```tsx
type AppProps = React.PropsWithChildren<{ message: string }>

const App = ({ message, children }: AppProps) => (
	<div>
    {message}
    {children}
  </div>
)
```

### 直接声明

```tsx
type AppProps = {
	message: string
	children?: React.ReactNode
}

const App = ({ message, children }: AppProps) => (
	<div>
		{message}
		{children}
	</div>
)
```



### React.Component

`React.Component` 为 ES6 形式，取代了 ES5 原生方式定义的组件 `React.createClass`。

定义 class 组件，需要继承 `React.Component`。

在 TypeScript 中， `React.Component` 是通用类型（`React.Component<PropType, StateType>`），要为其提供（可选）`props` 和 `state`  类型参数。

```jsx
import React, {Component} from 'react';

interface IProps {
    message1?:any
}
interface IState {
    message2:any
}

class Index extends Component<IProps,IState> {
    //构造函数
    constructor(props: IProps, context: any) {
        super(props, context);
        this.state={
            message2:"test"
        }
    }
    render() {
        return (
            <div>
                <div>{this.state.message2}</div>
                <div>{this.props.message1}</div>
            </div>
        );
    }
}
export default Index;
```



## typeof arr[number]

`typeof` 在类型上下文中获取变量或者属性的类型。

- 对嵌套对象同样有效。

- 也可以获取函数对象的类型

  ```ts
  function toArray(x: number): Array<number> {
    return [x];
  }
  type Func = typeof toArray; // -> (x: number) => number[]
  ```

### `ReturnType<T>`

获取函数的类型，并返回该函数的返回值类型：

```ts
type Predicate = (x: unknown) => boolean
type K = ReturnType<Predicate> // type K = boolean
```

```ts
function f() { return { x: 10, y: 3 } }
type P = ReturnType<typeof f> // type P = { X: number, y: number }
```

## keyof

`keyof` 获取一个对象类型，并产生该对象键的联合类型。

```ts
type Point = { x: number, y: number }
type P = keyof Point // as "x" | "y"
```

如果该类型具有 `string` / `number` 索引签名， `keyof` 将会返回这些类型：

```ts
type Arrayish = { [n: number]: unknown }
type A = keyof Arrayish // number

type Mapish = { [k: string]: boolean }
type M = keyof Mapish // string | number
```

- 是因为 JavaScript 的对象键，总是强制转换为字符串类型。

- 支持基本数据类型：

  ```ts
  let K1: keyof boolean; // let K1: "valueOf"
  let K2: keyof number; // let K2: "toString" | "toFixed" | "toExponential" | ...
  let K3: keyof symbol; // let K1: "valueOf"
  ```

- e.g. 获取 / 设置对象上的某一个属性

  ```ts
  function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]; // Inferred type is T[K]
  }
  
  function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
  }
  ```

## Indexed Access Types

通过使用 `indexed Access Types`，可以找到某一个类型上某个特定的属性。

```ts
type Person = { age: number; name: string; alive: boolean }
type Age = Person["age"] // number
```

索引类型本身也是一个类型，因此可以使用 **联合类型**，`keyof` ：

```ts
type I1 = Person["age" | "name"] // number | string
type I2 = Person[keyof Person] // string | number | boolean

type AliveOrName = "alive" | "name"
type I3 = Person[AliveOrName] // string boolean
```

也可以使用 `number` 来获取一个数组所有元素的类型：

```ts
const MyArray = [
	{ name: "Alice", age: 15 },
	{ name: "Bob", age: 23 },
	{ name: "Eve", age: 38 }
]

type Person = typeof MyArray[number] 
// type Person = { name: string; age:number }
type Age = typeof MyArray[number]["age"]	// type Age = number
type Age2 = Person["age"] 								// type Age = number
```

## `Omit<Type, Keys>`

构造一个类型，包含 `Type` 中的所有属性，但会剔除 `Keys` 中的属性。

```tsx
Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;
```


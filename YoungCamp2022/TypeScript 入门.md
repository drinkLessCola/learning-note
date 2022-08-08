- 动态类型：执行阶段才进行类型的检验和匹配。编译发生在运行时。
- 静态类型：编译发生在运行之前的编译阶段。



- 弱类型语言：自动进行类型转换
- 强类型语言：不会自动进行类型转换



TypeScript：

- 静态类型
  - 可读性增强：基于语法解析 TSDoc，ide增强
  - 可维护性增强：在编译阶段暴露大部分错误
  - 多人合作的大型项目中，获得更好的稳定性和开发效率。
- JS 的超集
  - 包含于兼容所有 JS 特性，支持共存
  - 支持渐进式引入与升级

## 2. 基本语法

### 基本数据类型

### 引用对象类型

```ts
interface Person{
	readonly id:number; // 只读属性，不可在对象初始化之后进行赋值。
	name:string;
	sex:'man' | 'woman' | 'other';
	age:number;
	hobby?:string; // 可选属性
	[key: string]:any // 任意属性：约束所有对象属性都必须是该属性的子类型
}
```

### 函数类型

```ts
function add(x:number, y: number): number {
	return x + y;
}

const mult:(x: number, y: number) => number = (x, y) => x * y;
```

通过接口定义函数类型：

```ts
interface IMult {
  (x: number, y: number): number;
}
const mult:IMult = (x, y) => x * y;
```

### 函数重载

```ts
function getDate(type:'string', timestamp?: string): string;
function getDate(type:'date', timestamp?:string): Date;
function getDate(type:'string' | 'date', timestamp?: string): Date | string { 
	const date = new Date(timestamp);
	return type === 'string'? date.toLocaleString() : date;
}

const x = getDate('date');
const y = getDate('string', '2018-01-10');
```

为了简化编写，可以使用接口定义函数重载：

```ts
interface IGetDate {
	(type: 'string', timestamp?: string): string;
	(type: 'date', timestamp?: string): Date;
	(type: 'string' | 'date', timestamp: string): Date | string
}

const getDate2: IGetDate = (type, timestamp) => {
  const date = new Date(timestamp);
  return type === 'string'? date.toLocaleString() : date;
}
```

1. 定义了一个匿名函数
2. 将匿名函数赋值给了 getDate2 这个自变量，会发生一次类型匹配。

由于匿名函数没有进行类型声明，会进行一次类型推断：

`(type: any, timestamp: any) => string | Date`

解决方式：让接口定义范围表达大于匿名函数的范围表达



### 数组类型

```ts
// [类型 + 方括号] 表示
type IArr1 = number[];
// 泛型表示
type IArr2 = Array<string | number | Record<string, number>>;
// 元组表示
type IArr3 = [number, number, string, string];
// 接口表示
interface IArr4 {
	[key: number]: any;
}

const arr1:IArr1 = [1, 2, 3, 4, 5, 6];
const arr2: iArr2 = [1, 2, '3', '4', { a: 1 }];
const arr3: iArr3 = [1, 2, '3', '4'];
const arr4: IArr4 = ['string', () => null, {}, []];
```

### TypeScript 泛型

**TypeScript 还对 JavaScript 的类型进行了一些补充：**

- `any` ：任意一个类型，是所有类型的子类型

  - `type IAnyType = any;`
  - type 表示类型别名，通过这个别名来表示更加复杂的类型。

- `void`：一般定义在函数的返回值，表示无返回值

  - `type IEmptyFunction = () => void;`

- `enum`：枚举类型，支持枚举值到枚举名的正、反向映射

  - ```ts
    // 枚举类型
    enum EnumExample {
      add = '+',
      mult = '*',
    }
    // or 另一种表达
    EnumExample['add'] === '+';
    EnumExample['+'] === 'add';
    
    enum ECorlor {Mon, Tue, Wed, Thu, Fri, Sat, Sun};
    EColor['Mon'] === 0;
    ECorlor[0] === 'Mon';
    ```

- 泛型：不预先指定具体的类型，而在使用的时候在指定类型的一种特性。

  - ```ts
    function getRepeatArr(target) {
    	return new Array(100).fill(target);
    }
    
    type IGetRepeatArr = (target: any) => any[];
    // 丢失了传入的参数类型，被重写成了 any
    
    type IGetRepeatArrR = <T>(target: T) => T[];
    // 类型T在函数执行过程中才确定
    ```



- 函数是在函数定义的括号前面使用尖括号来表示泛型。
- 而在类、泛型接口、泛型别名 都是在函数/类型名的后面使用尖括号

```ts
// 泛型接口 & 多泛型
interface IX<T, U> {
	key: T;
	val: U;
}
// 泛型类
class IMan<T> {
	instance: T;
}
// 泛型别名
type ITypeArr<T> = Array<T>;
```

#### 泛型约束

限制泛型必须符合某种类型

```ts
type IGetRepeatStringArr = <T extends string>(target: T) => T[];
const getStrArr: IGetRepeatStringArr = target => new Array(100).fill(target);

// Error
getStrArr(123);
```

#### 泛型参数默认类型

类型别名接收一个泛型，如果没有指定泛型则为默认值

```ts
type IGetRepeatArr<T = number> = (target: T) => T[];
const getRepeatArr: IGetRepeatArr = target => new Array(100).fill(target);
// Error
getRepeatArr('123');
```



### 类型别名 & 类型断言

```ts
type IObjArr = Array<{
	key:string;
  [objKey: string]:any;
}>
```

通过 `as` 关键字，断言 `result` 类型为正确类型。

```ts
function keyBy<T extends IObjArr>(objArr: Array<T>){
 const result = objArr.reduce((res, val, key) => {
   res[key] = val;
   return res;
 },{});
  return result as Record<string, T>;

}
```

### 字符串/数字 字面量

允许指定字符串 / 数字必须的固定值。

```ts
type IDomTag = 'html' | 'body' | 'div' | 'span';
type IOddNumber = 1 | 3 | 5 | 7 | 9;
```

## 3. 高级类型

### 联合 / 交叉类型

- **联合类型**：`A | B；` 联合类型表示一个值可以是几种类型之一。
  - <u>与字符串 / 数字字面量的区别</u>：此处 A 与 B 可以是 number / string 之外的值，如一个对象
- **交叉类型**：` A & B;` 多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220802190126213.png" alt="image-20220802190126213" style="zoom:80%;" />

- type 类型定义有误，应为 ‘history’ | ‘story’
- 重复声明 author

```ts
type IBookList = Array<{
	authou: string;
} & ({
	type:'history';
	range: string;
} | {
	type: 'story';
	theme: string;
})>
```

### 类型保护与类型守卫

**类型保护**：访问联合类型时，处于程序安全，**仅能访问联合类型中的交集部分。**

```ts
interface IA {a:1, a1:2}
interface IB {b:1, b1:2}
function log(args: IA | IB) {
  // Error:类型“IA | IB” 上不存在属性 "a"
	if(arg.a){
		console.log(arg.a1)
	} else {
		console.log(arg.b1);
	}
}
```

**可以通过类型守卫的方式解决：**

定义一个函数，它的返回值是一个类型谓词，生效范围为**子作用域**。

- 当函数的返回值为 `true` 时，`arg` 的类型一定为 `IA` 类型。
- 只有当两个类型完全没有重合点的时候，才需要写类型守卫。

```ts
function getIsIA(arg: IA | IB): arg is IA {
	return !!(arg as IA).a;
}

function log2(arg: IA | IB) {
	if(getIsIA(arg)){
		console.log(arg.a1);
	} else {
		console.log(arg.b1);
	}
}
```



```ts
function reverse(target: string | Array<any>) {
  // typeof 类型保护
	if(typeof target === 'string') {
		return target.split("").reverse().join('');
	}
  // instanceof 类型保护
	if(target instanceof Object) {
		return target.reverse();
	}
}
```

### Partial

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220802190043695.png" alt="image-20220802190043695" style="zoom:80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220802190015472.png" alt="image-20220802190015472" style="zoom:80%;" />

- `keyof` ：类型索引，相当于取值对象中的所有 `key` 组成的字符串字面量
  - `type IKeys = keyof { a: string; b:number };` 相当于 `type IKeys = "a" | "b"`
- `in` ：相当于取值**字符串字面量**中的一种可能，配合泛型 P，即表示每个 key
- `?`：通过设定对象可选选项，即可自动推导出子集类型。

```ts
interface IMerge {
	<T extends Record<string, any>>(sourceObj: Partial<T>, targetObj: T): T;
}
// IPartial<T> 为 T 的子集。

type IPartial<T extends Record<string, any>> = {
	[P in keyof T]?: T[P];
}
// 泛型要求传入对象 T，keyof 关键字取出对象中的所有 key
// 定义了一个新的泛型 P，可以为 keyof T 字符串字面量中的一种
```

### 函数返回值类型 ReturnType

实现下方函数 delayCall 的类型声明。

- `extends`：跟随泛型出现时，表示类型推断，其表达可类比三元表达式
  - 如 T === 判断类型？ 类型A ： 类型B
- `infer`：出现在类型推断中，表示定义类型变量，可以用于指代类型

```js
function delayCall(func) {
	return new Promise(resolve => {
		setTimeout(() => {
			const result = func()
			resolve(result)
		}, 1000);
	})
}
```

```ts
type IDelayCall = <T extends () => any>(func:T) => ReturnType<T>;
type IReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
// 第一个 extends 表示泛型限定
// 第二个不再表示泛型限定，而是泛型推断

// infer 将函数的返回值类型作为变量，使用新泛型 R 表示，使用在类型推断命中的结果中
```



## 4. 工程应用

### web

1. 配置 webpack loader 相关
   - 将 webpack 不能识别的文件转换为 webpack 可以识别的文件。
   - 我们需要使用 ts-loader 来将 ts 文件转换为 webpack 可以识别的文件。
2. 配置 tsconfig.js 文件
   - 不同的配置进行不同的行为的约束
3. 运行 webpack 启动 / 打包
4. loader 处理 ts 文件时，会进行编译和类型检查。

相关 loader：

- awesome-typescript-loader
- babel-loader

### node

使用 TSC 编译。

1. 安装 Node 与 npm
2. 配置 tsconfig.js 文件
3. 使用 npm 安装 tsc
4. 使用 tsc 运行编译得到 js 文件

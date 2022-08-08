# JavaScript 中的相等性比较

ES2015 中有四种相等算法：

- 抽象（非严格）相等比较 ==
- 严格相等比较 ===
  - 用于 Array.prototype.indexOf
  - Array.prototype.lastIndexOf
  - case-matching
- 同值零 SameValueZero
  - 用于 TypedArray 和 ArrayBuffer 构造函数
  - Map 和 Set 操作
  - ES7 的 String.prototype.includes
- 同值
  - 用于其他所有地方

JavaScript 提供三种不同的值比较操作

- 严格相等比较 ===
- 抽象相等比较 ==
- ES6 的 Object.is()

## 严格相等 ===

被比较的值在比较前不会进行隐式转换。

- 如果两个值具有不同的数据类型，那么这两个值是不全等的。
- 如果两个值类型相同，且不是 number 类型，值也相同，那么这两个值全等。
- 如果两个值的类型都是 number 类型
  - 不是 NaN 且数值相等，两个值全等
  - 两个值分别为 +0 和 -0 时，两个值全等

特殊例子：

- NaN ！== NaN （NaN 与其它任何值都不全等）
- +0 === -0

##  非严格相等==

null 与 undefined 相等。

类型相等会参照严格相等来进行比较。

在比较之前会将两个被比较的值转换为相同类型。

- Boolean 类型会转化为 Number 类型。
- Number 类型 与 String 类型比较，会将 String 类型转换为 Number 类型再进行比较。
  - 不能转化为数字将转化为 NaN，返回false
- Object 类型与其它类型，使用 ToPrimitive() 转换 Object 类型
  -  toPrimitive 没有传入 hint，设置为 ‘default’，在没有覆写[Symbol.toPrimitive] 的情况下，‘default’ 会转化为 ‘number’
  - hint === ‘number’ 时，先使用 valueOf() 方法转换，再使用 toString()
  - Array.prototype.toString() 使用了 join 方法

## 同值相等

ES6 通过 Object.is() 暴露了这个算法

总体上与严格相等类似，特殊在于：

- +0 与 -0 不相等
- NaN 与 NaN 相等

## 同值零

与同值相等一致，区别在于 +0 与 -0 相等。
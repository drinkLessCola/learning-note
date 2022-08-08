# JS 数据类型检测方案

## 1.typeof

- 只能区分基本数据类型
- 对象、数组和 null 都返回 object

## 2.instanceof

- 返回一个布尔值，默认根据原型链，检查实例的原型链上是否有某个类的原型对象
- 此外，还可以在静态方法 **[[Symbol.hasInstance]]** 中设置自定义逻辑
- 不适用于检查原始类型，只能用于检查引用类型。适用于对类进行检查并考虑继承的情况。

## 3.Object.prototype.toString.call()

- 返回一个字符串。
- 可以判断所有数据类型。
- 并支持自定义。
- 通过对象属性 **Symbol.toStringTag** 自定义对象的 toString 方法的行为。
- 适用于 原始数据类型，内建对象，以及包含 **Symbol.toStringTag** 属性的对象


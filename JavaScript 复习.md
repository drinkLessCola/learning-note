## Object

### 创建方法

1. 构造函数 new Object() 
2. 对象字面量
   - 在表达式上下文（期待一个返回值）中出现的大括号表示一个表达式
   - 在语句上下文中出现的大括号表示一个块作用域
   - 不会实际调用 new Object()
   - 通过 {} 可以创建一个只有默认属性的空对象。
3. Object.create()

### 对象属性名

在对象字面量中，属性名可以是字符串、数值或 Symbol 类型。

数值属性会被自动转换为字符串。

### 属性存取

1. 点符号
2. 中括号
   - 可以使用**变量**进行动态访问
   - 属性名中包含可能**导致语法错误的字符**，如空格
   - 属性名为**保留字 / 关键字**

## Array

### 创建数组

1. 构造函数 new Array
   - new 操作符可以省略
   - 若参数为一个数值，则作为创建数组的长度
   - 若参数有多个，或只有一个且不为数值，则会作为数组的元素。
2. 数组字面量
   - 不会调用 new Array 构造函数

### Array 的静态方法

1. Array.from

   - 接收参数 Array.from(arrayLike, mapFn, thisArg)

     - 类数组 / 可迭代对象
     - 映射函数
     - this 指向，对箭头函数不起作用

   - **可用于浅拷贝**

     - Array.from(arr)

   - **深拷贝**

     - ```js
       function recursiveClone(Val){
       	return (Array.isArray(val))? Array.from(val,recursiveClone) : val;
       }
       ```

   - **使用值填充数组**

     - ```js
       let length = 3;
       // 先创建一个类数组，然后使用 Array.from
       let arr = Array.from({length},()=> initVal);
       ```

     - 与 `Array(length).fill(initVal)` 比较：

       - 初始值为基本数据类型时，没有差别
       - 初始值为引用数据类型时，使用 `Array.fill` 则每一个元素都是同一个对象的引用，而 `Array.from` 则会创建不同的对象。

     - 与 `Array(length).map(() => initVal)` 比较：

       - map 方法会跳过数组空项（undefined），而 Array(length) 的创建结果的元素都为空项，因此结果还是 length 个 undefined。

   - **生成数字范围**

     - ```js
       function range(end){
       	return Array.from({length:end}, (_,index) => index);
       }
       ```

   - **数组去重**

     - 与 Set 配合：

       ```js
       Array.from(new Set(arr));
       ```

       

2. Array.of

   - 将参数转化为数组

   - 可用于数组浅拷贝：

     ```js
     Array.of(...arr)
     ```

### 数组空位

#### 创建：

在数组字面量中使用一连串的逗号来创建空位。

#### ES6 新增的方法与迭代器 与 之前 ES 版本的行为不同

- ES6 普遍将数组空位当作存在的元素，值为 undefined
- ES6 之前的方法会忽略数组空位，具体行为不同：
  - map : 跳过数组空位
  - join : 当作空字符串

### 数组索引

1. 向超过数组长度的索引设置值可以增长数组
2. 数组的 length 属性不是只读的，可以通过修改 length 属性增长或缩短数组
   - 字符串的 length 属性是只读的，修改会静默失败。
3. 新增的数组元素值为 undefined

### 检测数组

1. `instanceof Array`
   - 要求只有一个全局执行上下文
   - 因为在不同的执行上下文中 Array 构造函数是不同版本的。
2. `Array.isArray()`
   - 适用性更广，忽视全局执行上下文的差异。

## 数组方法

### 迭代器方法

1. `Array.prototype.keys()`
   - 返回数组索引的迭代器
   - 可以使用 Array.from()将迭代器转换为数组，**迭代器也是可迭代对象**， 在其原型上实现了 [[Symbol.iterator]]。
2. `Array.prototype.values()`
   - 返回数组值的迭代器
3. `Array.prototype.entries()`
   - 返回数组 索引/值对 的迭代器
   - for(let [idx, item] of arr)

### 复制和填充方法（原地修改）

1. `fill(填充元素[, start [, end]] )`

   - 向一个已有的数组中插入全部或部分相同的值

   - 填充范围 [start, end)

   - 可选的开始索引，不提供开始索引和结束索引默认为填充整个数组
   - 可选的结束索引，若没有提供，默认为数组长度

2. `copyWithin(插入位置[, 复制开始 [, 复制结束]])`

   - 浅复制数组中索引范围内的值，并将复制的值插入到指定的索引位置。 
   - 复制开始位置没有给定， 默认为 0
   - 在插值前会提前完整复制范围内的值，不会发生重写
   - 在源索引或目标索引到达数组边界时停止

- 都支持负索引值
- 静默忽略超过数组索引，零长度 和 方向相反的索引范围
- 不会改变数组的长度

### 转换方法

1. `valueOf`
   - 返回数组本身
2. `toString / toLocaleString`
   - 返回 对数组的每一个元素调用 toString / toLocaleString 方法，得到的返回值通过 **逗号分隔符** 拼接的结果。
   - 若想使用不同的分隔符，可以使用`join(exp)`
     - 若参数为空或是 undefined，使用默认的逗号分隔符
     - 使用提供的参数作为分隔符
     - 会对数组元素调用 toString 方法

- 数组中的元素若为 null / undefined，则在上述方法中都会变成 空字符串

### 栈方法（原地修改）

1. `push`
   - 接收任意数量的参数，并添加到数组的末尾
   - 返回数组最新的长度
2. `pop`
   - 删除数组的最后一个元素
   - 返回删除的元素

### 队列方法（原地修改）

1. `shift`
   - 从数组的开头删除一个元素
   - 返回删除的元素
2. `unshift`
   - 接收任意数量的参数，并添加到数组的开头
   - 返回数组最新的长度

### 排序方法（原地修改）

1. `reverse`

   -  翻转数组

2. `sort`

   - 默认将数组每个元素调用 toString() 的返回值按字典顺序排序（升序）

   - 可以传入一个比较函数，接收两个参数

     - 若前一个参数应该排在第二个参数的前面，返回**负值**
     - 两个参数相等，返回0
     - 若前一个参数应该排在第二个参数的后面，返回**正值**

   - 实现降序

     ```js
     arr.sort((a,b) => (a < b)? 1 ：-1);
     ```

   - 数组元素为数值，或 **valueOf() 的返回数值**的对象（如 **Date**)

     ```js
     arr.sort((a,b) => b-a)
     ```

- 都返回 调用方法的数组 的一个**引用**。

 ### 操作方法

1. `concat`
   - 根据 [[Symbol.isConcatSpreadable]] 的设置
     - 默认数组元素会先打平，其他元素直接拼接
     - 设置 [[Symbol.isConcatSpreadable]]  = true
       - 强制打平**类数组对象**
     - 设置[[Symbol.isConcatSpreadable]]  = false
       - 阻止打平数组参数 
2. `slice`
   - 与字符串的 slice 相同。
   - 返回截取的数组。
   - 不支持方向相反的索引范围，返回空数组
   - 支持负值索引
3. `splice`
   - 接收多个参数
     - 删除的第一个元素的索引
     - 删除的元素个数
     - 在删除位置插入的新元素
   - 返回删除的元素，没有则返回空数组


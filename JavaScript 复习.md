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

### 搜索和位置方法

1. **严格相等**

   - 内部使用全等 === 进行比较
   - includes 是 ES7 新增的方法
   - 都接收两个参数
     - 查找的元素
     - 起始搜索位置，可以为负值

   |             | 查找方向 | 返回值                             |
   | ----------- | -------- | ---------------------------------- |
   | indexOf     | 从前向后 | 第一个匹配的元素索引，没有找到为-1 |
   | lastIndexOf | 从后向前 | 第一个匹配的元素索引，没有找到为-1 |
   | includes    | 从前向后 | 元素是否包含的布尔值               |

2. **断言函数**

   - 对数组的每个元素都会调用断言函数，根据返回值判定是否匹配

   - 接收两个参数
     - 断言函数  `(item, index, array) => {return Boolean}`
     - 指定断言函数的 this 值
   - 找到匹配项后不再继续搜索

### 迭代方法

- 参数
  - 以每一个数组元素为参数运行的函数
  - 指定函数的 this 值
- every
  - 数组每一项执行函数都返回 true，方法才返回 true
- some
  - 数组只要有一项执行函数返回 true，方法返回 true
- filter
  - 函数返回 true 的项组成新数组后返回
- forEach
  - 无返回值
- map
  - 返回 函数调用的返回值 组成的新数组

### 归并方法

- `reduce(func, initValue)`
  - 从数组第一项开始遍历
- `reduceRight(func, initValue)`
  - 从数组最后一项开始遍历
- func 接收四个参数
  - 前一次归并的返回值
  - 当前数组元素
  - 当前索引
  - 数组本身
- 若**未指定归并初始值**，则初始值为**数组第一个元素**，遍历从第二个元素开始。

## Map

- 允许使用任何数据类型的键和值。

### Map 使用的比较算法 SameValueZero

- 与全等（===）基本一致
- 唯一不同在于 NaN 与 NaN 相同
  - 因此可以使用 NaN 作为键

### 初始化

- new Map()
- 可以传入一个可迭代的 包含键值对数组 的对象作为初始值。

### 方法

- `set(key, newVal)`
  - 返回映射实例的引用
  - 可以连缀多个操作
- `get(key)` 
  - 根据键获取值
  - 不存在返回 `undefined`
- `delete(key)`   删除键值对
- `clear()`  清除整个映射
- `has(key)` 返回布尔值，表示映射中是否有键
- `size()` 返回映射中键值对的个数

### 顺序

维护了插入键值对的属性

### 迭代

1. **迭代器方法**
   - `map.keys()`  返回映射中键的迭代器
   - `map.values()` 返回映射中值的迭代器
   - `map.entries()`返回映射中键值对数组的迭代器
   - `map[Symbol.iterator]` 引用了 `map.entries()``
     - ``map === map[Symbol.iterator]`
     - 可以对映射实例进行拓展操作 `…map``
     - ``new Map(…map)`
2. **回调函数**
   - `forEach(callback[, thisArg])`

## WeakMap

- 键的类型只允许为 **对象**，而值可以是任意类型
  - 保证了只有通过**实例的引用**才能取值
  - 原始值将无法区分 设置时使用的键 和 之后的一个相同的原始值
  - 原始值可以先包装为对象 new String(str)

### 初始化

- new WeakMap()
- 可以传入一个可迭代的 包含键值对数组 的对象作为初始值。
- 如果有一个初始值的键不符合要求，将会导致整个初始化失败。

### API

- `set(key, newVal)`
  - 返回映射实例的引用
  - 可以连缀多个操作
- `get(key)` 
  - 根据键获取值
  - 不存在返回 `undefined`
- `delete(key)`   删除键值对
- `has(key)` 返回布尔值，表示映射中是否有键

### 弱键

- 映射对键的引用不是正式引用，不会阻止垃圾回收
- 但弱键对值的引用属于正式引用

### 不可迭代

- WeakMap 实例中的键值对随时可能会被回收

### 应用

- 闭包 + WeakMap 实现私有属性

  - ```js
    const Demo = ((){
    	const wm = new WeakMap();
    	
    	class Demo{
    		constructor(id){
    			this.idProperty = Symbol('id');
    			this.setId(id);
    		}
    		
    		setPrivate(property, value){
    			const privateData = wm.get(this) || {};
    			privateData[property] = value;
    			wm.set(this, privateData);
    		}
    		getPrivate(property){
    			return wm.get(this)[property]
    		}
    		setId(id){
    			this.setPrivate(this.idProperty, id)
    		}
    		getId(){
    			return this.getPrivate(this.idProperty);
    		}
    	}
    
    	return Demo;
    })()
    ```

    

- DOM 节点关联源数据

## Map 与 Object 的比较

- 都是存储键值对

### 键

- Map 允许任何数据类型作为键
- Object 只允许 字符串类型 和 Symbol
  - 字面量中可以定义其他类型，但会被强制转换。
  - 对象会变成 “[object Object]”

### 遍历顺序

- Map 维护了键值对的插入顺序
  - 可以使用 **迭代器方法** 和 **回调函数** 遍历
- Object 
  - 使用 **for..in** 遍历
  - 默认未实现 [Symbol.iterator ] 方法，不能迭代
  - 
  - 内部方法 OwnPropertyKey 的规定顺序遍历
    1. 遍历所有的整数属性（按升序）
    2. 遍历所有的字符串属性（按插入顺序）
    3. 遍历所有的符号属性（按插入顺序）

### 内存占用

**Map** 较 Object **内存占用更少**

> 相同的内存空间，Map 大约可以比 Object 多存储 50% 的键值对

### 插入速度

- 插入速度不会随着键值对的数量而线性增加。
- 如果涉及大量的插入操作，**Map 的性能更佳**

### 查找速度

- 差距不大
- 如果涉及大量的查找操作，**Object** 的性能更佳
  - 因为如果 Object 中有较多**整数属性**时，浏览器会进行优化，在内存中使用更高效的布局。

### 删除性能

- Object 的 delete 性能十分拉跨
- Map 的 `delete()` 性能比 插入 和 查找 更好
- 如果涉及大量的删除操作，请不要犹豫，使用 **Map**!

## Set

### 初始化

- `new Set()`
- 可以传入一个可迭代对象作为初始值

### 内部使用的比较算法 SameValueZero

### API

- `add(value)`
  - 返回集合实例的引用
  - 可以连缀多个操作
- `delete(value)`   删除值，返回值表示集合中是否有要删除的值
- `has(value)` 返回布尔值，表示集合中是否有值
- `clear()` 清空集合
- `size` 返回集合中值的数量

### 顺序与迭代

- 迭代器方法（按插入顺序生成迭代器）
  - keys() / values() 返回值的迭代器
  - entries() 返回包含两个值元素的数组 [value, value]
  - [Symbol.iterator] 引用 `values()`
    - 可以对集合使用扩展操作 new Set(…set)
- 回调方法
  - `forEach((val, dupVal) => {} [, thisArg])`
  - callback 方法两个参数都是 Set 实例迭代的值




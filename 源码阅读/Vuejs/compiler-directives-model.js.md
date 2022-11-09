### genAssignmentCode

```ts
function genAssignmentCode (value: string, assignment: string): string
```

生成赋值的代码 value = assignment。

- res = `parseModel(value)` ，res 的形式：`{ exp:..., key: ... }`
- 如果 res.key 为空，即 value 是普通的变量名的形式，返回 `value = assignment`
- 否则，返回 `$set(res.exp, res.key, assignment)`



### parseModel

```ts
function parseModel (val: string): ModelParseResult
```

区分出 表达式（属性） 和 对象属性。

- 没有中括号 || 右中括号不是最后一个字符
  - 是对象属性访问的形式，以最后一个 `.` 分隔。返回 `{ exp: 最后一个.前的内容 , key: "最后一个.后的变量名" }`
  - 是普通的属性（变量名）。返回 `{ exp: val, key: null }`
- 计算属性结尾的形式
  - 返回 `{ exp: 最后一个[xxx]前的内容, key: 最后一个[xxx]的内容 xxx}`

<img src="E:\js\java-script-learning-notes\源码阅读\Vuejs\compiler-directives-model.js.assets\image-20221104205952164.png" alt="image-20221104205952164" style="zoom: 80%;" />
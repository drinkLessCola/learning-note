## compiler/parse/index.js

### createASTElement

```tsx
function createASTElement(
	tag:string, 
	attrs: Array<ASTAttr>, 
	parent: ASTElement | void
):ASTElement
```

为指定标签元素创建 ast 对象。

- tag 元素标签
- attr 属性数组 `[{ name: 'id', value: 'app', start, end }, ...]`
- parent 父元素 ast

ASTElement 格式如下：

```js
{
	type: 1, 												// 结点类型
  tag,		 												// 标签名
  attrsList: attrs,								// 标签属性数组 [{ name: 'id', value: 'app', start, end }, ...]
  attrsMap: makeAttrsMap(attr),		// 数组映射为属性对象 { id: 'app' }
  rawAttrsMap: {},								// 原始属性对象
  parent, 												// 父元素 ast
  children: [] 										// 子元素数组
}
```

-------

### processFor

```tsx
function processFor (el: ASTElement) 
```

- 获取并移除 el 上的 v-for 属性。

- 如果 `v-for` 属性不为空，`parseFor` 解析存储 for 语法中的变量名，并添加为 el 元素的属性。

  - ```js
    {
    	for:,
    	alias:,
    	iterator1:,
    	iterator2:,
    }
    ```

---

### parseFor

```tsx
function parseFor (exp: string): ?ForParseResult
```

匹配 for 语法中的变量。

- `res.for` = 被循环迭代的对象名

- `alias = (item, key, index)`，移除括号字符

- `iteratorMatch = [matchStr, key, index, …]`

- if `alias` 不仅有 `item`

  - ```js
    res.alias = 迭代时 item 存放的变量名
    res.iterator1 = 迭代时key 存放的变量名
    res.iterator2 = 迭代时 index 存放的变量名
    ```

- else `res.alias = alias`

---

### processIf

```tsx
function processIf (el: ASTElement) 
```

- 获取并移除 el 上的 v-if 属性。
- 如果 `v-if` 属性不为空，`addIfCondition` 。 
  - `<div v-if="msg">`, 处理后得到 `element.if = "msg"`
- 否则获取并移除 el 上的 v-else / v-else-if 属性
- 如果 `v-else` 属性不为空，`el.else = true` 。
- 如果 `v-else-if` 属性不为空，`el.elseif = true` 。

---

### processOnce

```js
function processOnce (el) 
```

- 获取并移除 el 上的 v-once 属性。
- 如果 `v-once` 属性不为空，`el.once = true`。

----

### processPre

```js
function processPre (el) 
```

- 获取并移除 el 上的 v-pre 属性。
- 如果 `v-once` 属性不为空，`el.pre = true`。

---

### processRawAttrs

```js
function processRawAttrs (el)
```

- 遍历 el.attrsList，处理后生成 attrs 数组。

- ```js
  // attrs 元素的结构：
  {
    name,
    value: JSON.stringify(list[i].value)
    start,
    end
    plain: !el.pre && !attrsList.length
  }
  ```

---

### processElement

```tsx
function processElement (element: ASTElement, options: CompilerOptions)
```

调用不同的函数处理元素节点的 `key`，`ref`，插槽，自闭合的 `slot `标签，动态组件，`class`，`style`，`v-bind`，`v-on`，其他指令和一些原生属性。

如果标签上有相应的属性被处理，例如标签上有 `key`，`ref`，`:class` 这三个属性，那么处理过后，会给 ast 添加 `key`，`ref`，`bindingClass` 这三个属性。

- `processKey` 处理 key。  得到 `element.key = xxx`

- 设置 `element.plain`：是否为普通元素

  - `element.plain = ` 没有 key 属性，没有 scope 属性，attrsList 长度为 0。

- `processRef` 处理 ref。 得到 `element.ref = xxx`, `element.refInFor = boolean`

- `processSlotContent` 处理作为插槽传递给组件的内容。

  - 得到插槽名称，是否为动态插槽，作用域插槽的值
  - 将插槽中的所有子元素，放在插槽对象的 children 属性中。

- `processSlotOutlet` 处理组件内部定义的插槽 `<slot>`

- `processComponent` 处理动态组件，如 `<component :is="compName">`。

  - 得到 `element.component = compName`。
  - 标记是否存在内联模板， `element.inlineTemplate = boolean`。

- 对 `element` 分别执行 `class` 、`style`、`model` 模块中的 `transformNode` 方法。

  - web 平台只有 `class` 和 `style` ，分别处理 class 属性和 style 属性。

  - ```js
    element = {
    	staticClass: 静态 class 属性的值,
      classBinding: 动态 class 属性的值,
      staticStyle: 静态 style 属性的值,
      styleBinding: 动态 style 属性的值
    }
    ```

- `processAttrs` 处理 `v-bind`、`v-on` 、其他指令（包括 `v-model` ）

  - ```js
    element = {
      ...
    	dynamicAttrs: [{ name, value, start, end, dynamic }, ...],
    	props: [{name, value, start, end, dynamic }, ...],
    	events: {
    		eventName: { value, start, end, dynamic },
    	},
    	directives: [
    		{ name, rawName, value, arg, isDynamicArg, modifier, start, end }, 
    		...
    	],
      ...
    }
    ```

    

  

---

### processKey

```tsx
function processKey (el: ASTElement)
```

检查 key 值是否合法，并设置 `el.key`。

- 获取el 上通过 bind 绑定的 `key` 属性。
- 如果 :key 属性不为空
  - `el.tag == template`，报错。`template` 不能被 keyed。
  - `el.for` 不为空，检查是否在 `transition-group` 标签上使用 `index` 作为 `key`，报错。
- `el.key =` 绑定的 key 属性值。

---

### processRef

```tsx
function processRef (el: ASTElement)
```

检查 key 值是否合法，并设置 `el.key`。

- 获取el 上通过 bind 绑定的 `ref` 属性。
- 如果 ref 属性不为空
  - 设置 `el.ref` = `ref` 属性绑定的标识符。
  - 设置 `el.refInFor` = 调用 `checkInFor` 判断当前节点是否处在 for 循环中。

---

### checkInFor

```tsx
function checkInFor (el: ASTElement): boolean
```

迭代遍历 el 的所有祖先节点，如果任一祖先节点 `el.for` 不为空，返回 true，否则返回 false。

---

### processSlotContent

```js
function processSlotContent (el) 
```

- 处理插槽作用域。

  - if `el.tag === template`
    - 获取并移除元素的 `scope` 属性，如果有，报错。
    - `el.slotScope` = scope 属性的值 || slot-scope 属性的值。
  - else if `slot-scope` 的值不为空
    - 检查元素是否有 `v-for` 属性，有就报错。
    - `el.slotScope ` = slot-scope 属性的值。

- 处理插槽的目标元素。

  - slotTarget = 获取绑定的 `slot` 属性。
  - if slotTarget 不为空：
    - 如果为空字符串，设置为 default。
    - el.slotTarget = slotTarget。
    - el.slotTargetDynamic = el.attrsMap 上是否有 `:slot` / `v-bind:slot` 属性。
    - 如果 slotScope 为空，并且 el.tag 不是 template， `el.attrs` 数组中添加 slot 属性，值为 slotTarget。

- 2.6 v-slot 语法。 只能用在 components / \<template> 上面

  - 处理 v-slot 在 template 标签上的情况。

    - `slotBinding` = 获取并移除 `el.attrsList` 上以 `v-slot:` / `#` 开头的属性。
    - `getSlotName` 获取插槽名字，以及插槽是否是动态的。
    - `el.slotTarget` = 插槽名字。
    - `el.slotTargetDynamic` =  插槽是动态的。
    - `el.slotScope` = `slotBinding.value` || `'__empty__'`。作用域插槽的值。

  - 处理组件上的 v-slot。

    - `slotBinding` = 获取并移除 `el.attrsList` 上以 `v-slot:` / `#` 开头的属性。

    - `getSlotName()` 获取插槽名字，以及插槽是否是动态的。

    - `slotContainer` = 调用 `createASTElement` 创建一个 tag 为 `template`，parent 为 当前元素 `el` 的 AST 对象。并添加到 `el.scopedSlots[name]`

    - 遍历 `el` 的 `children` 列表，过滤出没有 `slotScope` 属性的孩子，并设置子节点的 parent 属性为 `slotContainer`。

    - ```js
      el.scopedSlots[插槽名字] = slotContainer = 一个 template 元素对象。
      
      slotContainer = {
        tag: 'template',
        attrs: [],
        parent: el,
        slotTarget: 插槽名字,
      	slotTargetDynamic: 插槽是否是动态的,
      	children: el 没有 slotScope 属性的子节点的列表,
      	slotScope: slotBinding.value || '__empty__' 作用域插槽的值
      }
      ```

    - `el.children = []` 清空组件实例的 children

    - `el.plain = false`

---

### makeAttrsMap

```tsx
function makeAttrsMap (attrs: Array<Object>): Object
```

遍历 attrs 列表，转换为名值对的映射对象。

- 多个相同属性名 && !isIE && !isEdge，报错。
- 将 attrs 数组转换为 键值对的对象。 `{id: 'app'}`

---

### getSlotName

```js
function getSlotName (binding)
```

获取插槽目标的名字。

- 如果目标是动态的（中括号包裹），去掉中括号。`{name: name.slice(1, -1), dynamic: true}`
- 目标是静态的，加上双引号。`{name: "name", dynamic: false}`。

### processSlotOutlet

```js
function processSlotOutlet (el)
```

- 对于 tag === ‘slot’ 的元素
- `el.slotName` = `:name | v-bind:name` 属性值
- 如果 slot 元素有 `key` 属性，报错

---

### processComponent

```ts
function processComponent (el)
```

- `el.component` =  el 上绑定的 is 属性的值
- `el.inlineTemplate` = 获取并删除 `el.attrsList` 的 `inline-template` 属性的值，是否有值。

---

### processAttrs

```js
function processAttrs (el) 
```

- 遍历 `el.attrsList`，之前的处理已经删去了对应的属性。

  - ```
    pre: v-pre
    for: v-for
    if: v-if / v-else / v-else-if
    once: v-once
    slotContent: scope / slot-scope / v-slot(:|$)xxx / #xxx
    component: inline-template
    ```

- 匹配 v- / @ / : / # / . 开头的指令

  - `el.hasBindings = true`标记元素为动态的。

  - `modifiers` = `parseModifiers()`，得到`{ captrue: true, prevent: true, ...}`

  - if: 开启了`vBIND_PROP_SHORTHAND` && `name` 以 `.` 开头

    - `modifiers.prop = true`
    - `name` = `.` + 去掉修饰符的 `name`

  - <u>else: `name` 去掉修饰符</u>

  - `name` 以 `v-bind / :` 开头

    - `name`：去掉 name 中的 `v-bind / :`
    - `value`：`parseFilters(value)`
    - `isDynamic`：name 是否使用 `[]` 包裹，如果是，去掉 name 的 `[]`。
    - 如果 `modifiers` 不为空，处理修饰符。
      - 静态修饰符，`modifiers.prop || modifiers.camel` 变为 camel 格式。
      - `modifiers.sync` 
        - `syncGen` = `genAssignmentCode()` 生成 `value <= $event` 的赋值代码。
        - if `!isDynamic` 
          - 添加更新函数 `update: camelize(name)` ，函数体为 `syncGen`。
          - 如果 `camelize(name) !== hyphenate(name)` ，添加更新函数 `update: hyphenate(name)` 。
        - else 添加动态更新函数 `update: +(name)` 
    - 如果 `modifiers.prop` 不为空，

  - `name` 以 `v-on / @` 开头

    - `name`：去掉 name 中的 `v-on / @`
    - `isDynamic`：name 是否使用 `[]` 包裹，如果是，去掉 name 的 `[]`。
    - `addHandler` 添加事件相关的处理函数

  - `name` 为其他的指令， 如 `v-example:arg`，修饰符在上面去掉了。

    - `name`：`v-example`

    - `arg`：`arg`

    - `isDynamic`：arg 是否使用 `[]` 包裹，如果是，去掉 arg 的 `[]`。

    - `addDirective()` 向 `el.directives` 数组中添加指令对象，并设置 `el.plain = false`。

      - 指令对象的格式如下：

        ```js
        {
        	name,
        	rawName,
        	value,
        	arg,
        	isDynamicArg,
        	modifiers,
        	start,
        	end
        }
        ```

    - `checkForAliasModel` 检查 v-model 语法

- ```
  {
  	name,
  	value,
  	hasBindings: true,
  	modifiers,
  	directives,
  }
  ```

---

### parseModifiers

```ts
function parseModifiers (name: string): Object | void
```

- name 匹配 `modifierRE = /\.[^.\]]+(?=[^\]]*$)/g`，即 `.xxx` 的形式。

- 将匹配的修饰符转换为对象属性并返回：

  ```js
  {
  	prevent: true,
  	capture: true,
  	...
  }
  ```

---

### checkForAliasModel

```js
function checkForAliasModel (el, value)
```

如果 el 上有 `v-for` 指令，并且 `v-model` 的值 === 迭代的变量名 `alias`，报错。

修改迭代器变量 item 相当于修改函数的内部变量，不会影响输入参数本身（v-for 迭代的源可迭代对象）。

---

### isForbidden

```ts
function isForbiddenTag (el): boolean
```

tag 是否在模板中被禁用，即 style / script [type=‘text/javascript’]。

### parse

```tsx
function parse(
	template:string, 
	options: CompilerOptions
): ASTElement | void
```

将 template 字符串模板转换为 ast。

- template 字符串模板
- options 编译配置



```js
stack = []
root
currentParent

inVPre	// 在 v-pre 元素中
inPre		// 在 pre 标签中
```



1.  `parseHTML`：解析所有标签，处理标签及标签上的属性。
   -  定义基本的ast结构。
   - 对ast进行预处理( `preTransforms` )。
   - 解析 `v-pre`、`v-if`、`v-for`、`v-once`、`slot`、`key`、`ref` 等指令。
   - 对ast处理( `transforms` )。
   - 解析 `v-bind`、`v-on` 以及普通属性。
   - 根节点或 `v-else` 块等处理。
   - 模板元素父子关系的建立
   - 对ast后处理( `postTransforms` )
2. 将生成的 ast 对象返回。



#### 内部方法

```js
function closeElement(el)
```

1. `trimEndingWhitespace`：如果子元素的最后一个为空白文本结点，删去。
2. `processElement` 处理元素节点的 key、ref、插槽、自闭合的 slot 标签、动态组件、class、style、v-bind、v-on、其他指令和一些原生属性。
   - 前提：元素不在 v-pre 节点内，并且没有被处理过。
3. 处理根结点的同级节点，检查该节点的合法性。
   - 如果根结点有 `v-if` ，那么同级节点必须有 `v-else-if` / `v-else`。根节点没有 `v-if`， 警告。
   - `v-else(-if)` 元素 tag 不能为 `slot` / `template`，不能有 `v-for` 属性
   - 合法节点执行 `addIfCondition`，向 `root` 元素添加 `ifConditions`，`{ exp: element.elseif, block: element }`
4. 联系 `el` 与 `currentParent`。
   - 处理节点的 v-else-if / v-else 属性，为前面的 if 节点更新属性。
     - 这里不会和上面处理根节点 v-if / else 冲突，因为在上面的情况中， `currentParent` 为空！
   - <u>处理节点的 slotScope 属性，更新 `currentParent` 的 `scopedSlots` 对象。</u>
     - `el.slotTarget` 作为键， `el` 作为值。
   - 没有 v-else-if/ else 属性的节点，添加到 currentParent 的 children 列表中，并设置 el 的 parent 属性为 currentParent。
5. <u>过滤 children 中有 slotScope 属性的元素。</u>
6. `trimEndingWhitespace`：如果子元素的最后一个为空白文本结点，删去。
7. 如果当前元素具有 pre 属性，设置 `inVPre` 为 false。
8. 如果当前元素为 pre 标签，设置 `inPre` 为 false。
9. 对 ast 后处理( `postTransforms` )

```js
function trimEndingWhitespace (el) 
```

如果子元素的末尾为空白文本结点，删去。会循环判断。

```js
function checkRootConstraints(el)
```

检查根元素的合法性。

- 元素 tag 不能为 `slot` / `template`
- 不能有 `v-for` 属性



### addIfCondition

```js
function addIfCondition (el: ASTElement, condition: ASTIfCondition)
```

向 el 的 `ifConditions` 数组中添加 `condition`。

### processIfConditions

```js
function processIfConditions (el, parent) 
```

处理 v-else-if / v-else 节点，更新他们的 v-if 节点的属性。

- 在 parent 的 children 列表中找到上一个元素节点 `prev`。
- 如果 `prev` 有 `if` 属性，则向 `pre` `addIfCondition` ，`{ exp: element.elseif, block: element }`。

### findPrevElement

```tsx
function findPrevElement (children: Array<any>): ASTElement | void 
```

寻找前一个元素节点。

- 寻找前一个节点类型为 1 的元素。
- 从数组中剔除之后所有的文本节点。



#### 向 parseHTML 传入的属性：

##### start

```js
function start (tag, attrs, unary, start, end) 
```

- tag 标签名
- attrs 属性数组
- unary 是否是自闭合标签，如 <hr/>
- start 开始索引
- end 结束索引

处理开始标签。

1. 检查命名空间，如果存在，就继承父命名空间
2. `createElement` 创建当前标签的 AST 对象 `element`。
   - 并设置 `element` 的命名空间 `ns` 属性。
3. 检查 `attrs` 列表中的属性名是否合法。
4. 对 ast 进行预处理( `preTransforms` )，处理存在 `v-model` 的 `input` 标签，但没有处理 `v-model` 属性。
5. if `!inVPre` :`element` 是否存在 `v-pre` 指令，存在则设置 `inVPre = true`
   - 这种节点只会渲染一次。
   - `processRawAttrs` 将节点上的属性都设置到 `el.attrs` 数组对象中作为静态属性，数据更新时不会渲染这部分内容。
6. 如果是 `pre` 标签，设置 `inPre` = true。
7. `!inVPre && !element.processed`
   - `processFor` 处理 `v-for` 指令
   - `processIf` 处理  `v-if / v-else / v-else-if` 指令
   - `processOnce` 处理 `v-once` 指令
8.  如果根元素不存在，设置当前元素为根元素。
9. 如果不是自闭合标签，更新 `currentParent`，并将 `element` push 进 AST 对象的栈 `stack`。
10. 如果是自闭合标签，执行 `closeElement`。
    - 如果 el.processed = false， 处理结点上的属性。
    - 与父元素建立连接。



##### end

```js
function end (tag, start, end) 
```

处理结束标签。

1. pop 出开始标签 AST 栈 stack 的最后一个元素。即对应当前结束元素的开始标签。
2.  更新 `currentParent`。
3. `closeElement` 关闭标签。



##### chars

```tsx
function chars (text: string, start: number, end: number)
```

处理文本节点。

1. 如果 `currentParent` 不存在，说明该段文本没有父元素，报错。

2. 处理 text，如 trim 删除前后空格。

3. text 仍然存在，将 text 转换成 AST 对象 child。

   - 使用 `parseText` 解析：包含 mustache 语法， type = 2。

   - ```js
     // 含 mustache 的语法
     child = {
     	type: 2,
     	expression: res.expression,  // '"普通文本1"+_s(token)+"普通文本2"'
     	tokens: res.tokens,// ['普通文本1', {'@binding': 'token'}, ...]
     	text
     }
     
     // 普通文本
     child = {
     	type: 3,
     	text
     }
     ```

4. 加入到父元素的 children 列表中。



##### comment

```tsx
function comment (text: string, start: number, end: number)
```

处理注释节点。

禁止将任何内容作为 root 同级进行添加，注释节点除外，但会被忽略。

1. 如果 `currentParent` 不存在，注释与 root 同级，忽略。

2. 如果 `currentParent` 存在， 创建注释节点 AST。

   - ```js
     child = {
     	type: 3,
     	text,
       isComment: true
     }
     ```

3. 加入到父元素 currentParent 的 children 列表中。










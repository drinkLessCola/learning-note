### baseCompile

```ts
function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult 
```

1. `parse` 将 template 字符串转换为 ast 树。

2. `optimize` 遍历 ast，当遇到静态结点打上静态结点的标记，然后进一步标记出静态根结点。

   - 后续更新进行 dom diff 比对时可以跳过这些静态结点。
   - 在生成渲染函数阶段，可以生成静态根结点的渲染函数。

3. `generate ` 将 AST 生成 `render` 代码串， `staticRenderFns` 静态根节点代码串。

   ```
   generate: 将 ast 生成 render 代码串、staticRenderFns 静态根节点代码串
   比如：
   <div id="app">
    <div>{{msg}}</div>
    <div>
     <p>静态节点</p>
    </div>
   </div>
   
   经过编译后的 code 是：
   code = {
     render: 'with(this){return _c('div',{attrs:{\"id\":\"app\"}},[_c('div',[_v(_s(msg))]),_v(\" \"),_m(0)])}',
     staticRenderFns: ['with(this){return _c('div',[_c('p',[_v(\"静态节点\")])])}']
   }
   ```

   



### generate

```ts
function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult
```



### genElement

```ts
function genElement (el: ASTElement, state: CodegenState): string
```

根据不同指令类型处理不同的分支。

- `v-pre` 节点的所有子孙节点 继承 `el.pre = true` 

- if `el.staticRoot && !el.staticProcessed`：

  - 对于还未被处理的静态根节点，将静态结点的渲染函数放到 `staticRenderFns` 数组中。
  - 调用 `genStatic(el, state)` 返回一个可执行函数的字符串。

- else if `el.once && !el.onceProcessed`：处理 v-once 的情况，返回 `genOnce(el, state)`

- else if `el.for && !el.forProcessed`：处理 v-for， 返回 `genFor(el, state)`

  - 得到 `_l(exp, function(alias, iterator1, iterator2) { return _c(tag, data, children)})`

- else if `el.if && !el.ifProcessed`：处理 v-if， 返回 `genIf(el, state)`

  - 得到一个三元表达式：

    ```
    <p v-if="show"></p> 
    <p v-else></p>
    
    (_vm.show) ? _c('p') : _c('p')
    ```

- else if `el.tag === template && !el.slotTarget && !state.pre`

  - 当前节点是 template 标签，不是插槽，也没有 v-pre，生成所有子节点的渲染函数。
  - 返回 `genChildren(el, state)`得到的数组 || ’void 0’。

-  else if `el.tag === slot`：处理插槽，返回 `genSlot(el, state)` 的结果。

  - 得到 `_t(slotName, children, attrs, bindd)`。

- else 处理动态组件和普通元素（自定义组件、原生标签）

  - 对于动态组件 `<component :is="">`，`code = genComponent(el.component, el, state)`

  - 对于普通元素

    - `genData(el, state)` 处理节点上的众多属性，不包括 `v-if`，`v-for` 这些上面处理过的，会处理 `id`、`class`、`@click` 等属性

    - 最后生成

      ```
      data = {
      	key: xxx,
      	attr: {id: aaa }, ...
      }
      ```

    



### genStatic

```ts
function genStatic (el: ASTElement, state: CodegenState): string
```

生成静态节点的渲染函数字符串。

1. `el.staticProcessed = true` 标记当前节点已经被处理过了。

2. `state.pre = el.pre` 更新 state.pre ：节点是否在 v-pre  指令中。

3. 将静态节点的渲染函数放进 `state.staticRenderFns` 数组中。

   - ```js
     `with(this){ return ${genElement(el, state)}}`
     ```

4. 恢复之前的 `state.pre`。

5. 返回一个函数字符串：

   - ```js
     `_m(${ state.staticRenderFns.length - 1}${el.staticInFor ? ',true' : ''})`
     ```

   - 当前生成的代码在 `state.staticRenderFns` 数组中的索引。

   - `el.staticInFor` 根据是否处于 v-for 之中，决定是否向 _m 函数传第二个参数。

### genOnce

```ts
function genOnce (el: ASTElement, state: CodegenState): string
```

生成 v-once 的渲染函数字符串。

1. `el.onceProcessed = true` 标记当前节点已经处理过 v-once 了。
2. if 节点上有 `v-if`，但还未处理 `v-if`，return `genIf(el, state)`
3. else if `staticInFor === true` 节点是静态节点，且处在 `v-for` 之中
   - 找到有 `v-for` 指令的父节点 `parent`， `key = parent.key`。 
   - 如果 `key` 为空， 报错，return `genElement(el, state)`。
   - 否则，return `_o(${genElement(el, state)}, ${state.onceId ++}, ${key})`
4. else return `genStatic(el, state)`



### genIf

```ts
function genIf (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string
```

生成 v-if 的渲染函数字符串，一个三元表达式。

1. `el.ifProcessed = true` 标记当前节点已经处理过 v-if 了。
2. return `genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)` 返回三元表达式。



### genIfConditions

```ts
function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string 
```

condition 数据结构如下:

```js
{
	exp: v-else-if 的条件,
	block: element 符合条件渲染的元素
}
```

生成的示例：

```
<p v-if="foo"></p>
<p v-else-if="bar"></p>
<p v-else></p>

(foo)? 
```



1. 如果 conditions 是空数组，return `altEmpty || '_e()'`
2. 取出 conditions 第一项 `condition`。
   - if `condition.exp` 不为空，即 `v-else-if` 有值 ，return `(${condition.exp})? ${genTernaryExp(condition.block)} : ${genIfConditions(conditions, state, altGen, altEmpty)}`
   - else：return `${genTernaryExp(condition.block)}`

### genTernaryExp

```js
function genTernaryExp (el) 
```

1. if `altGen` 不为空  return `altGen(el, state)`
2. else if `el.once`  return `genOnce(el, state)`
   - v-if 和 v-once 在同一个元素上时，应生成 `(a)? _m(0) : _m(1)`
3.  else return `genElement(el, state)`





### genData

```ts
function genData (el: ASTElement, state: CodegenState): string
```

处理节点上的众多属性（不包括 v-if、v-for 之类已经处理过的）
生成属性对象，`{ key: xxx, attrs: { id: aaa }, ... }`

1. `data = '{'`

2. 首先处理指令，如 `v-text`，`v-html`，`v-model`。

   - ```js
     例如：v-html="htmlStr" 
     得到：_c('div', { domProps: { "innerHTML": _vm._s(_vm.htmlStr) } })
     
     当指令在运行时还有任务时，比如 v-model，有 <input v-model="msg">，
     最终生成的是
     _c('input', 
     	{
     		directives: [
     			{ name: "model", rawName: "v-model", value: (_vm.msg), expression: "msg" }
     		],
       	domProps: { "value": (_vm.msg) },
     		on: {
         	"input": function ($event) {
      				if ($event.target.composing) {
             	return;
       	   	}
       			_vm.msg = $event.target.value
       		}
       	}
       }
     )
     ```

   - `data += genDirectives(el, state)` + `','`



### genDirectives

```js
function genDirectives (el: ASTElement, state: CodegenState): string | void
```

`directives` 格式如下：

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

```ts
baseDirectives = {
	on: function on (el: ASTElement, dir: ASTDirective) {
    if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
      warn(`v-on without argument does not support modifiers.`)
    }
    el.wrapListeners = (code: string) => `_g(${code},${dir.value})`
  }, 
	bind: function bind (el: ASTElement, dir: ASTDirective) {
    el.wrapData = (code: string) => {
      return `_b(${code},'${el.tag}',${dir.value},${
        dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
      }${
        dir.modifiers && dir.modifiers.sync ? ',true' : ''
      })`
    }
  }, 
	cloak: function noop (a?: any, b?: any, c?: any) {},
  ... 其他 options.directives
}
```



1. if `el.directives`为空，直接 return

2. 遍历所有的指令 `dir`：

   - `gen = state.directives[dir.name]`

   - 如果 `gen` 不为空，`needRuntime = !!gen(el, dir, state.warn)` 生成操纵 AST 的编译时指令。

     - 如果同时需要运行时副本，`needRuntime = true`
     - bind 需要，on / cloak 不需要？

   - 如果需要运行时副本

     - ```js
       res += `{
       	name:"${dir.name}",
       	rawName:"${dir.rawName}"
       	${
       		dir.value ? 
       		`, 
       		value: (${dir.value}),
       		expression:${JSON.stringify(dir.value)}` : ''
         }
         ${
           dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
         }
         ${
           dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
         }
       },`
       ```

     - return `'directives:[' + res 去掉最后一个, + ']'`

### optimize

```ts
function optimize (root: ?ASTElement, options: CompilerOptions)
```

1. 生成一个函数 `isStaticKey`，用于判断某一个 key 是否是静态的。
   - 即 key 是否是 `type, tag, attrsList, attrsMap, plain, parent, children, attrs, start, end, rawAttrsMap, options.staticKeys` 中的某一个，这些属性是静态的。
2. `makeStatic(root)` 递归所有节点，为节点添加 `static` 属性。
   -  `static = false` 代表动态节点， `static = true` 代表静态节点。
3. `markStaticRoots(root, false)` 标记静态根。
   - 节点本身为静态节点，
   - 有子结点，并且子结点不是文本节点。



### genStaticKeys

```js
function genStaticKeys (keys: string): Function
```

根据 keys，生成一个函数，判断传入的参数是否在 keys 中。

```js
{
	type: true,
	tag: true,
	attrsList: true,
	attrsMap: true,
	plain: true,
	parent: true,
	children: true,
	attrs: true,
	start: true,
	end: true,
	rawAttrsMap: true,
	...其他 keys
}
```



### markStatic

```ts
function markStatic (node: ASTNode)
```

通过 `node.static` 来标识节点是否为静态节点。

- `node.static = isStatic(node)` 先从节点自身判断是否为静态节点。
- node 是元素节点（type = 1）:
  - 是组件（static = false）、不是 `<slot>`、不是内联模板 uinline-template，结束递归。
    - 不要将组件的插槽内容设置为静态节点，这样可以避免：
      1、组件不能改变插槽节点
      2、静态插槽内容在热重载时失败
  - 遍历子结点，递归调用 `markStatic` 标记子结点的 static 属性。
    - 如果子结点是动态节点，更改父结点为动态节点。`node.static = false`
  - if `node.ifConditions`，节点存在 `v-if / v-else-if / v-else` 指令
    - 调用 `markStatic` 标记 `node.ifConditions[i].block` 中的节点的 static。
    - 如果 block 中的节点为动态节点，更改父结点为动态节点。`node.static = false`

### markStaticRoots

```ts
function markStaticRoots (node: ASTNode, isInFor: boolean)
```

 **标记静态根节点，静态根节点的条件：**

- 节点本身是静态节点，并且有子节点，且子节点不是文本节点
- 如果子节点存在动态节点，当前节点会被更新为动态节点

参数：

- `isInFor` 当前节点是否被包裹在 v-for 指令所在的节点内



**只判断标记  `node.type === 1` 的元素节点**。

1. 如果节点是静态的 / 节点上有 `v-once` 指令，标记 `node.staticInFor = isInFor`
2. 如果节点是静态的，并且有子结点，并且子结点不是文本节点，标记为静态根 `node.staticRoot = true`，return。
3. 否则， `node.staticRoot = false`。
4. 当前节点不是静态的，对子结点递归调用 `markStaticRoots`，isInFor 传入 `isInFor || !!node.for`。
5. if `node.ifConditions`，节点存在 `v-if / v-else-if / v-else` 指令
   - 对 `node.ifConditions[i].block` 中的节点调用 `markStaticRoots` 。



### isStatic

```ts
function isStatic (node: ASTNode): boolean
```

根据 node 自身的节点类型 / AST 属性值 判断一个节点是否是静态节点。

1. 如果 node 为表达式（`node.type === 2`），如 `{{msg}}` ，代表是动态节点，返回 false。
2. 如果 node 为文本节点（`node.type === 3 `），代表是静态节点，返回 true。
3. node 是元素节点（`node.type === 1`），**node.pre 为 true** 或者 **符合以下条件**，返回 true。
   - `!node.hasBindings` 没有 `v-bind`
   - `!node.if && !node.for`没有 `v-if / v-else / v-else-if / v-for` 
   - `!isBuiltInTag(node.tag)` 标签不是内建类型（`slot`, `component`）
   - `isPlatformReservedTag` 是平台保留标签，**不是自定义组件**。
   - `!isDirectChildOfTemplateFor(node)` 不是有 `v-for` 指令的 `template` 结点的子孙结点。
   - `node` 的所有 AST 属性都是静态的。
     - 如果有  `type, tag, attrsList, attrsMap, plain, parent, children, attrs, start, end, rawAttrsMap, options.staticKeys`  之外的属性，说明 node 是动态的。



### isDirectChildOfTemplateFor

```ts
function isDirectChildOfTemplateFor (node: ASTElement): boolean
```

判断 node 是否是有 `v-for` 指令的 `template` 结点的子孙结点。
### getBindingAttr

```tsx
function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string 
```

- `dynamicValue` = 获取并从 attrsList 移除 :name 或 v-bind:name 属性
- 如果 `dynamicValue` 不为空，调用 `parseFilters` 处理该值 并返回。
- 如果 `dynamicValue` 为空，并且 `getStatic` 不为假，获取并从 attrsList 移除 name 静态属性，返回 JSON.stringify 后的结果。

### getAndRemoveAttr

```tsx
function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string 
```

### addAttr

```tsx
function addAttr (el: ASTElement, name: string, value: any, range?: Range, dynamic?: boolean)
```

- dynamic 是否添加动态属性



- 向 dynamicAttrs 或 attrs 数组中添加属性

- 添加的属性的格式：

  ```js
  {
  	name:,
  	value:,
  	dynamic:,
  	start:,
  	end:,
  }
  ```

- 设置 `el.plain = false`。

### addHandler

为 AST 树添加事件相关属性，以及对事件修饰符做特殊处理。

```ts
function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: ?Function,
  range?: Range,
  dynamic?: boolean
) 
```

- 根据事件修饰符对 `name` 进行处理：

  - if `modifiers.right`：根据是否是 `click` 决定是否将 `right` 改为 `contextmenu`。
    - if dynamic： `name = (name) === 'click'? 'contextmenu': (name)`
    - else if `name === 'click'`：
      - `name = 'contextmenu'`
      - 删除 `modifiers.right`
  - else if `modifiers.middle` ：根据是否是 `click` 决定是否将 `middle` 改为 `mouseup`。
    - if dynamic： `name = (name) === 'click'? 'mouseup': (name)`
    - else if `name === ‘click’`：`name = 'mouseup'`
  - if `modifiers.capture`：删除 capture 属性，在 name 前面添加 `!` 标记。
  - if `modifiers.once`：删除 once 属性，在 name 前面添加 `~` 标记。
  - if `modifiers.passive`：删除 passive 属性，在 name 前面添加 `&` 标记。

- 向 `el.event` 添加相应的事件处理函数。

  - if `modifiers.native`：删除 native 属性，events = el.nativeEvents

  - else events = el.events

  - ```js
    const newHandler = {
    	value,
    	dynamic,
    	start,
    	end,
    	modifiers
    }
    ```

  - 如果 `events[name]` 是一个数组（说明有很多该事件的处理函数），根据当前事件处理函数的重要程度 `important`，决定是将 `newHandler` 放在数组第一位还是最后一位。

  - 如果 `events[name]` 不是数组 & 不为空（说明仅有一个该事件的处理函数 handler），`events[name] = important ? [newHandler, handler] : [handler, newHandler]` 。

- `el.plain = false`



### prependModifierMarker

```ts
function prependModifierMarker (symbol: string, name: string, dynamic?: boolean): string
```

在 name 前面加上相应的修饰符标记。

- if dynamic： 返回 `_p(name, symbol)`
- else 返回 `symbol + name`

```
!: capture
~: once
&: passive
```



### rangeSetItem

```ts
function rangeSetItem (
  item: any,
  range?: { start?: number, end?: number }
) 
```

为 item 对象添加 start / end 属性。
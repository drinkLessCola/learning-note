![img](E:\js\java-script-learning-notes\构建 DOM 树.assets\818663-20170107232834409-1506458752.png)

```
DocumentLoader {
	startLoadingMainResource() //加载 url 返回的数据
	// 每次收到的数据块，会通过 Blink 封装的 IPC 进程间通信，触发 dataReceived 函数
	dataReceived()
	// 内部调用 commitData() 函数，开始处理具体业务逻辑
}
```

```c++
// bytes 是请求返回的 HTML 文本
void DocumentLoader::commitData(const char* bytes, size_t length) {
  // ensureWriter
  // writer 实例化 HTMLDocumentParser(Parser) 
  // 并实例化 document 对象
  ensureWriter(m_response.mimeType());
  if(length) {
    m_dataReceived = true;
  }
  
  // 传递数据给 Parser 解析
  m_writer->addData(bytes, length);
}
```

如果 `m_writer` 已经初始化过了，会直接返回。

即 `Parser` 和 `document` 只会初始化一次。

```c++
void DocumentLoader:ensureWriter(const AtomicString& mimeType, const KURL& overridingURL) {
	if(m_writer) return;
}
```

`addData` 函数中，会启动一条线程执行 Parser 的任务：

并将数据传递给这条线程进行解析，Parser 一旦收到数据就会序列成 tokens，再构建 DOM 树。

```c++
if(!m_haveBackgroundParser)
      startBackgroundParser();
```

## 2. 构建 tokens

tokens 的签名如下：

```
interface tokens {
	tagName
	type
	attr
	text
}
```

标签之间的文本（换行和空白）也会被当作一个标签处理。

Chrome 一共定义了 7 种标签类型：

```c++
enum TokenType {
	Uninitialized,
	DOCTYPE,
	StartTag,
	EndTag,
	Comment,	 // 注释
	Character, // 文本
	EndOfFile,
}
```

## 3. 构建 DOM 树

### （1）DOM 结点

DOM 结点的数据结构，以 p 标签 HTMLParagraphElement 为例：

![image-20221017200724316](E:\js\java-script-learning-notes\构建 DOM 树.assets\image-20221017200724316.png)

`Node` 为最顶层的父类，有三个指针：

- 两个指针分别指向它的前一个结点 `m_previous` 和后一个结点 `m_next`
- 一个指针指向它的父结点 `m_parentOrShadowHostNode`
- 每个 Node 都组合了一个 `treeScope`，记录了它属于哪个 `document`
  - 页面可能会嵌入 `iframe`

`ContainerNode` 继承于 `Node` ，添加了两个指针：

- 一个指向第一个子元素 `m_firstChild`
- 一个指向最后一个子元素 `m_lastChild`

`Element` 继承 `ContainerNode` ，又添加了：

- 设置 / 获取 DOM 结点属性函数
- `clientWidth`、`scrollTop` 

`HTMLElement` 继承 `Element`

- 继续添加了 `Translate` / `Draggable` / `ContentEditable` 等控制。

`HTMLParagraphElement` 继承 `HTMLElement`。

- 继承了所有父类的属性。
- 只添加了一个创建的函数 `create` 。

构建 DOM 最关键的步骤是建立起每个节点的父子兄弟关系，即上述成员指针的指向。

### （2）浏览器内核

也称渲染引擎。

### （3）处理开始步骤

Webkit 把 tokens 序列好之后，传递给构建的线程。

在 `HTMLDocumentParser::processTokenizedChunkFromBackgroundParser` 函数中做一个循环，把解析好的 tokens 做一个遍历，依次调 `constructTreeFromCompactHTMLToken` 进行处理。

```
tagName: html | type:DOCTYPE | attr: | text: ''
```

在函数中，首先 Parser 会调用 TreeBuilder 的函数：

```c++
m_treeBuilder->constructTree(&token);
```

在 TreeBuilder 中，根据 token 的类型做不同的处理：

```c++
void HTMLTreeBuilder::processToken(AtomicHTMLToken*token){
  // 文本节点
  if(token->type()==HTMLToken::Character){
    processCharacter(token);
    return;
  }
 
  switch(token->type()){
    case HTMLToken::DOCTYPE:	// doctype，比较特殊
      processDoctypeToken(token);
      break;
    case HTMLToken::StartTag:
      processStartTag(token);
      break;
    case HTMLToken::EndTag:
      processEndTag(token);
      break;
    //othercode
  }
}
```

### （4） DOCType 处理

在 Parser 处理 DOCTYPE 的函数中调用了 HTMLConstructionSite 的插入 DOCTYPE 的函数：

```c++
void HTMLTreeBuilder::processDoctypeToken(AtomicHTMLToken* token) {
	m_tree.insertDoctype(token);
	setInsertionMode(BeforeHTMLMode);
}
```

```c++
void HTMLConstructionSite::insertDoctype(AtomicHTMLToken*token){
  //const String& publicId = ...
  //const String& systemId = ...
  DocumentType*doctype=
      DocumentType::create(m_document, token->name(), publicId, systemId);
  //创建 DOCType 结点
  attachLater(m_attachmentRoot, doctype); //创建插 DOM 的 task
  setCompatibilityModeFromDoctype(token->name(), publicId, systemId); //设置文档类型
}
```

- 先创建一个 DOCTYPE 的结点
- 再创建插 DOM 的 task，并设置文档类型
  - 如果 tagName 不是 html，那么文档类型将会是怪异模式，即以下两种
    - `<!DOCType svg>`
    - `<!DOCType math>`

```c++
  // Check for Quirks Mode.
  if(name!="html"){
    setCompatibilityMode(Document::QuirksMode);
    return;
  }
```

HTML4 有限怪异模式：

```html
<!DOCTYPE HTML PUBLIC"-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
// systemId 为 ”http://www.w3.org/TR/html4/loose.dtd”
```

```c++
 // Check for Limited Quirks Mode.
  if(!systemId.isEmpty()&&
       publicId.startsWith("-//W3C//DTD HTML 4.01 Transitional//",
                           TextCaseASCIIInsensitive))){
    setCompatibilityMode(Document::LimitedQuirksMode);
    return;
  }
```

SystemId 为空：怪异模式。

既不是怪异模式，也不是有限怪异模式，即为标准模式：

```c++
 // Otherwise we are No Quirks Mode.
  setCompatibilityMode(Document::NoQuirksMode);
```

- 怪异模式 quirks： 模拟 IE，同时 CSS 解析会比较宽松，数字单位可以省略。
  - `input` 和 `textarea` 的默认盒模型会变为 `border-box`。
  - 文档高度是窗口可视域的高度。
  - 为了计算行内子元素的最小高度，一个块级元素的行高必须被忽略。
- 有限怪异模式：与标准模式的唯一区别在于对 inline 元素的行高处理不一样。
  - div 里的图片下方不会留空白。
  - 为了计算行内子元素的最小高度，一个块级元素的行高必须被忽略。
- 标准模式：页面遵守文档规定。
  - 文档高度为实际内容的高度。
  - div 里的图片下方会留空白，由 div 的行高撑起。

### （5）开标签处理

Webkit 使用 `m_attachmentRoot` 记录 `attach` 的根结点，初始化 `HTMLConstructionSite` 也会初始化这个变量，值为 `document`。

以 `<html>` 标签为例：

#### `insertHTMLHtmlStartTagBeforeHTML`

- 先实例化一个 `HTMLHtmlElement` 元素。
- 调用 `attachLater()` 函数将结点挂载到父结点上（通过添加一个任务）。
  - 传递两个参数，第一个参数是父结点，第二个是当前结点。
  - 挂载的任务实际上被添加到任务队列中。
- 使用一个栈 `m_openElements` 保存未遇到闭标签的所有开标签，将创建的结点 push 到栈中。
- `executeQueuedTasks` 执行队列中的任务。

```c++
HTMLConstructionSite::HTMLConstructionSite(Document& document): 		m_document(&document),
	m_attachmentRoot(document)
){}

// 插入 html 元素
void HTMLConstructionSite::insertHTMLHtmlStartTagBeforeHTML(AtomicHTMLToken* token){
  HTMLHtmlElement*element = HTMLHtmlElement::create(*m_document);
  // 将 html 结点挂载为 document 元素的子结点
  attachLater(m_attachmentRoot,element);
  m_openElements.pushHTMLHtmlElement(HTMLStackItem::create(element,token));
  executeQueuedTasks();
}

// 插入 head 元素
void HTMLConstructionSite::insertHTMLHeadElement(AtomicHTMLToken*token){
  // 创建 head 结点
  m_head = HTMLStackItem::create(createHTMLElement(token),token);
  // currentNode() 当前父结点
  // m_head -> element() 新增的子结点
  attachLater(currentNode(), m_head -> element());
  m_openElements.pushHTMLHeadElement(m_head);
} 
```

#### `attachLater`

`attachLater` 如何建立一个 task：

- DOM 树具有一个最大的深度 `maximumHTMLParserDOMTreeDepth` = 512
- 超过最大深度，会将它子元素当作父元素的同级节点。

```c++
 void HTMLConstructionSite::attachLater(ContainerNode* parent,
                                       Node* child,
                                       bool selfClosing){
  HTMLConstructionSiteTask task(HTMLConstructionSiteTask::Insert);
  task.parent=parent;
  task.child=child;
  task.selfClosing=selfClosing;
 
  // Add as a sibling of the parent if we have reached the maximum depth
  // allowed.
  if(m_openElements.stackDepth()>maximumHTMLParserDOMTreeDepth&&
      task.parent->parentNode())
    task.parent=task.parent->parentNode();
 
  queueTask(task);
}
```

#### `executeQueuedTasks`

`executeQueuedTasks` 会根据 task 的类型执行不同的操作，如此处进行 insert，会去执行一个插入的函数：`parserAppendChild`：

- 检查父元素是否支持子元素，不支持就直接返回。（video 标签不支持子元素）
- 然后再去调用具体的插入 `appendChildCommon`

```c++
void ContainerNode::parserAppendChild(Node* newChild){
  if(!checkParserAcceptChild(*newChild))
    return;
    AdoptAndAppendChild()(*this, *newChild, nullptr);
  }
  notifyNodeInserted(*newChild, ChildrenChangeSourceParser);
}
```

#### `appendChildCommon`

- 设置子元素的父结点
- 如果没有 lastChild，会将这个子元素作为 firstChild。
- 否则将这个子元素的 上一个兄弟结点 previousSibling 指向当前的 lastChild，当前 lastChild 的 nextSibling 指向该子结点，再把子元素设置为当前 ContainerNode 的 lastChild。

```c++
void ContainerNode::appendChildCommon(Node&child){
  child.setParentOrShadowHostNode(this);
  if(m_lastChild){
    child.setPreviousSibling(m_lastChild);
    m_lastChild->setNextSibling(&child);
  }else{
    setFirstChild(&child);
  }
  setLastChild(&child);
}
```

为什么要用一个 task 队列存放将要插入的结点，而不是直接插入？

- 方便统一处理 task
- 有些 task 可能不能立即执行

不过在例子中，存完的下一步就执行了。



#### `currentNode()` 

- `attachLater` 传参的第一个参数，为新增元素的父结点
- 是 **开标签栈** 中最顶部的元素

```c++
ContainerNode* currentNode() const {
	return _openElements.topNode();
}
```

### （6）处理闭标签

当遇到闭标签时，会将栈中的元素不断 pop 出来，直到 pop 出第一个和它标签名字一样的：

```c++
m_tree.openElements() -> popUntilPopped(token->name())
```

#### body 闭标签

遇到 body 闭标签后，并不会把 `body` pop 出来，因此如果 `body` 闭标签后再写了标签的话，会被自动当成 `body` 的子元素。

#### 格式化标签

带有格式化的标签会特殊处理，遇到一个开标签时会把它们放到一个列表里面：

```c++
// a, b, big, code, em, font, i, nobr, s, small, strike, strong, tt, and u.
m_activeFormattingElements.append(currentElementRecord() -> stackItem())
```

遇到一个闭标签时，又会从这个列表里面删掉，每处理一个新标签时，就会检查**这个列表和栈里的开标签**是否对应。

- 如果不对应则会 reconstruct：重新插入一个开标签。
- 因此格式化标签如果缺少闭标签，就会被不断重新插入，直到遇到下一个对应的闭标签为止。

```html
<p><b>hello</p>
```

<img src="E:\js\java-script-learning-notes\构建 DOM 树.assets\818663-20170115161205025-676435385.png" alt="img" style="zoom:50%;" />

### （7）自定义标签的处理

自定义标签默认不会有任何的样式，且默认为一个行内元素。

在 blink 源码中，不认识的标签默认会被实例化为一个 `HTMLUnknownElement`，这个类对外提供了一个 `create` 函数。

- 这和 HTMLSpanElement 是一样的，都只有一个 `create` 函数，且都继承于 `HTMLElement`。
- 因此从本质上来说，可以把自定义的标签当作一个 `span` 看待。

JavaScript 可以定义一个自定义标签，并定义它的属性：

```c++
CustomElementDefinition* definition=
      m_isParsingFragment ? nullptr
                          :lookUpCustomElementDefinition(document,token);
```

注册一个自定义标签：

- 通过这种方式创建的元素，不是 `HTMLUnknownElement`，blink 通过 V8 引擎把 js 的构造函数转化为 C++ 的函数，实例化为一个 HTMLElement 对象。

```js
window.customElements.define("high-school", HighSchoolElement)
class HighSchoolElement extends HTMLElement {
  constructor() {
    super()
    this._country = null
  }
  get country() {
    return this._country
  }
  set country(country) {
    this.setAttribute("country", country)
  }
  static get observedAttributes() {
    return this["country"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this._country = newValue
    this._updateRender(name, oldValue, newValue)
  }
  _updateRender(name, oldValue, newValue) {
    console.log(...)
  }
}
```

## 4. 查找 DOM 过程

### （1）按 ID 查找

```html
<script>document.getElementById('text')</script>
```

Chrome V8 引擎会将 JavaScript 代码层层转化，最后调用：

```c++
DocumentV8Internal::getElementByIdMethodForMainWorld(info);
```

这个函数又会调用 `TreeScope` 的 `getElementById` 函数，`TreeScope` 存储了一个 `m_map` 的哈希map，这个 map 以标签 id 字符串作为 key 值，Element 为 value 值。

- 由于 map 的查找时间复杂度为 O(1)，因此使用 ID 选择器是最快的。

```html
<div class="user"id="id-yin">
    <pid="id-name"class="important">yin</p>
    <pid="id-age">20</p>
    <pid="id-sex">mail</p>
</div>
```

```
存储的 map 结构为：
"id-age" "P"
"id-sex" "P"
"id-name" "P"
"id-yin" "DIV"
```

### （2）类选择器

```js
var users = document.getElementsByClassName("user");
users.length;
```

在执行第一行的时候，Webkit 返回了一个 ClassCollection 的列表：

- 这个列表并不是去查 DOM 获取的，只是记录了 className 作为标志。
- 这种 HTMLCollection 的数据结构都是在使用的时候才去查 DOM

```c++
return new ClassCollection(rootNode, classNames);
```

所以在上面第二行去获取 length 时，才会触发它的 DOM 查找，在 nodeCount 这个函数里面执行。

- 先获取符合 collection 条件的第一个结点
- 然后不断获取下一个符合条件的结点，直到 null
- 并把它存到一个 cachedList 里面。

```c++
NodeType* currentNode = collection.traverseToFirst();
unsigned currentIndex = 0;
while(currentNode) {
	m_cachedList.push_back(currentNode);
	currentNode = collection.traverseForwardToOffset(
		currentIndex + 1, *currentNode, currentIndex);
}
```

下次在获取这个 collection 的东西时便不用再重复查 DOM， 只要 cached 仍然有效。

```c++
if(this->isCachedNodeCountValid()) {
	return this->cachedNodeCount();
}
```

找到有效结点的方法：

- 获取第一个节点，如果没有 match，继续 next，直到找到符合条件的节点或节点为空为止。

```
ElementType* element = Traversal<ElementType>::firstWithin(current);
while(element && !isMatch(*element)) 
	element = Traversal<ElementType>::next(*element, &current, isMatch);
return element;
```

**next 获取下一个结点（深度优先查找）**：

- 当前结点有子元素，返回它的第一个子元素
- 没有子元素，并且在根结点就是开始找的根元素（document），则说明没有下一个元素了，直接返回 null / 0。
- 如果这个节点不为根元素，且为叶子结点，则检查它是否有相邻元素，有则返回下一个相邻元素。
- 不为根结点的叶子结点，且没有相邻元素，则说明已经到了最深的一层，并且是当前层的最后一个叶子结点。那么就返回它的父元素的下一个相邻节点。

```c++
if(current.hasChildren()) 
	return current.firstChild();
if(current == stayWithin)
	return 0;
if(current.nextSibling())
	return current.nextSibling();
return nextAncestorSibling(current, stayWithin);
```

### （3）querySelector

i. selector 为一个 id 时：

```js
document.querySelector("#id-name")
```

会调用 `ContainerNode` 的 `querySelector` 函数：

- 先把输入的 selector 字符串序列化为一个 `selectorQuery`
- 然后再 `queryFirst`，最后会调用 `TreeScope` 的 `getElementById`：

```c++
SelectorQuery* selectorQuery = document().selectorQueryCache().add(
	selectors, document(), exceptionState);
	
return selectorQuery -> queryFirst(*this);
```

```c++
rootNode.treeScope().getElementById(idToMatch);
```

ii. selector 为一个 class：

```js
document.querySelector(".user");
```

会从 document 开始遍历：

```c++
for(Element& element: ElementTraversal::descendantsOf(rootNode)) {
	if(element.hasClass() && element.classNames().contains(className)) {
    SelectorQueryTrait::appendElement(output, element);
    if(SelectorQueryTrait::shouldOnlyMatchFirstElement)
      return;
  }
}
```

- for 循环并非把所有的元素都取出来做循环，而是重载 ++ 操作符

  ```c++
  voidoperator++ () { m_current = TraversalNext::next(*m_current, m_root);}
  ```

- 这个 next 中 match 的条件判断是：

  - 有 className
  - 并且 className 列表里包含这个 class

### （4）复杂选择器

例如两个 class：

```js
document.querySelector(".user .important");
```

最终也会转成一个遍历，只是判断是否 match 的条件不一样：

```c++
for(Element& element: ElementTraversal::descendantsOf(rootNode)) {
	if(selectorMatches(selector, element, rootNode)) {
    SelectorQueryTrait::appendElement(output, element);
    if(SelectorQueryTrait::shouldOnlyMatchFirstElement)
      return;
  }
}
```

如果是怪异模式，会调一个 `executeSlow` 查询，并且判断 match 的条件也不一样。不过遍历是一样的。


那代码在执行的过程中，具体又做了什么呢？

## 执行上下文 Execution Context

> ES5 规范去除了 ES3 中 变量对象 和 活动对象 ，以 `词法环境组件`(LexicalEnvironment component) 和 `变量环境组件`(VariableEnvironment component) 替代。

执行上下文（Execution Context）有三个组成部分：

-   **LexicalEnvironment**：是一个词法环境(Lexical Environment)。
-   **VariableEnvironment**：也是一个词法环境(Lexical Environment)，一般和LexicalEnvironment指向同一个词法环境。
-   **ThisBinding**：这个就是代码里常用的this。

在 ES6 中，词法环境和 变量环境的区别在于前者用于存储函数声明和变量（ `let`和`const`关键字）绑定，而后者仅用于存储变量（ `var` ）绑定。

- 因此变量环境实现函数级作用域，
- 通过词法环境在函数作用域的基础上实现块级作用域。
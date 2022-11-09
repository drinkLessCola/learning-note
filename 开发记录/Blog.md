## Vue3 + TypeScript import 组件报错
https://www.cnblogs.com/lingern/p/16077302.html

## 优雅使用 svg

### __dirname && process.cwd()
- `__dirname` 是指 **被执行js文件** 所在的文件夹目录
- `process.cwd()` 是当前 **node 命令执行时** 所在的文件夹目录

使用 `process.chdir()` 时，两者会有所区别。
该方法用于改变工作目录。

在A目录下写的 node 脚本，可以通过 `process.chdir()` 在B目录下运行，而不需要改变脚本的目录。
- 此时， `__dirname` 是文件的位置，即 A 目录。
- `process.cwd()` 是运行目录，即 B 目录。




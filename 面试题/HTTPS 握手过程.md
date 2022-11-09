## 01. Client Hello

客户端经过 TCP 三次握手后，发送 Client Hello 给服务端。

- 告诉服务端支持的 **TLS 版本** 和 **加密套件**（不同的加密算法组合）
- 并生成**一个随机数（第1随机数）**发给服务端

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005210117449.png" alt="image-20221005210117449" style="zoom:80%;" />

## 02. Server Hello

服务端收到后发送 Server Hello 给客户端

- 在响应报文中发送服务端**确认支持的 TLS 版本**以及**选择的加密套件**。
- 服务器也生成**一个随机数（第2随机数）**发给客户端。

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005210353842.png" alt="image-20221005210353842" style="zoom:80%;" />

## 03. Certificate

服务器响应自己的**证书**

- 浏览器可以通过检查服务器的证书确认服务器是否可信。

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005210449675.png" alt="image-20221005210449675" style="zoom:80%;" />

## 04. Server Key Exchange

服务器发送自己的**公钥**。

- 如果服务器需要客户端的证书也会在这里发出请求（如登录网银时）

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005210623805.png" alt="image-20221005210623805" style="zoom:80%;" />

## 05. Server Hello Done

服务器响应完毕，发送 Server Hello Done

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005210809019.png" alt="image-20221005210809019" style="zoom:80%;" />

## 06. Client Key Exchange, Change Ciper Spec, Encrypted Handshake Message

客户端生成并交换预主秘钥。客户端和服务端分别用三个随机数计算出会话秘钥。

- 生成第三个随机数，称为 **预主密钥**。
- **使用服务器的公钥**对**第三个随机数**进行加密。并把加密后的随机数发送给服务器。
- <img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005211107634.png" alt="image-20221005211107634" style="zoom:80%;" />
- 客户端使用 **预主密钥，第 1 随机数和 第 2 随机数 **计算出会话秘钥。

**Change Cipher Spec**：告诉服务器往后的数据使用协商的算法和 **会话秘钥** 进行加密。

**Encrypted Handshake Message**：表示客户端这边的 TLS 协商已经准备好了，加密开始。

## 07. Encrypted Handshake Message

服务器也发送 Encrypted Handshake Message 表示准备完毕。

- 服务端收到加密后的预主密钥，使用自己的私钥进行解密。
  - 只有客户端和服务端知道预主密钥。
- 服务端也使用 **预主密钥，第 1 随机数和 第 2 随机数 **计算出**会话秘钥**。
- 此时 TLS 握手成功。



也就是说， TLS 握手过程中前面使用的是 **非对称性加密**，后面使用会话秘钥进行通信是 **对称性加密**。

- 因为非对称性加密的计算消耗比较大。

<img src="E:\js\java-script-learning-notes\面试题\HTTPS 握手过程.assets\image-20221005212636793.png" alt="image-20221005212636793" style="zoom:80%;" />
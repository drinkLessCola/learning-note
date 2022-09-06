## 引入网络字体

这个还是很方便的，新建了一个仓库用来存放字体文件。

踩坑点：

- 要注意 src 的链接必须是下载链接，就是打开这个链接会直接下载一个字体文件到本地。

- 微信小程序在控制台会报错

  - ![image-20220815101153341](E:\js\java-script-learning-notes\YoungCamp2022\image-20220815101153341.png)

  - 官方解释说这个可以不用理会，详情可见下面的链接
  - [引入字体包报错有遇到的吗？Failed to load font net::ERR_CACHE](https://developers.weixin.qq.com/community/develop/doc/000a060c9bc760d11a59630a35ec00)

```css
@font-face {
  font-family: 'Gilroy Bold';
  src: url("https://gitee.com/zirina/font-family/raw/master/gilroy-bold-4.otf");
}
```



## 小程序中使用 SVG 

### 1.将 SVG 文件转 Base64 ，在 CSS 中新建一个类并设置背景图片 url

- 不过还是要根据 svg 图片的大小设置高度和宽度，否则容器不会被撑开。

```css
.icon-address {
  display: inline-block;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5LjQyOSIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDkuNDI5IDEyIj4NCiAgPHBhdGggZD0iTTE2NC42ODYsNjMuOTg5YTQuNzE5LDQuNzE5LDAsMCwwLTQuNzEzLDQuNzEzYzAsMi41MDksNC4yMjUsNi45NjQsNC40LDcuMTUzYS40MjkuNDI5LDAsMCwwLC4zMTEuMTM0aC4wMDlhLjQxNS40MTUsMCwwLDAsLjMxMy0uMTQ3bDEuNDYzLTEuNjc1YzEuOTQ0LTIuMzgsMi45MjgtNC4yMTgsMi45MjgtNS40NjJBNC43Miw0LjcyLDAsMCwwLDE2NC42ODYsNjMuOTg5Wm0wLDYuODU2YTIuMTQyLDIuMTQyLDAsMSwxLDIuMTQyLTIuMTQyQTIuMTQxLDIuMTQxLDAsMCwxLDE2NC42ODYsNzAuODQ1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1OS45NzMgLTYzLjk4OSkiIGZpbGw9IiM4YThhOGEiLz4NCjwvc3ZnPg0K");
  background-size: contain;
  background-repeat: no-repeat;
  height:12px;
  width:10px;
}
```



## 自定义导航栏

注意增加一个填充块，填充 fixed 导致的空缺，

为避免页面滚动时， 填充块跟着滑动，position 要设置为 sticky。

## 自定义 tabbar

https://blog.csdn.net/protreshel/article/details/118389009

https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html

## 无法重新声明块范围变量。此处也声明了 xx

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220818115952448.png" alt="image-20220818115952448" style="zoom:80%;" />

https://www.cnblogs.com/awench/p/16224033.html

https://developers.weixin.qq.com/community/develop/doc/00082a6fc70e58c94bf936f035b400

页面结尾加上 export {}



## 微信小程序button默认样式修改

https://www.jianshu.com/p/6c034483bdf2



## bindtap 方法传参

https://blog.csdn.net/m0_46526358/article/details/113995010



## switchTab 需要加一杠在前面

![image-20220818162645180](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220818162645180.png)

### CSS 去除预设的属性值

微信小程序中的 `textarea` 有默认的宽度，可通过 `width:unset` 去除。

### this 类型的问题



 [TypeScript "this" 隐式具有类型 "any",因为它没有类型注释 'this' implicitly has type 'any' because it does not have a type annotation ](https://www.cnblogs.com/ltfxy/p/16395205.html)



- wx.switchTab({ url:"/pages/taskCenter/taskCenter"})
- wx.navigateTo()
- wx.redirectTo()

## tab 页之间带参跳转

https://blog.csdn.net/weixin_42220039/article/details/109338513

## 退出登录

https://blog.csdn.net/m0_68842055/article/details/125211966

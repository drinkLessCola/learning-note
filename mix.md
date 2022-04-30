来自华南农业大学20级计算机科学与技术专业，绩点4.2+/5.0，专业前5%，是新禾融媒体工作室技术部的成员，熟练掌握 HTML，CSS，JavaScript，深入理解 JavaScript 核心部分，如 原型链和闭包，熟悉 ES6 语法，如 promise，箭头函数，能够使用 React.js 框架完成应用开发，有多段微信小程序开发经验。

- [ ] 填写简历
- [ ] 计组实验报告





api

- stage.get/setWidth()
- stage.getsetHeight()

窗口可调节大小

- stage.setResizable(true);
- stage.setMaxHeight/Width()

```java
stage.heightProperty().addListener(new ChangeListener<Number>(){
  @override
  public void changed(ObservableValue<? extends Number> observable, Number oldValue, Number newValue){
    System.out.println(newValue.doubleValue());
  }
})
```

窗口距桌面左上角的坐标

stage.setX/Y()

最大化

stage.setMaximiazed(true);

透明

stage.setOpacity(0.5);

始终置顶

stage.setAlwaysOnTop(true)

全屏

stage.setFullScreen(true);

**stage.setScene(new Scene(new Group()));**

**容器，窗口会跟随拉伸！**



#### stage initStyle

DECORATED 默认

TRANSPARENT / UNDECORATED 透明

UNIFIED是模糊边界，窗体边界没有实线框

UTILITY

#### stage initModality

APPLICATION_MODAL 不能跳过的窗口

适用于多个窗口之间没有关联

WINDOW_MODAL

要先设置 initOwner(s1) 规定一个父窗口

![image-20220327150813380](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220327150813380.png)
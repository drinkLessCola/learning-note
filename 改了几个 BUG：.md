**改了几个 BUG：**

删去了标签 `<el-icon>`

![image-20220811173244346](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220811173244346.png)

参数名改了一个，如果参数名有大写，v-text 好像会有 bug。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220811173324693.png" alt="image-20220811173324693"  />

![image-20220811173439539](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220811173439539.png)







因为换页时发送请求时，携带的数据没有搜索内容。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220811170029209.png" alt="image-20220811170029209" style="zoom:80%;" />

可能有一个 bug：如果搜索结果有多页的话，点击换页时不是对搜索结果的下一页进行请求，而是对全部文件的下一页进行请求。

**解决的话想到两个：**

1. 服务端将搜索结果 / 获取文件的结果全部返回，由前端分页。
2. 根据搜索框里面是否有内容，来决定发送请求的时候的 cooperateName / projectName 。
   - 即搜索框有内容时，是对搜索结果的下一页进行请求，
   - 搜索框没有内容时，是对全部文件的下一页进行请求。
- 全部： status = 其他
- 进行中：status = 1
  - /task/_mget/${userid}/1/1
- 待确认：status = 1
  - 
- 已截止：status = 0
- 已下线：status = 0
-  /user_task/get/${taskId}

|        | status | /task/_mget/${userid}/${role}/${status} | 过滤           | 待确认（获取用户任务状态）              |
| ------ | ------ | --------------------------------------- | -------------- | --------------------------------------- |
| 全部   | 其他   | /task/_mget/${userid}/1/5               |                |                                         |
| 进行中 | 1      | /task/_mget/${userid}/1/1               | deadline > now |                                         |
| 待确认 | 1      | /task/_mget/${userid}/1/1               |                | /user_task/get/${taskId}   有status = 2 |
| 已截止 | 0      | /task/_mget/${userid}/1/0               | deadline < now |                                         |
| 已下线 | 0      | /task/_mget/${userid}/1/0               |                |                                         |



|        | /task/_mget/${userid}/${role}/${status} | /user_task/getStatus/${userid}/${taskid} | 过滤       |
| ------ | --------------------------------------- | ---------------------------------------- | ---------- |
| 已完成 | /task/_mget/${userid}/0/0               | /user_task/getStatus/${userid}/${taskid} | status = 0 |
| 待确认 | /task/_mget/${userid}/0/0               | /user_task/getStatus/${userid}/${taskid} | status = 2 |


# Promise, async/await

## 回调

JavaScript主机环境提供了许多函数，允许我们计划异步行为。

例如，setTimeout函数就是这样的一个函数。



```js
function loadScript(src){
	let script = document.createElement('script');
	script.src = src;
	document.head.append(script);
}

loadScript('/my/script.js');
```

它将创建指定src的标签\<script src = “…">，浏览器将自动开始加载它，并在加载完成后执行。

loadScript函数并没有提供跟踪加载完成的方法。

可以添加一个callback函数作为loadScript的第二个参数：

```js
function loadScript(src,callback){
	let script = document.createElement('script');
	script.src = src;
	
	script.onload = () => callback(script);
	
	document.head.append(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`Cool, the script ${script.src} is loaded`);
  alert( _ ); // 所加载的脚本中声明的函数
});
```

现在我们可以通过添加一个回调函数，使该函数在行为完成时运行。

**一般是一个匿名函数。**

这被称为**“基于回调”的异步编程风格**。

异步执行某项功能的函数应该提供一个callback参数用于在相应事件完成时调用。

### 多重回调

如何依次执行某些行为。（先执行完第一个，再执行第二个）

自然的解决方案是将第二个行为调用放入第一个行为的回调中。

```js
loadScript('/my/script.js', function(script) {
  loadScript('/my/script2.js', function(script) {
    loadScript('/my/script3.js', function(script) {
      // ...加载完所有脚本后继续
    });
  });
});
```

### 处理Error

```js
function loadScript(src, callback){
	let script = document.createElement('script');
	script.src = src;
	
	script.onload = () => callback(null,script);
	script.onerror = () => callback(new Error(`Script load error for ${src}`));
  //在调用时的第二个参数的函数中声明解决error的方法。
	
	document.head.append(script);
}
//在这里的匿名函数，第一个参数预留给了error
loadScript('/my/script.js',function(error,script){
  if(error){
    // 处理error
  } else {
    // 脚本加载成功
  }
});
```

这被称为==**“Error 优先回调（error-first callback）”风格**==。

1. callback的第一个参数是为error保留的。一旦出现error，callback(err)会被调用。
2. 第二个参数用于成功的结果，此时callback(null, result1, result2…) 就会被调用。

因此，单一的callback函数可以同时具有报告error和传递返回结果的作用。



### 厄运金字塔

随着调用嵌套的增加，代码层次变得更深，不断向右增长。这被称为“回调地狱”/“厄运金字塔”。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211225225047325.png" alt="image-20211225225047325" style="zoom:80%;" />

我们可以通过使每个行为都成为一个独立的函数来尝试减轻这种问题。

```js
loadScript('1.js',step1);

function step1(error,script){
	 if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...加载完所有脚本后继续 (*)
  }
}
```

将每个行为编写成一个独立的顶层函数

- 但是这样写代码的可读性很差。
- 此外，名为step的函数都是一次性的，复用性差，命名空间混乱。

### 任务：监听div标签的生成

```js
let div = document.createElement('div');
div.style.width/height/left/top = 12 + 'px'; // or 0 不用加px
div.className = 'className';
div.classList.add('className2');
div.append('String'); //在标签之间加入内容<div>...</div>
document.body.append(div);

/*可以写在setTimeout之中*/
div.addEventListener('transitionend',function handle(){
	div.removeEventListener('transitionend',handle);
	//这里执行回调函数
})
```

## Promise

Promise 对象的构造器语法如下：

```js
let promise = new Promise(function(resolve, reject){
	// executor
});
```

传递给new Promise的函数被称为executor。

当new Promise被创建，**executor 会自动执行。**

它的参数resolve 和 reject 是由JavaScript自身提供的**回调**。

当executor获得了结果，它应该调用以下回调之一：

- resolve(value) ——如果任务成功完成并带有结果value。
- reject(error) ——如果出现了error，error即为error对象。

由 new Promise 构造器返回的promise 对象具有以下的内部属性：

- **state**
  - 最初是 “pending”
  - 然后在resolve被调用时变为 ”fulfilled”
  - 或者在reject被调用时变为“rejected”
- **result**
  - 最初是undefined
  - 然后在resolve(value)被调用时变为 value
  - 或者在reject(error)被调用时变为error

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211226231107196.png" alt="image-20211226231107196" style="zoom:80%;" />

```js
let promise = new Promise(function(Resolve,reject){
	//当promise被构造完成 时自动执行此函数
	
	setTimeout(()=>resolve("done"),1000);
  setTimeout(()=>reject(new Error("Whoops!")),1000);
})
```

一个resolved 或 rejected 的promise都会被称为“settled”。

**executor 只能调用一个 resolve 或一个 reject。任何状态的更改都是最终的。**

所有其他的再对resolve和reject的调用都会被忽略。

并且，resolve/reject**只需要一个参数，或不包含任何参数**。并忽略额外的参数。

**reject可以使用任何类型的参数，但是建议使用Error对象（或继承自Error的对象）。**

**Resolve/reject可以立即进行。**

**state 和 result 都是内部的。**

我们无法直接访问它们，但可以对它们使用**.then / .catch /.finally方法**。

### then, catch, finally

#### then

```js
promise.then(
	function(result){},
	function(error){}
);
```

.then 的第一个参数是一个函数，该函数将在promise **resolved**后运行并接收结果。

第二个参数也是一个函数，该函数将在promise **rejected** 后运行并接收error。

```js
let promise = new Promise(function(resolve,reject){
	setTimeout(()=>resolve("done!"),1000);
});

promise.then(
	result => alert(result),
	error => alert(error)
);
```

可以只为.then提供一个函数参数：只处理resolved的情况。

```js
promise.then(alert);
```

#### catch

或者如果我们只对error感兴趣，那么我们可以使用null作为第一个参数：

**.then(null,errorHandlingFunction)。**

或者使用

**.catch(errorHandlingFunction)**

它只是一个简写形式。

#### finally [ES2018]

.finally(f)调用  与 .then(f,f)类似。从某种意义上，f总是在promise被settled时运行。

finally可以用来执行清理功能： 无论结果如何，都停止使用不再需要的加载指示符。

```js
new Promise((resolve,reject) =>{

})
//在promise 为 settled 时运行，无论成功与否
.finally(() => stop loading indicator)
//加载指示器 始终在我们处理结果/错误之前停止
.then(result => show result, err => show error)
```

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

finally(f) 并不完全等同于 then(f,f)。

- finally 处理程序没有关于promise结果的参数，不知道promise是否成功。

- finally处理程序将 **结果和error** 传递给**下一个处理程序**。

  ```js
  new Promise((resolve,reject) => {
  	setTimeout(() => resolve("result"),2000)
  })
  .finally(() => alert("Promise ready"))
  .then(result => alert(Result));
  //在finally之后的.then 对结果进行处理
  ```

我们可以**随时添加处理程序**，如果promise为pendiing状态，.then/catch/finally 处理程序将等待他。

如果结果已经在了，它们就会执行。

### 示例：loadScript

```js
function loadScript(src,callback){
	let script = document.createElement('script');
	script.src = src;
	
	script.onload = () => callback(null,script);
	script.onerror = () => callback(new Error(`Script load error for ${src}`));
	
	document.head.append(script);
}
```

使用promise重写：

```js
function loadScript(src){
  return new Promise((resolve,reject) =>{
    let script = document.createElement('script');
		script.src = src;
    
    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    
    document.head.append(script);
  })
}

let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
	script => alert(`${script.src} is loaded!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('Another handler...'));
```

promise 与 回调的比较：

| Promise                                  | Callbacks                                                    |
| ---------------------------------------- | ------------------------------------------------------------ |
| 我们可以按照自然顺序进行编码。           | 在调用时，我们处理的地方必须要有一个callback函数。即在调用loadScript之前，必须知道如何处理结果。 |
| 可以根据需要，在promise上多次调用.then。 | 只能有一个回调。                                             |

## Promise 链

Promise链将result通过.then处理程序链进行传递。

```js
new Promise((resolve,reject) => {
	setTimeout(() => resolve(1),1000);
}).then(result => {
	alert(result); //1
	return result*2;
}).then(result => {
	alert(result); //2
	return result*2;
}).then(result => {
	alert(result); //4
	return result*2;
});
```

**对 promise.then的调用会返回一个promise**，

因此我们可以在其基础上调用下一个.then。

当then中的处理程序**返回return一个值，它将成为该promise的 result。**

**我们也可以将多个.then添加到同一个promise上。但这并不是promise链。**

```js
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});
```

这几个处理程序彼此独立，并不会相互传递result。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211227001256367.png" alt="image-20211227001256367" style="zoom:80%;" />

### 返回 promise

.then(handle)中的处理程序handle，会创建并返回一个promise。

在这种情况下，其他的处理程序（.then()）将等待它settled后再获得其结果（result）。

返回promise 使我们能够构建异步行为链。

### loadScript

```js
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // 使用在脚本中声明的函数
    // 以证明脚本确实被加载完成了
    one();
    two();
    three();
  });
```

每个loadScript调用都返回一个promise，并且在它resolve时下一个.then开始运行。因此脚本是一个接一个地加载的。

箭头函数简洁版

```js
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // 脚本加载完成，我们可以在这儿使用脚本中声明的函数
    one();
    two();
    three();
  });
```

回调地狱版

```js
loadScript("/article/promise-chaining/one.js").then(script1 => {
  loadScript("/article/promise-chaining/two.js").then(script2 => {
    loadScript("/article/promise-chaining/three.js").then(script3 => {
      // 此函数可以访问变量 script1，script2 和 script3
      one();
      two();
      three();
    });
  });
});
```

直接写.then形成的嵌套函数可以访问外部作用域。

上述例子最深层的那个回调可以访问所有的变量script1 script2 script3。

### Thenables

确切地说，处理程序handle返回的不完全是一个promise，而是一个被称为“thenable”的对象。

一个**具有方法.then的任意对象**。因此会被当做一个promise来对待。

第三方库可以实现自己的“promise兼容”对象。可以具有扩展的方法集，也与原生的promise兼容。

```js
class Thenable{
	constructor(num){
		this.num = num;
	}
	then(resolve,reject){
		alert(resolve);
		setTimeout(() =>resolve(this.num * 2) , 1000);
	}
}

new Promise(resolve => resolve(1))
	.then(result => {
		return new Thenable(result);
	})
	.then(alert);
```

JavaScript检查由.then处理程序返回的对象：如果它**具有名为then的可调用方法，那么它将调用该方法并提供原生函数resolve和reject作为参数**。并**等待直到其中一个函数被调用**。

## 使用promise进行错误处理

当一个promise被reject时，控制权将移交给最近的rejection处理程序。

```js
fetch('http://no-such-server.blabla')//rejects
	.then(response => response.json())
	.catch(err => alert(err)//TypeError: Failed to fetch
```

.catch可以放在一个或多个.then之后，不必是立即的。

因此，捕获所有的error最简单的方法是将.catch附加到链的末尾。

```js
fetch('https://api.github.com/users/jaychouzirina')
	.then(response => response.json())
	.then(gitHubUser => new Promise((resolve,reject)=>{
  	let img = document.createElement('img');
  	img.src = gitHubUser.avatar_url;
  	img.className = "className";
  	document.body.append(img);
  
  	setTimeout(()=>{
      img.remove();
      resolve(gitHubUser);
    },3000);
}))
.catch(error => alert(error.message));
```

### 隐式 try…catch

Promise 的 executor 和 promise处理程序（handle）周围有一个隐式的try…catch。如果发生异常，就会被捕获，并**作为rejection**进行处理。

> executor指promise方法体。
>
> handle指then中的处理resolve和reject的函数

```js
new Promise((resolve,reject)=>{
	throw new Error("Whoops!");
  //与下面的代码工作相同
  reject(new Error("Whoops!"));
}).catch(alert); //Error:Whoops!
```

```js
new Promise((resolve,reject) => {
	resolve("ok");
}).then((result) => {
	throw new Error("Whoops!");
}).catch(alert);
```

最后的.catch会捕获所有的Error，不仅是**显式的rejection**，还有**处理程序中意外出现的error**，比如编程错误。

> catch 也可以捕获 then() 回调函数中的错误

使用 catch 比 在上一个 then 中定义 rejected 的回调函数要好，因为 catch 还可以捕获 then 回调函数中发生的错误。

### 再次抛出 Rethrowing

如果在.catch中throw，那么控制权就会被移交给下一个最近的error处理程序。

- 如果处理该error并正常完成，那么它将往下执行最近的.then处理程序。

  - ```js
    new Promise((resolve,reject)=>{
    	throw new Error("Whoops");
    }).catch(function(err){
    	alert("The err is handled,continue normally");
    }).then(()=>alert("Next successful handle runs"));
    ```

- 如果该error在.catch中被抛出，执行从第一个.catch沿着链跳转到下一个。

  - ```js
    new Promise((resolve,reject)=>{
    	throw new Error("Whoops!");
    }).catch(function(error){
    	if(error instanceof URIError){
    		//handle
    	} else {
    		alert("Can't handle such error");
    		
    		throw error;
    	}
    }).then(function(){
    	/*不运行*/
    }).catch(error => {
    	alert(`The unknown error has occurred: ${error}`);
    })
    ```

### 未处理的 rejection

如果出现error，promise的状态将变为“rejected”，然后执行会跳转到最近的rejection处理程序，如果没有处理程序，那么error会卡住。

> 没有使用 catch 方法指定回调函数，Promise 对象抛出的错误不会传递到外层代码。

当发生一个常规错误并且未被try..catch捕获时，**脚本会死掉**，并在控制台留下错误信息。

对于在promise中未被处理的rejection，也会发生类似的事情。

javaScript引擎会跟踪此类rejection，在这种情况下会**生成一个全局的error**。

**==在浏览器中，我们可以使用 unhandledrejection 事件来捕获这类error==**。

```js
window.addEventListener('unhandledrejection',function(event){
	alert(event.promise);//[object Promise]
	alert(event.reason);// Error: Whoops!
});

new Promise(function(){
  	throw new Error("Whoops!");
})//没有用来处理error的catch
```

这个事件是HTML标准的一部分。

如果出现了一个error，并且**没有.catch捕获**，那么unhandledrejection处理程序就会被触发，并获取具有error相关信息的**event对象**，因此我们可以做一些后续处理。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220106215222635.png" alt="image-20220106215222635" style="zoom:80%;" />

通常此类error是无法恢复的，最好的解决方案是将问题告知给用户，并且将事件报告给服务器。

在Node.js等非浏览器环境中，有其它用于跟踪未处理的error的方法。

### 补充

#### Fetch错误处理实例

显示错误的相关细节信息

##### 检查响应码

```js
class HttpError extends Error {
	constructor(response){
		super(`${response.status} for ${response.url}`);
		this.name = 'HttpError';
		this.response = response;
	}
}

function loadJson(url){
	return fetch(url).then(response => {
		if(response.status == 200){
			return response.json();
		} else {
			throw new HttpError(response);
		}
	})
}

loadJson('no-such-user.json')
  .catch(alert);// HttpError: 404 for .../no-such-user.json
```

使用自定义处理类的好处是我们可以使用instanceof容易地在错误处理代码中检查错误。

**如果响应码为404，代表不存在此用户**

```js
function demoGithubUser(){
	let name = prompt("Enter a name?","iliakan");
	return loadJson(`https://api.github.com/users/${name}`)
		.then(user => {
			alert(`Full name: ${user.name}.`);
			return user;
		})
		.catch(err => {
			if(err instanceof HttpError && err.response.status == 404) {
				alert("No such user, please reenter");
        return demoGithubUser();
			} else {
        throw err;
      }
		});
}

demoGithubUser();
```

##### load-indication 加载指示

使用.finally在加载完成时停止：

```js
function demoGithubUser(){
	let name = prompt("Enter a name?","iliakan");
	
	document.body.style.opacity = 0.3; //开始指示
  return loadJson(`https://api.github.com/users/${name}`)
  	.finally(()=>{ // 停止指示
    	document.body.style.opacity = '';
    	return new Promise(resolve => setTimeout(resolve));
  })
  .then(user => {
    alert(`Full name:${user.name}`);
    return user;
  })
  .catch(err => {
     if (err instanceof HttpError && err.response.status == 404) {
        alert("No such user, please reenter.");
        return demoGithubUser();
      } else {
        throw err;
      }
  });
}

demoGithubUser();
```

**浏览器技巧**

```js
return new Promise(resolve => setTimeout(resolve));
```

从finally返回零延时的promise。

因为一些浏览器（比如chrome）需要一点时间之外的promise处理程序来绘制文档的更改，因此它确保在进入链的下一步之前，指示在视觉上是停止的。

### setTimeout中的错误

```js
new Promise(function(resolve,reject){
	setTimeout(()=>{
		throw new Error("Whoops!");
	},1000);
}).catch(alert);
```

.catch不会被触发，因为这个错误不是在executor运行时生成的，而是在稍后生成的，因此，函数代码周围隐式的try…catch不会生效，try…catch只处理executor中的同步错误。

## Promise API

在Promise类中，有5种静态方法。

### Promise.all

```js
let promise = Promise.all([...promises...]);
```

Promise.all 接受一个promise数组作为参数（从技术上说，可以是任何可迭代的） 并返回一个新的promise。

当**所有给定的promise都被settled**时，新的promise才会resolve，并且其**结果数组**将成为新的promise的结果。

```js
Promise.all([
	new Promise(resolve => setTimeout(() => resolve(1), 3000)),
	new Promise(resolve => setTimeout(() => resolve(2), 2000)),
	new Promise(resolve => setTimeout(() => resolve(3), 1000))
]).then(alert);//1,2,3
```

**结果数组中的元素的顺序与其在源promise中的顺序相同。**

常见的技巧：将一个任务数据数组映射（map）到一个promise数组，然后将其包装到Promise.all。

例如，如果我们有一个存储URL的数组，我们可以像这样fetch它们。

```js
let url = [
	'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// 将每个url映射到fetch的promise中：
let requests = urls.map(url => fetch((url)));
/*或这样*/

let names = ['iliakan','remy','jeresig'];
let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

// Promise.all 等待所有的任务都 resolved
Promise.all(requests)
	.then(responses => {
  responses.foreach(response => alert(`${response.url}: ${response.status}`);
  return responses;
 })
// 将响应数组映射到 response.json() 数组中以读取它们的内容
.then(responses => Promise.all(response.map(r => r.json())))
)
// 所有 JSON 结果都被解析： “users”是它们的数组
.then(users => users.forEach(user => alert(user.name)));
```

**如果任意一个 promise 被reject，由 ==Promise.all== 返回的 promise 就会立即==reject==，并且返回的就是这个error。**

剩下的Promise**会继续执行**，但它们的**结果将被忽略**。

```js
Promise.all([
	new Promise((resolve, reject) => setTimeout(() => resolve(1),1000)),
	new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")),2000)),
	new Promise((resolve,reject) => setTimeout(() => resolve(3), 3000))
]).catch(alert);//Error: Whoops!
```

Promise.all没有采取任何措施来取消它们，在promise中没有“取消”的概念。

**AbortController将帮助我们解决这个问题！**

#### ==**Promise.all（iterable）允许在iterable中使用non-promise的“常规”值。**==

通常，Promise.all(…)接受含有promise项的可迭代对象作为参数，但是，如果这些对象中的任何一个不是promise，那么它将被“按原样”传递给结果数组。

```js
Promise.all([
	new Promise((resolve,reject) => {
		setTimeout(() => resolve(1), 1000)
	}),
	2,
	3
]).then(alert);// 1, 2, 3
```

如果作为参数的 Promise 实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发 Promise.all() 的 catch 方法，而是在自己的 catch 方法中处理，如果将错误处理完了，返回了一个 promise 实例，那么这个 promise 实例将作为 Promise.all() 中 resolved 的实例。

### Promise.allSettled

如果任意的promise reject，则Promise.all整个将会reject。

而promise.allSettled 将返回所有promise的结果，无论是否有reject的。

Promise.allSettled 等待所有的promise都被settle，无论结果如何，结果数组应有：

- { status:“fulfilled”，value:result} 对于成功的响应
- { status:”rejected”, reason:error }对于error

每个promise，我们都得到了其状态和value/reason。

```js
let urls = [
	'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://no-such-url'
];

Promise.allsettled(urls.map(url => fetch(url)))
	.then(results => {
		results.foreach( (result,num)  => {
			if(result.status == "fulfilled"){
				alert(`${urls[num]}:${result.value.status}`);
			}
			if(result.status == "rejected"){
				alert(`${urls[num]}:${result.reason}`);
			}
		});
	});
```

上面的results将是：

```js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error object...}
]
```

#### 😥Polyfill

如果浏览器不支持 Promise.allsettled，很容易进行 polyfill：

```js
if(!Promise.allSettled) {
	const rejectHandler = reason => ({ status: 'rejected',reason});
	const resolveHandler = value =>({ status:'fulfilled',value});
	
	Promise.allSettled = function (promises) {
		const convertedPromises = promises.map(p => 							Promise.resolve(p).then(resolveHandler, rejectHandler));
    //Promise.resolve(p) 用p作为value创建一个resolved的promise
		return Promise.all(convertedPromises);
	};
}
```

在这段代码中，promises.map获取输入值，并通过 p => Promise.resolve(p) 将输入值转换为promise，防止传递了非promise，

然后向每一个promise都添加.then处理程序。

这个处理程序将成功的结果value转换为{status:’fulfilled’ , value}，将error reason 转换为{status:’rejected’,reason}。



### Promise.race

与 Promise.all类似，但只等待第一个settled的promise并获取其结果（或error）。

```js
let promise = Promise.race(iterable);
```

```js
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

第一个settled的promise赢得了比赛之后，所有进一步的result / error 都会被忽略。

### Promise.any

ES 2021 新引入的方法。接收一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。

只要参数实例有一个变成了 fulfilled 状态，包装实例就会变成 fullfilled 状态；

如果所有的参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态。

抛出的错误为 **AggregateError 实例**。

相当于一个数组，每个成员对应一个被 rejected 的操作所抛出的错误。

```js
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```

### Promise.resolve/reject

#### Promise.resolve

promise.resolve(value)，用结果value创建一个 resolved 的 promise。

```js
let promise = new Promise(resolve => resolve(value));
```

当一个函数被期望返回一个promise时，这个方法用于兼容性。

**将value封装进一个promise，以满足返回一个promise的这个需求。**

- 参数是一个 Promise 实例
  - 不作任何修改，直接原封不动地返回这个实例
- 参数是一个 Thenable 对象
  - 会将这个对象转化为一个 Promise 对象
  - 然后立即执行 thenable 对象的  then 方法。
- 参数不是具有 then 方法的对象 / 不是对象
  - 返回一个新的 Promise 对象，状态为 resolved。

例：loadCached函数获取一个URL并记住其内容，以便将来对使用相同URL的调用，

它能从缓存中获取先前的内容，但使用Promise.resolve创建了一个该内容的promise，所以返回的值始终是一个promise。

```js
let cache = new Map();

function loadCached(url){
	if(cache.has(url)) return Promise.resolve(cache.get(url));
  
	return fetch(url)
	.then(response => response.text())
	.then(text => {
		cache.set(url,text);
		return text;
	});
}

```

#### Promise.reject

Promise.reject(error) 用 error 创建一个rejected 的 promise。

与下式相同：

```js
let promise = new Promise((resolve, reject) => reject(error));
```

## Promisification

指将一个接收回调的函数转换为一个返回promise的函数。

由于许多的函数和库都是基于回调的，因此，在实际开发中经常会需要进行这种转换。

对loadScript进行promisfy：

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}

// 用法：
// loadScript('path/script.js', (err, script) => {...})

function loadScriptPromise(src){
  return new Promise((resolve,reject)=>{
    loadScript(src,(err,script)=>{
      if(err) reject(err);
      else resolve(script);
    })
  })
}
```

新的函数是对原始的loadScript的包装。新函数调用它，并提供了自己的回调来将其转换为promise resolve/reject。

### Promisify辅助函数

```js
function promisify(f){
	return function(...args){
		return new Promise((resolve,reject) => {
			function callback(err,result){
        if(err) reject(err);
        else resolve(result);
      }
      
      args.push(callback);
      f.call(this,...args);
		});
	};
}

//用法
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

如果原始的f期望一个带有更多参数的回调callback(err,res1,res2,…)

可以用一个更高阶的promisify。

- 当它以promisify(f)的形式调用，应该与上面那个版本实现的工作方式类似。
- 当它被以promisify(f,true)的形式调用时，它应该返回以**回调函数数组**为结果resolve的promise。

```js
function promisify(f,manyArgs = false){
	return function(...args){
		return new Promise((resolve,reject) => {
			function callback(err,...results){
				if(err) reject(err);
				else resolve(manyArgs? results : results[0]);
			}
      
      args.push(callback);
      f.call(this,...args);
		});
	};
}

f = promisify(f, true);
f(...).then(arrayOfResults => ...,err => ...);
```

对于一些回调格式，比如没有err的：callback(result)，可以手动promisify这样的函数，而不使用helper。

也有一些具有更灵活一点的promisification函数的模块（module），例如**es6-promisify**。在Node.js中，有一个内建的promisify函数的util.promisify。

Promisification是一种很好的方法，特别是在使用async/await的时候，但不是回调的完全替代。

一个promise可能只有一个结果，**但一个回调可能会被调用很多次**。

因此，**promisification仅适用于调用一次回调的函数。进一步的调用将被忽略。**

## 微任务（microtask）

Promise的处理程序，.then，.catch，.finally 都是异步的。

即便一个promise立即被resolve，.then、.catch和.finally下面的代码也会在这些处理程序之前被执行。

```js
let promise = Promise.resolve();
promise.then(() => alert("promise done!"));

alert("code finished"); // 这个alert先显示
```

#### 微任务队列（Microtask queue）

EMCA标准规定了一个内部队列 PromiseJobs，通常被称为“微任务队列”。（ES8术语）

- 队列是先进先出的：**首先进入队列的任务会首先运行**。
- 只有在JavaScript引擎中**没有其他任务在运行时**，才开始执行任务队列中的任务。

当一个promise准备就绪时，它的.then/catch/finally 处理程序就会被放入队列中，但是不会立即被执行。当JavaScript引擎执行完当前的代码，它会从队列中获取任务并执行它。

Promise的内部程序总是会经过这个内部队列。

如果有一个包含多个.then/catch/finally的链，那么它们中的每一个都是**异步**执行的。它会首先进入队列，然后在当前代码自行完成且先前排队的处理程序都完成时才会被执行。

如果执行顺序很重要，那么都使用 .then放入队列。

### 未处理的rejection

unhandledrejection事件运行原理：

**如果一个promise的error未被在==微任务队列的末尾==进行处理，则会出现“未处理的rejection”**

正常来说，我们可以在promise链的末尾加上.catch来处理error，

但是如果我们忘记添加.catch，或迟一些处理error，那么，**微任务队列清空**后，JavaScript引擎会触发unhandledrejection事件：

```js
let promise = Promise.reject(new Error("Promise Failed!"));

window.addEventListener('unhandledrejection',event => alert(event.reason));
```

```js
let promise = Promise.reject(new Error("Promise Failed!"));
setTimeout(() => promise.catch(err => alert('caught')), 1000);

window.addEventListener('unhandledrejection', event =>alert(Event.reason));
```

上面这段代码，我们会先看到Promise failed！，然后才是caught。

是因为微任务队列中的任务都完成时，才会生成unhandledrejection：引擎会检查promise，如果promise中的任意一个出现rejected状态，unhandledrejection事件就会被触发。

但setTimeout事件在unhandledrejection事件出现之后才会被触发。



## Async/await

### Async function

async这个关键字可以被放置在一个函数前面：

```js
async function f(){
	return 1;
  //相当于
  return Promise.resolve(1);
}

f().then(alert);// 1
```

在函数前面的“async”这个单词表达了一个简单的事情：

==**即这个函数总是返回一个promise**==。

其他值将自动被包装在一个resolved的promise中。

### Await

```js
let value = await promise;
```

关键字 await 让 JavaScript 引擎等待直到 promise 完成并返回结果。

**只能在async函数内工作。**

```js
async function f(){
	let promise = new Promise((resolve,reject) => {
		setTimeout(() => resolve("done!"), 1000)
	});
	
	let result = await promise; //等待直到promise resolve
	alert(result); //done!
}

f();
```

这个函数在执行的时候，暂停在了let result = 那一行，并在promise settle时，拿到result作为结果继续往下执行。

await实际上会暂停函数的执行，直到promise状态变为settled，然后以promise的结果继续执行。这个行为不会耗费任何CPU资源。因为JavaScript引擎可以同时处理其他任务。

相比于promise.then，它是获取promise的结果的一个更优雅的语法。

```js
async function showAvatar(url){
  
  let response = await fetch(url);
  let user = await response.json();
  let githubResponse = await fetch(`https://api.github.com/users/${name}`);
  let githubUser = await githubResponse.json();
  
  let img = document.createElement('img');
  img.src = githubUser.avatur_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // 用来等待3s
  await new Promise((resolve,reject) => 
    setTimeout(() => resolve, 3000));
  
    img.remove();
    return githubUser;
  //返回的值会被自动包装为一个resolved 的 promise。
} 
```

#### await 不能在顶层代码运行

但可以将其包裹在一个匿名async函数中：

```js
(async () => {
	let response = await fetch('...xxx.json');
	...
})
```

※ **从V8引擎 8.9+ 开始，顶层await可以在模块中工作。**

#### await 接受 thenables

await 允许我们使用 thenable 对象，即那些**具有可调用then方法的对象**。

```js
class Thenable{
  constructor(num){
    this.num = num;
  }
  then(resolve,reject){
    alert(resolve);
    setTimeout(() => resolve(this.num * 2), 1000);
  }
}

async function f(){
  let result = await new Thenable(1);
  alert(result);
}

f();
```

如果await接收了一个非promise的但是提供.then方法的对象，

它就会**调用这个.then方法**，并**将内建的函数resolve和reject作为参数传入**。

就像它对待一个常规的Promise executor一样。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108144307272.png" alt="image-20220108144307272" style="zoom:80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108144352457.png" alt="image-20220108144352457" style="zoom: 80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108145507774.png" alt="image-20220108145507774" style="zoom:80%;" />

> async函数最终会返回一个resolved的promise
>
> 不使用await new Thenable 将不会执行Thenable对象中的then方法
>
> 但是如果return 这个Thenable对象，那么Thenable对象会执行.then
>
> 可能是return的时候会检查对象是否有then方法，如果有的话会执行并等待

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108144858460.png" alt="image-20220108144858460" style="zoom:80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108144908356.png" alt="image-20220108144908356" style="zoom: 80%;" />

> 使用await 将会执行Thenable对象中的then方法，并等待resolve/reject其中的一个方法被调用
>
> async函数立刻返回一个Promise，但其状态为pending！ 

#### Class 中的async方法

```js
class Waiter{
	async wait(){
		return await Promise.resolve(1);
	}
}
new Waiter()
	.wait()
	.then(alert);
```

确保了方法的返回值为promise

### Error处理

如果一个 promise 正常 resolve，await promise 返回的就是其结果。

但是如果promise 被 reject，它将==**throw 这个 error，就像在这一行有一个 throw 语句那样**==。

```js
async function f(){
	await Promise.reject(new Error("Whoops!"));
  //和下面一样：
  throw new Error("Whoops!");
}
```

在真实开发中，promise可能需要一点时间后才reject，在这种情况下，在await抛出一个error之前会有一个延时。

与常规的throw一致，可以用**try…catch**来捕获此error。

```js
async function f(){
	try{
		let response = await fetch('http://no-such-url');
	} catch(err) {
		alert(err); //TypeError: failed to fetch
	}
}
f();
```

如果await中有error发生，执行控制权会马上移交给catch块。

也可以用try包装多行await代码。

如果没有try…catch，那么由异步函数f()的调用**生成的promise**将变为**rejected**。我们可以在**函数调用后面添加.catch**来处理这个error。

如果忘记添加.catch，那么可以使用全局事件处理程序unhandledrejection来捕获这类error。

#### async / await 和 promise.then/catch

当我们使用async/await时，几乎就不会用到.then了，因为await为我们处理了等待，

并且我们使用常规的try..catch而不是.catch，这通常更加方便。

但是在代码的顶层，也就是在所有async函数之外，我们就不能使用await了，所以这时候通常的做法是添加.then/catch 来处理最终的 **结果 或 被抛出的error**。

#### async/await 可以和 Promise.all 一起使用

当我们需要同时等待多个promise时，可以使用Promise.all将它们包装起来，然后使用await:

```js
let results = await Promise.all([
	fetch(url1),
	fetch(url2),
	...
]);
```

如果出现error，error也会正常传递，从失败了的promise传到Promise.all，然后变成我们可以通过使用try..catch在调用周围捕获到的异常(exception)。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108155610768.png" alt="image-20220108155610768" style="zoom:80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220108155623900.png" alt="image-20220108155623900" style="zoom:80%;" />

> throw的error才能被try..catch捕获


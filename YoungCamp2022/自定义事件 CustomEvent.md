## 插件化

- 将控制元素抽取成插件。
- 插件与组件之间通过 **依赖注入** 方式建立联系。

```js
class Slider{
  constructor(id, cycle = 3000){
    this.container = document.getElementById(id);
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected');
    this.cycle = cycle;
  }
  // 注册插件
  registerPlugins(...plugins){
    plugins.forEach(plugin => plugin(this));// 传入 slider 实例
  }
  getSelectedItem(){
    const selected = this.container.querySelector('.slider-list__item--selected');
    return selected
  }
  getSelectedItemIndex(){
    return Array.from(this.items).indexOf(this.getSelectedItem());
  }
  slideTo(idx){
    const selected = this.getSelectedItem();
    if(selected){ 
      selected.className = 'slider-list__item';
    }
    const item = this.items[idx];
    if(item){
      item.className = 'slider-list__item--selected';
    }

    const detail = {index: idx}
    // 创建并分发事件，在事件中传入 idx 信息
    const event = new CustomEvent('slide', {bubbles:true, detail})
    this.container.dispatchEvent(event)
  }
  slideNext(){
    const currentIdx = this.getSelectedItemIndex();
    const nextIdx = (currentIdx + 1) % this.items.length;
    this.slideTo(nextIdx);
  }
  slidePrevious(){
    const currentIdx = this.getSelectedItemIndex();
    const previousIdx = (this.items.length + currentIdx - 1) % this.items.length;
    this.slideTo(previousIdx);  
  }
  addEventListener(type, handler){
    this.container.addEventListener(type, handler)
  }
  start(){
    this.stop();
    this._timer = setInterval(()=>this.slideNext(), this.cycle);
  }
  stop(){
    clearInterval(this._timer);
  }
}


function pluginController(slider){
  const controller = slider.container.querySelector('.slide-list__control');
  if(controller){
    const buttons = controller.querySelectorAll('.slide-list__control-buttons, .slide-list__control-buttons--selected');
    controller.addEventListener('mouseover', evt=>{
      const idx = Array.from(buttons).indexOf(evt.target);
      if(idx >= 0){
        slider.slideTo(idx);
        slider.stop();
      }
    });

    controller.addEventListener('mouseout', evt=>{
      slider.start();
    });

    // 监听自定义事件 slide
    slider.addEventListener('slide', evt => {
      // 获取自定义事件中的 idx 信息
      const idx = evt.detail.index
      const selected = controller.querySelector('.slide-list__control-buttons--selected');
      if(selected) selected.className = 'slide-list__control-buttons';
      buttons[idx].className = 'slide-list__control-buttons--selected';
    });
  }  
}
// 上一张
function pluginPrevious(slider){
  const previous = slider.container.querySelector('.slide-list__previous');
  if(previous){
    previous.addEventListener('click', evt => {
      slider.stop();
      slider.slidePrevious();
      slider.start();
      evt.preventDefault();
    });
  }  
}
// 下一张
function pluginNext(slider){
  const next = slider.container.querySelector('.slide-list__next');
  if(next){
    next.addEventListener('click', evt => {
      slider.stop();
      slider.slideNext();
      slider.start();
      evt.preventDefault();
    });
  }  
}


const slider = new Slider('my-slider');
// 注册组件
slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();
```



## 模板化

- 将 HTML 模板化，更易于扩展

```js
class Slider{
  constructor(id, opts = {images:[], cycle: 3000}){
    this.container = document.getElementById(id);
    this.options = opts;
    this.container.innerHTML = this.render();
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected');
    this.cycle = opts.cycle || 3000;
    this.slideTo(0);
  }
  render(){
    const images = this.options.images;
    const content = images.map(image => `
      <li class="slider-list__item">
        <img src="${image}"/>
      </li>    
    `.trim());
    
    return `<ul>${content.join('')}</ul>`;
  }
  registerPlugins(...plugins){
    plugins.forEach(plugin => {
      const pluginContainer = document.createElement('div');
      pluginContainer.className = '.slider-list__plugin';
      pluginContainer.innerHTML = plugin.render(this.options.images);
      this.container.appendChild(pluginContainer);
      
      plugin.action(this);
    });
  }
  getSelectedItem(){
    const selected = this.container.querySelector('.slider-list__item--selected');
    return selected
  }
  getSelectedItemIndex(){
    return Array.from(this.items).indexOf(this.getSelectedItem());
  }
  slideTo(idx){
    const selected = this.getSelectedItem();
    if(selected){ 
      selected.className = 'slider-list__item';
    }
    let item = this.items[idx];
    if(item){
      item.className = 'slider-list__item--selected';
    }
    
    const detail = {index: idx}
    const event = new CustomEvent('slide', {bubbles:true, detail})
    this.container.dispatchEvent(event)
  }
  slideNext(){
    const currentIdx = this.getSelectedItemIndex();
    const nextIdx = (currentIdx + 1) % this.items.length;
    this.slideTo(nextIdx);
  }
  slidePrevious(){
    const currentIdx = this.getSelectedItemIndex();
    const previousIdx = (this.items.length + currentIdx - 1) % this.items.length;
    this.slideTo(previousIdx);  
  }
  addEventListener(type, handler){
    this.container.addEventListener(type, handler);
  }
  start(){
    this.stop();
    this._timer = setInterval(()=>this.slideNext(), this.cycle);
  }
  stop(){
    clearInterval(this._timer);
  }
}

const pluginController = {
  render(images){
    return `
      <div class="slide-list__control">
        ${images.map((image, i) => `
            <span class="slide-list__control-buttons${i===0?'--selected':''}"></span>
         `).join('')}
      </div>    
    `.trim();
  },
  action(slider){
    const controller = slider.container.querySelector('.slide-list__control');
    
    if(controller){
      const buttons = controller.querySelectorAll('.slide-list__control-buttons, .slide-list__control-buttons--selected');
      controller.addEventListener('mouseover', evt => {
        const idx = Array.from(buttons).indexOf(evt.target);
        if(idx >= 0){
          slider.slideTo(idx);
          slider.stop();
        }
      });

      controller.addEventListener('mouseout', evt => {
        slider.start();
      });

      slider.addEventListener('slide', evt => {
        const idx = evt.detail.index
        const selected = controller.querySelector('.slide-list__control-buttons--selected');
        if(selected) selected.className = 'slide-list__control-buttons';
        buttons[idx].className = 'slide-list__control-buttons--selected';
      });
    }    
  }
};

const pluginPrevious = {
  render(){
    return `<a class="slide-list__previous"></a>`;
  },
  action(slider){
    const previous = slider.container.querySelector('.slide-list__previous');
    if(previous){
      previous.addEventListener('click', evt => {
        slider.stop();
        slider.slidePrevious();
        slider.start();
        evt.preventDefault();
      });
    }  
  }
};

const pluginNext = {
  render(){
    return `<a class="slide-list__next"></a>`;
  },
  action(slider){
    const previous = slider.container.querySelector('.slide-list__next');
    if(previous){
      previous.addEventListener('click', evt => {
        slider.stop();
        slider.slideNext();
        slider.start();
        evt.preventDefault();
      });
    }  
  }
};

const slider = new Slider('my-slider', {images: ['https://p5.ssl.qhimg.com/t0119c74624763dd070.png',
     'https://p4.ssl.qhimg.com/t01adbe3351db853eb3.jpg',
     'https://p2.ssl.qhimg.com/t01645cd5ba0c3b60cb.jpg',
     'https://p4.ssl.qhimg.com/t01331ac159b58f5478.jpg'], cycle:3000});

slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();
```

## 组件框架

将组件的通用模型抽象出来

```js
class Component{
  constructor(id, opts = {name, data:[]}){
    this.container = document.getElementById(id);
    this.options = opts;
    this.container.innerHTML = this.render(opts.data);
  }
  registerPlugins(...plugins){
    plugins.forEach(plugin => {
      const pluginContainer = document.createElement('div');
      pluginContainer.className = `.${name}__plugin`;
      pluginContainer.innerHTML = plugin.render(this.options.data);
      this.container.appendChild(pluginContainer);
      
      plugin.action(this);
    });
  }
  render(data) {
    /* abstract */
    return ''
  }
}

class Slider extends Component{
  constructor(id, opts = {name: 'slider-list', data:[], cycle: 3000}){
    super(id, opts);
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected');
    this.cycle = opts.cycle || 3000;
    this.slideTo(0);
  }
  render(data){
    const content = data.map(image => `
      <li class="slider-list__item">
        <img src="${image}"/>
      </li>    
    `.trim());
    
    return `<ul>${content.join('')}</ul>`;
  }
	...
}
```



## 自定义事件 CustomEvent

`CustomEvent` 事件是由程序创建的，可以有任意自定义功能的事件。

DOM 4 添加了对 CustomEvent 构造函数的支持。

#### 构造函数

```js
CustomEvent(
  type:DOMString, 		// 事件名
  [eventInitDict:CustomEventInit]	// 可选的事件配置信息对象
)
```

#### CustomEventInit

- `bubbles:boolean` 事件是否冒泡
- `cancelable:boolean` 事件是否可取消
- `detail:any` 事件初始化时传入的数据，默认为 null

#### 属性

`CustomEvent.detail` 初始化时传入的数据。【只读】

#### 示例

```js
obj.addEventListener("cat", function(e){process(e.detail)})

// 创建并分发事件
var event = new CusomEvent("cat", {"detail":{"hazcheeseburger":true}})
obj.dispatchEvent(Event);
```



# 过程抽象

- 用来处理局部细节控制的一些方法
- 函数式编程思想的基础应用



### 高阶函数 HOF

- 以函数作为参数
- 以函数作为返回值
- 常用于作为函数装饰器

为了能够让“只执行一次”的需求覆盖不同的事件处理，可将这个需求剥离出来，这个过程即是**过程抽象**。

```js
function once(fn){
	return function(...args){
		if(fn){
			const ret = fn.apply(this, args)
			fn = null
			return ret
		}
	}
}
```

#### 常用高阶函数

- Once

- Throttle

  - ```js
    function throttle(fn, time = 500){
    	let timer
    	return function(...args){
    		if(timer == null){
    			fn.apply(this, args)
    			timer = setTimeout(() => {
    				timer = null
    			}, time)
    		}
    	}
    }
    ```

- Debounce

  - ```
    function debounce(fn, time = 500){
    	return function(...args){
    		let timer;
    		if(timer){
    			clearTimeout(timer);
    			timer = setTimeout(() => {
    				fn.apply(this, args)
    			}, time)
    		}
    	}
    }
    ```

- Consumer / 2

  - ```js
    function consumer(fn, time){
    	let tasks = [],
    			timer
    	return function(...args){
    		tasks.push(fn.bind(this, ...args));
    		if(timer == null){
    			timer = setInterval(() => {
    				tasks.shift().call(this)
    				if(tasks.length <= 0){
              clearInterval(timer);
              timer = null;
            } 
    			}, time)
    		}
    	}
    }
    ```

- Iterative

  - ```js
    const isIterable = obj => obj != null && typeof obj[Symbol.iterator] === 'function'
    
    function iterative(fn) {
      return function(subject, ...rest){
        if(isIterable(subject)){
          const ret = []
          for(let obj of subject){
            ret.push(fn.apply(this, [obj, ...rest]))
          }
          return ret
        }
        return fn.apply(this, [subject, ...rest])
      }
    }
    ```

    

### 编程范式

- 命令式
- 声明式

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20220725142126662.png" alt="image-20220725142126662" style="zoom:80%;" />


## 代码块

[修饰符]{

​	执行语句

}

修饰符只能为static。

修饰符不写为普通代码块，**每次创建对象实例都会加载**。

若为static则为静态代码块，随着==**类的加载**==而执行，**但只加载一次**。

### 类什么时候被加载

1. 创建对象实例时（new）
2. 创建子类对象实例，父类也会被加载。
3. 使用类的静态成员时（静态属性，静态方法）。

### 普通代码块

在每一次创建对象实例时，会被隐式的调用。

如果只是使用类的静态成员时，普通代码块不会被执行。

### 创建对象时，类的调用顺序

1. 静态代码块和静态属性初始化（按代码先后顺序）
2. 普通代码块和普通属性初始化
3. 构造方法。

### 构造器

public A() extends B{

​	//super(); //没有写会隐式调用无参的父类构造器。

​	//调用普通代码块

​	//调用 A 中的代码

}

**![image-20211215222013584](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211215222013584.png)**

![image-20211216200542410](C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211216200542410.png)

==**构造方法中有this()就不能有super()**==

## 多态

### 向上转型

**父类的引用指向了子类的对象。**

父类引用 引用名 = new 子类类型();

Animal animal = new Cat();

Object obj = new Cat();



**①向上转型的对象只能调用父类的方法，且遵循访问权限**

因为编译阶段能调用哪些成员是由编译类型决定的，编译器javac会检查编译类型。

- animal.eat();//ok
- animal.catchMouse();//no,该方法来自运行类型Cat

**②但最终运行效果要看子类的具体实现**

javac编译完后虚拟机java不会检查编译类型。

只会看对象具体的运行类型，并从运行类型中去找方法。



### 向下转型

向下转型只能强转父类的引用，不能强转父类的对象。

并且父类的引用指向当前目标类型的对象。

向下转型后可以调用子类类型中的所有成员。

子类类型 引用名 = （子类类型）父类引用；



### 属性没有重写一说

因此属性的值看==**编译类型**==。

属性不具有动态绑定机制，因此编译完成时便确定了。

### instanceof 操作符

判断对象的==**运行类型**==是否为比较类型或其子类型。

String str = “hello”;

str instanceof Object; //true

### 重写的方法不能缩小被重写的方法的作用域



## == 和 equals

### ==

- 基本数据类型：比较值。
  - 65 == ’A‘     12.0f == 12(int)
- 引用数据类型，比较地址。
- 如果引用数据的类型不同，编译器报错。

### equals

是Object类中的方法。

**只进行两个对象之间的比较。**

- Object：比较地址 return (a == b);
- String：逐个字符进行比较，比较值。
- Integer

特别注意null不可以调用.equals方法，会报空指针异常错。

NullPointException





## abstract

方法声明的范围不能为private / static / final



## implements

接口只可以是public 或是 abstract 的。

[public / abstract] interface XX{

}

如果不写默认为package范围。



接口中的所有方法都为public方法，接口中的抽象方法可以不用abstract修饰。

==**接口中的属性都为 public static final**==

**用final修饰的属性不允许被修改，且==必须初始化==**。



![img](https://images2015.cnblogs.com/blog/690292/201609/690292-20160923095944481-1758567758.png)

静态属性和静态方法可以被继承，但是不能被重写，如果方法名相同则隐藏父类的。

```java
public class Main {
    public static void main(String[] args) {
        B b = new B();
        b.staticMethod(); // B静态方法

        A a = b;
        a.staticMethod(); // A静态方法

        C c = new C();
        c.staticMethod(); // A静态方法

    }
}

class A { //父类
    public static void staticMethod() {
        System.out.println("A静态方法");
    }
}

class B extends A {
    public static void staticMethod() {
        System.out.println("B静态方法");
    }
}

class C extends A {
}
```

# 课件



## 类的特性

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131346117.png" alt="image-20211217131346117" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131439715.png" alt="image-20211217131439715" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131422255.png" alt="image-20211217131422255" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131403593.png" alt="image-20211217131403593" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131326630.png" alt="image-20211217131326630" style="zoom: 80%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131310124.png" alt="image-20211217131310124" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131301927.png" alt="image-20211217131301927" style="zoom:50%;" />



## 继承、抽象类和接口



<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131204344.png" alt="image-20211217131204344" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131058884.png" alt="image-20211217131058884" style="zoom: 50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131537793.png" alt="image-20211217131537793" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217131939106.png" alt="image-20211217131939106" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217132135691.png" alt="image-20211217132135691" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217132240009.png" alt="image-20211217132240009" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217132624388.png" alt="image-20211217132624388" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217133425932.png" alt="image-20211217133425932" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217133604037.png" alt="image-20211217133604037" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217133825351.png" alt="image-20211217133825351" style="zoom: 50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211217134202566.png" alt="image-20211217134202566" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218214126975.png" alt="image-20211218214126975" style="zoom: 50%;" />

不写public abstract 或只写 public 都是 public abstract

抽象类抽象到极致就是接口，抽象类可存在有方法体的方法，接口中的方法全部为抽象方法.

**可以使用static/default替换[abstract]**

接口的实现中，实现类可以继承**接口的抽象方法** 和 **默认方法**， **静态属性**，但不继承**静态方法**。

但是普通的继承关系中，子类可以访问父类的静态方法。

==**如果一个类同时继承和实现接口，且父类和接口中具有相同变量名的变量**==

在该类中使用这个变量时

- this.i /  i        ambiguous 报错
- super.i          访问父类的i
- InterfaceName.i 通过接口名访问接口的i（public static final）

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218224319517.png" alt="image-20211218224319517" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218225041492.png" alt="image-20211218225041492" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218225048150.png" alt="image-20211218225048150" style="zoom: 80%;" />

接口变量可以存放其实现类的对象。因为实现类必然实现了接口的所有方法。<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218230144416.png" alt="image-20211218230144416" style="zoom:50%;" />

==**除了静态成员。**==

**并且，会继承所有父接口中的属性，无论是否重名**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218231053696.png" alt="image-20211218231053696" style="zoom: 80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218231525609.png" alt="image-20211218231525609" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218231625362.png" alt="image-20211218231625362" style="zoom:50%;" /><img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218235230200.png" alt="image-20211218235230200" style="zoom:50%;" />

**按升序排列**

java.lang.Comparable\<T>接口

- 函数式接口：接口中只能有一个抽象方法。
- 需要实现 public int compare(T o)方法。
- 在lang包中，默认引用。

```java
public class A implements Comparable<A>{
	int data;
	double data2;
	@Override
	public int compare(A o){
		return this.getData() - o.getData();
		//return Double.compare(this.data2,o.data2);
	}
}

//使用
Arrays.sort(datas);
```

java.util.Comparator\<T> 接口

- 在util包中，需要引入。

```java
import java.util.Comparator;
public class DataComparator implements Comparator<Data>{
	@Override
  public int compare(Data d1 ,Data d2){
    return d1.getData() - d2.getData();
  }
}
//使用
DataComparator comp = new DataComparator();
Arrays.sort(datas , comp)
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218235158651.png" alt="image-20211218235158651" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218235747010.png" alt="image-20211218235747010" style="zoom:50%;" />

java.lang.Cloneable接口

- 标记型接口，没有抽象方法
- 需要重写父类的clone方法
- 重写方法需要catch CloneNotSupportedException 错误或 throws抛出
- 实现的是浅克隆
- 返回的是Object类型，需要向下转型

```java
public class Data implements Cloneable {//or throws CloneNotSupportedException{
	@Override
	public Object clone(){
    try{
			return super.clone();
    } catch( CloneNotSupportedException e){
      return null;
    }
	}
}

//使用
Data newData = (Data)oldData.clone();
```

**浅克隆**

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218235816359.png" alt="image-20211218235816359" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211218235905657.png" alt="image-20211218235905657" style="zoom:50%;" />

Java中提供的类中存在一些无法被clone的类，比如StringBuffer，它既没有实现Cloneable接口，也没有重写clone方法，那么它就无法执行克隆操作，那么遇到它该怎么办呢？

这里提供一种办法，既然是新对象，那么直接创建一个新的StringBuffer对象，将原来的值赋值进来，就等于是完成了克隆，虽然这种方式要比Object中的clone方法慢许多，但不失为一种补救措施。

还有一些类型如基本类型的装箱类型、String，它们虽然也是引用类型，但是它们是final修饰的，且没有实现Cloneable接口，没有重写clone方法，要克隆也需要采用上面所示的方式来实现。

String 的浅拷贝方式 

String str2 = new String(Str1);

String str2 = str1 + “”；

## 异常处理

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219002625390.png" alt="image-20211219002625390" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219002807542.png" alt="image-20211219002807542" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219002915195.png" alt="image-20211219002915195" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219002943109.png" alt="image-20211219002943109" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219003458869.png" alt="image-20211219003458869" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219003623029.png" alt="image-20211219003623029" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219003706535.png" alt="image-20211219003706535" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219003809289.png" alt="image-20211219003809289" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219004020305.png" alt="image-20211219004020305" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219004058423.png" alt="image-20211219004058423" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219004126686.png" alt="image-20211219004126686" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219004221567.png" alt="image-20211219004221567" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219004252434.png" alt="image-20211219004252434" style="zoom:50%;" />

自定义异常类

- ？需要单独一个class
- 一般是继承 **RuntimeException**，可以使用java的默认处理机制
- 如果继承 Exception，抛出异常的函数链都需要声明异常抛出
- 重写toString方法 / 或者在构造函数中调用super(String str) 前者优先级更高
  - 使用super(str)；<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219122547507.png" alt="image-20211219122547507" style="zoom: 80%;" />
  - 重写toString()方法：<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219122608674.png" alt="image-20211219122608674" style="zoom: 80%;" />

- 使用throw检测抛出

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219005346421.png" alt="image-20211219005346421" style="zoom:50%;" />

### 运行时异常

- NullPointException 空指针异常
- IndexOutBoundsException 数组越界异常
- ArithmeticException 算术异常
- ClassCastException 类型转换异常
- NumberFormatException 数字转换异常

### 编译时异常

编译期间就必须处理的异常，否则代码不能通过编译。

- SQLException   操作数据库查询表可能发生异常
- IOException   操作文件发生的异常
- FileNotFoundException 操作不存在文件异常
- ClassNotFoundException 加载类类不存在异常
- EOFException   文件末尾发生异常
- IllegalArguementException  参数异常

**父类 throws的异常类型 必须大于等于 子类 throws的异常类型**。

**如果A函数调用B函数**，

- B函数声明抛出一个运行时异常，A函数可以不处理，java有默认处理机制。
- B函数声明抛出一个编译异常，要求A函数显式处理异常。

## 泛型与容器类



<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219130850851.png" alt="image-20211219130850851" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219171908714.png" alt="image-20211219171908714" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219191302794.png" alt="image-20211219191302794" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219191457275.png" alt="image-20211219191457275" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219191636868.png" alt="image-20211219191636868" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219191821691.png" alt="image-20211219191821691" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219192044090.png" alt="image-20211219192044090" style="zoom:50%;" />

**方法形参列表使用 泛型类对象 时**，需要声明泛型类的准确类型，即Demo\<==**这里必须明确声明一种类型**==>。

这个方法不属于泛型方法。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219194219406.png" alt="image-20211219194219406" style="zoom:50%;" />

但是可以通过 **通配符 ？**，来适配多种类型的泛型类对象。

```java
public static void output(Demo<?> d){
	...
}
```

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219194632829.png" alt="image-20211219194632829" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219194704370.png" alt="image-20211219194704370" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219195012276.png" alt="image-20211219195012276" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219195049934.png" alt="image-20211219195049934" style="zoom: 50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219195212214.png" alt="image-20211219195212214" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219195336312.png" alt="image-20211219195336312" style="zoom:50%;" />

- **不能创建对象和数组**：因为分配内存空间要先确定创建的类型，才能知道该分配多少内存空间。
- 但是List\<T> l = new ArrayList<>();可以创建是因为，只有当向其中add时，才

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219200040848.png" alt="image-20211219200040848" style="zoom:80%;" />

- **不能用泛型定义异常类**：抛出一个T类型的对象oa作为异常，这是不允许的。因为在没指定上界的情况下，**T会被擦拭成Object类**，而**Object类显然不会是Throwable的子类**，因此它不符合异常的有关规定。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219200919779.png" alt="image-20211219200919779" style="zoom: 50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219201110504.png" alt="image-20211219201110504" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219201215014.png" alt="image-20211219201215014" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219201322713.png" alt="image-20211219201322713" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219201637795.png" alt="image-20211219201637795" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219202314639.png" alt="image-20211219202314639" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219202511369.png" alt="image-20211219202511369" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219202552021.png" alt="image-20211219202552021" style="zoom:50%;" />

## 内部类与Lambda表达式

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219202950031.png" alt="image-20211219202950031" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219203518812.png" alt="image-20211219203518812" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219204537090.png" alt="image-20211219204537090" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219204757418.png" alt="image-20211219204757418" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205259283.png" alt="image-20211219205259283" style="zoom:80%;" />

是使用外部类对象创建内部类对象。

静态类对象可以直接创建。

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205521701.png" alt="image-20211219205521701" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205419741.png" alt="image-20211219205419741" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205710741.png" alt="image-20211219205710741" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205826570.png" alt="image-20211219205826570" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219205904098.png" alt="image-20211219205904098" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219210025154.png" alt="image-20211219210025154" style="zoom:50%;" />



## 文件管理与输入输出

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219125107539.png" alt="image-20211219125107539" style="zoom: 80%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219125215573.png" alt="image-20211219125215573" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219125455691.png" alt="image-20211219125455691" style="zoom: 67%;" />

**扩大数组**

files = Arrays.\<File>copyOf(files , files.length * 2);

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219130254964.png" alt="image-20211219130254964" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219212454199.png" alt="image-20211219212454199" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219212833218.png" alt="image-20211219212833218" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213021589.png" alt="image-20211219213021589" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213052773.png" alt="image-20211219213052773" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213145891.png" alt="image-20211219213145891" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213252550.png" alt="image-20211219213252550" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213314888.png" alt="image-20211219213314888" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213510043.png" alt="image-20211219213510043" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219213843652.png" alt="image-20211219213843652" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219214000532.png" alt="image-20211219214000532" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219214125108.png" alt="image-20211219214125108" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219214737128.png" alt="image-20211219214737128" style="zoom:50%;" />

<img src="C:\Users\Zirina\AppData\Roaming\Typora\typora-user-images\image-20211219214845845.png" alt="image-20211219214845845" style="zoom:50%;" />


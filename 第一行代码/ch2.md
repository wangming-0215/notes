

# Kotlin 入门

> Kotlin 是 JetBrains 公司开发与设计的，2011 年发布了第一个版本，2012 年正式开源，2016 年发 1.0 版本，2017 google 宣布 Kotlin 正式成为 Android 一级开发语言。

## 变量和函数

### 变量

Kotlin 完全抛弃了 Java 中的基本数据类型，全部使用了对象数据类型，拥有自己的方法和继承结构。

Kotlin 中只允许两种关键字声明变量:

- `val`: “value"的简写，声明一个**不可变**的变量，初始赋值后不允许重新赋值，对应 java 中的 `final`关键字。

- `var`: "variable"的简写，声明一个**可变**的变量，初始赋值后仍然可以重新赋值。

  ```kotlin
  fun main() {
      val  a = 10 // 自动推导类型
      println(a)
  }
  
  fun main() {
      val a: Int = 10 // 显示声明类型
      println(a)
  }
  ```

 **NOTE:** Kotlin 每一行代码的结尾可以不用加分号。

#### Java 和 Kotlin 数据类型对照表

| Java 基本数据类型 | Kotlin 对象数据类型 | 数据类型说明 |
| ----------------- | ------------------- | ------------ |
| int               | Int                 | 整型         |
| long              | Long                | 长整型       |
| short             | Short               | 短整型       |
| float             | Float               | 单精度浮点型 |
| double            | Double              | 双精度浮点型 |
| boolean           | Boolean             | 布尔型       |
| char              | Char                | 字符型       |
| byte              | Byte                | 字节型       |

#### 何时使用`val`

永远优先使用 `val` 来声明一个变量，当`val`无法满足时再使用`var`。

### 函数

函数是用来运行代码的载体，可以在一个函数中编写很多行代码，当运行这个函数时，函数中的所有代码会全部运行。

```kotlin
fun methodName(param1: Int, param2: Int): Int {
    return 0
}
```

当一个函数中只有一行代码时，可以不写函数体，可以直接将唯一的一行代码写在函数定义的尾部，中间用等号连接即可。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int = max(num1, num2)
```

## 程序的逻辑控制

### 条件语句

#### if

```kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    var value = 0
    if (num1 > num2) {
        value = num1
    } else {
        value = num2
    }
    return value
}
```

Kotlin 中的`if`语句相比 Java 有一个额外的功能，它是可以有返回值的，返回值是`if`语句每一个条件中最后一行代码的返回值。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    val value = if (num1 > num2) {
        num1
    } else {
        num2
    }
    return value
}
```

进一步简化:

```kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    return if (num1 > num2) {
        num1
    } else {
        num2
    }
}
```

再进一步简化:

```kotlin
fun largerNumber(num1: Int, num2: Int): Int = if (num1 > num2) {
    num1
} else {
    num2
}
```

再再进一步简化:

```kotlin
fun largerNumber(num1: Int, num2: Int): Int = if (num1 > num2) num1 else num2
```

#### when

Kotlin 中的`when`语句有点类似与 Java 中的 `switch`语句，但是又远比 `switch` 语句更强大。

```kotlin
fun getScore(name: String) = if (name == "Tom") {
    86
} else if (name == "Jim") {
    77
} else if (name == "Jack") {
    95
} else if (name == "Lily") {
    100
} else {
    0
}
```

使用`when`语句：

```kotlin
fun getScore(name: String) = when (name) {
    "Tom" -> 86
    "Jim" -> 77
    "Jack" -> 95
    "Lily" -> 100
    else -> 0
}
```

`when`语句允许传入一个任意类型的参数，然后再`when`的结构体中定义一系列的条件，格式是：

```
匹配值 -> { 执行逻辑 }
```

当执行逻辑只有一行代码时，`{ }`可以省略。

除了精确匹配之外，`when`语句还允许进行类型匹配：

```kotlin
fun checkNumber(num: Number) {
    when (num) {
        is Int -> println("number is Int")
        is Double -> println("number is Double")
        else -> println("number is not support")
    }
}
```

`when`语句可以不带参数使用，不太常用，但是能发挥很强的扩展性：

```kotlin
fun getScore(name: String) = when {
    name == "Tom" -> 86
    name == "Jim" -> 77
    name == "Jack" -> 95
    name == "Lily" -> 100
    else -> 0
}
```

**NOTE: ** Kotlin 中判断字符串或对象是否相等可以直接使用`==`关键字，而不用像 Java 那样调用`equals()`方法。

### 循环语句

#### while

Kotlin 的`while`循环Java中的`while`没有任何区别

#### for

##### 区间

```kotlin
val range = 0..10 // 闭区间，[0, 10]
val range = 10 downTo 1 // 降序闭区间， [10, 1]
val range = 0 until 10 // 左闭右开区间，[0. 10)
```

##### for-in

`for-in`循环可以遍历区间、数组和集合。

```kotlin
fun main() {
    for (i in 0..10) { // 递增步长为 1
        println(i) // 0， 1， 2， 3， 4， 5， 6， 7， 8， 9， 10
    }
}

fun main() {
    for (i in 0 until 10 step 2) { // 递增步长为 2； step 关键字设置步长
        println(i) // 0， 2， 4， 6， 8
    }
}
```

## 面向对象编程

### 类与对象

Kotlin 中使用`class`关键字创建类。

**面向对象编程的最基本用法：先将事物封装成具体的类，然后将事物所拥有的属性和能力分别定义成类中的字段和函数，再对类进行实例化，最后根据具体的编程需求调用类中的字段和方法即可。**

```kotlin
class Person {
    var name = "" // 使用 var 关键字是因为需要在创建对象之后在重新赋值为更具体的值
    var age = 0
    
    fun eat() {
        println(name + " is eating. He is " + age + " years old.")
    }
}

fun main() {
	// 实例化
	val p = Person() // Kotlin 中实例化对象时不需要使用`new`关键字    
    p.name = "Jack"
    p.age = 19
    p.eat()
}

```

### 继承和构造函数

#####  继承

继承是基于现实场景总结出来的一个概念。

比如可以再`Student`类中加入`sno`和`grade`字段。但同时学生也是人，也会有姓名和年龄，也需要吃饭。如果在`Student`类中重复定义`name`、`age`字段和`eat()`函数的话就显得太过冗余。这个时候就可以让`Student`类去继承`Person`类，这样`Student`类就自动拥有了`Person`类中的字段和函数，同时也可以定义自己独有的字段和函数。

Kotlin 中任何一个*非抽象类*默认都是不可以被继承的，相当于 Java 中给类声明了 `final`关键字。要想类可以被继承，需要在类声明是加上`open`关键字，或者定义成抽象类。（抽象类不可被实例化）

*《Effective Java》一书中明确提到，如果一个类不是专门为继承而设计的，那么就应该主动将他将上 final 声明，禁止它可以被继承。*

语法：

```
class 字类 : 父类 {
	
}
```

示例：

```kotlin
open class Person {
    var name = ""
    var age = 0
    
    fun eat() {
        println(name + " is eating. He is " + age + " years old.")
    }
}

// Student 类继承 Person 类
class Student : Person() {
    var sno = ""
    var grade = 0
}
```

##### 构造函数

1. 主构造函数

   主构造函数是最常用的构造函数，每个类默认有一个不带参数的主构造函数。

   **主构造函数没有函数体，直接定义在类名的后面即可。**

   主构造函数中的逻辑需要写在`init`结构体中。

   **子类中的构造函数必须调用父类的构造函数。**

   在主构造函数中使用`val`或者`var`声明的变量，会自动成为该类的字段。

   ```kotlin
   // 主构造函数中的参数是在创建实例是传入的，不需要重新赋值，所以使用`val`声明变量
   // : Person() 表示子类的主构造函数调用父类中的哪个构造函数，括号不能省略
   class Student(val sno: String, val grade: Int): Person() {
       init() {
           println("sno is " + sno)
           println("grade is " + grade)
       }
   }
   
   val student = Student('a123', 5)
   ```

2. 次构造函数

   次构造函数使用`contructor`关键字定义。

   任何一个类只能有一个主构造函数，但是可以有多个次构造函数。

   次构造函数有函数体，可以用于实例化一个类。

   Kotlin 中规定，当一个既有主构造函数又有次构造函数时，所有的次构造函数**必须**调用主构造函数，包括间接调用。

   ```kotlin
   open class Person(val name: String, val age: Int) {
       fun eat() {
           println(name + " is eating. He is " + age + " years old.")
       }
   }
   
   class Student(val sno: String, val grade: Int, name: String, age: Int): Person(name, age) {
       // 次构造函数，通过 `this` 调用主构造函数
       constructor(name: String, age: Int): this("", 0, name, age) {}
       // 次构造函数，通过 `this` 调用第一个次构造函数，并将 name 和 age 参数也赋值成初始值，间接调用了主构造函数
       constructor() : this("", 0)
   }
   
   // 3 种方式创建 Student 对象
   val student1 = Student() // 第二个次构造函数
   val student2 = Student("Jack", 19) // 第一个次构造函数
   val student3 = Student("a123", 5, "Jack", 19) // 主构造函数
   ```

##### 特殊情况

类中只有次构造函数，没有主构造函数

```kotlin
// Student 类后面没有显示地定义主构造函数，同时又定义了次构造函数，所以Student类没有主构造函数。
// 没有主构造函数时，继承Person类的时候也就不需要在加上括号了。
// 没有主构造函数，次构造函数只能直接调用父类的构造函数，`this`关键字也换成了`super`关键字。
class Student: Person {
    constructor(name: String, age: Int): super(name, age) {
        
    }
}
```

### 接口

接口是用于实现多态编程的重要组成部分，Kotlin 可以实现任意多个接口。

接口中可以定义一系列的抽象行为，然后由具体的类去实现。

Kotlin 中继承/实现接口统一使用冒号，中间用逗号进行分隔。

Kotlin 中为了让接口的功能更加灵活，还增加了一个额外的功能：允许对接口中定义的函数进行默认实现。

```kotlin
interface Study {
    fun readBooks()
    fun doHomework() {
        // 接口中函数的默认行为
        println("do homework default implementation")
    }
}

// Student 实现 Study 接口
class Student(name: String, age: Int): Person(name, age), Study {
    // override 关键字来重写父类或者实现接口中的函数
    override fun readBooks() {
        println(name + " is reading.")
    }
    
    override fun doHomework() {
        println(name + ' is doing homework.')
    }
}

fun main() {
    val student = Student("Jack", 19)
    doStudy(student)
}

fun doStudy(study: Study) {
    study.readBooks()
    study.doHomework()
}
```

### 函数的可见性修饰符

1. `private`

   表示只对当前类内部可见

2. `public`

   表示对所有类都可见，在 Kotlin 中，`public`修饰符是默认项。

3. `protected`

   表示只对当前类和子类可见。

4. `internal`

   模块中的一些函数只允许在该模块内部调用，不想暴露给外部时，可以将这些函数声明成`internal`。

#### Java 和 Kotlin 函数可见性修饰符对照表

| 修饰符    | Java                               | Kotlin             |
| --------- | ---------------------------------- | ------------------ |
| public    | 所有类可见                         | 所有类可见（默认） |
| private   | 当前类可见                         | 当前类可见         |
| protected | 当前类、子类、同一包路径下的类可见 | 当前类、子类可见   |
| default   | 同一包路径下的类可见（默认）       | 无                 |
| internal  | 无                                 | 同一模块的类可见   |

### 数据类与单例类

在一个规范的系统架构中，数据类通常占据着非常重要的角色，它们用于将服务器端或数据库中的数据映射到内存中，为编程逻辑提供数据模型的支持。`MVC`，`MVP`，`MVVM`之类的架构模式，不管时哪一种架构模式，其中*M*指的就是数据类。

数据类通常需要重写`equals()`、`hashCode()`、`toString()`这几个方法。其中，`equals()`方法用于判断两个数据类是否相等。 `hashCode()`方法作为`equals()`的配套方法，也需要一起重写，否则会导致`HashMap`、`HashSet`等 hash 相关的系统类无法正常工作。`toString()`方法用于提供更清晰的输入日志，否则一个数据类默认打印出来的一行内存地址。

#### 数据类

用`data`关键字声明类时，表示这个类是一个数据类，Kotlin 会根据主构造函数中的参数将`equals()`，`hashCode()`，`toString()`等固定且无实际逻辑意义的方法自动生成，从而大大减少开发的工作量。

```kotlin
data class Cellphone(val brand: String, val price: Double)

fun main() {
    val cellphone1 = Cellphone("Samsung", 1299.99)
    val cellphone2 = Cellphone("Samsung", 1200.99)
}
```

#### 单例类

在 Kotlin 中创建一个*单例类*的方式及其简单，只需要将`class`关键字改成`object`关键字即可。

```kotlin
object Singleton {
    fun singletonTest() {
        println("singletonTest is called.")
    }
}

fun main() {
    Singleton.singletonTest()
}
```

## Lambda 编程

### 定义

Lambda 就是一小段可以作为参数传递的代码。

通常不建议在 Lambda 表达式中编写太长的代码，否则可能会影响代码的可读性。

```
{ 参数1 : 参数类型， 参数2 : 参数类型 -> 函数体 }
```

函数体中的最后一行代码会自动作为 Lambda 表达式的返回值。

### 集合的创建和遍历

#### List

```kotlin
// 第一种方式
val list = ArrayList<String>()
list.add("Apple")
list.add("Orange")
list.add("Banana")
list.add("Peach")

// 第二种方式
// listOf 创建的是一个不可变的集合，只能用于读取，无法修改，添加或删除
val list = listOf("Apple", "Orange", "Banana", "Peach")

// 可变集合
val list = mutableListOf("Apple", "Orange", "Banana", "Peach11")
list.add("Watermelen")

// for-in 遍历
for (fruit in list) {
    println(fruit)
}
```

#### Set 

`Set`集合中不可以存放重复元素，如果存放多个相同元素，只会保留一份。

```kotlin
// 不可变集合
val set = setOf("Apple", "Orange", "Banana", "Peach")

// 可变集合
val set = mutableSetOf("Apple", "Orange", "Banana", "Peach")

for (fruit in set) {
    print(fruit)
}
```

#### Map

`Map`是一种键值对形式的数据结构。

``` kotlin
// 第一种
val map = HashMap<String, Int>()
map.put("Apple", 1)
map.put("Orange", 2)
map.put("Banana", 3)
map.put("Peach", 4)

// Kotlin 中不推荐使用`put()`和`get()`方法对`Map`进行添加和读取操作
// 推荐一种类似数组下标的语法结构
map["Apple"] = 1
map["Orange"] = 2
map["Banana"] = 3
map["Peach"] = 4

// 第二种
val map = mapOf("Apple" to 1, "Orange" to 2, "Banana" to 3, "Peach" to 4)
val map = mutableMapOf("Apple" to 1, "Orange" to 2, "Banana" to 3, "Peach" to 4)

// 遍历
for((fruit, number) in map) {
    print("fruit is " + fruit + ", number is " + number)
}
```

### 集合的函数式API

#### maxBy

根据传入的条件找出最大值。

```kotlin
// 集合中最长的字符串
val list = listOf("Apple", "Banana", "Orange", "Peach", "Watermelon")
val lambda = { fruit: string -> fruit.length }
val maxLengthFruit = list.maxBy(lambda)

// 第一次简化
val maxLengthFruit = list.maxBy({ fruit: String -> fruit.length })

// 当 lambda 参数是函数的最后一个参数时，可以将 lambda 表达式移到函数括号外面
val maxLengthFruit = list.maxBy() { fruit: String -> fruit.length }

// 如果 lambda 参数是函数的唯一一个参数时，函数的括号可以省略
val maxLengthFruit = list.maxBy { fruit: String -> fruit.length }

// 由于 Kotlin 的类型推导机制， lambda 表达式中的参数大多数情况下不必声明参数类型
val maxLengthFruit = list.maxBy { fruit -> fruit.length }

// 当 lambda 表达式的参数列表中只有一个参数时，也不必声明参数名，而是可以使用`it`关键字代替
val maxLengthFruit = list.maxBy { it.length }

```

#### map

将集合中的每个值映射为另一个值。

```kotlin
// map 将集合中的每个值映射为另一个值
val list = listOf("Apple", "Banana", "Orange")
val newList = list.map { it.toUpperCase() }
```

#### filter

过滤集合中的数据。

```kotlin
val list = listOf("Apple", "Banana", "Orange", "Watermelon")
val newList = list.filter { it.length <= 5 }
```

#### any

判断集合中是否至少存在一个元素满足条件， 返回 `Boolean`。

```kotlin
val list = listOf("Apple", "Banana", "Orange", "Watermelon")
val result = list.any { it.lengthh <= 5 }
```

#### all

判断集合中是否所有元素都满足条件，返回`Boolean`。

```kotlin
val list = listOf("Apple", "Banana", "Orange", "Watermelon")
val result = list.all { it.length <= 5 }
```

### Java 函数式 API 的使用

在 Kotlin 代码中调用一个 Java 方法，该方法接收一个 Java 单抽象方法接口参数，就可以使用函数式 API 。

Java 单抽象方法接口指的是接口中只有一个待实现方法,如果接口中有多个待实现方法,则无法使用函数式 API 。

## 空指针检查

#### 可空类型系统

Kotlin 利用**编译时判空检查机制**，几乎加杜绝了空指针异常。

Kotlin 将控指针异常的检查提前到编译时期。如果程序存在空指针异常的风险，那么在编译的时候会直接报错，修正之后才能成功运行，这样就可以保证在运行时期不会出现空指针异常。

可空类型系统就是在类名后面加上一个**问号**。

```kotlin
// 允许 study 参数为空
fun doStudy(study: Study?) {}
```

#### 判空辅助工具

##### `?.`操作符

当对象不为空时正常调用相应的方法，当对象为空时则什么都不做。

```kotlin
if (a != null) {
    a.doSomething()
}

// 可以简化为
a?.doSomething()
```

##### `?:`操作符

`?:`操作符的左右两边都接受一个表达式，如果左边的表达式不为空就返回左边表达式的值，否则返回右边表达式的值。

```kotlin
val c = if (a != null) a else b

// 可以简化为
val c = a ?: b
```

`!!`非空断言工具

```kotlin
val upperCase = content!!.toUpperCase() // 这是一个危险的操作
```


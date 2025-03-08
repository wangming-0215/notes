# 高阶函数和 lambda 函数

## 高阶函数

### 概念

定义：**接收函数作为参数**或**返回函数**的函数。

价值：
- 增强代码复用性
- 支持声明式编程风格
- 抽象复杂操作逻辑

### 实战

#### 集合操作三剑客

```kotlin
// map 转换示例
val numbers = listOf(1, 2, 3)
val squares = numbers.map { it * it } // [1, 4, 9]

// filter 过滤示例
val adults = users.filter { it.age >= 18 }

// fold 累积示例
val total = list.fold(0) { acc, num -> acc + num }
```
#### 自定义高阶函数

```kotlin
// 带日志的高阶函数
fun <T> withLog(tag: String, block: () -> T): T {
  println("[$tag] 操作开始")
  val result = block()
  println("[$tag] 操作结束")
  return result
}

// 使用示例
val data = withLog("网络请求") {
  fetchDataFromNetwork()
}
```

### 函数类型

#### 系统类型图谱

```kotlin
// 基础类型
val func1: (Int, String) -> Boolean

// 带接收者类型
val func2: String.(Int) -> Char

// 可空类型
val func3: ((Int) -> Unit)?

// 嵌套类型
val func4: (Int) -> (String) -> Boolean
```

#### 类型别名实践

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun filterList(list: List<Int>, predicate: Predicate<Int>) {
  list.filter(predicate)
}

// 使用
filterList(numbers) { it > 5 }
```

## Lambda 表达式

### 语法

#### 结构

```kotlin
val lambda: (参数类型) -> 返回类型 = { 参数 -> 
  // 执行逻辑
  最后表达式 // 隐式返回
}
```

#### 简化规则表

| 场景           | 原始写法                      | 简化写法               |
| -------------- | ----------------------------- | ---------------------- |
| 单参数         | `{ x: Int -> x * 2 }`         | `{ it * 2 }`           |
| 尾随 Lambda    | `list.fold(0, { ... })`       | `list.fold(0) { ... }` |
| 参数类型可推断 | `{ x: Int, y: Int -> x + y }` | `{ x, y -> x + y}`     |

### 高级参数处理技巧

#### 多参数解构

```kotlin
map.forEach { (key, value) -> 
  println("Key: $key, Value: $value")
}
```

#### 下划线忽略参数

```kotlin
// 忽略 Map 的键
map.forEach { (_, value) -> process(value) }
```

### 作用域和控制流

#### 闭包

定义：能够**捕获并记住其所在上下文环境**的函数（或 Lambda），即使原始作用域已销毁，仍能访问和操作被捕获的变量。

关键特性
- 记忆上下文环境
- 突破作用域限制
- 可修改被捕获的变量（当变量为 `var` 时）

实现：Kotlin 的 Lambda 表达式和匿名函数**自动支持**闭包，无需特殊实现。

```kotlin
fun counterFactory(): () -> Int {
  var count = 0 // 被闭包捕获的变量
  return {
    count++
  }
}

// 使用示例
val counter = counterFactory()
println(counter()) // 0
println(counter()) // 1（保持对 count 的引用）
```

应用：

1. 状态保持

    ```kotlin
    fun createMultiplier(factor: Int): (Int) -> Int {
      // 捕获外部参数 factor
      return { value -> value * factor }
    }

    val triple = createMultiplier(3)
    println(triple(5)) // 15（即使 createMultiplier 已执行完毕）
    ```

2. 缓存优化
   
   ```kotlin
    fun heavyOperationCache(): (String) -> String {
      val cache = mutableMapOf<String, String>() // 被闭包捕获
      
      return { key -> 
        cache.getOrPut(key) {
          // 模拟耗时操作
          Thread.sleep(1000)
          key.uppercase()
        }
      }
    }

    val cachedOp = heavyOperationCache()
    println(cachedOp("hello")) // 首次计算（耗时）
    println(cachedOp("hello")) // 从缓存读取（立即返回）
   ```

#### 返回控制

```kotlin
fun processList(list: List<Int>) {
  list.forEach {
    if (it == 0) return // 直接退出外层函数
  }
  
  println("处理完成")
}

// 安全返回方案
list.forEach label@{
  if (it == 0) return@label
}
```

## 函数类型高级应用

### 带接收者的函数类型

#### 概念

```kotlin
// 定义 DSL 构建器
class HTML {
  fun body(block: Body.() -> Unit) { ... }
}

// 使用示例
html {
  body { // 这里接收者是 Body 实例
    div { ... }
  }
}
```

#### 与扩展函数的关系

```kotlin
// 这两种写法等效
val func1: String.(Int) -> String
val func2: (String, Int) -> String
```

### 函数示例化方式

#### 三大创建途径

1. Lambda 表达式
   
   `val sum = { a: Int, b: Int -> a + b }`

2. 函数引用
   
   `val predicate = String::isNotEmpty`

3. 接口实现
   
   ```kotlin
    class MyFunction : (Int) -> Int {
      override fun invoke(x: Int) = x * 2
    }
   ```

## 避坑指南与性能优化

### 常见性能

#### 空安全处理

```kotlin
val func: ((Int) -> String)? = null

// 错误调用方式
// func(32) // 编译错误

// 正确方式
func?.invoke(32)
```

#### 意外返回

```kotlin
fun findFirstEven() {
  listOf(1, 2, 3).forEach {
    if (it % 2 == 0) {
      println("找到偶数")
      return // 直接退出函数！
    }
  }
  println("未找到")
}
```

### 性能优化

#### 序列（Sequence）应用

```kotlin
// 处理大数据集时
val bigData = (1...1_000_000).toList()

// 低效方式（生成中间集合）
bigData
  .filter { it % 2 == 0 } // 生成50万元素
  .map { it * 2 }         // 再生成50万元素
  .take(10)               // 取前10个

// 高效方式（使用序列）
bigData.asSequence()
  .filter { it % 2 == 0 } // 延迟处理
  .map { it * 2 }         // 延迟处理
  .take(10)               // 提前终止
  .toList()
```

#### inline 函数优化

```kotlin
inline fun measureTime(block: () -> Unit) {
  val start = System.currentTimeMillis()
  block()
  println("耗时：${System.currentTimeMillis() - start}ms")
}

// 使用后不会生成额外对象
measureTime { heavyOperation() }
```

## 综合实战

### 构建验证框架

```kotlin
typealias Validator<T> = (T) -> Boolean

fun <T> combineValidators(vararg validators: Validator<T>): Validator<T> {
  return { value -> 
    validators.all { it(value) }
  }
}

// 创建验证器
val isPositive: Validator<Int> = { it > 0 }
val isEven: Validator<Int> = { it % 2 == 0}

// 组合验证
val complexValidator = combineValidators(isPositive, isEven)
println(complexValidator(4)) // true
println(complexValidator(-2)) // false
```
### 实现重试机制

```kotlin
inline fun <T> retry(
  times: Int = 3,
  initialDelay: Long = 1000,
  crossinline block: () -> T
): T {
  var currentDelay = initialDelay
  repeat(times - 1) {
    try {
      return block()
    } catch (e: Exception) {
      Thread.sleep(currentDelay)
      currentDelay *= 2
    }
  }
  return block()
}

// 使用示例
val result = retry {
  callUnstableAPI()
}
```

## 常见问题解答

### Lambda 与匿名函数的主要区别

- 返回行为：Lambda 的 `return` 返回外层函数，匿名函数返回自身
- 类型声明：匿名函数可显式声明返回类型
- 代码结构：匿名函数支持多行复杂逻辑

### 何时使用带接收者的函数类型

- DSL 构建场景（如 HTML/布局构建）
- 需要扩展对象功能的场景
- 改善 API 可读性（类似扩展函数）

### 为什么需要类型别名

- 简化复杂类型声明
- 提高代码可读性
- 方便统一修改类型定义

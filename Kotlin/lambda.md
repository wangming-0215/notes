# 高阶函数和 lambda 函数

Kotlin 中函数是*一等公民*， 可以作为参数传递给其他函数以及作为其他函数的返回值。

## 高阶函数

高阶函数是将函数作为**参数**或**返回值**的函数

```kotlin
fun <T, R> Collection<T>.fold(
  initial: R,
  combine: (acc: R, nextElement: T) -> R
): R {
  var accumulator: R = initial
  for (element: T in this) {
    accumulator = combine(accumulator, element)
  }

  return accumulator
}

val items = arrayOf(1, 2, 3, 4, 5)

// Lambdas 表达式是花括号括起来的代码块
items.fold(0, {
  // 如果一个 lambda 表达式有参数，前面是参数，后面跟 `->`
  acc: Int, i: Int ->
  print("acc = $acc, i = $i, ")
  val result = acc + i
  println("result = $result")
  // lambda 表达是中最后一个表达式是返回值
  result
})

// 在编译器能够推断的情况下， lambda 表达式的参数类型是可选的
val joinedToString = items.fold("Elements: ", { acc, i -> acc + " " + i })

// 函数引用也可用于高阶函数调用
val product = items.fold(1, Int::times)
```

## 函数类型

使用类似 `(Int) -> String` 的一系列函数类型来处理函数声明。

- 所有函数类型都有一个圆括号括起来的参数类型以及一个返回类型: `(A, B) -> C`
- 函数类型可以有一个额外的接收者类型，它在表示法中的点之前指定： 类型 `A.(B) -> C` 表示可以在 A 的接收者对象上以一个 B 类型参数来调用并返回一个 C 类型值的函数
- 挂起函数属于特殊种类的函数类型，它的表示法中有一个 `suspend` 修饰符 ，例如 `suspend () -> Unit` 或者 `suspend A.(B) -> C`。

类型别名

```kt
typealias ClickHandler = (Button, ClickEvent) -> Unit
```
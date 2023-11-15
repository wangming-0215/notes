# 异步编程

## 为什么异步很重要

异步操作可以让程序在等待另一个操作的同时继续执行，而不是阻塞。在前端阻塞就意味着，前端页面无法响应任何操作，这对用户来说无疑是很糟糕的体验。

常见的异步操作：

- 从服务器获取数据
- 写数据库
- 读取文件
- 等等

这种异步计算通常以`Future`的形式提供结果，如果结果有多个部分，则以`Stream`的形式提供。

## 什么是`future`

`future`是[Future](https://api.dart.dev/stable/dart-async/Future-class.html)类的一个实例对象。

`future`表示异步操作的结果，它有两个状态：

- `uncompleted`：调用异步函数时，异步函数返回`uncompleted`状态的`future`，并等待异步操作完成或者抛出异常；
- `completed`：如果异步操作完成，`future`将填充一个值，否则，将填充一个`error`。
  - 填充值：一个类型为`Future<T>`的`future`，将会完成并返回类型为`T`的值。如果一个`future`不能产生可用的值，那么该`future`的类型为`Future<void>`。
  - 填充异常：如果函数执行的异步操作因任何原因失败，那么该`future`将以错误的形式完成。

### Example：`future`

```dart
Future<void> fetchUserOrder() {
  return Future.delayed(const Duration(seconds: 2), () => print('Large Latte'));
}

void main() {
  fetchUserOrder();
  print('Fetching user order...')
}

// output
// Fetching user order...
// 2 seconds later
// Large Latte
```

### Example: 填充异常

```dart
Future<void> fetchUserOrder() {
	return Future.delayed(const Duration(seconds: 2), () => throw Exception('Logout failed: user ID is invalid'));
}

void main() {
  fetchUserOrder();
  print('Fetching user order...')
}

// output
// Fetching user order...
// 2 seconds later
// Uncaught Error: Exception: Logout failed: user ID is invalid
```

## `async`和`await`

`async`和`await`关键字提供了一种声明式的方式来定义异步函数并使用它们的结果。有两个基本准则：

- 在函数体前添加`async`关键字定义异步函数；
- `await`关键字只能在`async`定义的异步函数中使用。

```dart
Future<void> printOrderMessage() {
  print('Awaiting user order...');
  var order = await fetchUserOrder();
  print('Your order is: $order');
}

Future<String> fetchUserOrder() {
  return Future.delayed(const Duration(seconds: 4), () => 'Large Latte');
}

void countSeconds(int seconds) {
  for (var i = 1; i <= seconds; i++) {
    Future.delayed(Duration(seconds: i), () => print(i));
  }
}

void main() async {
  countSeconds(4);
  await printOrderMessage();
}

// output
// Awaiting user order...
// a second later
// 1
// a second later
// 2
// a second later
// 3
// a second later
// 4
// immediately
// Your order is: Large Latte
```

## 异常处理

使用`try-catch`处理异常。

```dart
try {
  print('Awaiting user order...');
  var order = await fetchUserOrder();
} catch(err) {
  print('Caught error: $err');
}
```


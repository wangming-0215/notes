# 可迭代集合

## 集合

集合是表示**一组对象**的对象，这些对象称为**元素**。`Iterables` 是一种集合。

视用途而定，集合有不同的结构和实现方式，一般有三种类型：

- `List`：通过索引读取元素；
- `Set`：包含只能出现一次的元素；
- `Map`：通过键读取元素。

## Iterable: 可迭代对象

`Iterable`是可以顺序访问的元素的集合。

在`dart`中`Iterable`是一个抽象类，无法直接实例化它，可以通过创建`List`或`Set`来创建`Iterable`，它们具有与`Iterable`类相同的方法和属性。

`Map`在内部使用不同的数据结构，这取决于`Map`的具体实现，比如`HashMap`使用哈希表，其中的元素也是通过*键*获取的。使用`Map`的`entries`或`values`属性，可以把`Map`当作`Iterable`对象读取。

与`List`不同的是，`Iterable`不能保证按索引读取元素是有效的，`Iterable`是没有`[]`运算符的。可以通过`elementAt()`方法读取`Iterable`中的元素。

```dart
Iterable<int> iterable = [1, 2, 3];
int value = iterable.elementAt(1);
```

## 读取元素

使用`for-in`循环顺序读取可迭代对象中的元素

**Note：** `for-in`循环在底层是使用了迭代器（Iterator)，但是很少有直接使用`Iterator API`的，因为`for-in`更易于理解和阅读，不容易出错。

### Example: 使用`for-in`循环

```dart
void main() {
  const iterable = [1, 2, 3];
  for (final element in iterable) {
    print(element);
  }
}
```

### Example: 获取第一个/最后一个元素

- `first`：获取第一个元素；
- `last`： 获取最后一个元素。

获取`Iterable`的最后一个元素，需要遍历所有其他元素，所以`last`的效率可能会很慢。

在空的`Iterable`对象上使用`first`或`last`会报[StateError](https://api.dart.dev/stable/2.19.2/dart-core/StateError-class.html)错误。

```dart
void main() {
  Iterable<int> iterable = const [1, 2, 3];
  print('The first element is ${iterable.first}');
  print('The last element is ${iterable.last}');
}
```

### Example：使用`firstWhere()`

`firstWhere()`：找到满足某个特定条件的第一个元素。

使用可选的命名参数 `orElse` 调用 `firstWhere()`，它在找不到元素时提供替代方案。

```dart
bool predicate(item) {
  return item > 2;
}

void main() {
  Iterable<int> items = const [1, 2, 3, 4, 5];
  int foundItem1 = items.firstWhere((item) => item > 2);
  int foundItem2 = items.firstWhere(() {
    return item > 2;
  });
  int foundItem3 = item.firstWhere(predicate);
  int foundItem4 = items.firstWhere(
  	(item) => item > 5,
    orElse: () => -1
  );
}
```

## 条件检查

在使用`Iterable`对象时，可能需要验证集合中的所有元素是否满足某些条件。

```dart
// bad
for(final item in items) {
  if (item.length < 5) {
    return false;
  }
}
return true;

// good
return items.every((item) => item.length < 5);
```

### Example：使用`any()`和`every()`

- `any()`：如果至少一个元素满足条件，则返回`true`；
- `every()`：如果所有元素满足条件，则返回`true`。

```dart
void main() {
  Iterable<String> items = ['Salad', 'Popcorn', 'Toast'];
  if (items.any((item) => item.contains('a'))) {
    print('At least one item contains "a"');
  }
  
  if (items.every((item) => item.length >= 5)) {
    print('All items have length >= 5');
  }
  
  if (items.any((item) => item.contains('Z'))) {
    print('At least one item contains "Z"');
  } else {
    print('No item contains "Z"');
  }
}
```

## Filtering

`where()`：查找`Iterable`对象中所有满足条件的元素，返回另一个`Iterable`对象。

```dart
void main() {
  var evenNumbers = const [1, -2, 3, 42].where((number) => number.isEven);
  
  for (final number in evenNumbers) {
    print('$number is even');
  }
  
  if (evenNumbers.any((number) => number.isNegative)) {
    print('evenNumbers contains negative numbers.');
  }
  
  var largeNumbers = evenNumbers.where((number) => number > 1000);
  if (largeNumbers.isEmpty) {
    print('largeNumbers is empty!');
  }
}
```

### Example: `takeWhile()`和`skipWhere()`

- `takeWhile()`：从索引0开始，查询满足条件的元素，直到出现第一个不满足条件的元素，停止迭代，并返回前面满足条件的元素。（`takeWhile()` returns an `Iterable` that contains all the elements before the one that satisfies the predicate.）
- `skipWhile()`：从索引0开始，跳过所有满足条件的元素，直到出现第一个不满足条件的元素，返回包含第一个不满足条件的元素及该元素之后的所有元素。（`skipWhile()` returns an `Iterable` that contains all elements after and including the first one that *doesn’t* satisfy the predicate.）

```dart
void main() {
  const numbers = [1, 3, -2, 0, 4, 5];
  var numbersUntilZero = numbers.takeWhile(x => x != 0);
  print('Numbers until 0: $numbersUntilZero');
  var numbersStartingAtZero = numbers.skipWhile(x => x != 0);
  print('Numbers starting at 0: $numbersStartingAtZero');
}

// output
// Numbers util 0: (1, 3, -2)
// Numbers starting at 0: (0, 4, 5)
```

## Mapping

`map()`：对`Iterable`对象中的每个元素应用一个函数，用一个新元素替换每个元素。

```dart
Iterable<int> output = numbers.map((number) => number * 10);
```

### Example：使用`map()`改变元素

```dart
void main() {
  var numberByTwo = const [1, -2, 3, 42].map((x) => x * 2);
  print('Numbers by two: $numberByTwo}');
}

// output
// Numbers by two: (2, -4, 6, 84)
```

### Example: 映射到不同类型

```dart
class User {
  String name;
  int age;
  
  User(this.name, this.age);
}

Iterable<String> getNameAndAges(Iterable<User> users) {
  return users.map((user) => '${user.name} is ${user.age}');
}
```


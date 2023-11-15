# 空值安全（Null Safety）

> Dart 2.12中引入了空安全类型系统(null-safe type system)。

## 可空类型和不可空类型

使用**空安全**时，所有类型默认都是不可空类型。

在类型名后面添加`?`表示，该类型可以为空。

```dart
String name = '汪小明'; // name 不可为空，即 name 不能赋值为 null
String? name = null; // name 可为空
```

## 空断言运算符（Null assertion operator）

如果确定一个可空类型的表达式不为空，可以使用空断言运算符（`!`），让 dart 将其视为不可空。

```dart
List<int?> listThatCouldHoldNull = [2, null, 4];
int b = listThatCouldHoldNull.first!;

int? couldReturnNullButDoesnt = () => -3;
int c = couldReturnNullButDoesnt()!.abs();
```

## 空感知运算符（Null-aware operator)

如果变量或表达式是可空类型，则可以使用[类型提升](https://dart.dev/null-safety/understanding-null-safety#type-promotion-on-null-checks)来访问类型的成员，也可以使用==空感知运算符==。

要处理可能为空的值，可以使用*条件属性访问运算符*（`?.`）来有条件地访问属性，或者*空值合并运算符*（??）在`null`时提供默认值。

### Example: Conditional property access

在不确定表达式是否为`null`时，可以使用条件属性访问运算符来有条件地执行表达式的其余部分。

```dart
// 当 nullableObject 的值不为 null 时，才执行 action 函数
nullableObject?.action();
```

### Example: Exercise: Null-coalescing operators

如果想要在表达式计算结果为`null`时提供替代值（默认值），可以使用空值合并运算符。

```dart
// 当 nullableString 的值为 null 时，打印替代值 alternate
print(nullableString ?? 'alternate');
// 等价于
print(nullableString != null ? nullableString : 'alternate');

// 当 nullableString 的值为 null 时，nullableString 被赋值为 alternate
nullableString ??= 'alternate';
// 等价于
nullableString = nullableString != null ? nullableString : 'alternate';

```

### 类型提升（Type promotion）

如果您检查具有可空类型的局部变量以查看它是否不为空，Dart 将该变量提升为基础不可空类型：

```dart
String makeCommand(String executable, [List<String>? arguments]) {
  var result = executable;
  if (arguments != null) {
    result += ' ' + arguments.join(' ');
  }
  return result;
}
```

## `late` 

有时候变量（类中的字段或者顶级变量）应该时不可空类型的，但是又无法立即为它赋值，可以使用`late`关键字，延迟赋值。

当把`late`放在变量声明前面时，实际上实在告诉 dart:

- 先不要给这个变量赋值（dart中所有变量的默认值都是`null`）；
- 稍后再给这个变量赋值；
- 在使用这个变量之前，要确保它已经被赋值。

如果使用`late`声明变量，并在变量被赋值之前访问变量，程序将抛出异常。

```dart
class Meal {
  late String _description;
  
  set description(String desc) {
    _description = desc;
  }
  
 	String get description => _description;
}

void main() {
  final myMeal = Meal();
  myMeal.description = 'Feijoada!';
  print(myMeal.description);
}
```

`late`对于*循环引用*等棘手的模式很有帮助。

```dart
class Team {
  late final Coach coach;
}

class Coach {
  late final Team team;
}

void main() {
  final myTeam = Team();
  final myCoach = Coach();
  myTeam.coach = myCoach;
  myCoach.team = myTeam;
  print('All done');
}
```

`late` 对于复杂的不可空类型字段的[延迟初始化](https://dart.dev/null-safety/understanding-null-safety#lazy-initialization)也很有帮助。

在有初始化设定项（一般为函数）的字段上使用`late`时，初始化变为**惰性**。它不是在构造实例后立即运行它，而是延迟到该字段第一次被访问时运行。

```dart
class Weather {
  late int _temperature = _readThermometer();
}
```


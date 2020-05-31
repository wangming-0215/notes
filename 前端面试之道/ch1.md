# JS 基础知识点及常考面试题（一）

## 原始类型

- boolean
- null
- undefined
- number
- string
- symbol

## 对象类型

与原始类型不同的是，原始类型存储的是值，对象类型存储的是地址（指针）。当创建一个对象类型的时候，计算机会在内存中开辟一个空间来存放值，这个空间的地址赋值给变量。

## typeof vs instanceof

`typeof`对于原始类型来说，除了`null`都可以显示正确的类型。

`typeof`对于对象来说，除了函数都会显示`object`。

如果想判断一个对象的正确类型，可以考虑使用`instanceof`，其内部机制是通过原型链来判断的。

```js
const Person = function() {};
const p1 = new Person();
p1 instanceof Person; // true

const str = 'hello world';
str instanceof String; // false
```

## 类型转换

在 JS 中类型转换只有三种情况：

- 转换为布尔值
- 转换为数字
- 转换为字符串

### 转 Boolean

在条件判断是，除了`undefined`，`null`，`false`，`NaN`， `''`， `0`， `-0`，其他所有值都转为`true`，包括对象。

### 对象转原始类型

对象在类型转换的时候，会调用内置的`[[ToPrimitive]]`函数，算法逻辑如下：

- 如果已经是原始类型了，就不需要转换了
- 如果需要转换成字符串类型就调用`x.toString()`，转换为基础类型的话就返回转换的值。不是字符串类型的话就先调用`valueOf`，结果不是基础累次那个的话再调用`toString`。
- 调用`x.valueOf()`，如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错。

### 四则运算

加法运算符不同于其他几个运算符，有以下几个特点：

- 运算中其中一方为字符串，那么会把另一方也转换成字符串
- 如果一方不是字符串或者数字，那么会将它转换成数字或者字符串

### 比较运算符

- 如果是对象，就通过`toPrimitive`转换对象
- 如果是字符串，就通过`unicode`字符串索引来比较

## this

函数在执行过程中的调用位置决定`this`的绑定对象。

### 默认绑定 —— 独立函数调用

该规则下的`this`指向全局对象。

```js
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

在代码中，`foo()`直接使用不带任何修饰的函数应用进行调用，因此只能使用默认绑定，无法应用其他规则。

### 隐式绑定

调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含。

当函数应用有上下文对象时，隐式绑定规则会把函数调用中的`this`绑定到这个上下文对象。

对象属性引用链中只有上一层或者说最后一层在调用位置中起作用

```js
function foo() {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo
};

var obj1 = {
  a: 2,
  obj2: obj2
};

obj1.obj2.foo(); // 42
```

#### 隐式丢失

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

var bar = obj.foo;
var a = 'oops, global';
bar(); // 'oops, global'
```

虽然 `bar`是`obj.foo`的一个引用，但实际上，它引用的是`foo`函数本身，所以此时`bar()`其实是一个不带任何修饰的函数调用，因此引用了默认绑定。

更微妙，更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a: 2,
  foo: foo
};

var a = 'global';
doFoo(obj.foo); // global
```

参数传递其实就是一种隐式传值，因此传入函数时也会被隐式赋值。

### 显示绑定

使用函数的`call()`和`apply()`方法来显示绑定`this`。

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
};

foo.call(obj); // 2
```

通过`foo.call()`，可以在调用`foo`时强制把它的`this`绑定到`obj`上。

`Function.prototype.bind()`方法会返回一个硬编码的新函数，它会把指定的参数设置为`this`的上下文对象并调用原始函数。

### new 绑定

在 JavaScript 中，构造函数只是使用`new`操作符调用的普通函数。

使用`new`调用函数，会自动执行下面的操作：

- 创建一个全新的对象
- 这个新对象会被至此那个`[[Prototype]]`连接
- 这个新对象会绑定到函数调用的`this`
- 如果函数没有返回其他对象，那么`new`表达式中的函数调用会自动返回这个新对象

```js
function foo(a) {
  this.a = a;
}

var bar = new foo(2);
console.log(bar.a); // 2
```

### 判断 this

1. 函数是否在`new`中调用(new 绑定)？如果是的话 this 绑定的是新创建的对象。
2. 函数是否通过 call、apply（显示绑定）或者硬绑定调用？如果是，this 绑定的是指定的对象。
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。
4. 如果都不是的话，使用默认绑定。

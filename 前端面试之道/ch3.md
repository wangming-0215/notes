# ES6 知识点及常考面试题

## 变量提升

通过`var`声明的变量和函数会在任何代码被执行前首先被处理

如 `var a = 2`, JavaScript 会将其看成两个声明；`var a;`和`a = 2;`。第一个定义声明是在编译阶段进行的。第二个赋值声明会被*留在原地*等待执行阶段。

NOTE：**只有声明本省会被提升，而赋值或其他逻辑会留在原地。**

NOTE：**函数声明和变量声明都会被提升，但是函数会被首先提升，然后才是变量**

## let vs const

`let`和`const`关键字可以将变量绑定到所在的任意作用域中。换句话说就是为其声明的变量隐式地劫持了所在的作用域。

`let`和`const`声明的变量不会被提升，无法在声明前访问，无法重复声明，不会绑定的`window`对象上。

`let`和`const`声明的变量附属一个新的作用域而不是当前的作用域。

## 原型继承和 class 继承

### 组合继承

```js
function Parent(value) {
  this.val = value;
}

Parent.prototype.getValue = function() {
  return this.val;
};

function Child(value) {
  Parent.call(this, value);
}

Child.prototype = new Parent();

const child = new Child(1);

child.getValue(); // 1

child instanceof Parent; // true
```

组合继承的核心是在子类的构造函数中通过`Parent.call(this)`继承父类的属性，然后改变子类的原型为`new Parent()`;

优点：

- 构造函数可以传参，不会与父类引用属性共享
- 复用父类的函数

缺点：

- 继承父类函数时调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

### 寄生组合继承

```js
function Parent(value) {
  this.val = value;
}

Parent.prototype.getValue = function() {
  return this.val;
};

function Child(value) {
  Parent.call(this, value);
}

Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

const child = new Child(1);

child.getValue(); // 1
child instanceof Parent; // true
```

## 模块化

好处：

- 解决命名冲突。
- 提高复用性。
- 提高代码可维护性。

### 立即执行函数

在早期，使用立即执行函数实现模块化时常见手段，通过函数作用域解决命名冲突、污染全局作用域问题

## AMD vs CMD

```js
// AMD
define(['./a', './b'], function(a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a');
  a.doSomething();
});
```

### commonjs

### ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

- CommonJS 支持动态导入，也就是 require(\${path}/xx.js)，后者目前不支持，但是已有提案
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化

ES6 的模块没有“行内”格式，必须被定义在独立的文件中，一个文件即一个模块。

# 动画的 JavaScript 基础

## 动画基础

- 动画由帧组成，每一帧在表现运动的假象上有细微差别；
- 逐帧动画包含每一帧的图像或图像描述；
- 动态动画包含一幅图片的起始描述以及后续每一帧图像的变化规则。

## HTML5 简介

## 用代码实现动画

### 动画循环

几乎所有的程序动画动画都会表现为某种形式的**循环**。

**循环**的含义：

- 设置初始状态：比如，用`canvas`内置的绘图 API 像屏幕上绘制一个圆形，渲染并显示着一帧；
- 应用规则：比如，球向右移动 5 个像素；
- 应用规则后会变迁到新的状态，此时会根据一个新的图像描述渲染并显示；
- 同样的规则会重复应用。

为了实现动画，需要为每一帧执行以下操作：

- 执行该帧所要调用的代码；
- 将所有对象绘制到 `canvas` 上；
- 重复这一过程渲染下一帧。

创建一个函数用于不断更新对象的位置并将它绘制到 `canvas` 元素上。然后创建一个定时器启动循环：

```js
function drawFrame() {
  ball.x += 1;
  ball.draw(context);
}
window.setInterval(drawFrame, 1000 / 60);
```

### 使用 `requestAnimationFrame` 的动画循环

`window.requestAnimationFrame` 函数接收一个回调函数作为参数，并确保在重绘屏幕前执行该回调函数。在回调函数中对程序的修改必定发生在下一个浏览器重绘事件之前。

```js
(function drawFrame() {
  window.requestAnimationFrame(drawFrame, canvas);

  // animation code...
  // 每一帧将要执行的动画代码
})();
```

当执行 `drawFrame` 函数时，`window.requestAnimationFrame` 将 `drawFrame` 函数放入队列等待，在下一个动画间隔中再次执行。而当它再次执行时又会重复这一过程。

浏览器兼容(polyfill):

```js
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 69);
    };
}
```

## 用户交互

用户交互式基于事件的，这些事件通常是鼠标事件、触摸事件以及键盘事件。

### 事件与事件处理程序

- 监听器决定一个元素是否应该响应某个事件；
- 事件处理程序是当事件发生时将要调用的函数。

`canvas`元素上的形状自身并不具备检测事件的功能。但是可以通过 `DOM` 接口捕获用户输入，嫌贵与绘制的对象计算出事件发生后的位置，然后根据这一信息作出进一步的决定。

### 鼠标事件

常见的鼠标事件：

- mousedown
- mouseup
- click
- dbclick
- mousewheel
- mousemove
- mouseover
- mouseout

### 鼠标位置

每个鼠标事件有两个属性用于确定鼠标的当前位置： `pageX`和`pageY`。结合这两个属性已经`canvas`元素相对文件的偏移量，可以确定鼠标在`canvas`元素上的相对坐标。但并不是所有的浏览器都支持这两个属性，所以在这些情况下，可能要用到`clientX`与`clientY`属性。

- `pageX`: 鼠标指针相对于整个文档的 x 坐标
- `pageY`: 鼠标指针相对于整个文档的 y 坐标
- `clientX`: 鼠标指针在点击元素(DOM)中的 x 坐标
- `clientY`: 鼠标指针在点击元素(DOM)中的 y 坐标

鼠标的 x，y 坐标值是相对于元素的左上角坐标(0, 0)而言的。

```js
// 计算鼠标位置
function captureMouse(element) {
  const mouse = { x: 0, y: 0 };
  element.addEventListener(
    "mousemove",
    function(event) {
      let x, y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x =
          event.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        y =
          event.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      x -= element.offsetLeft;
      y -= element.offsetTop;
      mouse.x = x;
      mouse.y = y;
    },
    false
  );
  return mouse;
}
```

### 触摸事件

触摸事件与鼠标事件相似，当也有一些显著的不同：

1. 一个触摸事件可以被想象成一个鼠标光标，不过鼠标光标会一直停留在屏幕行，而手纸缺会从设备上按下、移动以及释放，所以某些事件光标会从屏幕上消失。
2. 其次，不存在与`mouseover`等效的触摸事件——要么发生了一次触摸要么没有，不存在手指悬停在触摸屏上的概念。
3. 最后，同一时间可能发生多点触摸。某个触摸点的信息会保存在触摸事件的一个数组中。

一下触摸事件将用于与动画的交互：

- touchstart
- touchend
- touchmove

### 触摸位置

```js
function captureTouch(element) {
  const touch = { x: null, y: null, isPressed: false };
  element.addEventListener(
    "touchstart",
    function(event) {
      touch.isPressed = true;
    },
    false
  );
  element.addEventListener(
    "touched",
    function(event) {
      touch.isPressed = false;
      touch.x = null;
      touch.y = null;
    },
    false
  );
  element.addEventListener(
    "touchmove",
    function(event) {
      let x;
      let y;
      let touch_event = event.touches[0]; // first touch
      if (touch_event.pageX || touch_event.pageY) {
        x = touch_event.pageX;
        y = touch_event.pageY;
      } else {
        x =
          touch_event.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        y =
          touch_event.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      x -= element.offsetLeft;
      y -= element.offsetTop;
      touch.x = x;
      touch.y = y;
    },
    false
  );
  return touch;
}
```

### 键盘事件

键盘事件类型仅包含一下两个：

- keydown
- keyup

**NOTE:** 在捕获键盘事件之前，首先需要将屏幕的焦点设置到该元素上

在大多数情况下，更加简单的做法是直接在网页上监听键盘事件而不管谁获得了焦点。为了做到这一点，可以直接将一个键盘事件监听器绑定到全局的`window`对象上

```js
function onKeydown(event) {
  console.log(event.type);
}

window.addEventListener("keydown", onKeydown, false);
```

### 键盘码

在一个键盘事件中，可以通过事件对象的`keyCode`属性获知哪个键按下。

`keyCode` 属性包含一个带包按下的物理键的数字值。如果用户按下 a 键，那么无论是否有其他键按下，`keyCode` 都会包含数字 65。如果用户先按下 shift 键在同时按下 a，将获得两个键盘事件，一个是 shift 键的事件，另一个为 a 键的事件。

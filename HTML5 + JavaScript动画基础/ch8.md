# 缓动与弹动

## 比例运动

**缓动**是指物体**滑动**到目标点就停下来了。

**弹动**是指物体来回地反弹一会儿，最终停在目标点的运动。

缓动与弹动的共同点：

- 需要设定一个目标点。
- 需要确定物体到目标点的距离。
- 运动和距离成正比——距离越远，运动的程度越大。

缓动是指**速度**与距离成正比。物体离目标点越远，物体运动的速度就越快。当物体运动到接近目标点的时候，它几乎就停下来了。

在弹动的时候，随着距离成比例变化的是**加速度**。如果物体离目标点很远，加速度就远大，速度就会快速增大。当物体很接近目标点的时候，加速度变得很小，但是它还是在加速的。当它越过目标点之后，随着距离变大，方向加速度也随之变大，就会把它拉回来，最终在摩擦力的作用下停住。

## 缓动

### 简单的缓动

实现缓动的策略：

- 为运动确定一个比例系数，这是一个小于 1 且大于 0 的小数。
- 确定目标点。
- 计算出物体与目标点的距离。
- 计算速度，速度 = 距离 x 比例系数。
- 用当前位置加上速度来计算新的位置。
- 重复第 3 步到第 5 步，知道物体到达目标。

首先，确定一个小数作为比例系数，用速度除以距离就能得到这个系数。

```js
const easing = 0.05;
```

下一步要确定目标点，这是一个简单的坐标点。

```js
const targetX = canvas.width / 2;
const targetY = canvas.height / 2;
```

然后计算物体到目标点的距离。

```js
const dx = targetX - ball.x;
const dy = targetY - ball.y;
```

速度就是距离乘以系数。

```js
const vx = dx * easing;
const vy = dx * easing;

ball.x += vx;
ball.y += vy;
```

#### 何时停止缓动

假设在 x 轴上，有一个物体位于 0 的位置，要把它移动到 100.把`easing`变量设置为 0.5，因此它每次移动距离的一半。具体过程如下：

- 从原点开始，在第一帧后，它移动到 50。
- 在第二帧后，移动到 75。
- 现在距离终点的距离是 25，再次移动一半，现在的位置时 87.5。
- 按照这样循环下去，位置将变化到 93.75， 96.875 等。经过 20 帧后，位置为 99.999809265。

在循环中简单地判断是否已到达目标点，缓动代码就永远都不会停止运行。需要判断物体到目标点的距离是否小于某个特定值，比如 1 像素。

#### 移动的目标点

目标点并不是一定要固定值，代码不关心物体是否到达了目标点或者目标点是否在移动。它只需在播放下一帧的时候知道目标点的位置，然后计算距离和速度。

#### 缓动不仅仅适用于运动

##### 旋转

设置旋转角度的当前值和目标值。

```js
let rotation = 90;
const targetRotation = 270;

// 使用缓动
rotation += (targetRotation - rotation) * easing;
arrow.rotation = (rotation * Math.PI) / 180;
```

##### 颜色

在 24 位颜色上使用缓动。要设置红、绿、蓝的初始值和目标值，用缓动改变每一种单独的颜色，然后再把它们合并为单个颜色值。

```js
let red = 255;
let green = 0;
let blue = 0;
const targetRed = 0;
const targetGreen = 0;
const targetBlue = 255;

// 使用缓动
red += (targetRed - red) * easing;
green += (targetGreen - green) * easing;
blue += (targetBlue - blue) * easing;

// 合并颜色
const color = (red << 16) | (green << 8) | blue;
```

##### 透明度

```js
let alpha = 0;
const target = 1;

alpha += (target - alpha) * easing;
```

### 高级缓动

[高级缓动公式](http://robertpenner.com/easing/)

[github](https://github.com/lamberta/html5-animation)

## 弹动

### 一维坐标上的弹动

与缓动类似，弹动也需要一个变量来存储弹性比例系数，可以把他看做距离的一部分，并会累加在速度上。

```js
const spring = 0.1;
const targetX = canvas.width / 2;
let vx = 0;
```

计算物体到目标点的距离

```js
const dx = targetX - ball.x;
```

计算加速度。加速度与距离是成比例关系的。

```js
const ax = dx * spring;
vx += ax;
ball.x += vx;
```

如果小球的摆动幅度不变，那么他在某个点速度就不会减小，一直弹跳下去。需要使用摩擦力让它停下来。

```js
const friction = 0.95;

ax = dx * spring;
vx += ax;
vx *= friction;
ball.x += vx;
```

### 二维坐标上的弹动

```js
const spring = 0.03;
const friction = 0.95;
const target = { x: canvas.width / 2, y: canvas.height / 2 };
let vx = 0;
let vy = 0;

// 弹动
const dx = target.x - ball.x;
const dy = target.y - ball.y;
const ax = dx * spring;
const ay = dy * spring;

vx = (vx + ax) * friction;
vy = (vy + ay) * friction;

ball.x += vx;
ball.y += vy;
```

### 向移动的目标点弹动

弹动的目标点并不需要固定。

### 有偏移量的弹动

```js
const dx = object.x - fixedX;
const dy = object.y - fixedY;
const angle = Math.atan2(dy, dx);
const targetX = fixedX + Math.cos(angle) * springLength;
const targetY = fixedY + Math.sin(angle) * springLength;
```

## 小结

- 缓动是比例速度。
- 弹动是比例加速度。

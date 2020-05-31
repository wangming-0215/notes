# 前端与 HTML

## 什么是前端

- 解决人机交互问题
- 跨终端
  - PC/移动浏览器
  - 客户端
  - VR/AR 等
- Web 技术栈

前端工程师主要使用 Web 技术栈解决多端的图形界面交互问题。

### 前端技术栈

- HTML: 内容
- CSS：样式
- JavaScript：行为

### 前端应关注的问题

- 功能
- 美观
- 无障碍
- 安全
- 性能：网站加载速度，动画
- 兼容性：兼容各种浏览器
- 体验：用户体验

### 前端边界

- 服务端：Node
- 客户端：
  - 移动端 APP: React Native 等
  - PC： electron
- 实时通讯： WebRTC

### 开发环境

- 浏览器： chrome
- 编辑器： vscode

## HTML

`HyperText Markup Language`

`HyperText`: 超文本，不是纯文字，可以包含图片，链接，表格，音视频等
`Markup`: 标记，使用含有特定含义的标记

比如：

```html
<h1>This is a title</h1>

<img src="path/to/image" />
```

`doctype`: 指明 HTML 使用的版本，决定浏览器渲染页面的模式。

### 标题

h1 - h6

```html
<h1>h1</h1>
```

### 列表

#### 有序列表

```html
<ol>
  <li>苹果</li>
  <li>梨子</li>
</ol>
```

#### 无序列表

```html
<ul>
  <li>苹果</li>
  <li>梨子</li>
</ul>
```

#### 定义列表

```html
<dl>
  <dt>水果</dt>
  <dd>苹果</dd>
  <dd>梨子</dd>
</dl>
```

### 链接

```html
<a href="https://baidu.com" target="_blank">百度一下</a>
```

### 多媒体

```html
<img src="path/to/image" alt="" />

<audio src="path/to/audio" />

<video src="path/to/video" />
```

### 输入

```html
<input type="text" />
```

`type`：输入框的类型:

- text
- password
- date
- email
- number
- radio
- checkbox
- file

```html
<!-- 下拉选择框 -->
<select>
  <option value="a">A</option>
</select>

<!-- 文本框输入时有提示 -->
<input list="countries" />
<datalist id="countries">
  <option>Greece</option>
</datalist>
```

### 文本标签

`blockquote`：长引用，表示直接引用别人的一段话

`cite`：短引用，作品的名字或者章节

`q`：前文提到的内容

`code`：代码

`pre`： 多行代码

`strong`: 强调，重要紧急的

`em`：强调，突出，重音

### 内容划分

`header`: 头部，一般放导航栏

`main`： 正文

`aside`：侧边栏，广告

`footer`：参考链接，版权信息等

### 语义化

HTML 中的元素、属性及属性值都拥有某些含义，开发正英遵循语义开发。

HTML 使用者：

- 开发者 - 修改维护页面
- 浏览器 - 渲染页面
- 搜索引擎 - 提取关键字，排序，即 SEO
- 屏幕阅读器 - 给盲人读页面

好处：

- 代码可读性
- 可维护性
- 搜索引擎优化
- 提升无障碍性

根据传达的内容来决定使用哪种标签，而不是根据样式

如何做到语义化

- 了解每个标签和属性的含义
- 思考什么标签最适合描述这个内容
- 不使用可视化工具生成代码

## 总结

从本节课中我了解到前端工程师的主要职责是利用 web 技术栈解决多端的图形界面交互问题。其中 web 技术栈主要包括`HTML`,`CSS`以及`JavaScript`三个部分，`HTML`负责页面的**内容**， `CSS`负责**样式**，`JavaScript`负责**逻辑与行为**。

本节课还介绍`HTML`相关基础。`HTML`是`HyperText Markup Language`的缩写，即**超文本标记语言**。与普通文本相比，超文本的内容更加丰富，可以包含链接，视频，音频等富文本内容，而不是单纯的文本字符串。`HTML`使用标记的形式构成基本语法，包括开始标签，如`<h1>`，结束标签`</h2>`，以及其他的一些属性和属性值等等，具体可以去[MDN](https://developer.mozilla.org/zh-CN/)上查询相关文档。

`HTML`比较重要的一部分，也是容易忽略的一部分就是**语义化**，早期的`div + css`就没有遵循语义化来开发网页。`HTML`中的每个标签、属性以及属性值都有某种含义，遵循语义化可以更好的帮助使用者。

具体`HTML`的使用者有开发者、浏览器、搜索引擎以及屏幕阅读器。从它们的角度来思考语义化带来的好处：

- 代码可读性
- 可维护性
- SEO
- 提升无障碍性

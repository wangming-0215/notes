# 第一个 Flutter 应用

## 计数器应用

使用 `flutter create` 命令创建的应用模板是一个简单的计数器应用。

1. 应用入口

   ```dart
   void main => runApp(MyApp());
   ```

2. 应用结构

   - `MyApp`类代表整个 Flutter 应用，继承自`StatelessWidget`类，这也就意味着应用本身也是一个`Widget`。
   - 在 Flutter 中，大多数东西都是`Widget`，包括对齐`alignment`、填充`padding`和布局`layout`等，它们都是以`Widget`的形式提供的。
   - Flutter 在构建布局是，会调用组件的`build`方法，`Widget`的主要工作是提供一个`build()`方法来描述如何构建 UI（通常是通过组合、拼装其他基础`Widget`来实现的）。
   - `MaterialApp`是`Material`库中提供的 Flutter APP 框架，可用于设置应用的名称、主题、语言、首页及路由表等。`MaterialApp`也是一个`Widget`。
   - `Scaffold`是`Material`库中提供的页面脚手架，包含导航栏、Body 以及 FloatingActionButton。
   - `home`为 Flutter 应用的首页，也是一个`Widget`。

   ```dart
   class MyApp extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return new MaterialApp(
        title: 'Flutter Demo',
         theme: new ThemeData(
          primarySwatch: Colors.blur,
         ),
         home: new MyHomePage(title: 'Flutter Demo Home Page'),
       );
     }
   }
   ```

3. `StatelessWidget`：无状态`Widget`，用于不需要维护状态的场景，通常在`build`方法中通过嵌套其他`Widget`来构建 UI，在构建过程中会递归地构建其嵌套的`Widget`。

4. `StatefullWidget`：有状态`Widget`，可以拥有状态，这些状态在`Widget`生命周期中是可以发生变化的。`StatefullWidget`至少由两个类组成：

   - 一个`StatefullWidget`类；
   - 一个`State`类，`StatefullWidget`类本身是不会变化的，但是`State`类中持有的状态再`Widget`声明周期中可能会发生变化。

   ```dart
   class MyHomePage extends StatefulWidget {
     MyHomePage({Key key, this.title}): super(key: key);
     final String title;
     @override
     _MyHomePageState createState() => new _MyHomePageState();
   }

   class _MyHomePageState extends State<MyHomePage> {
     @override
     Widget build(BuildContext context) {
       return new Center();
     }
   }
   ```

5. `State`类：表示与其对应的`StatefulWidget`所要维护的状态。

## 路由管理

路由（Route）在 Android 中通常是指一个 Activity，在 IOS 中则是指一个 ViewController。

所谓路由管理，就是管理页面之间如何跳转，通常也可称为导航管理。

Flutter 中的路由管理与原生开发类似，无论是 Android 还是 IOS，导航管理都会维护一个路由栈，路由入栈（push）操作对应打开一个新页面，路由出栈（pop）操作对应页面关闭操作，而路由管理则主要是指如果管理路由栈。

### MaterialPageRout

`MaterialPageRoute`继承自`PageRoute`类，`PageRoute`类是一个抽象类，标识占有整个屏幕控件的一个模态路由页面，同时还定义了路由构建及切换时过度动画的相关接口和属性。

```dart
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```

- `builder`：构建路由页面的具体内容，返回值是一个`Widget`，通常需要自己实现；
- `settings`：包含路由的配置信息，如路由名称、是否初始路由（首页）等；
- `maintainState`：默认情况下，当入栈一个新路由时，原路由会被保存在内存中，如果想在路由没用的时候释放其占用的所有资源，可以将`maintainState`设置为`false`；
- `fullscreenDialog`：表示新的路由页面是否为一个全屏的模态对话框。

### Navigator

`Navigator`是路由管理组件，提供了**打开**和**退出**路由的方式。它通过一个栈来管理活动路由集合。通常，当前屏幕显示的页面就是栈顶的路由。

- 路由入栈，返回一个`Future`对象，用于接收新路由出栈时返回的数据：

```dart
Future push(BuildContext context, Route route);
```

- 路由出栈：

```dart
bool pop(BuildContext context, [result]);
```

### 路由传参

```dart
class NewRoute extends StatelessWidget {
  NewRoute({
    Key key,
    @required this.text, // 接收路由传参
  }): super(key: key);

  @override
  Widget build(BuildContext context) {
    return SomeWidget();
  }
}

// 想 NewRoute 页面传递参数
var reault = await Navigator.push(context, MaterialPageRoute(
	builder: (context) {
    return NewRoute({ text: 'test '})
  }
));
```

参数通过`NewRoute`的`text`参数传递个新路由面，并等待`Nagivator.push()`返回的 Future 来获取新路由的返回数据。

### 命名路由

要想使用命名路由，必须先提供并注册一个路由表（routing table）。

路由表示一个`Map`：`Map<String WidgetBuilder> routes`，`key`是路由的名字，是一个字符串；`value`是一个`builder`函数，用于生成相应的路由 Widget。

通过路由名字打开新路由时，会根据路由名字在路由表中找到对应的回调函数，并调用该回调函数生成路由 Widget。

注册路由表：

```dart
MaterialApp(
	title: 'Flutter Demo',
  initialRoute: '/', // 名为'/'的路由将作为应用的 home （首页），作用同下 `home` 属性
  theme: ThemeData(primarySwatch: Colors.blue),
  // 注册路由表
  routes: {
    'new_page': (context) => NewRoute(),
  },
  // home: MyHomePage();
)
```

通过路由名打开新页面：

```dart
Future pushNamed(BuildContext context, String routeName, {Object arguments});
```

类似的还有`pushReplacementNamed`等 API。

详情参考[Navigator 文档](https://api.flutter.dev/flutter/widgets/Navigator-class.html)

命名路由传参：

```dart
class NewRoute {
  @override
  Widget build(BuildContext) {
    // 获取路由参数
		var args = ModalRoute.of(context).settings.arguments;
  }
}

// 传递参数
Navigator.of(context).pushNamed('new_page', arguments: 'hi');
// or
Navigator.pushNamed(context, 'new_page', arguments: 'hi');
```

路由生成钩子`onGenerateRoute`：打开命名路由时有可能被调用。

- 如果指定路由名已经在路由表中注册，则会调用路由表中的`builder`函数生成路由组件
- 如果指定路由名在路由表中没有注册，则会调用`onGenerateRoute`生成路由。

```dart
MaterialApp(
	onGenerateRoute: (RouteSettings settings) {
    return MaterialPageRoute(builder: (context) {
      String routeName = settings.name;
      // 进入路由前执行的操作
    });
  }
);
```

命名路由的好处：

- 语义化更明确；
- 代码更好维护，如果使用匿名路由，则必须在调用`Navigator.push`的地方创建新路由页，这样不仅需要导入新路由页的 dart 文件，而且这样的代码还将会变得非常分散；
- 可以通过`onGenerateRoute`做一些全局的路由跳转前置处理逻辑。

## 包管理

Flutter 使用`YMAL`文件管理依赖，在 Flutter 项目中默认的配置文件是`pubspec.yaml`。

`pubspec.yaml`中各个字段的意义：

- `name`： 应用或包的名字；
- `description`：应用或包的描述、简介；
- `version`：应用或包的版本号；
- `dependencies`：应用或包依赖的其他包或插件；
- `dev_dependencies`：开发环境依赖的工具包（而不是 Flutter 应用本身依赖的包）；
- `fluttter`：Flutter 相关的配置项。

`dependencies`和`dev_dependencies`的区别在于，前者的依赖包将作为 APP 源码的一部分参与编译，生成最终的安装包，而后者的依赖只是作为开发阶段的一些工具包，主要用于帮助提高开发和测试的效率。

其他依赖方式：

- 依赖本地包：

  ```yaml
  dependencies:
  	pkg1:
  		path: ../../code/pkg1
  ```

- 依赖 Git

  ```yaml
  # 软件包位于仓库根目录
  dependencies:
  	pkg1:
  		git:
  			url: git://github.com/xx/pkg1.git


  # 软件包位于某个路径下，使用 path 指定相对位置
  dependencies:
  	package1:
  		git:
  			url: git://github.com/xx/package1.git
  			path: packages/package1
  ```

## 资源管理

Flutter 使用`pubspec.yaml`文件来管理应用程序所需的资源。

```yaml
flutter:
	assets:
		- assets/my_icon.png
		- assets/background.png
```

每个`assets`都通过相对于`pubspec.yaml`文件所在的路径来标识自身的路径。

`assets`的声明顺序无关紧要，实际目录页也可以是任意文件夹。

在构建期间，Flutter 将 `asset`放置在称为`asset bundle`的特殊存档中，应用程序可以在运行时读取它们，但是不能修改。

#### asset 变体（variant）

不同版本的 asset 可能显示在不同的上下文中。

在构建过程中，Flutter 会在相邻的子目录中查找具有相同名称的任何文件，这些文件会与指定的 asset 一起被包含在`asset bundle`中。

假设 APP 中包含一下文件：

- .../assets/my_icon.png
- .../assets/background.png
- .../assets/dark/background.png

```yaml
flutter:
	assets:
		- assets/background.png
```

此时，`assets/background.png`和`assets/dark/background.png`都将包含在 asset bundle 中，前者被认为是`_main asset_`（主资源），后者被认为是一种变体（variant）。

#### 加载 assets

Flutter 通过`AssetBundle`对象访问 asset。

**加载文本**

1. 通过`rootBundle`对象加载：通过`package:flutter/services.dart`包中的全局静态对象`rootBundle`可以轻松访问主资源包。
2. 通过`DefaultAssetBundle`加载：获取当前`BuildContext`的`AssetBundle`。

**NOTE**：建议通过`DefaultAssetBundle`加载资源，`DefaultAssetBundle`并不是使用 APP 默认的 asset bundle，而是使父级 Widget 在运行时动态替换不同的`AssetBundle`，这对于本地化或测试场景很有用。

通常，可以使用`DefaultAssetBundle.of()`在 APP 运行时间接加载 asset，而在 Widget 上下文之外，或其他`AssetBundle`句柄不可用时，使用`rootBundle`直接加载 asset。

```dart
import 'dart:async' show Future;
import 'package:flutter/services.dart' show rootBundle;

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/config.json');
}
```

**加载图片**

Flutter 可以为当前设备加载适合其分辨率的图像。

1. 声明分辨率相关的图片 assets：

   `AssetImage`可以将 asset 的请求逻辑映射到最接近当前设备像素比例（dpi）的 asset。为了使这种映射起作用，必须根据特定的目录结构保存 asset。具体如下：

   - .../my_icon.png
   - .../2.0x/my_icon.png
   - .../3.0x/my_icon.png

2. 加载图片：使用`AssetImage`类。

   ```dart
   Widget build(BuildContext context) {
     return new DecoratedBox(
     	image: new DecorationImage(
       	image: new AssetImage('assets/background.png')
       );
     );
   }

   // 或者使用 Image Widget
   Widget build(BuildContext context) {
     return Image.asset('assets/background.png');
   }
   ```

3. 加载依赖包中的资源图片

   ```dart
   new AssetImage('icons/heart.png', package: 'my_icons');

   // or
   new Image.asset('icons/heart.png', package: 'my_icon');
   ```

**特定平台 asset**

懒得写了，还是去看[文档](https://flutter.dev/docs/development/ui/assets-and-images)吧，反正书上内容也是翻译的文档。

## 调试 Flutter 应用

[文档文档还是文档](https://flutter.dev/docs/testing/debugging)

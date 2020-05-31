# 第一个Flutter应用

## 计数器应用

使用 `flutter create` 命令创建的应用模板是一个简单的计数器应用。

1. 应用入口

   

   ```dart
   void main => runApp(MyApp());
   ```

   

2. 应用结构

   - `MyApp`类代表整个Flutter应用，继承自`StatelessWidget`类，这也就意味着应用本身也是一个`Widget`。

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


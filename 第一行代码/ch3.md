# 先从看得到的入手，探究 Activity

## Activity 是什么

Activity 是最容易吸引用户的地方，它是一种可以包含用户界面的组件，主要用于和用户进行交互。一个应用程序中可以包含零个或多个Activity，但不包含任何Activity的应用程序很少见。

## Activity 的基本用法

### 手动创建Activity

```kotlin
class FirstActivity: AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }
}
```

### 创建和加载布局

Android 程序的设计讲究逻辑和视图分离，最好每一个 Activity 都能对应一个布局。

布局是用来显示界面内容的。

加载布局：

```kotlin
class FirstActivity: AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // 给当前Activity加载一个布局
    setContentView(R.layout.first_layout)
  }
}
```

### 在 AndroidManifest 文件中注册

所有的 Activity 都要在 `AndroidManifest.xml` 中进行注册才能生效。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myfirstandroidapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyFirstAndroidApp">
      	<!-- 注册 Activity -->
      	<!-- android:label 指定 Activity 中标题栏的内容，标题栏是显示在 Activity 最顶部的 -->
      	<!-- 主 Activity 指定的 label 不仅会成为标题栏中的内容，还会成为启动器（Launcher）中应用程序显示的名称 -->
        <activity
            android:name=".FirstActivity"
            android:label="This is FirstActivity">
          	<!-- 配置主 Activity -->
          	<!-- 主 Activity 是应用程序首先打开的 Activity -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

注册Activity

```xml
<activity android:name=".PacakgeName" android:label="label" />
```

注册主 Activity

```xml
<activity android:name=".PackageName" android:label="label">
	<intent-filter>
  	<action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
</activity>
```

没有主 Activity 的程序可以正常安装，但是无法在启动器（桌面）中看到或打开这个程序。这种程序一般是作为第三方服务供其他应用在内部进行调用的。

### 在 Activity 中使用 `Toast`

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  setContentView(R.layout.first_layout)
  val button1: Button = findViewById(R.id.button1)
  button1.setOnClickListener {
    Toast.makeText(this, "You clicked Button 1", Toast.LENGTH_SHORT).show()
  }
}
```

`findViewById()`方法获取在布局文件中定义的元素。通过传入在布局文件中定义的元素`id`(android:id)来得到元素示例。`findViewById()`方法返回的是一个继承自`View`的泛型对象，Kotlin 无法自动推到，需显示声明元素类型。

Kotlin 编写的 Android 项目在*app/build.gradle*文件的头部默认引入了一个`kotlin-android-extendsions`插件，这个插件会根据布局文件中定义的控件`id`自动生成一个具有相同名称的变量，可以在Activity中直接使用这个变量，而不需要在调用`findViewById()`方法了。

[视图绑定](https://developer.android.com/topic/libraries/view-binding)

### 在Activity中使用Menu


# Fragment

## 概念

`Fragment`是一种可以嵌入在 `Activity` 中的 UI 片段，它能让程序更加合理和充分地利用大屏幕控件，因而在平板上应用的非常广泛。

## 使用

### 简单用法

`left_fragment.xml`

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:text="Button"
        />

</LinearLayout>
```

```kotlin
class LeftFragment : Fragment() {

  override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? {
    return inflater.inflate(R.layout.left_fragment, container, false)
  }

}
```

`activity_main.xml`

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <fragment
        android:id="@+id/leftFrag"
        android:name="com.example.fragmenttest.LeftFragment"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1" />

</LinearLayout>
```

通过 `android:name`属性来显式声明要添加的`Fragment` 类名。

### 动态添加 Fragment

Fragment 真正的强大之处在于，它可以在程序运行时动态地添加到 Activity 中。

动态添加 Fragment 只要分为 5 步：

1. 创建待添加 Fragment 的实例；
2. 获取 FragmentManager，在 Activity 中可以直接调用`getSupportFragmentManager()方法获取；
3. 开启一个事务，通过调用`beginTransaction()`方法开启；
4. 向容器内添加或替换 Fragment，一般使用`replace()`方法实现，需要传入容器的 id 和待添加的 Fragment 实例；
5. 提交事务，调用`commit()`方法提交事务。

```kotlin
private fun replaceFragment(fragment: Fragment) {
  val fragmentManager = supportFragmentManager
  val transaction = fragmentManager.beginTransaction()
  transaction.replace(R.id.rightLayout, fragment)
  transaction.commit()
}
```

### 在 Fragment 中实现返回栈

`FragmentTransaction` 中提供了一个`addToBackState()`方法可以将事务添加到返回栈中，这样点击`Back`键就可以返回到上一个 Fragment 中。

```kotlin
private fun replaceFragment(fragment: Fragment) {
  val fragmentManager = supportFragmentManager
  val transaction = fragmentManager.beginTransaction()
  transaction.replace(R.id.rightLayout, fragment)
  // addToBackStack()方法，它可以接收一个名字用于描述返回栈的状态，一般传入null即可
  transaction.addToBackState(null)
  transaction.commit()
}
```

### Fragment 和 Activity 之间的交付

Activity 中获取 Fragment 的实例

```kotlin
val fragment = supportFragmentManager.findFragmentById(R.id.leftFragment) as LeftFragment
```

Fragment 中调用 Activity 里的方法

```kotlin
if (activity != null) {
  val mainActivity = activity as MainActivity
}
```

Fragment 之间进行通信

首先在一个 Fragment 中可以得到与之相关联的 Activity，然后再通过这个 Activity 去获取另外一个 Fragment 实例。

## Fragment 的生命周期

### Fragment 的状态和回调

#### 四种状态

##### 运行状态

当一个 Fragment 所关联的 Activity 正处于运行状态时，该 Fragment 也处于运行状态。

##### 暂停状态

当一个 Activity 进入暂停状态时（由于另一个未占满屏幕的 Activity 被添加到了栈顶），与之相关联的 Fragment 就会进入暂停状态。

##### 停止状态

当一个 Activity 进入停止状态，与之相关联的 Fragment 就会进入停止状态，或者通过调用 FragmentTransaction 的`remove()`、`replace()`方法将 Fragment 从 Activity 中移除，但在事务提交之前调用了`addToBackStack()`方法，这是的 Fragment 也会进入停止状态，总的来的，进入停止状态的 Fragment 对用户来说时完全不可见的，有可能被系统回收。

##### 销毁状态

Fragment 总是依附于 Activity 而存在的，因而当 Activity 被销毁时，与之相关联的 Fragment 就会进去销毁状态。或者通过调用 FragmentTransaction 的`remove()`、`replace()`方法将 Fragment 从 Activity 中移除，但再事务提交之前并没有调用`addToBackStack()`方法，这时的 Fragment 也会进入销毁状态。

#### 回调

##### `onAttach()`

当 Fragment 和 Activity 建立关联时调用

##### `onCreateView()`

为 Fragment 创建视图（加载布局）时调用

##### `onViewCreated()`

确保与 Fragment 相关联的 Activity 已经创建完毕时调用

##### `onDestroyView()`

当与 Fragment 关联的视图被移除时调用

##### `onDetach()`

当 Fragment 和 Activity 解除关联时调用

![Fragment 生命周期图](./assets/010.png)

# 广播机制

## 简介

Android 中广播主要分为两种类型：

- 标准广播：是一种完全异步执行的广播，在广播发出之后，所有的 BroadcastReceiver 几乎会在同一时刻收到这条广播消息，因此他们之间没有任何先后顺序可言。这种广播效率比较高，但是无法被截断。

- 有序广播：是一种同步执行的广播，在广播发出后，同一时刻只有一个 BroadcastReceiver 能够收到这条广播消息，当这个 BroadcastReceiver 中的执行完毕后，广播才会继续传递。所以此时的 BroadcastReceiver 是由先后顺序的，优先级高的 BroadcastReceiver 就可以先收到广播消息，并且前面的 BroadcastReceiver 还可以截断正在传递的广播，这样后面的 BroadcastReceiver 就无法收到广播消息了。

## 接收系统广播

注册 BroadcastReceiver 的方式有两种：Manifest-declared receivers 和 Context-registered receivers

### Manifest-declared receivers（静态注册）

如果您在 manifest 中声明广播接收器，则系统会在发送广播时启动您的应用程序（如果应用程序尚未运行）。

静态注册的 BroadcastReceiver 在应用程序**未启动**的情况下也能接收广播。

在 Android 8.0 系统之后，所有的隐式广播（隐式广播值得是那些没有具体指定发送给哪个应用程序的广播，大多数系统广播属于隐式广播）都不允许使用静态注册的方式来接收。

1. 在`AndroidManifest.xml`中指定`<receiver>`

   ```xml
   <!-- If this receiver listens for broadcasts sent from the system or from
     other apps, even other apps that you own, set android:exported to "true". -->
   <receiver android:name=".MyBroadcastReceiver" android:exported="false">
    <intent-filter>
        <action android:name="APP_SPECIFIC_BROADCAST" />
    </intent-filter>
   </receiver>
   ```

2. 继承`BroadcastReceiver`并实现`onReceive(Context, Indent)`方法

   ```kt
   private const val TAG = "MyBroadcastReceiver"

    class MyBroadcastReceiver : BroadcastReceiver() {

        override fun onReceive(context: Context, intent: Intent) {
            StringBuilder().apply {
                append("Action: ${intent.action}\n")
                append("URI: ${intent.toUri(Intent.URI_INTENT_SCHEME)}\n")
                toString().also { log ->
                    Log.d(TAG, log)
                    Toast.makeText(context, log, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
   ```

### Context-registered receivers（动态注册）

只要注册上下文有效，上下文注册的接收者就会接收广播。 例如，如果您在 Activity 上下文中注册，只要该 Activity 未被销毁，您就会收到广播。 如果您在应用程序上下文中注册，只要应用程序正在运行，您就会收到广播。

动态注册的 BroadcastReceiver 可以自由地控制注册和注销，但必须在应用程序启动之后才能接收广播，因为注册的逻辑是写在`onCreate`方法中的。

```kt
ContextCompat.registerReceiver(context, br, filter, receiverFlags)
```

## 发送广播

### 发送标准广播

`sendBroadcast(Intent)`，发送标准广播

```kt
Intent().also { intent ->
  intent.setAction("com.example.broadcast.MY_NOTIFICATION")
  intent.putExtra("data", "Nothing to see here, move along.")
  // 指定发出这条广播的应用程序，使其变成显式广播，否则静态注册的 receiver 无法接收这条广播
  intent.setPackage(packageName)
  sendBroadcast(intent)
}
```

### 发送有序广播

`sendOrderedBroadcast(Intent, String)`，发送标准广播

第二个参数是与权限相关的字符串。

`<receiver>`标签中`android:priority`属性给 BroadcastReceiver 设置优先级，数值越大优先级越高

```kt
Intent().also { intent ->
  intent.setAction("com.example.broadcast.MY_NOTIFICATION")
  intent.putExtra("data", "Nothing to see here, move along.")
  // 指定发出这条广播的应用程序，使其变成显式广播，否则静态注册的 receiver 无法接收这条广播
  intent.setPackage(packageName)
  sendOrderedBroadcast(intent, null)
}
```

`abortBroadcast`取消广播，表示将这条广播阶段，后面的 BroadcastReceiver 将无法在接收到这条广播

## 使用权限限制广播

可以对广播的发送者或接收者实施限制。

### 有权限发送广播

在调用 `sendBroadcast(Intent, String)` 或 `sendOrderedBroadcast(Intent, String, BroadcastReceiver, Handler, int, String, Bundle)` 时，可以指定权限参数。 只有在清单中使用标签请求许可的接收者（如果有危险，随后被授予许可）才能接收广播。

```kt
sendBroadcast(Intent("com.example.NOTIFY"), Manifest.permission.SEND_SMS)
```

```xml
<uses-permission android:name="android.permission.SEND_SMS" />
```

### 有权限接收广播

如果您在注册广播接收器时指定权限参数（使用 `registerReceiver(BroadcastReceiver, IntentFilter, String, Handler)` 或在清单中的 `<receiver>` 标记中），则只有使用 `<uses-permission>` 请求权限的广播者 清单中的标签（如果危险，随后被授予许可）可以向接收者发送 Intent。

```xml
<receiver android:name=".MyBroadcastReceiver"
          android:permission="android.permission.SEND_SMS">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE"/>
    </intent-filter>
</receiver>
```

```kt
var filter = IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED)
registerReceiver(receiver, filter, Manifest.permission.SEND_SMS, null )
```

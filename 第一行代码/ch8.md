# 跨程序共享数据 —— ContentProvider

**ContentProvider**主要用于在不同的应用程序之间实现数据共享的功能，它提供了一套完整的机制，允许一个程序访问另一个程序中的数据，同时还能保证被访问数据的安全性。

ContentProvider 是 Android 实现跨程序共享数据的*标准方式*。

ContentProvider 可以选择只对那一部分数据进行共享，从而保证程序中的隐私数据不会有泄露的风险。

## 运行时权限

为了更好地保护了用户的安全和隐私，Android 6.0 系统中引入了运行时权限。

运行时权限：用户不需要再安装软件时一次性授权所有申请的权限，而是可以在软件的使用过程中再对某一项权限申请进行授权。

Android 现在将常用的权限大致规程两类：

- 普通权限：指的是哪些不会直接威胁到用户的安全和隐私的权限，对于这部分权限申请，系统会自动进行授权，不需要用户手动操作；
- 危险权限：指的是那些可能会触及用户隐私或者对设备安全造成影响的权限，入获取设备联系人信息、定位设备地理位置。这类权限必须由用户手动授权，否则程序无法使用相应的功能。

到 Android 10 系统为止所有的危险权限(Android 6.0 以上必须运行时授权)：

| 权限组名             | 权限名                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| CALENDAR             | READ_CALENDAR<br/>WRITE_CALENDAR                                                                                                |
| CALL_LOG             | READ_CALL_LOG<br/>WRITE_CALL_LOG<br/>PROCESS_OUTGOING_CALLS                                                                     |
| CAMERA               | CAMERA                                                                                                                          |
| CONTACTS             | READ_CONTACTS<br/>WRITE_CONTACTS<br/>GET_ACCOUNTS                                                                               |
| LOCATION             | ACCESS_FINE_LOCATION<br/>ACCESS_COARSE_LOCATION<br/>ACCESS_BACKGROUND_LOCATION                                                  |
| MICROPHONE           | RECORD_AUDIO                                                                                                                    |
| PHONE                | READ_PHONE_STATE<br/>READ_PHONE_NUMBERS<br/>CALL_PHONE<br/>ANSWER_PHONE_CALLS<br/>ADD_VOICEMAIL<br/>USE_SIP<br/>ACCEPT_HANDOVER |
| SENSORS              | BODY_SENSORS                                                                                                                    |
| ACTIVITY_RECOGNITION | ACTIVITY_RECOGNITION                                                                                                            |
| SMS                  | SEND_SMS<br/>RECEIVE_SMS<br/>READ_SMS<br/>RECEIVE_WAP_PUSH<br/>RECEIVE_MMS                                                      |
| STORAGE              | READ_EXTERNAL_STORAGE<br/>WRITE_EXTERNAL_STORAGE<br/>ACCESS_MEDIA_LOCATION                                                      |

检查权限：

```kotlin
ContextCompat.checkSelfPermission(@NonNull Context context, @NonNull String permission)

// result == PackageManager.PERMISSION_GRANTED
```

- 返回值：`PackageManager.PERMISSION_GRANTED` or `PackageManager.PERMISSION_DENIED`

申请授权：

```kotlin
ActivityCompat.requestPermissions(
  @NonNull Activity activity
  @NonNull String[] permissions,
  @IntRange(from = 0) int requestCode,
)
```

- `activity`： Activity 实例；
- `permissions`：申请的权限；
- `requestCode`： 请求码，只要是唯一值就可以了；
- 系统会弹出一个权限申请的对话框，用户可以选择同意或拒绝权限申请，不论哪种结果，最终都会回调到`onRequestPermissionsResult()`方法中，而授权的结果则会封装在`grantResults`参数中。

完整示例：

```kotlin
class MainActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    makeCall.setOnClickListener {
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermission(this, arrayOf(Manifest.permission.CALL_PHONE), 1)
      } else {
        call()
      }
    }
  }

  override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    when(requestCode) {
      1 -> {
        if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          call()
        } else {
          Toast.makeText(this, "You denied the permission", Toast.LENGTH_LONG).show()
        }
      }
    }
  }

  private fun call() {
    try {
      val intent = Intent(Intent.ACTION_CALL)
      intent.data = Uri.parse("tel:10086")
      startActivity(intent)
    } catch(e: SecurityException) {
      e.printStackTrace()
    }
  }

}
```

## 访问其他程序中的数据

ContentProvider 的用法一般有两种：

- 一种是使用现有的 ContentProvider 读取和操作相应程序中的数据；
- 另一种是创建自己的 ContentProvider，给程序的数据提供外部访问的接口。

ContentResolver 中提供了一些列的方法用于对数据进行增删改查操作。

ContentResolver 中的增删改查方法接收一个内容 URI 作为参数，内容 URI 给 ContentProvider 中的数据建立唯一的标识符。

内容 URI 最标准格式：`content://com.example.app.provider/table1`。

内容 URI 主要由两部分组成：

- `authority`：用于对不同的应用程序做区分的，一般为了避免冲突，会采用应用包名的方式进行命名，如：`com.example.app.provider`；
- `path`：用于对于同一应用程序中不同的表做区分的，通常会添加到`authority`的后面，如：`com.example.app.provider/table`

```kotlin
val uri = Uri.parse("content://com.example.app.provider/table1")
val cursor = contentResolver.query(
  uri,
  projection, // 指定查询的列名
  selection, // 指定 where 的约束条件
  selectionArgs, // 为 where 中的占位符提供具体的值
  sortOrder, // 指定查询结果的排序方式
)

while(cursor.moveToNext()) {
  val column1 = cursor.getString(cursor.getColumnIndex("column1"))
  val column2 = cursor.getInt(cursor.getColumnIndex("column2"))
}

cursor.close()
```

## 创建自己的 ContentProvider

```kotlin
class MyProvider : ContentProvider() {

    // 初始化 ContentProvider 的时候调用。
    // 通常会在这里完成对数据库的创建和升级等操作。
    // 返回 true 表示初始化成功，返回 false 则表示失败
    override fun onCreate(): Boolean {
        return false
    }

    // 从 ContentProvider 中查询数据。
    override fun query(uri: Uri, projection: Array<String>?, selection: String?, selectionArgs: Array<String>?, sortOrder: String?): Cursor? {
        return null
    }

    // 向 ContentProvider 中添加一条数据。
    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    // 更新 ContentProvider 中已有的数据。
    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    // 从 ContentProvider中删除数据。
    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    // 根据传入的内容 URI 返回相应的 MIME 类型。
    override fun getType(uri: Uri): String? {
        return null
    }

}
```

内容 URI 的格式主要有两种：

- 以路径结尾表示期望访问该表中的所有的数据；
- 以 id 结尾表示期望访问该表中拥有相应 id 的数据。

使用通配符分别匹配这两种格式的内容 URI：

- `*` 表示匹配任意长度的任意字符，如`content://com.example.app.provider/*`，表示匹配任意表；
- `#` 表示匹配任意长度的数字。如`content://com.example.app.provider/table1/#`，表示匹配 table1 表中任意一行的数据。

`UriMatcher`：

添加要匹配的 URI，以及匹配此 URI 时返回的代码：

```kotlin
addURI(String authority, String path, int code)
```

尝试匹配 url 中的路径：

```kotlin
match(Uri uri)
```

示例：

```kotlin
class MyProvider : ContentProvider() {
  private val table1Dir = 0
  private val table1Item = 1
  private val table2Dir = 2
  private val table2Item = 3

  private val prefix = "com.example.app.provider"

  private val uriMatcher = UriMatcher(UriMatcher.NO_MATCH)

  init {
    uriMatcher.addURI(prefix, "table1", table1Dir)
    uriMatcher.addURI(prefix, "table1/#", table1Item)
    uriMatcher.addURI(prefix, "table2", table2Dir)
    uriMatcher.addURI(prefix, "table2/#", table2Item)
  }

  override fun query(uri: Uri, projection: Array<String>?, selection: String?, selectionArgs: Array<String>?, sortOrder: String?): Cursor? {
    when (uriMatcher.match(uri)) {
      table1Dir -> {
        // 查询table1表中的所有数据
      }
      table1Item -> {
        // 查询table1表中的单条数据
      }
      table2Dir -> {
        // 查询table2表中的所有数据
      }
      table2Item -> {
        // 查询table2表中的单挑数据
      }
    }
  }
}
```

内容 URI 所对应的 MIME 字符串主要由 3 部分组成，格式规定如下：

- 必须以`vnd`开头；
- 如果内容 URI 以路径结尾，则后接`android.cursor.dir/`，如：`vnd.android.cursor.dir/vnd.com.example.app.provider.table1`；
- 如果内容 URI 以 id 结尾，则后接`android.cursor.item/`，如：`vnd.android.cursor.item/vnd.com.example.app.provider.table1`；
- 最后接上`vnd.<authority>.<path>`。

```kotlin
class MyProvider : ContentProvider() {

  ...

  override fun getType(uri: Uri) = when (uriMatcher.match(uri)) {
    table1Dir -> "vnd.android.cursor.dir/vnd.com.example.app.provider.table1"
    table1Item -> "vnd.android.cursor.item/vnd.com.example.app.provider.table1"
    table2Dir -> "vnd.android.cursor.dir/vnd.com.example.app.provider.table2"
    table2Item -> "vnd.android.cursor.item/vnd.com.example.app.provider.table2"
    else -> null
  }

}
```

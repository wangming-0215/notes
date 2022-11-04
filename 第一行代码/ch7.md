# 数据持久化

## 简介

数据持久化是指将内存中的瞬时诗句保存到存储设备中，保证即使在手机或计算机关机的情况霞，这些数据不会丢失。

Android 系统中主要提供了三种简单的数据持久化功能：文件存储、SharedPreferences 存储以及数据库存储。

## 文件存储

文件存储不会对存储的内容进行任何格式化处理，所有的数据都是原封不动地保存到文件当中的，因而比较适合存储一些简单的稳步数据或二进制数据。

如果要保存一些较为复杂的结构化数据，需要定义一套自己的格式规范，方便之后将数据解析出来。

### 将数据存储到文件中

`openFileOutput(filename, mode)`：将数据保存到指定文件。

- `filename`：文件名，所有文件都默认保存到`/data/data/<package name>/files/`目录下；文件不存在会自动创建
- `mode`：文件操作模式；
  - `MODE_PRIVATE`：指定相同文件名时，写入的内容将会覆盖原文件内容；
  - `MODE_APPEND`：文件已存在，就在文件中追加内容，否则创建新文件。
- 返回`FileOutputStream`对象。

```kotlin
fun save(inputText: String) {
  try {
    val output = openFileOutput("data", Context.MODE_PRIVATE)
    val writer = BufferedWriter(OutputStreamWriter(output))
    // 保证在Lambda表达式中的代码执行完成后自动将外层的流关闭
    writer.use {
      it.write(inputText)
    }
  } catch(e: IOException) {
    e.printStackTrace()
  }
}
```

### 从文件中读取数据

`openFileInput(filename)`：从文件中读取数据。

- `filename`：要读取的文件名；
- 返回`FileInputStream`对象。

```kotlin
fun load() : String {
  val content = StringBuilder()
  try {
    val input = openFileInput("data")
    val reader = BufferedReader(InputStreamReader(input))
    reader.use {
      reader.forEachLine {
        content.append(it)
      }
    }
  } catch (e: IOException) {
    e.printStackTrace()
  }

  return content.toString()
}
```

## SharedPreferences

使用键值对的方式保存数据。支持多种不同的数据类型。

### 将数据保存到 SharedPreferences 中

- `Context`类中的`getSharedPreferences(filename, mode)`方法

  - `filename`：文件名，所有文件都默认保存到`/data/data/<package name>/shared_prefs/`目录下，文件不存在会自动创建
  - `mode`：操作模式；
    - `MODE_PRIVATE`：喝直接传入`0`的效果相同，表示只有当前的应用程序才可以对改文件进行读写。

- `Activity`类中的`getPreferences(mode)`方法, 自动将当前`Activity`的类名作为`SharedPreferences`文件名。
  - `getPreferences(mode)`获取`SharedPreferences`对象；

存储数据主要分为 3 步实现：

- 调用`SharedPreferences`对象的`edit()`方法获取一个`SharedPreferences.Editor`对象；
- 向`SharedPreferences.Editor`对象中添加数据；
- 调用`apply()`方法将添加的数据提交，完成数据存储操作

```kotlin
val editor = getSharedPreferences("data", Context.MODE_PRIVATE).edit()
editor.putString("name", "Tom")
editor.putInt("age", 28)
editor.putBoolean("married", false)
editor.apply()

// 简化用法
getSharedPreferences("data", Context.MODE_PRIVATE).edit {
  putString("name", "Tom")
  putInt("age", 28)
  putBoolean("married", false)
}
```

### 从 SharedPreferences 中读取数据

SharedPreferences 对象中提供了一系列的`get`方法，用于读取数据

这些`get`方法接收两个参数

- 第一个参数时键，存储数据时使用的键
- 第二个参数时默认值

### 使用高阶函数简化 SharedPreferences

```kotlin
fun SharedPreferences.open(block: SharedPreferences.Editor.() -> Unit) {
  val editor = edit()
  editor.block()
  editor.apply()
}

getSharedPreferences("data", Context.MODE_PRIVATE).open {
  putString("name", "Tom")
  putInt("age", 28)
  putBoolean("married", false)
}
```

## SQLite 数据库

SQLite 是一款轻量级关系数据库，运行速度快，占用资源少，特别适合在移动设备上使用。

SQLite 不仅支持标准的 SQL 语法，还遵循了数据库的 ACID 事务。

### 创建数据库

借助`SQLiteOpenHelper`帮助类（抽象类），可以非常简单的创建/升级数据库。

- `onCreate()`： 创建数据库；
- `onUpgrade()`：升级数据库；
- `getReadableDatabase()`：以只读的方式打开数据库（如果数据库已经存在则直接打开，否则要创建一个新的数据库）；
- `getWritableDatabase()`：已写入的方式打开数据库（如果数据库已经存在则直接打开，否则要创建一个新的数据库）；

```kotlin
class MyDatabaseHelper(val context: Context, name: String, version: Int) : SQLiteOpenHelper(context, name, null, version) {

  private val createBookTable = "create table Book (" +
          " id integer primary key autoincrement," +
          "author text," +
          "price real," +
          "pages integer," +
          "name text)"

  override fun onCreate(db: SQLiteDatabase) {
    db.execSQL(createBookTable)
    Toast.makeText(context, "Create succeeded", Toast.LENGTH_SHORT).show()
  }

  override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {}
}
```

### 升级数据库

当`SQLiteOpenHelper`中的版本号发生变化是，会调用`onUpgrade()`方法。

```kotlin
class MyDatabaseHelper(val context: Context, name: String, version: Int):
        SQLiteOpenHelper(context, name, null, version) {
    ...
    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // 如果数据库中已经存在Book表或Category表，就删除这两张表
        db.execSQL("drop table if exists Book")
        db.execSQL("drop table if exists Category")
        // 重新创建表
        onCreate(db)
    }

}
```

### 增删改查

`insert(table, nullColumnHack, values)`：添加数据

- `table`：表名，要添加数据的表；
- `nullColumnHack`：在未指定添加数据的情况下给某些可为空的列自动赋值 Null
- `values`：`ContentValues`对象，要添加的数据。

```kotlin
val db = dbHelper.writableDatabase
val values = ContentValues().apply {
  put("name", "The Da Vinci Code")
  put("author", "Dan Brown")
  put("pages", 454)
  put("price", 16.96)
}
db.insert("Book", null, values)
```

`update(table, values, whereClause, whereArgs)`：更新数据

- `table`：表名；
- `values`：`ContentValues`对象，更新的数据；
- 第三、第四个参数用于`where`查询。

```kotlin
val db = dbHelper.writableDatabase
val values = ContentValues()
values.put("price", 10.99)
// UPDATE Book SET price = 10.99 WHERE name = The Da Vinci Code
db.update("Book", values, "name = ?", arrayOf("The Da Vinci Code"))
```

**NOTE：** `?`是一个占位符，可以通过第四个参数提供的一个字符串数组未第三个参数中的每个占位符指定相应的内容。

`delete(table, whereClause, whereArgs)`：删除数据

```kotlin
val db = dbHelper.writableDatabase
db.delete("Book", "pages > ?", arrayOf("500"))
```

`query(table, columns, selection, selectionArgs, groupBy, having, orderBy)`：查询数据

- `table`：查询的表名；
- `columns`：查询的列，不指定则默认查询所有列；
- 第三、第四个参数用于约束查询某一行或某几行的数据，不指定则默认查询所有；
- `groupBy`：需要 group by 操作的列；
- `having`：对 group by 之后的数据进一步过滤；
- `orderBy`：指定排序方式；
- 返回一个 Cursor 对象，查询到的所有数据都将从这个对象中取出。

```kotlin
val db = dbHelper.writableDatabase
val cursor = db.query("Book", null, null, null, null, null, null)
with (cursor) {
  while (moveToNext()) {
    val name = getString(getColumnIndexOrThrow("name"))
  }
}
cursor.close()
```

### 直接使用 SQL 操作数据库

添加数据

```kotlin
db.execSQL("insert into Book (name, author, pages, price) values(?, ?, ?, ?)", arrayOf("The Da Vinci Code", "Dan Brown", "454", "16.96"))
```

更新数据

```kotlin
db.execSQL("update Book set price = ? where name = ?", arrayOf("10.99", "The Da Vinci Code"))
```

删除数据

```kotlin
db.execSQL("delete from Book where pages > ?", arrayOf("500"))
```

查询数据

```kotlin
val cursor = db.rawQuery("select * from Book", null)
```

### 事务

事务的特性可以保证让一系列操作要么全部完成，要么一个都不会完成。

```kotlin
val db = dbHelper.writableDatabase
db.beginTransaction() // 开启事务
try {
  db.delete("Book", null, null)
  val values = ContentValues().apply {
    put("name", "Game of Thrones")
    put("author", "George Martin")
    put("pages", 720)
    put("price", 20,85)
  }
  db.insert("Book", null, values)
  db.setTransactionSuccessful() // 事务已经执行成功
} catch (e) {
  e.printStackTrace()
} finally {
  db.endTransaction() // 结束事务
}
```

## Room

[官方推荐使用`Room`来操作 SQLite 数据库](https://developer.android.com/training/data-storage/room)

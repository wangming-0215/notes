# 手机多媒体

## 通知

通知渠道：每个应用程序可以自由地创建当前应用拥有哪些通知渠道，用户可以自由地选择通知渠道的重要程度，是否响铃、是否振动或者是否要关闭这个渠道的通知。

通知渠道一旦创建之后就不能再修改了，因此开发者需要仔细分析自己的应用程序一共有哪些类型的通知，然后再去创建相应的通知渠道。

Twitter 的通知渠道划分：

![](assets/014.png)

### 创建通知渠道的详细步骤

- 通过调用 Context 的`getSystemService()`方法获取`NotificationManager`

```kotlin
val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
```

- 使用`NotificationChannel`类构建一个通知渠道，并调用`NotificationManager`的`createNotificationChannel()`方法完成创建。
  `Notification(channelId, channelName, importance)`：

  - `channelId`：渠道 ID，全局唯一；
  - `channelName`: 渠道名称，给用户看的；
  - `importance`：通知的重要等级，`IMPORTANCE_HIGHT`, `IMPORTANCE_DEFAULT`, `IMPORTANCE_LOW`, `IMPORTANCE_MIN`

```kotlin
// NotificationChannel 类和 createNotificationChannel()方式是 Android 8.0 系统中新增的API，
// 需要进行版本判断
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  val channel = NotificationChannel(channelId, channelName, importance)
  manager.createNotificationChannel(channel)
}
```

### 通知的基本用法

通知可以在 Activity、BroadcastReceiver 以及 Service 中使用。
在 Activity 中创建通知的场景比较少，因为一般只有当程序进入后台的时候才会需要使用通知。

创建通知的步骤：

- 使用`Builder`构造器来创建`Notification`对象（使用 AndroidX 库中提供的兼容 API`NotificationCompat`类来保证程序在所有 Android 系统中都能正常工作）；

```kotlin
val notification = NotificationCompat.Builder(context, channelId)
    .setContentTitle("This is content title") // 通知标题
    .setContentText("This is content text") // 通知正文内容
    .setSmallIcon(R.drawable.small_icon) // 通知下图标
    .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.large_icon)) // 通知大图标
    .build()

// 发送通知
// 第一个参数是 id，要保证每个通知的 id 是不同的；
// 第二个参数是 Notification 对象
manager.notify(1, notification)
```

### PendingIntent

`PendingIntent`倾向于在某个合适的时机执行某个动作。也可以把`PendingIntent`简单地理解为延迟执行的 Intent。

给通知添加点击功能：

```kotlin
val intent = Intent(context, NotificationActivity::class.java)
val pi = PendingIntent.getActivity(this, 0, intent, 0)
val notification = NotificationCompat.Builder(this, "normal")
    .setContentTitle("This is content title")
    .setContentText("This is content text")
    .setSmallIcon(R.drawable.small_icon)
    .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.large_icon))
    .setContentIntent(pi)
    .build()
```

### 进阶技巧

`setStyle()`：构建富文本的通知内容

```kotlin
val notification = NotificationCompat.Builder(this, "normal")
        .setStyle(NotificationCompat.BigTextStyle().bigText("Learn how to build
        notifications, send and sync  data, and use voice actions. Get the official
        Android IDE and developer tools to build apps for Android."))
       .build()
```

通知渠道的重要等级越高，发出的通知就越容易获得用户的注意。比如高重要等级的通知渠道发出的通知可以弹出横幅、发出声音，而低等级的通知渠道发出的通知不仅可能会在某些情况下被隐藏，而且可能会被改变显示的顺序，将其排在更重要的通知之后。

开发者只能哎创建通知渠道的时候为它指定初始的重要等级，如果用户不认可这个重要等级的话，可以随时进行修改，爱发着对此无权再进行调整和变更，因为通知渠道一旦创建就不能再通过代码修改了。

## 调用摄像头和相册

### 调用摄像头

```kotlin
class MainActivity : AppCompatActivity() {
  val takePhoto = 1
  lateinit var imageUri: Uri
  lateinit var outputImage: File

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    takePhotoBtn.setOnClickListener {
      // 创建 File 对象，用于存储拍照后的照片
      // getExternalCacheDir() 获取应用关联缓存目录，专门用于存放当前应用缓存数据
      outputImage = File(externalCacheDir, "output_image.jpg")
      if (outputImage.exists()) {
        outputImage.delete()
      }
      outputImage.createNewFile()
      imageUri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        // Android 7.0系统开始，直接使用本地真实路径的Uri被认为是不安全的，会抛出
        // FileUriExposedException异常。
        // FileProvider 是一种特殊的ContentProvider, 它使用了和ContentProvider类似的机制
        // 来对数据进行保护，可以选择性地将封装过的 Uri 共享给外部，从而提高应用的安全性。

        FileProvider.getUriForFile(this, "com.example.app.fileprovider", outputImage)
      } else {
        Uri.fromFile(outputImage)
      }

      // 启动相机程序
      val intent = Intent("android.media.action.IMAGE_CAPTURE")
      intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri)
      startActivityForResult(intent, takePhoto)
    }
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    when (requestCode) {
      takePhoto -> {
        if (resultCode == Activity.RESULT_OK) {
          // 将拍摄照片显示出来
          val bitmap = BitmapFactory.decodeStream(contentResolver.openInputStream(imageUri))
          // 某些手机上照片可能发生旋转
          imageView.setImageBitmap(rotateIfRequired(bitmap))
        }
      }
    }
  }

  private fun rotateIfRequired(bitmap: Bitmap): Bitmap {
    val exif = ExifInterface(outputImage.path)
    val orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)

    return when (orientation) {
      ExifInterface.ORIENTATION_ROTATE_90 -> rotateBitmap(bitmap, 90)
      ExifInterface.ORIENTATION_ROTATE_180 -> rotateBitmap(bitmap, 180)
      ExifInterface.ORIENTATION_ROTATE_270 -> rotateBitmap(bitmap, 270)
      else -> bitmap
    }
  }

  private fun rotateBitmap(bitmap: Bitmap, degree: Int): Bitmap {
    val matrix = Matrix()
    matrix.postRotate(degree.toFloat())
    val rotatedBitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    bitmap.recycle() // 将不在需要的 Bitmap 对象回收
    return rotatedBitmap
  }
}
```

在 AndroidManifest.xml 中注册 FileProvider

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="com.example.cameraalbumtest.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>

<!-- file_paths.xml -->
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 指定Uri共享路径，name 随便填，path表示共享的具体路径 -->
    <external-path name="my_images" path="/" />
</paths>
```

### 从相册中选择图片

```kotlin
class MainActivity : AppCompatActivity() {
  val fromAlbum = 2

  override fun onCreate(savedInstanceState: Bundle?) {
    fromAlbumBtn.setOnClickListener {
      // 打开文件选择器
      val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
      intent.addCategory(Intent.CATEGORY_OPENABLE)
      // 指定只显示图片
      intent.type = "image/*"
      startActivityForResult(intent, fromAlbum)
    }
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    when(requestCode) {
      fromAlbum -> {
        if (resultCode == Activity.RESULT_OK && data != null) {
          data.data?.let { uri ->
            // 将选择的图片显示出来
            val bitmap = contentResolver.openFileDescriptor(uri, "r")?.use {
              BitmapFactory.decodeFileDescriptor(it.fileDescriptor)
            }
            imageView.setImageBitmap(bitmap)
          }
        }
      }
    }
  }
}
```

## 播放多媒体文件

### 播放音频

在 Android 中播放音频文件一般是使用 `MediaPlayer`类实现的。

`MediaPlayer` 类中较为常用的控制方法。

| 方法名          | 功能描述                                              |
| --------------- | ----------------------------------------------------- |
| setDataSource() | 设置要播放的音频文件的位置                            |
| prepare()       | 在开始播放之前调用，以完成准备工作                    |
| start()         | 开始或继续播放音频                                    |
| pause()         | 暂停播放音频                                          |
| reset()         | 将 MediaPlayer 对象重置到刚刚创建的状态               |
| seekTo()        | 从指定的位置开始播放音频                              |
| stop()          | 停止播放音频。调用后的 MediaPlayer 对象无法再播放音频 |
| release()       | 释放与 MediaPlayer 对象相关的资源                     |
| isPlaying()     | 判断当前 MediaPlayer 是否正在播放音频                 |
| getDuration()   | 获取载入的音频文件的时长                              |

工作流程：

- 首先需要创建一个 `MediaPlayer` 对象；
- 然后调用`setDataSource()`方法设置音频文件路径；
- 再调用`prepare()`方法使`MediaPlayer`对象进入准备状态；
- 接下来调用`start()`方法开始播放音频，调用`pause`方法暂停播放，调用`reset()`方法停止播放。

```kotlin
class MainActivity : AppCompatActivity() {
  private val mediaPlayer = MediaPlayer()

  override fun onCreate(savedInstance: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    initMediaPlayer()
    play.setOnClickListener {
      if (!mediaPlayer.isPlaying) {
        mediaPlayer.start() // 开始播放
      }
    }

    pause.setOnClickListener {
      if (mediaPlayer.isPlaying) {
        mediaPlayer.pause() // 暂停播放
      }
    }

    stop.setOnClickListener {
      if (mediaPlayer.isPlaying) {
        mediaPlayer.reset() // 停止播放
        initMediaPlayer()
      }
    }
  }

  private fun initMediaPlayer() {
    val assetManager = assets;
    val fd = assetManager.openFd("music.mp3")
    mediaPlayer.setDataSource(fd.fileDescriptor, fd.startOffset, fd.length)
    mediaPlayer.prepare()
  }

  override fun onDestroy(){
    super.onDestroy()
    mediaPlayer.stop()
    mediaPlayer.release()
  }
}
```

### 播放视频

在 Android 中播放音频文件一般是使用 `VideoView`类实现的。

`VideoView` 类中较为常用的控制方法。

| 方法名         | 功能描述                    |
| -------------- | --------------------------- |
| setVideoPath() | 设置要播放的视频文件的位置  |
| start()        | 开始或继续播放视频          |
| pause()        | 暂停播放视频                |
| resume()       | 将视频从头开始播放          |
| seekTo()       | 从指定的位置开始播放视频    |
| isPlaying()    | 判断当前是否正在播放视频    |
| getDuration()  | 获取载入的视频文件的时长    |
| suspend()      | 释放 VideoView 所占用的资源 |

```kotlin
class MainActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    val uri = Uri.parse("android.resource://$packageName/${R.raw.video}")
    videoView.setVideoURI(uri)
    play.setOnClickListener {
      if (!videoView.isPlaying) {
        videoView.start()
      }
    }

    pause.setOnClickListener {
      if (videoView.isPlaying) {
        videoView.pause() // 暂停播放
      }
    }

    replay.setOnClickListener {
      if (videoView.isPlaying) {
        videoView.resume() // 重新播放
      }
    }
  }

  override fun onDestroy() {
    super.onDestroy()
    videoView.suspend()
  }
}
```

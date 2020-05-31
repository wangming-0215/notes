# 二分查找和大 O 表示法

## 二分查找

> 二分查找是一种算法,其输入是一个**有序列表**.从列表中间元素开始查找,如果中间元素大于被查找元素,则从左边中间继续查找,否则从右边中间元素继续查找,以此类推.如果要查找的元素包含在列表中,则返回其位置,否则返回 null.

时间复杂度: O($log_2$)

实现:

```python
def binary_search(list, item):
	low = 0
    high = len(list) - 1
    while low <= hight:
    	mid = (low + high) / 2
        guess = list[mid]

        if guess == item:
        	return mid

        if guess > item:
        	high = mid - 1
       	else:
        	low = mid + 1
    return None
```

```js
function binarySearch(list, item) {
  let low = 0;
  let high = list.length - 1;
  while (low <= hight) {
    mid = ~~(low + high) / 2; // 取整
    guess = list[mid];
    if (guess == item) {
      return mid;
    }
    if (guess > item) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return null;
}
```

## 大 O 表示法

> *大 O 表示法*是一种特殊的表示法,(1) 指出了算法的速度有多快.(2) 指出了算法运行时间的增速. (3) 指出了最糟情况下的运行时间.

一些常见的大 O 运行时间（从快到慢顺序）：

1. **O($log_2{n}$)**: 也叫*对数时间*，算法包括二分查找法等。
2. **O($n$)**: 也叫*线性时间*, 这样的算法包括简单查找。
3. **O($n*log_2{n}$)**: 快速排序。
4. **O($n^2$)**: 选择排序。
5. **O($n!$)**

启示：

- 算法的速度指的并非时间，而是操作数的增速；
- 谈论算法的速度时，我们说的是随着输入的增加，其运行时间在以什么样的速度增加；
- 算法的运行时间用大 O 表示法表示；
- O($log_2{n}$)比 O( n\$)快，当需要搜索的元素越多时，前者比后者快得越多。

## 总结

- 二分查找的速度比简单茶杂环哦快得多；
- O($log_2{n}$)比 O($n$)快。需要搜索的元素越多，前者比后者就快得越多。
- 算法运行时间并不是以秒为单位。
- 算法运行时间是从其增速的角度度量的。
- 算法运行时间用大 O 表示法表示。

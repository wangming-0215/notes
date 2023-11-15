void main() {
// 读取元素
  Iterable<int> items1 = [1, 2, 3];
  int item1 = items1.elementAt(1);
  print('item1: $item1');

  for (final item in items1) {
    print('item: $item');
  }

  print('first: ${items1.first}');
  print('last: ${items1.last}');

  int foundItem1 = items1.firstWhere((element) => element >= 2);
  print('Found item: $foundItem1');

  int foundItem2 = [1].singleWhere((element) => element >= 2, orElse: () => -1);
  print('Found item: $foundItem2');

  Iterable<String> items2 = ['Salad', 'Popcorn', 'Toast'];
  if (items2.any((element) => element.contains('a'))) {
    print('At least one item contains "a"');
  }

  if (items2.every((element) => element.length >= 5)) {
    print('All items have length >= 5');
  }

  if (items2.any((element) => element.contains('Z'))) {
    print('At least one item contains "Z"');
  } else {
    print('No item contains "Z"');
  }

  var evenNumbers = const [1, -2, 3, 42].where((number) => number.isEven);
  print('Even numbers: $evenNumbers');
}

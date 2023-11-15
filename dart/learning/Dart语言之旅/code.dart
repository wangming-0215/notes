void main() {
  var value = 0x22;
  print(-0x03);
  print(0xffffffffffffffd);
  print((-value >>> 4) == 0x0ffffffffffffffd);
}

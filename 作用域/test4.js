debugger
var x = 1
function foo(x, y = function () { x = 2 }) {
  var x = 3
  y()
  console.log(x)
}
foo()
console.log(x)



// var x = 1
// function foo(x = 3, y = function () { x = 2 }) {
//   var x
//   y()
//   console.log(x)
// }
// foo()
// console.log(x)
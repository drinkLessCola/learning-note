debugger;
var global='window';
function foo(a){
    console.log(a);
    console.log(global);
    var b;
}
var fn=function(){};
console.log(fn);
foo(123);
console.log(b);

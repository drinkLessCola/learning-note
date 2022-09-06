var global='window';
function foo(name,sex){
    console.log(name);
    function name(){};
    console.log(name);
    var nums=123;
    function nums(){};
    console.log(nums);
    var fn=function(){};
    console.log(fn);
}
debugger
foo('html');
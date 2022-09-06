
var a = 2;
let x = 1;
const y = 5;

function foo() {
    console.log(a);

    function bar() {
        var b = 3;
        console.log(a * b);
    }

    bar();
}
function baz() {
    var a = 10;
    foo();
}
baz();


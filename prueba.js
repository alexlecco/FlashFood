a = [1, 2, 3, 4]
console.log(a)

f = x => x*x*x

function f(x) {
  return x*x*x
}

var f = function(x){
  return x*x*x;
}

const f = (x) => x*x*x


b = a.map( f )
console.log(b)

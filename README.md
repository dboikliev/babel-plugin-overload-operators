# babel-operators

This projects builds a babel compiler plugin allowing users to write more consise and readable code through the use of operator overloading.

## Supported operators 

Binary:
`+, -, *, /, %, |, &, ^, ||, &&, ==, ===, !=, !==, >, <, >=, <=, >>, <<`

Unary:
`+, -, ++, --, ~, !, typeof, void`

*Assignment:
`+=, *=, /=, %=, |=, &=, ^= >>=, <<=`


*Note on assignement operators:
You cannot overload these operators directly. They are automatically supported 
once you implement an overload for their counterpart binary operator. For example if
you implement `binary.+` you will be taking advantage of that operator when you use
`lhs += rhs` as that will be turned to an expression of form `lhs = operation(lhs, rhs, 
'+')`.

## Usage

To overload an operator declare a static function in your class with a key `Symbol.for(op)`  where `op` is an the operator
prefixed with either `unary.` or `binary.`. 

```javascript
class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    
    static 'binary.+'(v1, v2) {
      return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    
    static 'binary.-'(v1, v2) {
      return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
  
    static 'binary.*'(v, scale) {
      if (typeof scale !== 'number') {
        throw Error(`Cannot scale vector by a non-numeric factor '${scale}'`);
      }
      return new Vector(-v.x * scale, -v.y * scale);
    }
  
    static 'unary.-'(v) {
      return new Vector(-v.x, -v.y);
    }
 }

let v = new Vector(1, 5);
console.log(v * 5); // Vector { x: -5, y: -25 }
console.log(-v); // Vector { x: -1, y: -5 }
```

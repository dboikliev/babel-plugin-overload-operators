# babel-operators

This projects builds a babel compiler plugin allowing users to write more consise and readable code through the use of operator overloading.

## Supported operators 

**Binary:**
`+, -, *, /, %, |, &, ^, ||, &&, ==, ===, !=, !==, >, <, >=, <=, >>, <<, instanceof`

**Unary:**
`+, -, ++, --, ~, !, typeof, void`

**&ast;Assignment:**
`+=, *=, /=, %=, |=, &=, ^= >>=, <<=`


**&ast;Note on assignement operators**:
You cannot overload these operators directly. They are automatically supported once you implement an overload for their counterpart binary operator. For example if you implement `binary.+` you will be taking advantage of that operator when you use `lhs += rhs` as that will be turned to an expression of form `lhs = operation(lhs, rhs, '+')`.

## Usage

To overload an operator declare a static function in your class with a key `binary.op` or `unary.op` where `op` is an the operator
being overloaded, for example: `binary.+` to overload the binary plus operator. 

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

## Controlling the naming convention

By default the plugin expects keys for binary operators to be prefixed with 'binary' and keys for unary operators - with 'unary'. Users can supply options to change these prefixes. You can control through the plugin options by passing and object with a key 'prefixes' which has two propertires - 'binary' and 'unary' representing the binary and unary prefixes, for example:

```javascript
{
    "prefixes": {
        "binary": "b",
        "unary": "u"
    }
}
```

This will make the plugin look for functions with keys `b.op` and `u.op`, for example `b.+' for the binary plus operator.
This can be useful to prevent clashes with preexisting naming conventions in your code.

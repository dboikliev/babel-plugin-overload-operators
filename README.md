# babel-plugin-operator-overloading

This projects builds a babel compiler plugin allowing users to write more consise and readable code through the use of operator overloading.

## Supported operators

**Binary:**
`+, -, *, /, %, |, &, ^, ||, &&, ==, ===, !=, !==, >, <, >=, <=, >>, <<, **, instanceof, in`

**Unary:**
`+, -, ++, --, ~, !, typeof, void`

**&ast;Assignment:**
`+=, *=, /=, %=, |=, &=, ^=, >>=, <<=`

**&ast;Note on assignement operators**:
You cannot overload these operators directly. They are automatically supported once you implement an overload for their counterpart binary operator. For example if you implement `binary.+` you will be taking advantage of that operator when you use `lhs += rhs` as that will be turned to an expression of form `lhs = operation(lhs, rhs, 'binary.+')`.

## Installation

`npm install babel-operator-overloading`

## Usage

In your `.babelrc` add the folllowing:`"plugins": ["babel-operator-overloading"]`

## Examples

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

  static 'binary.*'(a, b) {
    if (typeof a === 'number' && typeof b === 'Vector') {
      let scale = a;
      let vector = b;
      return new Vector(vector.x * scale, vector.y * scale);
    }

    if (typeof a === 'Vector' && typeof b === 'number') {
      let scale = b;
      let vector = a;
      return new Vector(vector.x * scale, vector.y * scale);
    }

    if (typeof a === 'Vector') {
      throw Error(`Cannot scale vector by a non-numeric factor '${b}'`);
    }

    if (typeof b === 'Vector') {
      throw Error(`Cannot scale vector by a non-numeric factor '${a}'`);
    }
  }

  static 'unary.-'(v) {
    return new Vector(-v.x, -v.y);
  }

  static 'unary.typeof'(v) {
    return this.name;
  }

  toString() {
    return `Vector { x: ${this.x}, y: ${this.y} }`;
  }
}

try {
  let v = new Vector(1, 5);
  console.log(v); // Vector { x: 1, y: 5 }
  console.log(-v); // Vector { x: -1, y: -5 }
  console.log(v + v) // Vector { x: 2, y: 10 }
  console.log(v * 5); // Vector { x: 5, y: 25 }
  console.log(5 * v); // Vector { x: 5, y: 25 }
  console.log(typeof v === 'Vector'); // true
  console.log(v * {});
} catch (error) {
  console.log(error); // Error: Cannot scale vector by a non-numeric factor '[object Object]'
}
```

## Controlling the naming convention

By default the plugin expects keys for binary operators to be prefixed with `binary` and keys for unary operators - with `unary`. Users can supply options to change these prefixes. You can control through the plugin options by passing and object with a key `prefixes` which has two propertires - `binary` and `unary` representing the binary and unary prefixes, for example:

```javascript
{
    "prefixes": {
        "binary": "b",
        "unary": "u"
    }
}
```

This will make the plugin look for functions with keys `b.op` and `u.op`, for example `b.+` for the binary plus operator.
This can be used to prevent clashes with preexisting naming conventions in your code.

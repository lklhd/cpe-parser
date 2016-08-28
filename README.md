[![Build Status](https://travis-ci.org/lklhd/cpe-parser.svg?branch=master)](https://travis-ci.org/lklhd/cpe-parser)

Creative Property Expression Parser/Evaluator
=============================================

`cpe-parser` is a Javascript package for parsing and evaluating
Creative Property Expressions (CPEs). CPEs are used to represent text
strings that may embed dynamic data or perform simple arithmetic
calculations.

The most common use case for CPEs is to templatize an otherwise static
text string. Consider the following strings:

```
See other dresses like this.
See other shoes like this.
See other accessories like this.
```

If there is a dataset of similar products with categories, you might
want to replace the category name above with a reference to that
dataset using a CPE:

```
See other {{similarProducts[1].categoryName}} like this.
```

In the example CPE above, an embedded expression (surrounded by `{{`
and `}}`) references a dataset called similarProducts. When evaluated,
it will be replaced with the categoryName attribute from the first
item in the similarProducts dataset.

CPEs can also do simple arithmetic. For example:

```
{{deals[1].name}} expires in less than {{deals[1].lifetimeHours * 60}} minutes!
```

## Installation

To install via NPM:

```
npm install --save cpe-parser
```

## Usage

To evaluate a CPE:

```javascript
var cpeParser = require('cpe-parser');

var result = cpeParser.evaluate.fromString('One plus two equals {{1 + 2}}.');

console.log(result);
// "One plus two equals 3."
```

Evaluating within an environment:

```javascript
var env = {
  queries: {
    fruit: [
      { name: 'apple' },
      { name: 'banana' }
    ]
  }
};

var result = cpeParser.evaluate.fromString(
  'I love {{fruit[1].name}}s and {{fruit[2].name}}s!',
  env
);

console.log(result);
// "I love apples and bananas!"
```

{
  function normalize (ast) {
    if (Array.isArray(ast)) {
      const flattenedAst = ast.filter((e) => e !== '').reduce((a, e) => a.concat(e), [])
      if (flattenedAst.length === 0) {
        return ''
      }
      if (flattenedAst.length === 1) {
        return flattenedAst[0]
      }
      return flattenedAst
    }

    return ast
  }
}

Start
  = CreativePropertyExpression

CreativePropertyExpression
  = first : StringLiteral rest : EmbeddedCodeFollowedByStringLiteral * {
    return normalize([first].concat(normalize(rest)))
  }

StringLiteral
  = chars : CharacterLiteral * {
    return chars.join('')
  }

CharacterLiteral
  = ! EmbeddedCode char : . {
    return char
  }

EmbeddedCodeFollowedByStringLiteral
  = first : EmbeddedCode second : StringLiteral {
    return normalize([first, second])
  }

EmbeddedCode
  = "{{" code : Code "}}" {
    return code
  }

Code
  = Whitespace string : QuotedString Whitespace {
    return string
  }
  / Whitespace code : AdditionFollowedByWhitespace * {
    return normalize(code)
  }

Whitespace
  = ' ' * {
    return ''
  }

AdditionFollowedByWhitespace
  = first : Addition Whitespace {
    return first
  }

Addition
  = left : DataRef Whitespace operator : [+-] Whitespace right : Addition {
    return {
      type: operator,
      left: left,
      right: right
    }
  }
  / Multiplication

Multiplication
  = left : DataRef Whitespace operator : [*/] Whitespace right: Multiplication {
    return {
      type: operator,
      left: left,
      right: right
    }
  }
  / DataRef

DataRefFollowedByWhitespace
  = first : DataRef Whitespace {
    return first
  }

DataRef
  = query : DataRefIdentifier "[" rank : DataRefRank "]." field : DataRefField {
    return {
      type: 'ref',
      name: query,
      rank: rank,
      field: field
    }
  }
  / Operand

DataRefIdentifier
  = Identifier

Identifier
  = first : [_a-zA-Z] rest : [_a-zA-Z0-9] * {
    return [first].concat(rest).join('')
  }

DataRefRank
  = first : [1-9] rest : [0-9] * {
    return parseInt([first].concat(rest).join(''))
  }

DataRefField
  = Identifier

Operand
  = NumberLiteral
  / "(" Whitespace expr : Addition Whitespace ")" {
    return expr
  }

NumberLiteral
  = IntegerLiteral

IntegerLiteral
  = sign : [+-] ? first : [1-9] rest : [0-9] * {
    const unsignedInt = parseInt([first].concat(rest).join(''))
    return sign === '-' ? -unsignedInt : unsignedInt
  }
  / [0] {
    return 0
  }

QuotedString
  = DoubleQuotedString

DoubleQuotedString
  = '"' chars : DoubleQuotedCharacter * '"' {
    return chars.join('')
  }

DoubleQuotedCharacter
  = "\\\\" {
    return '\\'
  }
  / '\\"' {
    return '"'
  }
  / [^"]

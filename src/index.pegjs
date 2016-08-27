Start = CreativePropertyExpression

CreativePropertyExpression = first : StringLiteral rest : EmbeddedCodeFollowedByStringLiteral * {
  const nested = [first === '' ? [] : first].concat(rest)
  const flattened = nested.reduce((f, e) => f.concat(e), [])
  if (flattened.length === 0) {
    return ''
  }
  if (flattened.length === 1) {
    return flattened[0]
  }
  return flattened
}

StringLiteral = chars : CharacterLiteral * {
  return chars.join('')
}

CharacterLiteral = ! EmbeddedCode char : . {
  return char
}

EmbeddedCodeFollowedByStringLiteral = first : EmbeddedCode second : StringLiteral {
  if (second === '') {
    return first
  }
  return [first, second]
}

EmbeddedCode = "{{" code : Code "}}" { return code }

Code = DataRef

DataRef = query : DataRefIdentifier "[" rank : DataRefRank "]." field : DataRefField {
  return {
    type: 'ref',
    name: query,
    rank: rank,
    field: field
  }
}

DataRefIdentifier = Identifier

Identifier = first : [_a-zA-Z] rest : [_a-zA-Z0-9] * {
  return [first].concat(rest).join('')
}

DataRefRank = first : [1-9] rest : [0-9] * {
  return parseInt([first].concat(rest).join(''))
}

DataRefField = Identifier

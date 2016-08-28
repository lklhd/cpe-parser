const environment = require('./environment')

/**
 * Evaluates an AST for a Creative Property Expression (CPE)
 * in an environment.
 *
 * @param ast Abstract syntax tree of a CPE to evaluate.
 * @param env Environment to evaluate the AST in.
 */
function evaluateAST (ast, env) {
  function recurse (ast) {
    return evaluateAST(ast, env)
  }

  if (typeof ast === 'string') {
    return ast
  }
  if (typeof ast === 'number') {
    return ast
  }
  if (Array.isArray(ast)) {
    return ast.reduce((a, e) => [a].concat(recurse(e)).join(''), '')
  }
  if (typeof ast === 'object') {
    switch (ast.type) {
      case 'ref':
        if (typeof ast.name !== 'string' ||
            !Number.isInteger(ast.rank) ||
            ast.rank - 1 < 0 ||
            typeof ast.field !== 'string') {
          throw new Error(`Could not evaluate invalid AST: ${JSON.stringify(ast)}`)
        }
        return environment.query(env)(ast.name, ast.rank, ast.field)
      case '+':
        return Number(recurse(ast.left)) + Number(recurse(ast.right))
      case '-':
        return recurse(ast.left) - recurse(ast.right)
      case '*':
        return recurse(ast.left) * recurse(ast.right)
      case '/':
        return recurse(ast.left) / recurse(ast.right)
    }
  }

  throw new Error(`Could not evaluate unrecognized AST: ${JSON.stringify(ast)}`)
}

module.exports = function (parse) {
  return {
    fromString: (string, env) => evaluateAST(parse(string), env),
    fromAST: evaluateAST
  }
}

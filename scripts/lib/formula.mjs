/**
 * Quantity formulas in package_item.qty_formula.
 * Grammar: numbers, variable keys, + - * / ( ), and min/max/ceil/floor/round.
 * Parsed with a small recursive-descent parser — no eval, so a malformed or
 * hostile formula fails loudly at validation time instead of running.
 */

const FUNCS = {
  min: Math.min, max: Math.max,
  ceil: Math.ceil, floor: Math.floor, round: Math.round,
};

function tokenize(src) {
  const tokens = [];
  const re = /\s*(?:([0-9]*\.?[0-9]+)|([A-Za-z_][A-Za-z0-9_]*)|([-+*/(),]))/y;
  let pos = 0;
  while (pos < src.length) {
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m) throw new Error(`unexpected character at offset ${pos}: ${JSON.stringify(src.slice(pos, pos + 8))}`);
    pos = re.lastIndex;
    if (m[1] !== undefined) tokens.push({ t: 'num', v: Number(m[1]) });
    else if (m[2] !== undefined) tokens.push({ t: 'name', v: m[2] });
    else tokens.push({ t: m[3] });
  }
  return tokens;
}

export function parse(src) {
  const tokens = tokenize(src);
  let i = 0;
  const peek = () => tokens[i];
  const eat = (t) => {
    if (!tokens[i] || tokens[i].t !== t) throw new Error(`expected ${t} at token ${i} in ${JSON.stringify(src)}`);
    return tokens[i++];
  };

  const primary = () => {
    const tok = peek();
    if (!tok) throw new Error(`unexpected end of formula ${JSON.stringify(src)}`);
    if (tok.t === 'num') { i++; return { k: 'num', v: tok.v }; }
    if (tok.t === '(') { i++; const e = expr(); eat(')'); return e; }
    if (tok.t === '-') { i++; return { k: 'neg', a: primary() }; }
    if (tok.t === 'name') {
      i++;
      if (peek()?.t === '(') {
        if (!(tok.v in FUNCS)) throw new Error(`unknown function ${tok.v}()`);
        i++;
        const args = [];
        if (peek()?.t !== ')') { args.push(expr()); while (peek()?.t === ',') { i++; args.push(expr()); } }
        eat(')');
        return { k: 'call', fn: tok.v, args };
      }
      return { k: 'var', name: tok.v };
    }
    throw new Error(`unexpected token ${tok.t} in ${JSON.stringify(src)}`);
  };

  const term = () => {
    let left = primary();
    while (peek()?.t === '*' || peek()?.t === '/') { const op = tokens[i++].t; left = { k: 'bin', op, a: left, b: primary() }; }
    return left;
  };
  const expr = () => {
    let left = term();
    while (peek()?.t === '+' || peek()?.t === '-') { const op = tokens[i++].t; left = { k: 'bin', op, a: left, b: term() }; }
    return left;
  };

  const ast = expr();
  if (i !== tokens.length) throw new Error(`trailing input in formula ${JSON.stringify(src)}`);
  return ast;
}

export function variablesUsed(ast, acc = new Set()) {
  switch (ast.k) {
    case 'var': acc.add(ast.name); break;
    case 'neg': variablesUsed(ast.a, acc); break;
    case 'bin': variablesUsed(ast.a, acc); variablesUsed(ast.b, acc); break;
    case 'call': ast.args.forEach((a) => variablesUsed(a, acc)); break;
  }
  return acc;
}

export function evaluate(ast, scope) {
  switch (ast.k) {
    case 'num': return ast.v;
    case 'var': {
      if (!(ast.name in scope)) throw new Error(`unknown variable ${ast.name}`);
      return Number(scope[ast.name]);
    }
    case 'neg': return -evaluate(ast.a, scope);
    case 'bin': {
      const a = evaluate(ast.a, scope), b = evaluate(ast.b, scope);
      if (ast.op === '/' && b === 0) throw new Error('division by zero');
      return ast.op === '+' ? a + b : ast.op === '-' ? a - b : ast.op === '*' ? a * b : a / b;
    }
    case 'call': return FUNCS[ast.fn](...ast.args.map((a) => evaluate(a, scope)));
  }
  throw new Error(`unhandled node ${ast.k}`);
}

export const evalFormula = (src, scope) => evaluate(parse(src), scope);

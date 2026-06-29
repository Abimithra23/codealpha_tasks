const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

let current = '0';      // what's shown on main display
let expression = '';    // full expression string
let justEvaluated = false;

function updateDisplay(value, expr = '') {
  // Shrink font for long numbers
  resultEl.classList.remove('error');
  resultEl.style.fontSize = value.length > 12 ? '22px' : value.length > 9 ? '28px' : '40px';
  resultEl.textContent = value;
  expressionEl.textContent = expr;
}

function handleDigit(val) {
  if (justEvaluated) {
    // Start fresh after evaluation unless it's a digit continuing
    current = val === '.' ? '0.' : val;
    expression = current;
    justEvaluated = false;
  } else {
    if (val === '.' && current.includes('.')) return;
    if (current === '0' && val !== '.') {
      current = val;
    } else {
      current += val;
    }
    // Replace last number in expression with updated current
    expression = expression.replace(/(\d*\.?\d*)$/, current) || current;
    if (!expression) expression = current;
  }
  updateDisplay(current, expression);
}

function handleOperator(op) {
  justEvaluated = false;
  const ops = ['+', '-', '*', '/'];

  if (expression === '' && current === '0' && op === '-') {
    // Allow leading negative
    current = '-';
    expression = '-';
    updateDisplay(current, expression);
    return;
  }

  // If last char is already an operator, replace it
  if (ops.includes(expression.slice(-1))) {
    expression = expression.slice(0, -1) + op;
  } else {
    if (expression === '') expression = current;
    expression += op;
  }

  current = '0';
  updateDisplay(formatOp(op), expression);
}

function formatOp(op) {
  return { '*': '×', '/': '÷', '+': '+', '-': '−' }[op] || op;
}

function evaluate() {
  if (!expression || expression === '') return;

  // Clean trailing operator
  let expr = expression.replace(/[+\-*/]$/, '');
  if (!expr) return;

  expressionEl.textContent = expr + ' =';

  try {
    // Safe eval using Function
    // eslint-disable-next-line no-new-func
    let result = Function('"use strict"; return (' + expr + ')')();

    if (!isFinite(result)) {
      resultEl.classList.add('error');
      resultEl.textContent = 'Error';
      current = '0';
      expression = '';
      return;
    }

    // Round floating point noise
    result = parseFloat(result.toPrecision(12));
    current = String(result);
    expression = current;
    justEvaluated = true;
    updateDisplay(current, expr + ' =');
  } catch {
    resultEl.classList.add('error');
    resultEl.textContent = 'Error';
    current = '0';
    expression = '';
  }
}

function clearAll() {
  current = '0';
  expression = '';
  justEvaluated = false;
  updateDisplay('0', '');
}

function backspace() {
  if (justEvaluated) { clearAll(); return; }
  if (current.length <= 1 || (current.length === 2 && current[0] === '-')) {
    current = '0';
  } else {
    current = current.slice(0, -1);
  }
  // Remove last char from expression too
  if (expression.length > 0) {
    expression = expression.slice(0, -1);
  }
  updateDisplay(current, expression);
}

// Button click handler
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'equals') evaluate();
    else if (['+', '-', '*', '/'].includes(value)) handleOperator(value);
    else handleDigit(value);
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  const key = e.key;

  if (key >= '0' && key <= '9') { flashKey(key); handleDigit(key); }
  else if (key === '.') { flashKey('.'); handleDigit('.'); }
  else if (key === '+') { flashKey('+'); handleOperator('+'); }
  else if (key === '-') { flashKey('-'); handleOperator('-'); }
  else if (key === '*') { flashKey('*'); handleOperator('*'); }
  else if (key === '/') { e.preventDefault(); flashKey('/'); handleOperator('/'); }
  else if (key === 'Enter' || key === '=') { flashBtn('[data-action="equals"]'); evaluate(); }
  else if (key === 'Backspace') { flashBtn('[data-action="backspace"]'); backspace(); }
  else if (key === 'Escape' || key === 'c' || key === 'C') { flashBtn('[data-action="clear"]'); clearAll(); }
});

function flashKey(val) {
  const btn = document.querySelector(`[data-value="${val}"]`);
  if (btn) flashBtn(null, btn);
}

function flashBtn(selector, el = null) {
  const btn = el || document.querySelector(selector);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 150);
}

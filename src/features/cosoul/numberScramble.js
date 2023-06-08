/* eslint-disable */

// ——————————————————————————————————————————————————
// NumberScramble
// ——————————————————————————————————————————————————

function generateRandomNumberInRange(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function generateRandomNumber(digits) {
  if (digits == 4) {
    return generateRandomNumberInRange(9999, 1000);
  } else if (digits == 3) {
    return generateRandomNumberInRange(999, 100);
  } else if (digits == 2) {
    return generateRandomNumberInRange(99, 10);
  } else {
    return generateRandomNumberInRange(9, 1);
  }
}

class NumberScramble {
  constructor(el) {
    this.el = el;
    this.chars = '1234567890????';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export function startNumberScramble(targetClass) {
  const els = document.querySelectorAll(targetClass);
  els.forEach(el => {
    const fx = new NumberScramble(el);
    const digits = el.getAttribute('data-digits');
    const next = () => {
      if (digits == '3') {
        fx.setText(generateRandomNumber(3).toString()).then(() => {
          setTimeout(next, 0);
        });
      } else if (digits == '2') {
        fx.setText(generateRandomNumber(2).toString()).then(() => {
          setTimeout(next, 0);
        });
      } else {
        fx.setText(generateRandomNumber(1).toString()).then(() => {
          setTimeout(next, 0);
        });
      }
    };
    next();
  });
}

const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../src/game/mosslight.ts'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

assert(source.includes("easy: 10"), 'easy habits should grant 10 growth');
assert(source.includes("medium: 20"), 'medium habits should grant 20 growth');
assert(source.includes("hard: 30"), 'hard habits should grant 30 growth');
assert(source.includes('if (streakDays >= 365) return 3'), '365-day streak should return 3x');
assert(source.includes("{ level: 100, name: 'Living Paradise' }"), 'level 100 Living Paradise expansion should exist');
assert(source.includes("{ level: 30, reward: 'Ancient Forest' }"), 'forest level 30 Ancient Forest reward should exist');
console.log('Mosslight logic source checks passed.');

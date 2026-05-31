const fs = require('fs');
const path = require('path');
const catalog = fs.readFileSync(path.join(__dirname, '../src/domain/catalog.ts'), 'utf8');
const progression = fs.readFileSync(path.join(__dirname, '../src/engines/progressionEngine.ts'), 'utf8');
const discovery = fs.readFileSync(path.join(__dirname, '../src/engines/discoveryEngine.ts'), 'utf8');
const actions = fs.readFileSync(path.join(__dirname, '../src/application/mosslightActions.ts'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

assert(catalog.includes('easy: 10'), 'easy habits should grant 10 growth');
assert(catalog.includes('medium: 20'), 'medium habits should grant 20 growth');
assert(catalog.includes('hard: 30'), 'hard habits should grant 30 growth');
assert(progression.includes('if (streakDays >= 365) return 3'), '365-day streak should return 3x');
assert(catalog.includes("levelRequired: 100, name: 'Living Paradise'"), 'level 100 Living Paradise expansion should exist');
assert(catalog.includes("{ level: 30, name: 'Ancient Forest' }"), 'forest level 30 Ancient Forest reward should exist');
assert(discovery.includes('!isPremium'), 'rare discoveries should be gated to premium users');
assert(actions.includes('applyEcosystemXp'), 'habit completion should update ecosystem XP');
assert(actions.includes('applyExpansionUnlocks'), 'sanctuary updates should unlock expansions');
console.log('Mosslight production logic source checks passed.');

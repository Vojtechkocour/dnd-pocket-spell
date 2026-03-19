#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[''\/]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function convertCastingTime(spell) {
  if (spell.castingTime) return spell.castingTime;
  switch (spell.actionType) {
    case 'action': return '1 action';
    case 'bonusAction': return '1 bonus action';
    case 'reaction':
      if (spell.castingTrigger) return `1 reaction, ${spell.castingTrigger}`;
      return '1 reaction';
    default: return '1 action';
  }
}

function convertComponents(spell) {
  const comps = spell.components || [];
  const result = {
    verbal: comps.includes('v'),
    somatic: comps.includes('s'),
    material: comps.includes('m'),
  };
  if (result.material && spell.material) {
    result.materialDescription = spell.material;
  }
  return result;
}

const inputPath = path.join(__dirname, 'srd-5.2-spells.json');
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'spells.json');

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const output = input.map(spell => {
  let description = spell.description;
  if (spell.cantripUpgrade) {
    description = description + '\n\nCantrip Upgrade: ' + spell.cantripUpgrade;
  }

  const converted = {
    id: slugify(spell.name),
    name: spell.name,
    level: spell.level,
    school: spell.school,
    castingTime: convertCastingTime(spell),
    range: spell.range,
    components: convertComponents(spell),
    duration: spell.duration,
    concentration: spell.concentration,
    ritual: spell.ritual,
    description,
    classes: spell.classes,
    source: 'SRD 5.2',
  };

  if (spell.higherLevelSlot) converted.higherLevels = spell.higherLevelSlot;

  return converted;
});

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`✓ Converted ${output.length} spells → ${outputPath}`);

// Summary by level
const byLevel = {};
for (const s of output) {
  byLevel[s.level] = (byLevel[s.level] || 0) + 1;
}
for (const [lvl, count] of Object.entries(byLevel).sort((a, b) => +a[0] - +b[0])) {
  console.log(`  Level ${lvl === '0' ? '0 (cantrip)' : lvl}: ${count} spells`);
}

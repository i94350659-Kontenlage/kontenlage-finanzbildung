const fs = require('fs');
const p = 'G:/Scratch\u00b4nTravel/Ausbau\u00dcberlegungen/Website analysis and badge creation/src/components/Layout.tsx';
let content = fs.readFileSync(p, 'utf8');

// Add WanderBond to the Navigation group, after Reisepass
const insertAfter = "{ path: '/passport', icon: '🛂', label: 'Reisepass' },";
const insertNew   = "{ path: '/passport', icon: '🛂', label: 'Reisepass' },\n      { path: '/wanderbond', icon: '🧬', label: 'WanderBond™ DNA' },";
content = content.replace(insertAfter, insertNew);

fs.writeFileSync(p, content, 'utf8');
console.log('Layout.tsx patched with WanderBond nav item');

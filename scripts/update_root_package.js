const fs = require('fs');
const pkgPath = 'G:/Scratch´nTravel/package.json';

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = {
  "dev": "npm --prefix \"AusbauÜberlegungen/Website analysis and badge creation\" run dev",
  "build": "npm --prefix \"AusbauÜberlegungen/Website analysis and badge creation\" run build",
  "preview": "npm --prefix \"AusbauÜberlegungen/Website analysis and badge creation\" run preview",
  "start": "npx serve .",
  "seed": "node scripts/hermes_travel_seeder.js"
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('package.json updated with root scripts!');

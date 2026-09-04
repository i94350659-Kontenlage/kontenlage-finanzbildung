const fs = require('fs');
const viteConfigPath = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/vite.config.ts';

let content = fs.readFileSync(viteConfigPath, 'utf8');

// Replace port 8443 with 5173
content = content.replace("process.env.PORT || '8443'", "process.env.PORT || '5173'");
content = content.replace("process.env.PORT || '8443'", "process.env.PORT || '5173'");

// Replace __dirname with import.meta.dirname
content = content.replace("path.resolve(__dirname, './src')", "path.resolve(import.meta.dirname, './src')");

// Fix JSON import
content = content.replace("import siteConfiguration from './.figma/make/site.json'", "import siteConfiguration from './.figma/make/site.json' with { type: 'json' }");

fs.writeFileSync(viteConfigPath, content, 'utf8');
console.log('vite.config.ts updated with port 5173 and modern Vite standard config!');

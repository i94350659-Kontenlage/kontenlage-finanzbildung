import fs from 'node:fs';
import { execSync } from 'node:child_process';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/^GITHUB_TOKEN=(.+)$/m);
if (!match || !match[1].trim()) {
  console.error('GITHUB_TOKEN not found in .env');
  process.exit(1);
}
const token = match[1].trim();
const repo = 'i94350659-Kontenlage/kontenlage-finanzbildung.git';
const url = `https://x-access-token:${token}@github.com/${repo}`;

try {
  console.log('Pushing to GitHub...');
  const res = execSync(`git -c credential.helper= -c core.askPass= push "${url}" main`, { stdio: 'pipe' });
  console.log('Git push succeeded!');
  console.log(res.toString());
} catch (err) {
  const msg = (err.stderr ? err.stderr.toString() : err.message).replace(new RegExp(token, 'g'), '[REDACTED_TOKEN]');
  console.error('Git push failed:', msg);
  process.exit(1);
}

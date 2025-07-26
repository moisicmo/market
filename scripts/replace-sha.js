// scripts/replace-sha.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sha256 = process.env.VITE_SHA256_CERT;

if (!sha256) {
  console.error('❌ Falta VITE_SHA256_CERT en .env');
  process.exit(1);
}

const filePath = path.resolve(__dirname, '..', 'public', '.well-known', 'assetlinks.json');
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace('TU_SHA256_AQUI', sha256);
fs.writeFileSync(filePath, content);

console.log('✅ SHA256 insertado en assetlinks.json');
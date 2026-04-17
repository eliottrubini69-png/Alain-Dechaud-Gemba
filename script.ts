import fs from 'fs';
const data = fs.readFileSync('public/photo_alain_final.png', 'base64');
fs.writeFileSync('src/photo_alain_data.ts', `export const photoAlainBase64 = "data:image/png;base64,${data}";\n`);

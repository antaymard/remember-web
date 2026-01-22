// Script simple pour générer des icônes placeholder PWA
// Ce script crée des fichiers PNG basiques pour chaque taille requise

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Assurer que le dossier icons existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Pour chaque taille, créer une icône SVG simple
sizes.forEach(size => {
  const iconName = `icon-${size}x${size}.png`;
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);

  // Créer une icône SVG simple pour chaque taille
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" fill="#000000" rx="${size * 0.25}"/>
  <g transform="translate(${size * 0.207}, ${size * 0.207})">
    <path d="M${size * 0.293} 0C${size * 0.131} 0 0 ${size * 0.131} 0 ${size * 0.293}s${size * 0.131} ${size * 0.293} ${size * 0.293} ${size * 0.293} ${size * 0.293}-${size * 0.131} ${size * 0.293}-${size * 0.293}S${size * 0.455} 0 ${size * 0.293} 0zm0 ${size * 0.527}c-${size * 0.129} 0-${size * 0.234}-${size * 0.105}-${size * 0.234}-${size * 0.234}S${size * 0.164} ${size * 0.059} ${size * 0.293} ${size * 0.059}s${size * 0.234} ${size * 0.105} ${size * 0.234} ${size * 0.234}-${size * 0.105} ${size * 0.234}-${size * 0.234} ${size * 0.234}z" fill="#ffffff"/>
    <circle cx="${size * 0.293}" cy="${size * 0.176}" r="${size * 0.039}" fill="#ffffff"/>
    <circle cx="${size * 0.176}" cy="${size * 0.293}" r="${size * 0.039}" fill="#ffffff"/>
    <circle cx="${size * 0.293}" cy="${size * 0.410}" r="${size * 0.039}" fill="#ffffff"/>
    <circle cx="${size * 0.410}" cy="${size * 0.293}" r="${size * 0.039}" fill="#ffffff"/>
    <circle cx="${size * 0.293}" cy="${size * 0.293}" r="${size * 0.059}" fill="#ffffff"/>
  </g>
</svg>`;

  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Créé ${path.basename(svgPath)}`);
});

console.log('\n⚠️  Icônes SVG créées. Pour une PWA complète, convertissez-les en PNG:');
console.log('Vous pouvez utiliser:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://www.pwabuilder.com/imageGenerator');
console.log('- ImageMagick: for i in icons/*.svg; do convert "$i" "${i%.svg}.png"; done');

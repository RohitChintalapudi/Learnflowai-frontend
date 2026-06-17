const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function crop(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        const outPath = path.join(__dirname, filename + '.tmp.png');
        console.log(`Reading ${filePath}...`);
        
        await sharp(filePath)
            .trim()
            .toFile(outPath);
            
        fs.renameSync(outPath, filePath);
        console.log(`Successfully cropped: ${filename}`);
    } catch (e) {
        console.error(`Error cropping ${filename}:`, e);
    }
}

async function main() {
    await crop('public/logo.png');
    await crop('public/logo_dark.png');
}

main();

const sharp = require('sharp');
const path = require('path');

async function makeFavicon(inputFile, outputFile) {
    const filePath = path.join(__dirname, 'public', inputFile);
    const outPath = path.join(__dirname, 'public', outputFile);
    
    // Read the image, resize to 48x48, then extend canvas to 64x64 with transparency (creating 16px padding)
    await sharp(filePath)
        .resize(48, 48, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
            top: 8, bottom: 8, left: 8, right: 8,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outPath);
        
    console.log(`Generated ${outputFile}`);
}

async function main() {
    await makeFavicon('logo.png', 'favicon.png');
    await makeFavicon('logo_dark.png', 'favicon_dark.png');
}

main().catch(console.error);

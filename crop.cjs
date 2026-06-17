const Jimp = require('jimp');
const path = require('path');

async function crop(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        console.log(`Reading ${filePath}...`);
        const img = await Jimp.read(filePath);
        img.autocrop();
        await img.writeAsync(filePath);
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

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = 'public/images';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.png') {
      const inputPath = path.join(directory, file);
      const outputPath = path.join(directory, path.basename(file, '.png') + '.webp');

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`Converted: ${file} -> ${path.basename(file, '.png') + '.webp'}`);
        })
        .catch(err => {
          console.error(`Error converting ${file}:`, err);
        });
    }
  });
});

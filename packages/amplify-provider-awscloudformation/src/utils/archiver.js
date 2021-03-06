const archiver = require('archiver');
const path = require('path');
const fs = require('fs-extra');

const DEFAULT_IGNORE_PATTERN = ['*/*/build/**', '*/*/dist/**', 'function/*/src/node_modules/**'];

function run(folder, zipFilePath, ignorePattern = DEFAULT_IGNORE_PATTERN) {
  const zipFileFolder = path.dirname(zipFilePath);
  const zipFilename = path.basename(zipFilePath);

  fs.ensureDir(zipFileFolder);
  const output = fs.createWriteStream(zipFilePath);
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      resolve({ zipFilePath, zipFilename });
    });
    output.on('error', () => {
      reject(new Error('Failed to zip code.'));
    });

    const zip = archiver.create('zip', {});
    zip.pipe(output);
    zip.glob('**', {
      cwd: folder,
      ignore: ignorePattern,
      dot: true,
    });
    zip.finalize();
  });
}

module.exports = {
  run,
};

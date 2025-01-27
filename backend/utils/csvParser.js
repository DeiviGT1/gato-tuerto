const csv = require('csv-parser');
const stream = require('stream');

exports.parseCsvContent = (content, separator) => {
  return new Promise((resolve, reject) => {
    const inventory = [];
    const parser = csv({ separator })
      .on('data', (row) => inventory.push(row))
      .on('end', () => resolve(inventory))
      .on('error', (err) => reject(err));

    const contentStream = new stream.Readable();
    contentStream.push(content);
    contentStream.push(null);
    contentStream.pipe(parser);
  });
};
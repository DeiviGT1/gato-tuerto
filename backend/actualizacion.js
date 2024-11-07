const fs = require('fs');
const csv = require('csv-parser');

const inventory = [];
const data = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// Leer y procesar el archivo inventory.txt
fs.createReadStream('inventory.txt')
    .pipe(csv({ separator: '\t' }))
    .on('data', (row) => {
        row.QTY_ON_HND = row.QTY_ON_HND || 0;
        inventory.push(row);
    })
    .on('end', () => {
        // Actualizar el JSON con inventario y precios
        data.types.forEach(type => {
            type.subtypes.forEach(subtype => {
                subtype.products.forEach(products => {
                    products.products.forEach(product => {
                        product.sizes.forEach(size => {
                            // Buscar el inventario por BARCODE en el CSV
                            const item = inventory.find(inv => inv.BARCODE === size.id);
                            size.inventory = item ? parseInt(item.QTY_ON_HND, 10) : 0;
                            size.price = item ? parseFloat(item.PRICE_C) : 100000;
                        });
                    });
                });
            });
        });

        // Guardar el JSON actualizado
        fs.writeFileSync('data_final.json', JSON.stringify(data, null, 4));
        console.log('Archivo data_final.json generado con éxito.');
    });
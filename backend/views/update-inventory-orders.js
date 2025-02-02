//backend/scripts/update-inventory-orders.js

/*
 * Archivo: update-inventory.js
 * Descripción: Contiene la lógica para actualizar el inventario y generar el archivo.
 * Nota: No se han cambiado las funciones existentes ya que son compartidas con otro sitio.
 */

// Variables globales para almacenar el contenido del archivo y los items actualizados
let fileContent = "";
let savedItems = [];

// Referencias a elementos HTML
const uploadBtn = document.getElementById('uploadBtn');
const inventoryFileInput = document.getElementById('inventoryFile');
const uploadSection = document.getElementById('uploadSection');
const searchSection = document.getElementById('searchSection');
const resultMessage = document.getElementById('resultMessage');
const downloadBtn = document.getElementById('downloadBtn');
const finalProcessBtn = document.getElementById('finalProcessBtn');
const dataFrameContainer = document.getElementById('dataFrameContainer');

// Al hacer clic en "Subir Archivo" se lee el contenido del archivo TXT
uploadBtn.addEventListener('click', () => {
  const file = inventoryFileInput.files[0];
  if (!file) {
    alert("Por favor, selecciona un archivo .txt");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    fileContent = e.target.result;
    alert("Archivo cargado exitosamente");
    // Se oculta la sección de subida y se muestra la de búsqueda
    uploadSection.style.display = 'none';
    searchSection.style.display = 'block';
    // Enfocar el primer input de búsqueda
    document.getElementById('productCode').focus();
  };
  reader.readAsText(file);
});

/**
 * Función para asignar una categoría según el campo TYPE.
 * Puedes personalizar este mapeo según tus necesidades.
 */
function getCategory(type) {
  switch(type) {
    case "WINE-CHAMPAGNE": return "Vino";
    case "WHIS-SCOTCH": return "Whisky";
    case "CORDIALS-IMPORTED": return "Licor";
    default: return "Sin categoría";
  }
}

/**
 * Función que busca en el archivo (formateado como TSV) el producto cuyo código
 * (columna BARCODE) coincida con el ingresado.
 * @param {string} codigo - El código de producto a buscar.
 * @returns {object|null} - Objeto con la información encontrada o null si no se halla.
 */
function buscarItem(codigo) {
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return null; // No hay datos (solo encabezado)
  const dataLines = lines.slice(1);
  for (let line of dataLines) {
    const columns = line.split('\t');
    if (columns.length > 0) {
      let barcode = columns[0].replace(/"/g, '').trim();
      if (barcode === codigo.trim()) {
        return {
          barcode: barcode,
          brand: columns[1] ? columns[1].replace(/"/g, '').trim() : '',
          description: columns[2] ? columns[2].replace(/"/g, '').trim() : '',
          type: columns[3] ? columns[3].replace(/"/g, '').trim() : '',
          size: columns[4] ? columns[4].replace(/"/g, '').trim() : '',
          price: columns[5] ? parseFloat(columns[5].replace(/"/g, '').trim()) : 0,
          qty: columns[6] ? columns[6].replace(/"/g, '').trim() : '0'
        };
      }
    }
  }
  return null;
}

/**
 * Función que registra la información cuando se presiona Enter en "Inventario Físico".
 * Se verifica que ambos campos estén completos, se busca el producto y, si se encuentra,
 * se comprueba que no se haya registrado previamente. Si no se repite, se guarda la información
 * en 'savedItems' con los datos requeridos, incluyendo la diferencia, el size y el código de producto.
 */
function handleRegistration() {
  const productCode = document.getElementById('productCode').value.trim();
  const newInventory = document.getElementById('newInventory').value.trim();
  if (!productCode || !newInventory) {
    alert("Por favor, complete ambos campos.");
    return;
  }
  
  // Verificar si el producto ya está registrado (usando el código)
  if (savedItems.some(item => item.barcode === productCode)) {
    alert("Producto ya registrado");
    return;
  }
  
  const foundItem = buscarItem(productCode);
  if (foundItem) {
    const productName = foundItem.brand + " " + foundItem.description;
    const productType = foundItem.type;
    const inventarioSistema = foundItem.qty;
    const inventarioFisico = newInventory;
    const categoria = getCategory(foundItem.type);
    const size = foundItem.size;
    const invSistemaNum = parseFloat(inventarioSistema);
    const invFisicoNum = parseFloat(inventarioFisico);
    const diferencia = invSistemaNum - invFisicoNum;
    const newItem = {
      barcode: foundItem.barcode,
      nombre: productName,
      type: productType,
      inventarioSistema: inventarioSistema,
      inventarioFisico: inventarioFisico,
      categoria: categoria,
      diferencia: diferencia,
      size: size
    };
    savedItems.push(newItem);
    resultMessage.textContent =
      "Producto guardado: " + productName + " (" + productType + ") - " +
      "Size: " + size + ", Inventario sistema: " + inventarioSistema +
      ", Inventario físico: " + inventarioFisico +
      ", Diferencia: " + diferencia + ", Categoría: " + categoria;
    document.getElementById('productCode').value = "";
    document.getElementById('newInventory').value = "";
    document.getElementById('productCode').focus();
    if (savedItems.length > 0) {
      downloadBtn.style.display = 'block';
      finalProcessBtn.style.display = 'block';
    }
  } else {
    alert("Producto con código " + productCode + " no encontrado.");
  }
}

document.getElementById('productCode').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const productCodeValue = event.target.value.trim();
    if (productCodeValue === "") {
      alert("Por favor, ingresa un código de producto.");
    } else {
      document.getElementById('newInventory').focus();
    }
  }
});

document.getElementById('newInventory').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleRegistration();
  }
});

/**
 * Función para generar y descargar el archivo de texto con la información acumulada,
 * formateado para que al imprimir en una hoja A4 se vea como un dataframe con 7 columnas.
 * Se utilizan anchos fijos para cada columna y se centra el contenido de las columnas
 * "I.Sistema", "I.físico" y "Dif".
 */
function downloadFile() {
  // Definir los encabezados y anchos fijos para cada columna
  const headers = [
    "Nombre del producto",
    "Type",
    "I.Sistema",
    "I.físico",
    "Categoría",
    "Dif",
    "Size"
  ];
  // Fixed widths in characters (adjust these numbers as needed)
  const fixedColWidths = [20, 8, 5, 5, 7, 6, 6];

  // New padCell function that can optionally center text
  function padCell(text, width, center = false) {
    text = text.toString();
    if (text.length > width) {
      return text.substring(0, width);
    } else if (center) {
      let totalPadding = width - text.length;
      let leftPadding = Math.floor(totalPadding / 2);
      let rightPadding = totalPadding - leftPadding;
      return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
    } else {
      return text.padEnd(width);
    }
  }

  // Helper: return true if column index should be centered (for columns "I.Sistema", "I.físico" and "Dif")
  function shouldCenter(i) {
    return (i === 2 || i === 3 || i === 5);
  }

  // Construir la fila de encabezados
  let headerRow = "| " + headers.map((header, i) => padCell(header, fixedColWidths[i], shouldCenter(i))).join(" | ") + " |";
  // Construir la fila separadora
  let separatorRow = "|-" + fixedColWidths.map(w => "-".repeat(w)).join("-|-") + "-|";

  // Construir las filas de datos (solo las 7 columnas)
  let dataRows = savedItems.map(item => {
    let row = [
      item.nombre,
      item.type,
      item.inventarioSistema,
      item.inventarioFisico,
      item.categoria,
      item.diferencia.toString(),
      item.size
    ];
    return "| " + row.map((cell, i) => padCell(cell, fixedColWidths[i], shouldCenter(i))).join(" | ") + " |";
  });

  // Concatenar todo el contenido
  let tableContent = headerRow + "\n" + separatorRow + "\n" + dataRows.join("\n");

  // Descargar el contenido en un archivo de texto
  const blob = new Blob([tableContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "productos_actualizados.txt");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

downloadBtn.addEventListener('click', downloadFile);

/**
 * Función para generar y mostrar la información acumulada en forma de tabla (dataframe)
 * en la página. Se incluye una columna de "Acciones" para eliminar productos.
 */
function showDataFrame() {
  let html = '<table>';
  html += '<thead><tr>';
  html += '<th>Nombre del producto</th>';
  html += '<th>Type</th>';
  html += '<th>Inventario sistema</th>';
  html += '<th>Inventario físico</th>';
  html += '<th>Categoría</th>';
  html += '<th>Diferencia</th>';
  html += '<th>Size</th>';
  html += '<th>Acciones</th>';
  html += '</tr></thead>';
  html += '<tbody>';
  savedItems.forEach((item, index) => {
    html += `<tr>
               <td>${item.nombre}</td>
               <td>${item.type}</td>
               <td>${item.inventarioSistema}</td>
               <td>${item.inventarioFisico}</td>
               <td>${item.diferencia}</td>
               <td>${item.categoria}</td>
               <td>${item.size}</td>
               <td><button class="delete-btn" onclick="removeProduct(${index})">Eliminar</button></td>
             </tr>`;
  });
  html += '</tbody></table>';
  dataFrameContainer.innerHTML = html;
}

function removeProduct(index) {
  savedItems.splice(index, 1);
  showDataFrame();
}

finalProcessBtn.addEventListener('click', showDataFrame);
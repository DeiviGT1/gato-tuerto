/*
 * Archivo: update-inventory-orders.js
 * Descripción: Lógica para actualizar el inventario y generar el archivo, ahora con persistencia usando localStorage.
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
// Se elimina la referencia al botón de previsualizar ya que no se mostrará
// const finalProcessBtn = document.getElementById('finalProcessBtn');
const dataFrameContainer = document.getElementById('dataFrameContainer');
const resetBtn = document.getElementById('resetBtn');

// Función para actualizar localStorage con los datos actuales
function updateLocalStorage() {
  localStorage.setItem('savedItems', JSON.stringify(savedItems));
  localStorage.setItem('fileContent', fileContent);
}

// Al cargar la página, se carga la información almacenada en localStorage (si existe)
document.addEventListener('DOMContentLoaded', function(){
  const storedItems = localStorage.getItem('savedItems');
  if (storedItems) {
    savedItems = JSON.parse(storedItems);
  }
  const storedFileContent = localStorage.getItem('fileContent');
  if (storedFileContent) {
    fileContent = storedFileContent;
    // Si ya se ha cargado un archivo previamente, mostrar la sección de búsqueda
    uploadSection.style.display = 'none';
    searchSection.style.display = 'block';
  }
  // Si hay items guardados, mostrar el botón de descarga y actualizar la tabla
  if (savedItems.length > 0) {
    downloadBtn.style.display = 'block';
    // Se llama a showDataFrame para actualizar la previsualización de la tabla
    showDataFrame();
  }
});

// Al hacer clic en "Subir Archivo", se lee el contenido del archivo TXT
uploadBtn.addEventListener('click', () => {
  const file = inventoryFileInput.files[0];
  if (!file) {
    alert("Por favor, selecciona un archivo .txt");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    // Obtener el contenido original
    let rawContent = e.target.result;
    
    // Procesar cada línea y cada celda: si la celda está vacía, asignar "0"
    fileContent = rawContent.split('\n').map(line => {
      // Dividir la línea por tabuladores
      return line.split('\t').map(cell => {
        // Remover comillas y espacios y, si está vacía, asignar "0"
        const trimmed = cell.replace(/"/g, '').trim();
        return trimmed === "" ? "0" : trimmed;
      }).join('\t');
    }).join('\n');
    
    alert("Archivo cargado exitosamente");
    // Se oculta la sección de subida y se muestra la de búsqueda
    uploadSection.style.display = 'none';
    searchSection.style.display = 'block';
    // Enfocar el primer input de búsqueda
    document.getElementById('productCode').focus();
    
    // Actualizar localStorage con el contenido del archivo
    updateLocalStorage();
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
    showCustomAlert("Por favor, complete ambos campos.");
    return;
  }
  
  // Verificar si el producto ya está registrado (usando el código)
  if (savedItems.some(item => item.barcode === productCode)) {
    showCustomAlert("Producto ya registrado");
    return;
  }
  
  const foundItem = buscarItem(productCode);
  if (foundItem) {
    // Procesamiento normal del producto
    const productName = foundItem.brand + " " + foundItem.description;
    const productType = foundItem.type;
    const inventarioSistema = foundItem.qty;
    const inventarioFisico = newInventory;
    const size = foundItem.size;
    const invSistemaNum = parseFloat(inventarioSistema);
    const invFisicoNum = parseFloat(inventarioFisico);
    const diferencia = invFisicoNum - invSistemaNum;
    const newItem = {
      barcode: foundItem.barcode,
      nombre: productName,
      type: productType,
      inventarioSistema: inventarioSistema,
      inventarioFisico: inventarioFisico,
      diferencia: diferencia,
      size: size
    };
    savedItems.push(newItem);
    resultMessage.textContent =
      "Producto guardado: " + productName + " (" + productType + ") - " +
      "Size: " + size + ", Inventario sistema: " + inventarioSistema +
      ", Inventario físico: " + inventarioFisico +
      ", Diferencia: " + diferencia;
    document.getElementById('productCode').value = "";
    document.getElementById('newInventory').value = "";
    document.getElementById('productCode').focus();
    
    // Mostrar el botón de descarga si hay al menos un item
    if (savedItems.length > 0) {
      downloadBtn.style.display = 'block';
    }
    
    // Actualizar localStorage y actualizar la previsualización de la tabla
    updateLocalStorage();
    showDataFrame();
  } else {
    // Mostrar el modal y no permitir avanzar hasta que se cierre con el botón OK
    showCustomAlert("Producto con código " + productCode + " no encontrado.");
    return;
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
  const modal = document.getElementById('customAlert');
  // Si el modal está abierto, ignoramos la tecla Enter
  if (modal.dataset.open === "true") {
    event.preventDefault();
    return;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    handleRegistration();
  }
});

/**
 * Función para generar y descargar el archivo de texto con la información acumulada,
 * formateado para que al imprimir en una hoja A4 se vea como un dataframe.
 */

function downloadPDF() {
  // Asegúrate de tener acceso a jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Definir el encabezado y los datos de la tabla, colocando "Size" como segunda columna
  const headers = [["Nombre del producto", "Size", "Type", "I.Sistema", "I.físico", "Dif"]];
  const data = savedItems.map(item => [
    item.nombre,
    item.size,
    item.type,
    item.inventarioSistema,
    item.inventarioFisico,
    item.diferencia.toString()
  ]);

  // Genera la tabla. autoTable repetirá el encabezado en cada página automáticamente.
  doc.autoTable({
    head: headers,
    body: data,
    margin: { top: 20, bottom: 20 },
    didDrawPage: function (data) {
      // Formatear la fecha actual en mm/dd/yyyy
      const today = new Date();
      const mm = ("0" + (today.getMonth() + 1)).slice(-2);
      const dd = ("0" + today.getDate()).slice(-2);
      const yyyy = today.getFullYear();
      const formattedDate = mm + "/" + dd + "/" + yyyy;
      
      // Crear el título con la fecha
      const title = "Ordenes de la semana " + formattedDate;
      
      // Ajustar la fuente y escribir el título en la posición deseada
      doc.setFontSize(12);
      doc.text(title, data.settings.margin.left, 10);
    }
  });

  doc.save("productos_actualizados.pdf");
}

downloadBtn.addEventListener('click', downloadPDF);

/**
 * Función para generar y mostrar la información acumulada en forma de tabla (dataframe).
 * Se incluye una columna de "Acciones" para eliminar productos.
 */
function showDataFrame() {
  let html = '<table>';
  html += '<thead><tr>';
  html += '<th>Nombre del producto</th>';
  html += '<th>Type</th>';
  html += '<th>Inventario sistema</th>';
  html += '<th>Inventario físico</th>';
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
               <td>
                 <input type="number" value="${item.inventarioFisico}" 
                        onchange="updateInventory(${index}, this.value)" 
                        style="width: 80px; text-align: center;" />
               </td>
               <td>${item.diferencia}</td>
               <td>${item.size}</td>
               <td><button class="delete-btn" onclick="removeProduct(${index})">Eliminar</button></td>
             </tr>`;
  });
  html += '</tbody></table>';
  dataFrameContainer.innerHTML = html;
}

/**
 * Función para actualizar el inventario físico de un item y recalcular la diferencia.
 */
function updateInventory(index, newValue) {
  const invFisicoNum = parseFloat(newValue) || 0;
  const invSistemaNum = parseFloat(savedItems[index].inventarioSistema) || 0;
  savedItems[index].inventarioFisico = newValue;
  savedItems[index].diferencia = invFisicoNum - invSistemaNum;
  updateLocalStorage();
  showDataFrame();
}

/**
 * Función para eliminar un producto de la lista.
 */
function removeProduct(index) {
  savedItems.splice(index, 1);
  updateLocalStorage();
  showDataFrame();
}

// Se elimina el listener del botón de previsualizar ya que no se muestra
// finalProcessBtn.addEventListener('click', showDataFrame);

// Event listener para el botón de reiniciar: limpia el localStorage y recarga la página.
resetBtn.addEventListener('click', function(){
  if (confirm("¿Estás seguro de reiniciar? Se perderán todos los datos almacenados.")) {
    localStorage.removeItem('savedItems');
    localStorage.removeItem('fileContent');
    window.location.reload();
  }
});


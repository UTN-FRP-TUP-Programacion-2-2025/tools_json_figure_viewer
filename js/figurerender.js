// Variables globales
let canvas3d, ctx3d;
let canvas2d, ctx2d;
let currentData = [];
let selectedObject = null;
let viewMode = 'all';
let canvasMode = 'filled';

// Datos de ejemplo
const exampleData = [
  {
    "Tipo": "Cilindro", 
    "Tapas": [
      {  
        "Tipo":"Circulo", 
        "Radio": 3.00, 
        "Area": 28.27
      }, 
      {  
        "Tipo":"Circulo", 
        "Radio": 3.00, 
        "Area": 28.27
      }
    ],
    "Lado": { 
      "Tipo": "RectanguloDesarrollado", 
      "Lago": 3.00, 
      "Ancho": 18.85, 
      "Area": 56.55
    },
    "Area": 113.10,
    "Volumen": 84.82
  },
  {  
    "Tipo": "Cubo", 
    "Caras": [
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 3.00, 
        "Ancho": 3.00, 
        "Area": 9.00
      }
    ],  
    "Area": 36.00,
    "Volumen": 27.00
  },
  {  
    "Tipo": "Ortoedro", 
    "Tapas": [
      { 
        "Tipo": "Rectangulo", 
        "Largo": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo": "Rectangulo", 
        "Largo": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }
    ],
    "Laterales": [
      { 
        "Tipo": "Rectangulo", 
        "Largo": 21.00, 
        "Ancho": 7.00, 
        "Area": 147.00
      }, 
      { 
        "Tipo": "Rectangulo", 
        "Largo": 21.00, 
        "Ancho": 7.00, 
        "Area": 147.00
      }, 
      { 
        "Tipo": "Rectangulo", 
        "Largo": 21.00, 
        "Ancho": 7.00, 
        "Area": 147.00
      }, 
      { 
        "Tipo": "Rectangulo", 
        "Largo": 21.00, 
        "Ancho": 7.00, 
        "Area": 147.00
      }
    ],
    "Area": 686.00,
    "Volumen": 343.00
  },
  {
    "Tipo": "Cilindro", 
    "Tapas": [
      {  
        "Tipo":"Circulo", 
        "Radio": 9.00, 
        "Area": 254.47
      }, 
      {  
        "Tipo":"Circulo", 
        "Radio": 9.00, 
        "Area": 254.47
      }
    ],
    "Lado": { 
      "Tipo": "RectanguloDesarrollado", 
      "Lago": 13.00, 
      "Ancho": 56.55, 
      "Area": 735.13
    },
    "Area": 1244.07,
    "Volumen": 3308.10
  },
  {  
    "Tipo": "Cubo", 
    "Caras": [
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }, 
      { 
        "Tipo":"Cuadrado", 
        "Lago": 7.00, 
        "Ancho": 7.00, 
        "Area": 49.00
      }
    ],  
    "Area": 196.00,
    "Volumen": 343.00
  },
  {
    "Tipo": "Cilindro", 
    "Tapas": [
      {  
        "Tipo":"Circulo", 
        "Radio": 13.00, 
        "Area": 530.93
      }, 
      {  
        "Tipo":"Circulo", 
        "Radio": 13.00, 
        "Area": 530.93
      }
    ],
    "Lado": { 
      "Tipo": "RectanguloDesarrollado", 
      "Lago": 23.00, 
      "Ancho": 81.68, 
      "Area": 1878.67
    },
    "Area": 2940.53,
    "Volumen": 12211.37
  }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initialize3D();
    initialize2D();
    setupEventListeners();
    loadExampleData();
});

// Configurar event listeners
function setupEventListeners() {
    const fileInput = document.getElementById('jsonFile');
    fileInput.addEventListener('change', handleFileUpload);
    
    const jsonTextarea = document.getElementById('jsonTextarea');
    if (jsonTextarea) {
        jsonTextarea.addEventListener('input', handleJsonInput);
    }
}

// Manejar carga de archivo
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                processData(data);
                // Actualizar textarea con el contenido del archivo
                const textarea = document.getElementById('jsonTextarea');
                if (textarea) {
                    textarea.value = e.target.result;
                }
            } catch (error) {
                showError('Error al parsear el archivo JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Manejar entrada de texto JSON
function handleJsonInput(event) {
    const jsonText = event.target.value.trim();
    if (jsonText) {
        try {
            const data = JSON.parse(jsonText);
            processData(data);
        } catch (error) {
            // No mostrar error mientras el usuario está escribiendo
            console.log('JSON incompleto:', error.message);
        }
    }
}

// Cargar datos de ejemplo
function loadExampleData() {
    processData(exampleData);
    // Actualizar textarea con datos de ejemplo
    const textarea = document.getElementById('jsonTextarea');
    if (textarea) {
        textarea.value = JSON.stringify(exampleData, null, 2);
    }
}

// Procesar datos
function processData(data) {
    currentData = Array.isArray(data) ? data : [data];
    buildTree(currentData);
    render3D();
    render2D();
    updateStats();
}

// Inicializar vista 3D
function initialize3D() {
    const container = document.getElementById('view3d-container');
    canvas3d = document.createElement('canvas');
    ctx3d = canvas3d.getContext('2d');
    
    canvas3d.width = container.clientWidth;
    canvas3d.height = container.clientHeight;
    container.appendChild(canvas3d);
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
}

// Inicializar vista 2D
function initialize2D() {
    const container = document.getElementById('view2d-container');
    canvas2d = document.createElement('canvas');
    ctx2d = canvas2d.getContext('2d');
    
    canvas2d.width = container.clientWidth;
    canvas2d.height = container.clientHeight;
    container.appendChild(canvas2d);
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    const container3d = document.getElementById('view3d-container');
    const container2d = document.getElementById('view2d-container');
    
    if (canvas3d) {
        canvas3d.width = container3d.clientWidth;
        canvas3d.height = container3d.clientHeight;
        render3D();
    }
    
    if (canvas2d) {
        canvas2d.width = container2d.clientWidth;
        canvas2d.height = container2d.clientHeight;
        render2D();
    }
}

// Renderizar vista 3D con mejor distribución espacial
function render3D() {
    if (!ctx3d) return;
    
    const canvas = ctx3d.canvas;
    ctx3d.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 30;
    const startX = padding;
    const startY = padding;
    const maxWidth = canvas.width - 2 * padding;
    const maxHeight = canvas.height - 2 * padding;
    
    // Calcular distribución óptima
    const objectCount = currentData.length;
    const cols = Math.ceil(Math.sqrt(objectCount));
    const rows = Math.ceil(objectCount / cols);
    
    const cellWidth = maxWidth / cols;
    const cellHeight = maxHeight / rows;
    
    currentData.forEach((object, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const x = startX + col * cellWidth + cellWidth / 2;
        const y = startY + row * cellHeight + cellHeight / 2;
        
        draw3DObject(object, x, y, Math.min(cellWidth, cellHeight) * 0.3);
    });
}

// Dibujar objeto 3D con escala dinámica
function draw3DObject(object, x, y, scale) {
    ctx3d.save();
    
    switch (object.Tipo) {
        case 'Cilindro':
            drawCylinder3D(object, x, y, scale);
            break;
        case 'Cubo':
            drawCube3D(object, x, y, scale);
            break;
        case 'Ortoedro':
            drawOrtoedro3D(object, x, y, scale);
            break;
    }
    
    // Dibujar etiqueta
    ctx3d.fillStyle = '#4a5568';
    ctx3d.font = '12px Arial';
    ctx3d.textAlign = 'center';
    ctx3d.fillText(object.Tipo, x, y + scale * 2 + 20);
    
    ctx3d.restore();
}

// Dibujar cilindro 3D con escala dinámica
function drawCylinder3D(object, x, y, scale) {
    const radius = object.Tapas[0].Radio || 1;
    const height = object.Lado?.Lago || 2;
    
    const centerX = x;
    const centerY = y;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - radius * scale * 0.8, centerY + height * scale / 2, 
                   radius * scale * 1.6, height * scale * 0.3);
    
    // Cuerpo del cilindro
    ctx3d.fillStyle = 'rgba(102, 126, 234, 0.8)';
    ctx3d.fillRect(centerX - radius * scale, centerY, 
                   radius * scale * 2, height * scale);
    
    // Tapas
    ctx3d.fillStyle = 'rgba(102, 126, 234, 0.9)';
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.fill();
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY + height * scale, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.fill();
    
    // Contorno
    ctx3d.strokeStyle = '#667eea';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - radius * scale, centerY, 
                     radius * scale * 2, height * scale);
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.stroke();
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY + height * scale, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.stroke();
}

// Dibujar cubo 3D con escala dinámica
function drawCube3D(object, x, y, scale) {
    const size = object.Caras[0].Lago || 1;
    
    const centerX = x;
    const centerY = y;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - size * scale * 0.8, centerY + size * scale, 
                   size * scale * 1.6, size * scale * 0.3);
    
    // Cara frontal
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.8)';
    ctx3d.fillRect(centerX - size * scale, centerY - size * scale, 
                   size * scale * 2, size * scale * 2);
    
    // Cara lateral
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.6)';
    ctx3d.fillRect(centerX + size * scale, centerY - size * scale * 0.8, 
                   size * scale * 0.8, size * scale * 1.6);
    
    // Cara superior
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.9)';
    ctx3d.fillRect(centerX - size * scale, centerY - size * scale * 1.8, 
                   size * scale * 2, size * scale * 0.8);
    
    // Contorno
    ctx3d.strokeStyle = '#764ba2';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - size * scale, centerY - size * scale, 
                     size * scale * 2, size * scale * 2);
    ctx3d.strokeRect(centerX + size * scale, centerY - size * scale * 0.8, 
                     size * scale * 0.8, size * scale * 1.6);
    ctx3d.strokeRect(centerX - size * scale, centerY - size * scale * 1.8, 
                     size * scale * 2, size * scale * 0.8);
}

// Dibujar ortoedro 3D con escala dinámica
function drawOrtoedro3D(object, x, y, scale) {
    const width = object.Tapas[0].Largo || 1;
    const height = object.Tapas[0].Ancho || 1;
    const depth = object.Laterales[0].Largo || 1;
    
    const centerX = x;
    const centerY = y;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - width * scale * 0.8, centerY + height * scale, 
                   width * scale * 1.6, height * scale * 0.3);
    
    // Cara frontal
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.8)';
    ctx3d.fillRect(centerX - width * scale, centerY - height * scale, 
                   width * scale * 2, height * scale * 2);
    
    // Cara lateral
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.6)';
    ctx3d.fillRect(centerX + width * scale, centerY - height * scale * 0.8, 
                   depth * scale * 0.8, height * scale * 1.6);
    
    // Cara superior
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.9)';
    ctx3d.fillRect(centerX - width * scale, centerY - height * scale * 1.8, 
                   width * scale * 2, height * scale * 0.8);
    
    // Contorno
    ctx3d.strokeStyle = '#48bb78';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - width * scale, centerY - height * scale, 
                     width * scale * 2, height * scale * 2);
    ctx3d.strokeRect(centerX + width * scale, centerY - height * scale * 0.8, 
                     depth * scale * 0.8, height * scale * 1.6);
    ctx3d.strokeRect(centerX - width * scale, centerY - height * scale * 1.8, 
                     width * scale * 2, height * scale * 0.8);
}

// Renderizar vista 2D con mejor distribución
function render2D() {
    if (!ctx2d) return;
    
    const canvas = ctx2d.canvas;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 20;
    const startX = padding;
    const startY = padding;
    const maxWidth = canvas.width - 2 * padding;
    const maxHeight = canvas.height - 2 * padding;
    
    // Calcular distribución óptima
    const objectCount = currentData.length;
    const cols = Math.ceil(Math.sqrt(objectCount));
    const rows = Math.ceil(objectCount / cols);
    
    const cellWidth = maxWidth / cols;
    const cellHeight = maxHeight / rows;
    
    currentData.forEach((object, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const x = startX + col * cellWidth + cellWidth / 2;
        const y = startY + row * cellHeight + cellHeight / 2;
        
        draw2DObject(object, x, y, Math.min(cellWidth, cellHeight) * 0.2);
    });
}

// Dibujar objeto 2D con escala dinámica
function draw2DObject(object, x, y, scale) {
    ctx2d.save();
    
    switch (object.Tipo) {
        case 'Cilindro':
            drawCylinder2D(object, x, y, scale);
            break;
        case 'Cubo':
            drawCube2D(object, x, y, scale);
            break;
        case 'Ortoedro':
            drawOrtoedro2D(object, x, y, scale);
            break;
    }
    
    // Dibujar etiqueta
    ctx2d.fillStyle = '#4a5568';
    ctx2d.font = '12px Arial';
    ctx2d.textAlign = 'center';
    ctx2d.fillText(object.Tipo, x, y + scale * 4 + 20);
    
    ctx2d.restore();
}

// Dibujar cilindro 2D con escala dinámica
function drawCylinder2D(object, x, y, scale) {
    const radius = object.Tapas[0].Radio || 1;
    const height = object.Lado?.Lago || 2;
    
    ctx2d.strokeStyle = '#667eea';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(102, 126, 234, 0.3)';
        ctx2d.fillRect(x - radius * scale, y - height * scale / 2, 
                       radius * scale * 2, height * scale);
        ctx2d.fillStyle = 'rgba(102, 126, 234, 0.6)';
        ctx2d.beginPath();
        ctx2d.ellipse(x, y - height * scale / 2, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
        ctx2d.fill();
        ctx2d.beginPath();
        ctx2d.ellipse(x, y + height * scale / 2, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
        ctx2d.fill();
    }
    
    ctx2d.strokeRect(x - radius * scale, y - height * scale / 2, 
                     radius * scale * 2, height * scale);
    ctx2d.beginPath();
    ctx2d.ellipse(x, y - height * scale / 2, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx2d.stroke();
    ctx2d.beginPath();
    ctx2d.ellipse(x, y + height * scale / 2, radius * scale, radius * scale * 0.3, 0, 0, 2 * Math.PI);
    ctx2d.stroke();
}

// Dibujar cubo 2D con escala dinámica
function drawCube2D(object, x, y, scale) {
    const size = object.Caras[0].Lago || 1;
    
    ctx2d.strokeStyle = '#764ba2';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(118, 75, 162, 0.3)';
        ctx2d.fillRect(x - size * scale, y - size * scale, 
                       size * scale * 2, size * scale * 2);
    }
    
    ctx2d.strokeRect(x - size * scale, y - size * scale, 
                     size * scale * 2, size * scale * 2);
}

// Dibujar ortoedro 2D con escala dinámica
function drawOrtoedro2D(object, x, y, scale) {
    const width = object.Tapas[0].Largo || 1;
    const height = object.Tapas[0].Ancho || 1;
    
    ctx2d.strokeStyle = '#48bb78';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(72, 187, 120, 0.3)';
        ctx2d.fillRect(x - width * scale, y - height * scale, 
                       width * scale * 2, height * scale * 2);
    }
    
    ctx2d.strokeRect(x - width * scale, y - height * scale, 
                     width * scale * 2, height * scale * 2);
}

// Construir árbol jerárquico con propiedades detalladas
function buildTree(data) {
    const treeContainer = document.getElementById('jsonTree');
    treeContainer.innerHTML = '';
    
    data.forEach((object, index) => {
        const node = createTreeNode(object, `Objeto ${index + 1}`, index);
        treeContainer.appendChild(node);
    });
}

// Crear nodo del árbol con propiedades detalladas
function createTreeNode(obj, label, index) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    
    const header = document.createElement('div');
    header.className = 'tree-node-header';
    header.onclick = () => toggleNode(node, obj, index);
    
    const toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    toggle.textContent = '▶';
    
    const title = document.createElement('span');
    title.textContent = `${label} (${obj.Tipo})`;
    
    header.appendChild(toggle);
    header.appendChild(title);
    
    const children = document.createElement('div');
    children.className = 'tree-children';
    
    // Agregar información del objeto
    const objectInfo = document.createElement('div');
    objectInfo.className = 'object-info';
    objectInfo.innerHTML = `
        <div class="object-type">${obj.Tipo}</div>
        <div class="object-dimensions">
            ${getObjectDimensions(obj)}
        </div>
    `;
    children.appendChild(objectInfo);
    
    // Agregar propiedades principales con formato especial para dimensiones
    Object.entries(obj).forEach(([key, value]) => {
        if (key !== 'Tipo' && typeof value !== 'object') {
            const propItem = document.createElement('div');
            propItem.className = isDimensionProperty(key) ? 'dimension-item' : 'property-item';
            
            if (isDimensionProperty(key)) {
                propItem.innerHTML = `
                    <span class="dimension-name">${key}:</span>
                    <span class="dimension-value">${value}</span>
                `;
            } else {
                propItem.innerHTML = `
                    <span class="property-name">${key}:</span>
                    <span class="property-value">${value}</span>
                `;
            }
            children.appendChild(propItem);
        }
    });
    
    // Agregar sub-objetos
    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const arrayNode = createArrayNode(value, key, index);
            children.appendChild(arrayNode);
        } else if (typeof value === 'object' && value !== null) {
            const objectNode = createObjectNode(value, key, index);
            children.appendChild(objectNode);
        }
    });
    
    node.appendChild(header);
    node.appendChild(children);
    
    return node;
}

// Verificar si una propiedad es una dimensión
function isDimensionProperty(key) {
    const dimensionKeys = ['Radio', 'Lago', 'Ancho', 'Largo', 'Area', 'Volumen'];
    return dimensionKeys.includes(key);
}

// Obtener dimensiones del objeto
function getObjectDimensions(obj) {
    const dimensions = [];
    
    switch (obj.Tipo) {
        case 'Cilindro':
            if (obj.Tapas && obj.Tapas[0]) {
                dimensions.push(`Radio: ${obj.Tapas[0].Radio}`);
            }
            if (obj.Lado) {
                dimensions.push(`Altura: ${obj.Lado.Lago}`);
            }
            break;
        case 'Cubo':
            if (obj.Caras && obj.Caras[0]) {
                dimensions.push(`Lado: ${obj.Caras[0].Lago}`);
            }
            break;
        case 'Ortoedro':
            if (obj.Tapas && obj.Tapas[0]) {
                dimensions.push(`Largo: ${obj.Tapas[0].Largo}, Ancho: ${obj.Tapas[0].Ancho}`);
            }
            if (obj.Laterales && obj.Laterales[0]) {
                dimensions.push(`Altura: ${obj.Laterales[0].Largo}`);
            }
            break;
    }
    
    return dimensions.join(' | ');
}

// Crear nodo de array con propiedades detalladas
function createArrayNode(array, label, parentIndex) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    
    const header = document.createElement('div');
    header.className = 'tree-node-header';
    header.onclick = () => toggleNode(node);
    
    const toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    toggle.textContent = '▶';
    
    const title = document.createElement('span');
    title.textContent = `${label} [${array.length}]`;
    
    header.appendChild(toggle);
    header.appendChild(title);
    
    const children = document.createElement('div');
    children.className = 'tree-children';
    
    array.forEach((item, index) => {
        if (typeof item === 'object') {
            const childNode = createTreeNode(item, `${label}[${index}]`, parentIndex);
            children.appendChild(childNode);
        } else {
            const propItem = document.createElement('div');
            propItem.className = isDimensionProperty(label) ? 'dimension-item' : 'property-item';
            
            if (isDimensionProperty(label)) {
                propItem.innerHTML = `
                    <span class="dimension-name">[${index}]:</span>
                    <span class="dimension-value">${item}</span>
                `;
            } else {
                propItem.innerHTML = `
                    <span class="property-name">[${index}]:</span>
                    <span class="property-value">${item}</span>
                `;
            }
            children.appendChild(propItem);
        }
    });
    
    node.appendChild(header);
    node.appendChild(children);
    
    return node;
}

// Crear nodo de objeto con propiedades detalladas
function createObjectNode(obj, label, parentIndex) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    
    const header = document.createElement('div');
    header.className = 'tree-node-header';
    header.onclick = () => toggleNode(node);
    
    const toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    toggle.textContent = '▶';
    
    const title = document.createElement('span');
    title.textContent = label;
    
    header.appendChild(toggle);
    header.appendChild(title);
    
    const children = document.createElement('div');
    children.className = 'tree-children';
    
    Object.entries(obj).forEach(([key, value]) => {
        const propItem = document.createElement('div');
        propItem.className = isDimensionProperty(key) ? 'dimension-item' : 'property-item';
        
        if (isDimensionProperty(key)) {
            propItem.innerHTML = `
                <span class="dimension-name">${key}:</span>
                <span class="dimension-value">${value}</span>
            `;
        } else {
            propItem.innerHTML = `
                <span class="property-name">${key}:</span>
                <span class="property-value">${value}</span>
            `;
        }
        children.appendChild(propItem);
    });
    
    node.appendChild(header);
    node.appendChild(children);
    
    return node;
}

// Alternar nodo del árbol
function toggleNode(node, obj, index) {
    const toggle = node.querySelector('.tree-toggle');
    const children = node.querySelector('.tree-children');
    
    if (children.classList.contains('expanded')) {
        children.classList.remove('expanded');
        toggle.classList.remove('expanded');
    } else {
        children.classList.add('expanded');
        toggle.classList.add('expanded');
    }
    
    // Seleccionar objeto
    if (obj) {
        selectObject(obj, index);
    }
}

// Seleccionar objeto
function selectObject(obj, index) {
    // Remover selección anterior
    document.querySelectorAll('.tree-node-header.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Seleccionar nuevo objeto
    const header = event.target.closest('.tree-node-header');
    if (header) {
        header.classList.add('selected');
    }
    
    selectedObject = obj;
    
    // Resaltar objeto en 3D
    highlightObject(index);
}

// Resaltar objeto en 3D
function highlightObject(index) {
    console.log('Objeto seleccionado:', index);
}

// Establecer modo de vista
function setViewMode(mode) {
    viewMode = mode;
    
    // Actualizar botones
    document.querySelectorAll('.view3d-panel .control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-renderizar
    render3D();
    render2D();
}

// Establecer modo de canvas
function setCanvasMode(mode) {
    canvasMode = mode;
    
    // Actualizar botones
    document.querySelectorAll('.view2d-panel .control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-renderizar 2D
    render2D();
}

// Actualizar estadísticas
function updateStats() {
    const stats3d = document.getElementById('stats3d');
    const stats2d = document.getElementById('stats2d');
    
    let totalArea = 0;
    let totalVolume = 0;
    let objectCount = currentData.length;
    
    currentData.forEach(obj => {
        if (obj.Area) totalArea += obj.Area;
        if (obj.Volumen) totalVolume += obj.Volumen;
    });
    
    stats3d.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${objectCount}</div>
            <div class="stat-label">Objetos</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalArea.toFixed(2)}</div>
            <div class="stat-label">Área Total</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalVolume.toFixed(2)}</div>
            <div class="stat-label">Volumen Total</div>
        </div>
    `;
    
    stats2d.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${objectCount}</div>
            <div class="stat-label">Objetos 2D</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${canvasMode}</div>
            <div class="stat-label">Modo</div>
        </div>
    `;
}

// Mostrar error
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
} 
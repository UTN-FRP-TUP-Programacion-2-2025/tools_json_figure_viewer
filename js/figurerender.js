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
    console.log('DOM cargado, inicializando...');
    initialize3D();
    initialize2D();
    setupEventListeners();
    loadExampleData();
});

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    const fileInput = document.getElementById('jsonFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
        console.log('File input listener configurado');
    } else {
        console.error('No se encontró el elemento jsonFile');
    }
    
    const jsonTextarea = document.getElementById('jsonTextarea');
    if (jsonTextarea) {
        jsonTextarea.addEventListener('input', handleJsonInput);
        console.log('Textarea listener configurado');
    } else {
        console.error('No se encontró el elemento jsonTextarea');
    }
}

// Manejar carga de archivo
function handleFileUpload(event) {
    console.log('Archivo seleccionado:', event.target.files[0]);
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
    console.log('Cargando datos de ejemplo...');
    processData(exampleData);
    // Actualizar textarea con datos de ejemplo
    const textarea = document.getElementById('jsonTextarea');
    if (textarea) {
        textarea.value = JSON.stringify(exampleData, null, 2);
    }
}

// Procesar datos
function processData(data) {
    console.log('Procesando datos:', data);
    currentData = Array.isArray(data) ? data : [data];
    buildTree(currentData);
    render3D();
    render2D();
    updateStats();
}

// Inicializar vista 3D
function initialize3D() {
    console.log('Inicializando vista 3D...');
    const container = document.getElementById('view3d-container');
    if (!container) {
        console.error('No se encontró el contenedor 3D');
        return;
    }
    
    canvas3d = document.createElement('canvas');
    ctx3d = canvas3d.getContext('2d');
    
    canvas3d.width = container.clientWidth;
    canvas3d.height = container.clientHeight;
    container.appendChild(canvas3d);
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
    console.log('Vista 3D inicializada');
}

// Inicializar vista 2D
function initialize2D() {
    console.log('Inicializando vista 2D...');
    const container = document.getElementById('view2d-container');
    if (!container) {
        console.error('No se encontró el contenedor 2D');
        return;
    }
    
    canvas2d = document.createElement('canvas');
    ctx2d = canvas2d.getContext('2d');
    
    canvas2d.width = container.clientWidth;
    canvas2d.height = container.clientHeight;
    container.appendChild(canvas2d);
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
    console.log('Vista 2D inicializada');
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    const container3d = document.getElementById('view3d-container');
    const container2d = document.getElementById('view2d-container');
    
    if (canvas3d && container3d) {
        canvas3d.width = container3d.clientWidth;
        canvas3d.height = container3d.clientHeight;
        render3D();
    }
    
    if (canvas2d && container2d) {
        canvas2d.width = container2d.clientWidth;
        canvas2d.height = container2d.clientHeight;
        render2D();
    }
}

// Calcular dimensiones del objeto para distribución
function getObjectDimensions(object) {
    switch (object.Tipo) {
        case 'Cilindro':
            const radius = object.Tapas[0].Radio || 1;
            const cylinderHeight = object.Lado?.Lago || 2;
            return { width: radius * 2, height: cylinderHeight, depth: radius * 2 };
        case 'Cubo':
            const size = object.Caras[0].Lago || 1;
            return { width: size, height: size, depth: size };
        case 'Ortoedro':
            const width = object.Tapas[0].Largo || 1;
            const ortoHeight = object.Tapas[0].Ancho || 1;
            const depth = object.Laterales[0].Largo || 1;
            return { width, height: ortoHeight, depth };
        default:
            return { width: 1, height: 1, depth: 1 };
    }
}

// Calcular distribución óptima de objetos
function calculateOptimalLayout(objects, containerWidth, containerHeight) {
    const objectCount = objects.length;
    if (objectCount === 0) return { positions: [], scale: 1 };
    
    // Calcular dimensiones reales de cada objeto
    const objectDimensions = objects.map(obj => {
        const dims = getObjectDimensions(obj);
        return {
            object: obj,
            width: dims.width,
            height: dims.height,
            depth: dims.depth,
            // Calcular área aproximada para distribución
            area: dims.width * dims.height
        };
    });
    
    // Ordenar objetos por área (más grandes primero)
    objectDimensions.sort((a, b) => b.area - a.area);
    
    // Calcular área total disponible
    const margin = 60;
    const availableWidth = containerWidth - margin * 2;
    const availableHeight = containerHeight - margin * 2;
    const totalAvailableArea = availableWidth * availableHeight;
    
    // Calcular área total de objetos
    const totalObjectArea = objectDimensions.reduce((sum, obj) => sum + obj.area, 0);
    
    // Calcular escala base para que todos los objetos quepan
    const baseScale = Math.sqrt(totalAvailableArea / (totalObjectArea * 2)); // Factor 2 para espaciado
    
    // Distribuir objetos usando algoritmo de empaquetado
    const positions = [];
    const usedAreas = [];
    
    objectDimensions.forEach((objDim, index) => {
        const obj = objDim.object;
        const scaledWidth = objDim.width * baseScale;
        const scaledHeight = objDim.height * baseScale;
        
        // Buscar posición libre
        let position = findFreePosition(scaledWidth, scaledHeight, availableWidth, availableHeight, usedAreas, margin);
        
        // Si no se encuentra posición, usar distribución en grid
        if (!position) {
            const cols = Math.ceil(Math.sqrt(objectCount));
            const rows = Math.ceil(objectCount / cols);
            const cellWidth = availableWidth / cols;
            const cellHeight = availableHeight / rows;
            
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            position = {
                x: margin + col * cellWidth + cellWidth / 2,
                y: margin + row * cellHeight + cellHeight / 2
            };
        }
        
        // Registrar área usada
        usedAreas.push({
            x: position.x - scaledWidth / 2,
            y: position.y - scaledHeight / 2,
            width: scaledWidth,
            height: scaledHeight
        });
        
        positions.push({
            x: position.x,
            y: position.y,
            scale: baseScale * 0.8 // Reducir un poco para margen visual
        });
    });
    
    return { positions, scale: baseScale * 0.8 };
}

// Función auxiliar para encontrar posición libre
function findFreePosition(width, height, containerWidth, containerHeight, usedAreas, margin) {
    const padding = 20; // Espacio mínimo entre objetos
    
    // Intentar posiciones en una cuadrícula fina
    const gridSize = 50;
    const cols = Math.floor(containerWidth / gridSize);
    const rows = Math.floor(containerHeight / gridSize);
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = margin + col * gridSize + gridSize / 2;
            const y = margin + row * gridSize + gridSize / 2;
            
            // Verificar si esta posición está libre
            const canFit = usedAreas.every(usedArea => {
                const distanceX = Math.abs(x - (usedArea.x + usedArea.width / 2));
                const distanceY = Math.abs(y - (usedArea.y + usedArea.height / 2));
                const minDistanceX = (width + usedArea.width) / 2 + padding;
                const minDistanceY = (height + usedArea.height) / 2 + padding;
                
                return distanceX > minDistanceX || distanceY > minDistanceY;
            });
            
            if (canFit) {
                return { x, y };
            }
        }
    }
    
    return null; // No se encontró posición libre
}

// Función de debug para dibujar áreas de colisión
function drawCollisionAreas(layout, containerWidth, containerHeight, ctx = ctx3d) {
    if (!ctx) return;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    layout.positions.forEach((position, index) => {
        const object = currentData[index];
        const dims = getObjectDimensions(object);
        const scaledWidth = dims.width * position.scale;
        const scaledHeight = dims.height * position.scale;
        
        // Dibujar rectángulo de colisión
        ctx.strokeRect(
            position.x - scaledWidth / 2,
            position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight
        );
        
        // Dibujar centro del objeto
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.restore();
}

// Renderizar vista 3D con distribución mejorada
function render3D() {
    if (!ctx3d) {
        console.error('Contexto 3D no disponible');
        return;
    }
    
    const canvas = canvas3d;
    ctx3d.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentData.length === 0) return;
    
    // Calcular distribución óptima
    const layout = calculateOptimalLayout(currentData, canvas.width, canvas.height);
    
    // Debug: Dibujar áreas de colisión (opcional)
    if (window.debugMode) {
        drawCollisionAreas(layout, canvas.width, canvas.height);
    }
    
    // Dibujar objetos en sus posiciones calculadas
    currentData.forEach((object, index) => {
        const position = layout.positions[index];
        if (position) {
            draw3DObject(object, position.x, position.y, position.scale);
        }
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
    ctx3d.fillText(object.Tipo, x, y + scale * 100 + 30);
    
    ctx3d.restore();
}

// Dibujar cilindro 3D con escala dinámica
function drawCylinder3D(object, x, y, scale) {
    const radius = object.Tapas[0].Radio || 1;
    const height = object.Lado?.Lago || 2;
    
    const centerX = x;
    const centerY = y;
    
    // Calcular dimensiones escaladas
    const scaledRadius = radius * scale;
    const scaledHeight = height * scale;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - scaledRadius * 0.8, centerY + scaledHeight / 2, 
                   scaledRadius * 1.6, scaledHeight * 0.3);
    
    // Cuerpo del cilindro
    ctx3d.fillStyle = 'rgba(102, 126, 234, 0.8)';
    ctx3d.fillRect(centerX - scaledRadius, centerY, 
                   scaledRadius * 2, scaledHeight);
    
    // Tapas
    ctx3d.fillStyle = 'rgba(102, 126, 234, 0.9)';
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.fill();
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY + scaledHeight, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.fill();
    
    // Contorno
    ctx3d.strokeStyle = '#667eea';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - scaledRadius, centerY, 
                     scaledRadius * 2, scaledHeight);
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.stroke();
    ctx3d.beginPath();
    ctx3d.ellipse(centerX, centerY + scaledHeight, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx3d.stroke();
}

// Dibujar cubo 3D con escala dinámica
function drawCube3D(object, x, y, scale) {
    const size = object.Caras[0].Lago || 1;
    
    const centerX = x;
    const centerY = y;
    
    // Calcular dimensiones escaladas
    const scaledSize = size * scale;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - scaledSize * 0.8, centerY + scaledSize, 
                   scaledSize * 1.6, scaledSize * 0.3);
    
    // Cara frontal
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.8)';
    ctx3d.fillRect(centerX - scaledSize, centerY - scaledSize, 
                   scaledSize * 2, scaledSize * 2);
    
    // Cara lateral
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.6)';
    ctx3d.fillRect(centerX + scaledSize, centerY - scaledSize * 0.8, 
                   scaledSize * 0.8, scaledSize * 1.6);
    
    // Cara superior
    ctx3d.fillStyle = 'rgba(118, 75, 162, 0.9)';
    ctx3d.fillRect(centerX - scaledSize, centerY - scaledSize * 1.8, 
                   scaledSize * 2, scaledSize * 0.8);
    
    // Contorno
    ctx3d.strokeStyle = '#764ba2';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - scaledSize, centerY - scaledSize, 
                     scaledSize * 2, scaledSize * 2);
    ctx3d.strokeRect(centerX + scaledSize, centerY - scaledSize * 0.8, 
                     scaledSize * 0.8, scaledSize * 1.6);
    ctx3d.strokeRect(centerX - scaledSize, centerY - scaledSize * 1.8, 
                     scaledSize * 2, scaledSize * 0.8);
}

// Dibujar ortoedro 3D con escala dinámica
function drawOrtoedro3D(object, x, y, scale) {
    const width = object.Tapas[0].Largo || 1;
    const height = object.Tapas[0].Ancho || 1;
    const depth = object.Laterales[0].Largo || 1;
    
    const centerX = x;
    const centerY = y;
    
    // Calcular dimensiones escaladas
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const scaledDepth = depth * scale;
    
    // Sombra
    ctx3d.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx3d.fillRect(centerX - scaledWidth * 0.8, centerY + scaledHeight, 
                   scaledWidth * 1.6, scaledHeight * 0.3);
    
    // Cara frontal
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.8)';
    ctx3d.fillRect(centerX - scaledWidth, centerY - scaledHeight, 
                   scaledWidth * 2, scaledHeight * 2);
    
    // Cara lateral
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.6)';
    ctx3d.fillRect(centerX + scaledWidth, centerY - scaledHeight * 0.8, 
                   scaledDepth * 0.8, scaledHeight * 1.6);
    
    // Cara superior
    ctx3d.fillStyle = 'rgba(72, 187, 120, 0.9)';
    ctx3d.fillRect(centerX - scaledWidth, centerY - scaledHeight * 1.8, 
                   scaledWidth * 2, scaledHeight * 0.8);
    
    // Contorno
    ctx3d.strokeStyle = '#48bb78';
    ctx3d.lineWidth = 2;
    ctx3d.strokeRect(centerX - scaledWidth, centerY - scaledHeight, 
                     scaledWidth * 2, scaledHeight * 2);
    ctx3d.strokeRect(centerX + scaledWidth, centerY - scaledHeight * 0.8, 
                     scaledDepth * 0.8, scaledHeight * 1.6);
    ctx3d.strokeRect(centerX - scaledWidth, centerY - scaledHeight * 1.8, 
                     scaledWidth * 2, scaledHeight * 0.8);
}

// Renderizar vista 2D con distribución mejorada
function render2D() {
    if (!ctx2d) {
        console.error('Contexto 2D no disponible');
        return;
    }
    
    const canvas = canvas2d;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentData.length === 0) return;
    
    // Calcular distribución óptima
    const layout = calculateOptimalLayout(currentData, canvas.width, canvas.height);
    
    // Debug: Dibujar áreas de colisión (opcional)
    if (window.debugMode) {
        drawCollisionAreas(layout, canvas.width, canvas.height, ctx2d);
    }
    
    // Dibujar objetos en sus posiciones calculadas
    currentData.forEach((object, index) => {
        const position = layout.positions[index];
        if (position) {
            draw2DObject(object, position.x, position.y, position.scale);
        }
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
    ctx2d.fillText(object.Tipo, x, y + scale * 80 + 30);
    
    ctx2d.restore();
}

// Dibujar cilindro 2D con escala dinámica
function drawCylinder2D(object, x, y, scale) {
    const radius = object.Tapas[0].Radio || 1;
    const height = object.Lado?.Lago || 2;
    
    // Calcular dimensiones escaladas
    const scaledRadius = radius * scale;
    const scaledHeight = height * scale;
    
    ctx2d.strokeStyle = '#667eea';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(102, 126, 234, 0.3)';
        ctx2d.fillRect(x - scaledRadius, y - scaledHeight / 2, 
                       scaledRadius * 2, scaledHeight);
        ctx2d.fillStyle = 'rgba(102, 126, 234, 0.6)';
        ctx2d.beginPath();
        ctx2d.ellipse(x, y - scaledHeight / 2, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
        ctx2d.fill();
        ctx2d.beginPath();
        ctx2d.ellipse(x, y + scaledHeight / 2, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
        ctx2d.fill();
    }
    
    ctx2d.strokeRect(x - scaledRadius, y - scaledHeight / 2, 
                     scaledRadius * 2, scaledHeight);
    ctx2d.beginPath();
    ctx2d.ellipse(x, y - scaledHeight / 2, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx2d.stroke();
    ctx2d.beginPath();
    ctx2d.ellipse(x, y + scaledHeight / 2, scaledRadius, scaledRadius * 0.3, 0, 0, 2 * Math.PI);
    ctx2d.stroke();
}

// Dibujar cubo 2D con escala dinámica
function drawCube2D(object, x, y, scale) {
    const size = object.Caras[0].Lago || 1;
    
    // Calcular dimensiones escaladas
    const scaledSize = size * scale;
    
    ctx2d.strokeStyle = '#764ba2';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(118, 75, 162, 0.3)';
        ctx2d.fillRect(x - scaledSize, y - scaledSize, 
                       scaledSize * 2, scaledSize * 2);
    }
    
    ctx2d.strokeRect(x - scaledSize, y - scaledSize, 
                     scaledSize * 2, scaledSize * 2);
}

// Dibujar ortoedro 2D con escala dinámica
function drawOrtoedro2D(object, x, y, scale) {
    const width = object.Tapas[0].Largo || 1;
    const height = object.Tapas[0].Ancho || 1;
    
    // Calcular dimensiones escaladas
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    ctx2d.strokeStyle = '#48bb78';
    ctx2d.lineWidth = 2;
    
    if (canvasMode === 'filled') {
        ctx2d.fillStyle = 'rgba(72, 187, 120, 0.3)';
        ctx2d.fillRect(x - scaledWidth, y - scaledHeight, 
                       scaledWidth * 2, scaledHeight * 2);
    }
    
    ctx2d.strokeRect(x - scaledWidth, y - scaledHeight, 
                     scaledWidth * 2, scaledHeight * 2);
}

// Construir árbol jerárquico con propiedades detalladas
function buildTree(data) {
    console.log('Construyendo árbol con', data.length, 'objetos');
    const treeContainer = document.getElementById('jsonTree');
    if (!treeContainer) {
        console.error('No se encontró el contenedor del árbol');
        return;
    }
    
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
            ${getObjectDimensionsText(obj)}
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

// Obtener texto de dimensiones del objeto
function getObjectDimensionsText(obj) {
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
    console.log('Cambiando modo de vista a:', mode);
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
    console.log('Cambiando modo de canvas a:', mode);
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
    
    if (stats3d) {
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
    }
    
    if (stats2d) {
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
}

// Mostrar error
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Función para activar/desactivar modo debug
function toggleDebugMode() {
    window.debugMode = !window.debugMode;
    console.log('Modo debug:', window.debugMode ? 'activado' : 'desactivado');
    
    // Re-renderizar para mostrar/ocultar áreas de colisión
    render3D();
    render2D();
}

// Función para verificar distribución
function checkDistribution() {
    if (!currentData || currentData.length === 0) {
        console.log('No hay datos para verificar');
        return;
    }
    
    const canvas = canvas3d || canvas2d;
    if (!canvas) {
        console.log('No hay canvas disponible');
        return;
    }
    
    const layout = calculateOptimalLayout(currentData, canvas.width, canvas.height);
    
    console.log('=== Verificación de Distribución ===');
    console.log('Objetos:', currentData.length);
    console.log('Posiciones calculadas:', layout.positions.length);
    console.log('Escala base:', layout.scale);
    
    // Verificar superposiciones
    let overlaps = 0;
    for (let i = 0; i < layout.positions.length; i++) {
        for (let j = i + 1; j < layout.positions.length; j++) {
            const pos1 = layout.positions[i];
            const pos2 = layout.positions[j];
            const obj1 = currentData[i];
            const obj2 = currentData[j];
            
            const dims1 = getObjectDimensions(obj1);
            const dims2 = getObjectDimensions(obj2);
            
            const width1 = dims1.width * pos1.scale;
            const height1 = dims1.height * pos1.scale;
            const width2 = dims2.width * pos2.scale;
            const height2 = dims2.height * pos2.scale;
            
            const distanceX = Math.abs(pos1.x - pos2.x);
            const distanceY = Math.abs(pos1.y - pos2.y);
            const minDistanceX = (width1 + width2) / 2;
            const minDistanceY = (height1 + height2) / 2;
            
            if (distanceX < minDistanceX && distanceY < minDistanceY) {
                overlaps++;
                console.log(`⚠️ Superposición detectada entre objetos ${i} y ${j}`);
            }
        }
    }
    
    if (overlaps === 0) {
        console.log('✅ No se detectaron superposiciones');
    } else {
        console.log(`❌ Se detectaron ${overlaps} superposiciones`);
    }
    
    return { overlaps, layout };
} 
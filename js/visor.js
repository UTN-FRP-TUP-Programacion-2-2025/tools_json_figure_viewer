// Variables globales para Three.js
let scene, camera, renderer, objects = [];
let isMouseDown = false, mouseX = 0, mouseY = 0;
let showWireframe = false;

// Variables para rotación orbital
let cameraDistance = 25;
let cameraAngleX = 0.3; // Ángulo vertical (elevación)
let cameraAngleY = 0;   // Ángulo horizontal (azimut)
let objectsCenter = { x: 0, y: 0, z: 0 }; // Centro del conjunto

// Colores para diferentes tipos de objetos
const objectColors = {
    'Cilindro': 0x3498db,
    'Cubo': 0xe74c3c,
    'Ortoedro': 0x2ecc71,
    'Rectangulo': 0xf39c12,
    'Cuadrado': 0x9b59b6,
    'Circulo': 0x1abc9c
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    setupEventListeners();
    // Procesar JSON inicial
    document.getElementById('parseBtn').click();
});

function setupEventListeners() {
    document.getElementById('parseBtn').addEventListener('click', processJSON);
    document.getElementById('resetView').addEventListener('click', resetView);
    document.getElementById('toggleWireframe').addEventListener('click', toggleWireframe);
    document.getElementById('centerObjects').addEventListener('click', centerObjects);
    
    // Controles de mouse para rotación
    const canvas = document.getElementById('canvas-3d');
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);
}

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('canvas-3d');
    
    // Configurar escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2c3e50);
    
    // Configurar cámara
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    updateCameraPosition();
    
    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x4fc3f7, 0.5, 100);
    pointLight.position.set(-10, 0, 0);
    scene.add(pointLight);
    
    // Añadir grilla de referencia
    const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    // Iniciar render loop
    animate();
}

function createCylinder(radius, height, position = { x: 0, y: 0, z: 0 }, color = objectColors.Cilindro) {
    const group = new THREE.Group();
    
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    
    const cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.castShadow = true;
    cylinderMesh.receiveShadow = true;
    
    if (showWireframe) {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
        group.add(line);
    }
    
    group.add(cylinderMesh);
    group.position.set(position.x, height/2, position.z);
    
    return group;
}

function createCube(size, position = { x: 0, y: 0, z: 0 }, color = objectColors.Cubo) {
    const group = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    
    const cubeMesh = new THREE.Mesh(geometry, material);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    
    if (showWireframe) {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
        group.add(line);
    }
    
    group.add(cubeMesh);
    group.position.set(position.x, size/2, position.z);
    
    return group;
}

function createOrtoedro(width, height, depth, position = { x: 0, y: 0, z: 0 }, color = objectColors.Ortoedro) {
    const group = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    
    const ortoedroMesh = new THREE.Mesh(geometry, material);
    ortoedroMesh.castShadow = true;
    ortoedroMesh.receiveShadow = true;
    
    if (showWireframe) {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
        group.add(line);
    }
    
    group.add(ortoedroMesh);
    group.position.set(position.x, height/2, position.z);
    
    return group;
}

function createPlaneShape(type, width, height, position = { x: 0, y: 0, z: 0 }, color) {
    const group = new THREE.Group();
    
    let geometry;
    if (type === 'Circulo') {
        geometry = new THREE.CircleGeometry(width, 32);
        color = color || objectColors.Circulo;
    } else {
        geometry = new THREE.PlaneGeometry(width, height);
        color = color || objectColors.Rectangulo;
    }
    
    const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.receiveShadow = true;
    
    if (showWireframe) {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
        group.add(line);
    }
    
    group.add(planeMesh);
    group.position.set(position.x, 0.1, position.z);
    group.rotation.x = -Math.PI / 2; // Rotar para que esté horizontal
    
    return group;
}

/*sol1
function getRandomPosition(existingPositions, objectSize) {
    const maxAttempts = 100;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        const x = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;
        
        let collision = false;
        for (let pos of existingPositions) {
            const distance = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
            const minDistance = objectSize + pos.size + 2; // Margen de seguridad
            
            if (distance < minDistance) {
                collision = true;
                break;
            }
        }
        
        if (!collision) {
            return { x, z, size: objectSize };
        }
        
        attempts++;
    }
    
    // Si no se puede evitar colisión, usar posición aleatoria
    return {
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        size: objectSize
    };
}
*/

/*sol2
function getRandomPosition(existingPositions, newObjectSize) {
    const maxAttempts = 100;
    const padding = 2; // Margen de seguridad entre objetos
    
    for (let i = 0; i < maxAttempts; i++) {
        // Genera una posición aleatoria dentro de un rango más amplio
        const x = (Math.random() - 0.5) * 40; 
        const z = (Math.random() - 0.5) * 40;
        
        let collision = false;
        for (const existingPos of existingPositions) {
            // Calcula la distancia entre los centros
            const distance = Math.sqrt(
                (x - existingPos.x) ** 2 + 
                (z - existingPos.z) ** 2
            );
            
            // La distancia mínima debe ser la suma de la mitad del tamaño de cada objeto
            const minDistance = (existingPos.size / 2) + (newObjectSize / 2) + padding;
            
            if (distance < minDistance) {
                collision = true;
                break;
            }
        }
        
        if (!collision) {
            // Si no hay colisión, devuelve la posición encontrada
            return { x, z, size: newObjectSize };
        }
    }
    
    // Si no se encuentra una posición sin colisión después de muchos intentos
    // devuelva una posición aleatoria y advierte de una posible superposición.
    console.warn("No se pudo encontrar una posición sin colisión. Los objetos pueden superponerse.");
    return {
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        size: newObjectSize
    };
}
*/


//sol3 - es buena - pero esta distribuida aleatoriamente
function getRandomPosition(existingPositions, newObjectRadius, padding) {
    const maxAttempts = 100;
    
    for (let i = 0; i < maxAttempts; i++) {
        const x = (Math.random() - 0.5) * 40; 
        const z = (Math.random() - 0.5) * 40;
        
        let collision = false;
        for (const existingPos of existingPositions) {
            const distance = Math.sqrt(
                (x - existingPos.x) ** 2 + 
                (z - existingPos.z) ** 2
            );
            
            // La distancia mínima es la suma de los radios de ambos objetos, más el padding.
            const minDistance = existingPos.radius + newObjectRadius + padding;
            
            if (distance < minDistance) {
                collision = true;
                break;
            }
        }
        
        if (!collision) {
            return { x, z };
        }
    }
    
    console.warn("No se pudo encontrar una posición sin colisión después de 100 intentos.");
    return {
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
    };
}


function calculateObjectsCenter() {
    if (objects.length === 0) {
        objectsCenter = { x: 0, y: 0, z: 0 };
        return;
    }
    
    let totalX = 0, totalZ = 0;
    let maxY = 0;
    
    objects.forEach(obj => {
        totalX += obj.position.x;
        totalZ += obj.position.z;
        
        // Calcular altura máxima para centrado vertical
        const box = new THREE.Box3().setFromObject(obj);
        maxY = Math.max(maxY, box.max.y);
    });
    
    objectsCenter = {
        x: totalX / objects.length,
        y: maxY / 2, // Centro vertical basado en altura máxima
        z: totalZ / objects.length
    };
}

function updateCameraPosition() {
    // Posición de la cámara en coordenadas esféricas
    const x = objectsCenter.x + cameraDistance * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
    const y = objectsCenter.y + cameraDistance * Math.sin(cameraAngleX);
    const z = objectsCenter.z + cameraDistance * Math.cos(cameraAngleX) * Math.sin(cameraAngleY);
    
    camera.position.set(x, y, z);
    camera.lookAt(objectsCenter.x, objectsCenter.y, objectsCenter.z);
}


function processJSON() {
    let jsonText = document.getElementById('jsonInput').value;
    
    try {
        // Limpiar JSON de comas finales comunes
        jsonText = cleanJSON(jsonText);
        
        const jsonData = JSON.parse(jsonText);
        
        // Limpiar objetos existentes
        clearScene();
        
        // Crear árbol jerárquico
        createJSONTree(jsonData);
        
        // Actualizar información del objeto
        updateObjectInfo(jsonData);
        
        // Procesar y crear objetos 3D
        if (Array.isArray(jsonData)) {
            processObjectArray(jsonData);
        } else {
            // Objeto único
            const position = { x: 0, y: 0, z: 0 };
            const obj = create3DObject(jsonData, position);
            if (obj) {
                objects.push(obj);
                scene.add(obj);
            }
            
            // Para objeto único, el centro es el origen
            objectsCenter = { x: 0, y: 0, z: 0 };
            updateCameraPosition();
        }
        
    } catch (error) {
        // Mostrar error más detallado
        const errorMsg = `Error al procesar JSON: ${error.message}\n\nSugerencias:\n- Verifica comas finales\n- Revisa comillas y corchetes\n- Asegúrate que todos los objetos estén bien cerrados`;
        alert(errorMsg);
        console.error('JSON Error Details:', error);
        console.log('Cleaned JSON:', jsonText);
    }
}


function cleanJSON(jsonStr) {
    // Eliminar comentarios de una línea (// ...)
    jsonStr = jsonStr.replace(/\/\/.*$/gm, '');
    
    // Eliminar comentarios de bloque (/* ... */)
    jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Eliminar comas finales antes de } y ]
    // Esto maneja casos como: "key": value, } o "key": value, ]
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
    
    // Limpiar espacios en blanco excesivos
    jsonStr = jsonStr.replace(/\s+/g, ' ').trim();
    
    return jsonStr;
}

function clearScene() {
    // Remover todos los objetos existentes
    objects.forEach(obj => scene.remove(obj));
    objects = [];
}

/*
function processObjectArray(dataArray) {
    const positions = [];
    
    dataArray.forEach((objData, index) => {
        let objectSize = 5; // Tamaño por defecto
        
        // Calcular tamaño aproximado del objeto para evitar superposición
        if (objData.Tipo === 'Cilindro' && objData.Tapas && objData.Tapas[0]) {
            objectSize = objData.Tapas[0].Radio * 2;
        } else if (objData.Tipo === 'Cubo' && objData.Caras && objData.Caras[0]) {
            objectSize = objData.Caras[0].Largo;
        } else if (objData.Tipo === 'Ortoedro' && objData.Tapas && objData.Tapas[0]) {
            objectSize = Math.max(objData.Tapas[0].Largo, objData.Tapas[0].Ancho);
        }
        
        const position = getRandomPosition(positions, objectSize);
        positions.push(position);
        
        const obj = create3DObject(objData, { x: position.x, y: 0, z: position.z });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    });
    
    // Calcular centro del conjunto de objetos
    calculateObjectsCenter();
    updateCameraPosition();
}
*/
/*sol1
function processObjectArray(dataArray) {
    const positions = [];
    
    dataArray.forEach((objData, index) => {
        let objectSize;
        
        // Calcular el tamaño aproximado del objeto para la detección de colisiones
        // Se toma la dimensión más grande para asegurar un margen suficiente
        switch (objData.Tipo) {
            case 'Cilindro':
                objectSize = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Radio * 2 : 5;
                break;
            case 'Cubo':
                // Nota: Usar 'Largo' como la longitud del lado, como en tu código
                objectSize = (objData.Caras && objData.Caras[0]) ? objData.Caras[0].Largo : 5;
                break;
            case 'Ortoedro':
                objectSize = (objData.Tapas && objData.Tapas[0]) ? Math.max(objData.Tapas[0].Largo, objData.Tapas[0].Ancho) : 5;
                break;
            case 'Rectangulo':
                objectSize = objData.Largo ? Math.max(objData.Largo, objData.Ancho) : 5;
                break;
            case 'Cuadrado':
                objectSize = objData.Largo || 5;
                break;
            case 'Circulo':
                objectSize = objData.Radio ? objData.Radio * 2 : 5;
                break;
            default:
                objectSize = 5; // Tamaño por defecto si el tipo no coincide
        }
        
        const position = getRandomPosition(positions, objectSize);
        positions.push(position);
        
        const obj = create3DObject(objData, { x: position.x, y: 0, z: position.z });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    });
    
    calculateObjectsCenter();
    updateCameraPosition();
}
*/
//sol2

/*sol3
function processObjectArray(dataArray) {
    const positions = [];
    const padding = 2; // Margen de seguridad entre objetos
    
    dataArray.forEach((objData, index) => {
        let objectRadius; // Usaremos un radio para la detección de colisiones
        
        switch (objData.Tipo) {
            case 'Cilindro':
                // El radio de colisión es el radio del cilindro.
                objectRadius = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Radio : 2.5;
                break;
            case 'Cubo':
                // El radio de colisión es la mitad de la diagonal de la base del cubo.
                const size = (objData.Caras && objData.Caras[0]) ? objData.Caras[0].Largo : 5;
                objectRadius = Math.sqrt(size * size + size * size) / 2;
                break;
            case 'Ortoedro':
                // El radio de colisión es la mitad de la diagonal de la base del ortoedro.
                const width = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Largo : 5;
                const depth = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Ancho : 5;
                objectRadius = Math.sqrt(width * width + depth * depth) / 2;
                break;
            case 'Rectangulo':
                // El radio de colisión es la mitad de la diagonal del rectángulo.
                const rectLargo = objData.Largo || 5;
                const rectAncho = objData.Ancho || 5;
                objectRadius = Math.sqrt(rectLargo * rectLargo + rectAncho * rectAncho) / 2;
                break;
            case 'Cuadrado':
                // Igual que el cubo, pero para una forma plana.
                const lado = objData.Largo || 5;
                objectRadius = Math.sqrt(lado * lado + lado * lado) / 2;
                break;
            case 'Circulo':
                // El radio de colisión es el radio del círculo.
                objectRadius = objData.Radio || 2.5;
                break;
            default:
                objectRadius = 2.5; // Radio por defecto
        }
        
        const position = getRandomPosition(positions, objectRadius, padding);
        positions.push({ x: position.x, z: position.z, radius: objectRadius });
        
        const obj = create3DObject(objData, { x: position.x, y: 0, z: position.z });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    });
    
    calculateObjectsCenter();
    updateCameraPosition();
}
//
*/

/*
//sol4 - ubicarlos sobre una circunferencia
function processObjectArray(dataArray) {
    // Almacena objetos con su radio de envoltura
    const objectsWithRadius = [];
    const padding = 2; // Margen de seguridad entre objetos
    
    dataArray.forEach(objData => {
        let objectRadius;
        
        switch (objData.Tipo) {
            case 'Cilindro':
                objectRadius = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Radio : 2.5;
                break;
            case 'Cubo':
                const size = (objData.Caras && objData.Caras[0]) ? objData.Caras[0].Largo : 5;
                objectRadius = Math.sqrt(size * size + size * size) / 2;
                break;
            case 'Ortoedro':
                const width = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Largo : 5;
                const depth = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Ancho : 5;
                objectRadius = Math.sqrt(width * width + depth * depth) / 2;
                break;
            case 'Rectangulo':
                const rectLargo = objData.Largo || 5;
                const rectAncho = objData.Ancho || 5;
                objectRadius = Math.sqrt(rectLargo * rectLargo + rectAncho * rectAncho) / 2;
                break;
            case 'Cuadrado':
                const lado = objData.Largo || 5;
                objectRadius = Math.sqrt(lado * lado + lado * lado) / 2;
                break;
            case 'Circulo':
                objectRadius = objData.Radio || 2.5;
                break;
            default:
                objectRadius = 2.5;
        }
        
        objectsWithRadius.push({ data: objData, radius: objectRadius });
    });
    
    // --- NUEVA LÓGICA DE POSICIONAMIENTO ---
    
    // Si hay un solo objeto, colócalo en el centro
    if (objectsWithRadius.length === 1) {
        const obj = create3DObject(objectsWithRadius[0].data, { x: 0, y: 0, z: 0 });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    } else if (objectsWithRadius.length > 1) {
        let totalAngle = 0;
        
        for (let i = 0; i < objectsWithRadius.length; i++) {
            const currentObject = objectsWithRadius[i];
            const nextObject = objectsWithRadius[(i + 1) % objectsWithRadius.length];
            
            // Distancia mínima requerida para el siguiente objeto
            const minDistance = currentObject.radius + nextObject.radius + padding;
            
            // El radio del círculo de posicionamiento será la distancia al objeto actual
            const positionRadius = minDistance / 2;
            
            // Calcula la posición en el círculo
            const x = positionRadius * Math.cos(totalAngle);
            const z = positionRadius * Math.sin(totalAngle);
            
            // Crea y añade el objeto
            const obj = create3DObject(currentObject.data, { x, y: 0, z });
            if (obj) {
                objects.push(obj);
                scene.add(obj);
            }
            
            // Aumenta el ángulo para el siguiente objeto, basándote en la distancia
            const angleIncrement = Math.acos(1 - (minDistance * minDistance) / (2 * positionRadius * positionRadius));
            totalAngle += angleIncrement;
        }
    }
    
    // Calcular el centro del conjunto de objetos
    calculateObjectsCenter();
    updateCameraPosition();
}
*/


/*sol final: ubicarlos sobre una circunsferencia en la que la separacion sobre uno de otro este basdada
en el mayor radio de envoltura de cada objeto

function processObjectArray(dataArray) {
    // 1. Recorrer todos los objetos para calcular sus radios de envoltura
    const objectsWithRadius = dataArray.map(objData => {
        let objectRadius;
        
        switch (objData.Tipo) {
            case 'Cilindro':
                objectRadius = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Radio : 2.5;
                break;
            case 'Cubo':
                const size = (objData.Caras && objData.Caras[0]) ? objData.Caras[0].Largo : 5;
                objectRadius = Math.sqrt(size * size + size * size) / 2;
                break;
            case 'Ortoedro':
                const width = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Largo : 5;
                const depth = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Ancho : 5;
                objectRadius = Math.sqrt(width * width + depth * depth) / 2;
                break;
            case 'Rectangulo':
                const rectLargo = objData.Largo || 5;
                const rectAncho = objData.Ancho || 5;
                objectRadius = Math.sqrt(rectLargo * rectLargo + rectAncho * rectAncho) / 2;
                break;
            case 'Cuadrado':
                const lado = objData.Largo || 5;
                objectRadius = Math.sqrt(lado * lado + lado * lado) / 2;
                break;
            case 'Circulo':
                objectRadius = objData.Radio || 2.5;
                break;
            default:
                objectRadius = 2.5;
        }
        
        return { data: objData, radius: objectRadius };
    });
    
    // 2. Determinar el radio de envoltura máximo
    const maxRadius = objectsWithRadius.reduce((max, obj) => Math.max(max, obj.radius), 0);
    const padding = 2; // Margen de seguridad entre objetos
    const separationDistance = (maxRadius * 2) + padding; // Distancia entre centros
    
    // 3. Posicionar los objetos en la circunferencia
    clearScene(); // Asegurarse de que la escena esté limpia
    
    // Si hay un solo objeto, colócalo en el centro
    if (objectsWithRadius.length === 1) {
        const obj = create3DObject(objectsWithRadius[0].data, { x: 0, y: 0, z: 0 });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    } else if (objectsWithRadius.length > 1) {
        // Calcular el radio de la circunferencia de posicionamiento
        // Esto asume que los objetos se posicionan hombro con hombro
        const circumferenceRadius = (objectsWithRadius.length * separationDistance) / (2 * Math.PI);
        
        for (let i = 0; i < objectsWithRadius.length; i++) {
            const angle = (i / objectsWithRadius.length) * 2 * Math.PI;
            
            const x = circumferenceRadius * Math.cos(angle);
            const z = circumferenceRadius * Math.sin(angle);
            
            const obj = create3DObject(objectsWithRadius[i].data, { x, y: 0, z });
            if (obj) {
                objects.push(obj);
                scene.add(obj);
            }
        }
    }
    
    // Calcular el centro del conjunto de objetos
    calculateObjectsCenter();
    updateCameraPosition();
}
*/

//sol final 2: //distribución en cuadrícula con separación basada en el radio de envoltura máximo
function processObjectArray(dataArray) {
    // 1. Recorrer todos los objetos para calcular sus radios de envoltura
    const objectsWithRadius = dataArray.map(objData => {
        let objectRadius;
        
        switch (objData.Tipo) {
            case 'Cilindro':
                objectRadius = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Radio : 2.5;
                break;
            case 'Cubo':
                const size = (objData.Caras && objData.Caras[0]) ? objData.Caras[0].Largo : 5;
                objectRadius = Math.sqrt(size * size + size * size) / 2;
                break;
            case 'Ortoedro':
                const width = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Largo : 5;
                const depth = (objData.Tapas && objData.Tapas[0]) ? objData.Tapas[0].Ancho : 5;
                objectRadius = Math.sqrt(width * width + depth * depth) / 2;
                break;
            case 'Rectangulo':
                const rectLargo = objData.Largo || 5;
                const rectAncho = objData.Ancho || 5;
                objectRadius = Math.sqrt(rectLargo * rectLargo + rectAncho * rectAncho) / 2;
                break;
            case 'Cuadrado':
                const lado = objData.Largo || 5;
                objectRadius = Math.sqrt(lado * lado + lado * lado) / 2;
                break;
            case 'Circulo':
                objectRadius = objData.Radio || 2.5;
                break;
            default:
                objectRadius = 2.5;
        }
        
        return { data: objData, radius: objectRadius };
    });

    // 2. Determinar el radio de envoltura máximo y la distancia de separación
    const maxRadius = objectsWithRadius.reduce((max, obj) => Math.max(max, obj.radius), 0);
    const padding = 2;
    const separationDistance = (maxRadius * 2) + padding;

    // --- CÁLCULO AUTOMÁTICO DE gridSize ---
    // Estimar el lado del cuadrado que contendrá a todos los objetos
    const numObjects = objectsWithRadius.length;
    if (numObjects === 0) {
        // No hay objetos para colocar, salir de la función
        return;
    }
    // Calcular el número de columnas y filas necesarias para formar una cuadrícula cuadrada
    const sideLength = Math.ceil(Math.sqrt(numObjects));
    // El gridSize es la mitad del tamaño total del área de la cuadrícula
    const autoGridSize = (sideLength * separationDistance) / 2 + separationDistance; 

    // 3. Crear una matriz de puntos posibles usando el gridSize calculado
    const gridPoints = [];
    const startX = -autoGridSize;
    const startZ = -autoGridSize;
    const step = separationDistance;
    
    for (let x = startX; x <= autoGridSize; x += step) {
        for (let z = startZ; z <= autoGridSize; z += step) {
            gridPoints.push({ x, z });
        }
    }
    
    // Asegurarse de que haya suficientes puntos
    if (gridPoints.length < numObjects) {
        // En caso de que el cálculo falle por los redondeos, ajustar el gridSize
        console.warn("Recalculando gridSize. Los objetos pueden quedar más cerca de los bordes.");
        const newGridSize = autoGridSize + separationDistance;
        gridPoints.length = 0; // Vaciar el array
        for (let x = -newGridSize; x <= newGridSize; x += step) {
            for (let z = -newGridSize; z <= newGridSize; z += step) {
                gridPoints.push({ x, z });
            }
        }
    }

    // 4. Asignar objetos a los puntos de forma aleatoria
    clearScene();
    
    const shuffledObjects = objectsWithRadius.sort(() => Math.random() - 0.5);
    const shuffledGridPoints = gridPoints.sort(() => Math.random() - 0.5);

    shuffledObjects.forEach((objData, index) => {
        const position = shuffledGridPoints[index];
        const obj = create3DObject(objData.data, { x: position.x, y: 0, z: position.z });
        if (obj) {
            objects.push(obj);
            scene.add(obj);
        }
    });
    
    // Calcular el centro del conjunto de objetos
    calculateObjectsCenter();
    updateCameraPosition();
}

function create3DObject(data, position) {
    const type = data.Tipo;
    
    switch (type) {
        case 'Cilindro':
            if (data.Tapas && data.Tapas[0] && data.Lado) {
                const radius = data.Tapas[0].Radio;
                const height = data.Lado.Largo;
                return createCylinder(radius, height, position);
            }
            break;
            
        case 'Cubo':
            if (data.Caras && data.Caras[0]) {
                const size = data.Caras[0].Largo;
                return createCube(size, position);
            }
            break;
            
        case 'Ortoedro':
            if (data.Tapas && data.Tapas[0] && data.Laterales && data.Laterales[0]) {
                const width = data.Tapas[0].Largo;
                const depth = data.Tapas[0].Ancho;
                const height = data.Laterales[0].Ancho;
                return createOrtoedro(width, height, depth, position);
            }
            break;
            
        case 'Rectangulo':
            if (data.Largo && data.Ancho) {
                return createPlaneShape('Rectangulo', data.Largo, data.Ancho, position);
            }
            break;
            
        case 'Cuadrado':
            if (data.Largo) {
                return createPlaneShape('Rectangulo', data.Largo, data.Largo, position, objectColors.Cuadrado);
            }
            break;
            
        case 'Circulo':
            if (data.Radio) {
                return createPlaneShape('Circulo', data.Radio, data.Radio, position);
            }
            break;
    }
    
    return null;
}

function createJSONTree(data) {
    const container = document.getElementById('jsonTree');
    container.innerHTML = '';
    
    const rootNode = createJSONNode('JSON', data, 0);
    container.appendChild(rootNode);
}

function createJSONNode(key, value, level) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'json-node';
    
    if (typeof value === 'object' && value !== null) {
        // Crear nodo expandible
        const keySpan = document.createElement('span');
        keySpan.className = 'json-key';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down expand-icon';
        
        const keyText = document.createElement('span');
        keyText.textContent = key;
        
        const typeInfo = document.createElement('span');
        typeInfo.className = 'json-value';
        typeInfo.textContent = Array.isArray(value) ? ` [${value.length}]` : ' {}';
        
        keySpan.appendChild(icon);
        keySpan.appendChild(keyText);
        keySpan.appendChild(typeInfo);
        
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'json-children';
        
        // Crear nodos hijos
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const childNode = createJSONNode(`[${index}]`, item, level + 1);
                childrenDiv.appendChild(childNode);
            });
        } else {
            Object.keys(value).forEach(childKey => {
                const childNode = createJSONNode(childKey, value[childKey], level + 1);
                childrenDiv.appendChild(childNode);
            });
        }
        
        // Event listener para colapsar/expandir
        keySpan.addEventListener('click', function() {
            const isCollapsed = childrenDiv.classList.contains('collapsed');
            childrenDiv.classList.toggle('collapsed');
            icon.classList.toggle('collapsed');
        });
        
        nodeDiv.appendChild(keySpan);
        nodeDiv.appendChild(childrenDiv);
        
    } else {
        // Nodo hoja
        const keySpan = document.createElement('span');
        keySpan.className = 'json-key';
        keySpan.textContent = key + ':';
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'json-value';
        
        if (typeof value === 'string') {
            valueSpan.className += ' json-string';
            valueSpan.textContent = `"${value}"`;
        } else if (typeof value === 'number') {
            valueSpan.className += ' json-number';
            valueSpan.textContent = value;
        } else {
            valueSpan.textContent = String(value);
        }
        
        nodeDiv.appendChild(keySpan);
        nodeDiv.appendChild(valueSpan);
    }
    
    return nodeDiv;
}

function updateObjectInfo(data) {
    const infoDiv = document.getElementById('objectInfo');
    
    if (Array.isArray(data)) {
        let html = `<h6>Colección de ${data.length} objetos:</h6>`;
        
        data.forEach((obj, index) => {
            html += `
                <div class="mb-2 p-2 bg-light rounded">
                    <strong>${obj.Tipo || 'Objeto'} ${index + 1}:</strong><br>
                    <small>
                        Área: ${obj.Area || 'N/A'} • 
                        Volumen: ${obj.Volumen || 'N/A'}
                    </small>
                </div>
            `;
        });
        
        infoDiv.innerHTML = html;
    } else {
        let html = `
            <div class="row">
                <div class="col-md-6">
                    <strong>Tipo:</strong> ${data.Tipo || 'N/A'}<br>
                    <strong>Área Total:</strong> ${data.Area || 'N/A'}<br>
                    <strong>Volumen:</strong> ${data.Volumen || 'N/A'}
                </div>
                <div class="col-md-6">
        `;
        
        if (data.Tapas && data.Tapas.length > 0) {
            html += `<strong>Tapas:</strong> ${data.Tapas.length}<br>`;
            html += `<strong>Radio:</strong> ${data.Tapas[0].Radio || 'N/A'}<br>`;
        }
        
        if (data.Caras && data.Caras.length > 0) {
            html += `<strong>Caras:</strong> ${data.Caras.length}<br>`;
            html += `<strong>Lado:</strong> ${data.Caras[0].Largo || 'N/A'}<br>`;
        }
        
        if (data.Lado) {
            html += `<strong>Altura:</strong> ${data.Lado.Largo || 'N/A'}<br>`;
        }
        
        html += '</div></div>';
        infoDiv.innerHTML = html;
    }
}

function updateCylinder() {
    const radius = parseFloat(document.getElementById('radiusSlider').value);
    const height = parseFloat(document.getElementById('heightSlider').value);
    
    document.getElementById('radiusValue').textContent = radius.toFixed(1);
    document.getElementById('heightValue').textContent = height.toFixed(1);
    
    createCylinder(radius, height);
}

function resetView() {
    // Resetear ángulos de cámara orbital
    cameraAngleX = 0.3;
    cameraAngleY = 0;
    cameraDistance = 25;
    
    // Recalcular centro si hay objetos
    if (objects.length > 0) {
        calculateObjectsCenter();
    } else {
        objectsCenter = { x: 0, y: 0, z: 0 };
    }
    
    updateCameraPosition();
}

// Controles de mouse
function onMouseDown(event) {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseMove(event) {
    if (!isMouseDown) return;
    
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;
    
    // Actualizar ángulos de cámara orbital
    cameraAngleY += deltaX * 0.01; // Rotación horizontal (azimut)
    cameraAngleX -= deltaY * 0.01; // Rotación vertical (elevación)
    
    // Limitar ángulo vertical para evitar inversión
    cameraAngleX = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, cameraAngleX));
    
    updateCameraPosition();
    
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onWheel(event) {
    event.preventDefault();
    
    // Zoom orbital ajustando la distancia
    const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
    cameraDistance *= zoomFactor;
    
    // Limitar distancia mínima y máxima
    cameraDistance = Math.max(5, Math.min(100, cameraDistance));
    
    updateCameraPosition();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotación automática orbital muy sutil cuando no hay interacción del mouse
    if (!isMouseDown && objects.length > 0) {
        cameraAngleY += 0.002; // Rotación horizontal muy lenta
        updateCameraPosition();
    }
    
    renderer.render(scene, camera);
}

// Responsive
window.addEventListener('resize', function() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});
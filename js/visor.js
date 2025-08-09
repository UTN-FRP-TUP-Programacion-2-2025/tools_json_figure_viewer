// Variables globales para Three.js
        let scene, camera, renderer, objects = [];
        let isMouseDown = false, mouseX = 0, mouseY = 0;
        let rotationX = 0, rotationY = 0;
        let showWireframe = false;
        
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
            camera.position.set(15, 10, 15);
            camera.lookAt(0, 0, 0);
            
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
        
        function processJSON() {
            const jsonText = document.getElementById('jsonInput').value;
            
            try {
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
                }
                
            } catch (error) {
                alert('Error al procesar JSON: ' + error.message);
            }
        }
        
        function clearScene() {
            // Remover todos los objetos existentes
            objects.forEach(obj => scene.remove(obj));
            objects = [];
        }
        
        function processObjectArray(dataArray) {
            const positions = [];
            
            dataArray.forEach((objData, index) => {
                let objectSize = 5; // Tamaño por defecto
                
                // Calcular tamaño aproximado del objeto para evitar superposición
                if (objData.Tipo === 'Cilindro' && objData.Tapas && objData.Tapas[0]) {
                    objectSize = objData.Tapas[0].Radio * 2;
                } else if (objData.Tipo === 'Cubo' && objData.Caras && objData.Caras[0]) {
                    objectSize = objData.Caras[0].Lago;
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
        }
        
        function create3DObject(data, position) {
            const type = data.Tipo;
            
            switch (type) {
                case 'Cilindro':
                    if (data.Tapas && data.Tapas[0] && data.Lado) {
                        const radius = data.Tapas[0].Radio;
                        const height = data.Lado.Lago;
                        return createCylinder(radius, height, position);
                    }
                    break;
                    
                case 'Cubo':
                    if (data.Caras && data.Caras[0]) {
                        const size = data.Caras[0].Lago;
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
                    if (data.Lago) {
                        return createPlaneShape('Rectangulo', data.Lago, data.Lago, position, objectColors.Cuadrado);
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
                    html += `<strong>Lado:</strong> ${data.Caras[0].Lago || 'N/A'}<br>`;
                }
                
                if (data.Lado) {
                    html += `<strong>Altura:</strong> ${data.Lado.Lago || 'N/A'}<br>`;
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
            camera.position.set(15, 10, 15);
            camera.lookAt(0, 0, 0);
            rotationX = 0;
            rotationY = 0;
            
            // Resetear rotación de todos los objetos
            objects.forEach(obj => {
                obj.rotation.x = 0;
                obj.rotation.y = 0;
                obj.rotation.z = 0;
            });
        }
        
        // Controles de mouse
        function onMouseDown(event) {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        
        function onMouseMove(event) {
            if (!isMouseDown || objects.length === 0) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            rotationY += deltaX * 0.01;
            rotationX += deltaY * 0.01;
            
            // Aplicar rotación a todos los objetos
            objects.forEach(obj => {
                obj.rotation.x = rotationX;
                obj.rotation.y = rotationY;
            });
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        
        function onMouseUp() {
            isMouseDown = false;
        }
        
        function onWheel(event) {
            event.preventDefault();
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            camera.position.multiplyScalar(scale);
        }
        
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotación automática sutil cuando no hay interacción del mouse
            if (objects.length > 0 && !isMouseDown) {
                objects.forEach(obj => {
                    obj.rotation.y += 0.003;
                });
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
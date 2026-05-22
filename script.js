const MODEL_PATH = './modelo/model.json'; 

const GROUPS = {
    0: { display: "Turniciformes", species: "Torillos" },
    1: { display: "Trogoniformes", species: "Trogones y Quetzales" },
    2: { display: "Tinamiformes", species: "Tinamúes" },
    3: { display: "Struthioniformes", species: "Avestruces" },
    4: { display: "Strigiformes", species: "Búhos y Lechuzas" },
    5: { display: "Sphenisciformes", species: "Pingüinos" },
    6: { display: "Rheiformes", species: "Ñandúes" },
    7: { display: "Pteroclidiformes", species: "Gangas" },
    8: { display: "Psittaciformes", species: "Loros, Guacamayos y Cacatúas" },
    9: { display: "Procellariiformes", species: "Albatros y Pardelas" },
    10: { display: "Podicipediformes", species: "Somormujos y Zampullines" },
    11: { display: "Piciformes", species: "Pájaros Carpinteros y Tucanes" },
    12: { display: "Phoenicopteriformes", species: "Flamencos" },
    13: { display: "Pelecaniformes", species: "Pelícanos, Garzas e Ibis" },
    14: { display: "Passeriformes", species: "Pájaros cantores (Gorriones, Cuervos, etc.)" },
    15: { display: "Gruiformes", species: "Grullas y Rascones" },
    16: { display: "Gaviiformes", species: "Colimbos" },
    17: { display: "Galliformes", species: "Gallinas, Pavos y Faisanes" },
    18: { display: "Falconiformes", species: "Halcones y Cernícalos" },
    19: { display: "Cuculiformes", species: "Cuclillos y Correcaminos" },
    20: { display: "Coraciiformes", species: "Martín Pescador y Carracas" },
    21: { display: "Columbiformes", species: "Palomas y Tórtolas" },
    22: { display: "Coliiformes", species: "Pájaros Ratón" },
    23: { display: "Ciconiiformes", species: "Cigüeñas" },
    24: { display: "Charadriiformes", species: "Gaviotas, Chorlitos y Frailecillos" },
    25: { display: "Casuariiformes", species: "Casuarios y Emúes" },
    26: { display: "Caprimulgiformes", species: "Chotacabras" },
    27: { display: "Apterygiformes", species: "Kiwis" },
    28: { display: "Apodiformes", species: "Colibríes y Vencejos" },
    29: { display: "Anseriformes", species: "Patos, Gansos y Cisnes" }
};

let model = null;
let cocoModel = null;
const dropzone = document.getElementById('dropzone');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const dropzoneContent = document.getElementById('dropzoneContent');
const predictBtn = document.getElementById('predictBtn');
const resultContent = document.getElementById('resultContent');
const resetBtn = document.getElementById('resetBtn');

// Cargar los modelos
async function loadModels() {
    try {
        predictBtn.querySelector('span').textContent = 'Cargando modelos IA...';
        
        // Cargar modelo principal (Layers Model local)
        model = await tf.loadLayersModel(MODEL_PATH);
        
        // Cargar modelo guardia (COCO-SSD)
        cocoModel = await cocoSsd.load();
        
        predictBtn.disabled = false;
        predictBtn.querySelector('span').textContent = 'Analizar Imagen';
    } catch (e) {
        resultContent.innerHTML = `<div class="error-message"><i class="ph ph-warning-circle"></i> Error cargando el modelo. Revisa la consola o asegúrate de usar un servidor local.</div>`;
        console.error("Error loading model:", e);
    }
}

// Lógica de Drag & Drop
dropzone.addEventListener('click', () => imageInput.click());

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
});

dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        handleFile(files[0]);
    }
});

// Lógica de Drag & Drop Global (Toda la pantalla)
const globalDropzone = document.getElementById('globalDropzone');
let dragCounter = 0; // Para evitar que el overlay parpadee al entrar/salir de hijos

window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
        dragCounter++;
        globalDropzone.classList.add('active');
    }
});

window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
        globalDropzone.classList.remove('active');
    }
});

window.addEventListener('dragover', (e) => {
    e.preventDefault();
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    globalDropzone.classList.remove('active');
    
    const dt = e.dataTransfer;
    if (dt.files && dt.files.length) {
        handleFile(dt.files[0]);
    }
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        dropzoneContent.style.opacity = '0';
        resetBtn.style.display = 'flex';
        
        // Reset results
        resultContent.innerHTML = '<div class="placeholder-text">Imagen lista. Haz clic en Analizar Imagen.</div>';
    };
    reader.readAsDataURL(file);
}

// Lógica del botón de resetear imagen
resetBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que se abra el selector de archivos al hacer click en la "X"
    imageInput.value = '';
    previewImage.src = '';
    previewImage.style.display = 'none';
    dropzoneContent.style.opacity = '1';
    resetBtn.style.display = 'none';
    resultContent.innerHTML = '<div class="placeholder-text">Sube una imagen para ver los resultados</div>';
});

// Predicción de dos fases
predictBtn.addEventListener('click', async () => {
    if (!model || !cocoModel || !previewImage.src) return;
    
    predictBtn.disabled = true;
    predictBtn.classList.add('loading');
    predictBtn.querySelector('span').textContent = 'Procesando...';
    
    // Pequeño timeout para permitir que la UI se actualice
    setTimeout(async () => {
        try {
            // FASE 1: Guardia de seguridad (Object Detection)
            const objectPredictions = await cocoModel.detect(previewImage);
            
            // Buscar si la IA detectó un ave ('bird') con al menos 30% de confianza
            const isBirdDetected = objectPredictions.some(pred => pred.class === 'bird' && pred.score > 0.3);

            if (!isBirdDetected) {
                // Si no hay aves, detenemos el proceso y mostramos alerta
                resultContent.innerHTML = `
                    <div class="error-message" style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: var(--warning);">
                        <i class="ph ph-warning" style="font-size: 2.5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));"></i>
                        <br>
                        <strong style="font-size: 1.1rem;">No se ha detectado ningún ave</strong>
                        <p style="font-size: 0.95rem; margin-top: 0.5rem; color: var(--text-main);">
                            El filtro de seguridad IA no encontró características de aves en la imagen. Por favor, asegúrate de subir una foto donde el ave sea claramente visible.
                        </p>
                    </div>`;
                return; // Detiene la ejecución, saltando al finally block
            }
            
            // FASE 2: Clasificación taxonómica
            let tensor = tf.browser.fromPixels(previewImage)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims()
                .div(255.0);
            
            const predictions = await model.predict(tensor).data();
            const predictionArray = Array.from(predictions);
            
            const index = predictionArray.indexOf(Math.max(...predictionArray));
            const confidence = Math.max(...predictionArray);
            
            renderResult(index, confidence);
            
            tensor.dispose();
        } catch (error) {
            console.error("Prediction error:", error);
            resultContent.innerHTML = `<div class="error-message">Error durante la predicción.</div>`;
        } finally {
            predictBtn.disabled = false;
            predictBtn.classList.remove('loading');
            predictBtn.querySelector('span').textContent = 'Analizar Imagen';
        }
    }, 100);
});

function renderResult(index, confidence) {
    const percent = (confidence * 100).toFixed(1);
    
    if (confidence < 0.6) {
        resultContent.innerHTML = `
            <div class="result-item">
                <div class="result-group" style="color: var(--warning);">
                    <span><i class="ph ph-question"></i> No identificado</span>
                    <span class="confidence-text">${percent}%</span>
                </div>
                <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.95rem;">
                    La imagen no parece coincidir claramente con ninguno de los grupos taxonómicos reconocidos.
                </p>
                <div style="margin-top: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Confianza de la IA</span>
                    <div class="progress-container">
                        <div class="progress-bar progress-low" style="width: ${percent}%"></div>
                    </div>
                </div>
            </div>`;
    } else {
        const groupInfo = GROUPS[index];
        const groupName = groupInfo.display;
        const speciesName = groupInfo.species;
        
        let progressClass = 'progress-high';
        if (confidence < 0.8) progressClass = 'progress-medium';
        
        resultContent.innerHTML = `
            <div class="result-item">
                <div class="result-group">
                    <span><i class="ph-fill ph-check-circle"></i> ${groupName}</span>
                    <span class="confidence-text">${percent}%</span>
                </div>
                <p style="color: var(--text-main); font-size: 1.1rem; margin-top: 1rem; border-left: 3px solid var(--primary); padding-left: 12px; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                    <span style="color: var(--text-muted); font-size: 0.9rem; display: block; margin-bottom: 0.2rem;">ESPECIES PRINCIPALES:</span>
                    ${speciesName}
                </p>
                <div style="margin-top: 1.5rem;">
                    <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Confianza de Predicción</span>
                    <div class="progress-container">
                        <div class="progress-bar ${progressClass}"></div>
                    </div>
                </div>
            </div>`;
            
        // Animar la barra de progreso después de insertarla
        setTimeout(() => {
            const bar = resultContent.querySelector('.progress-bar');
            if(bar) bar.style.width = `${percent}%`;
        }, 50);
    }
}

// Iniciar cargando los dos modelos
loadModels();

// Efecto 3D Parallax / Giroscopio (Mouse)
const parallaxBg = document.getElementById('parallax-bg');
document.addEventListener('mousemove', (e) => {
    if (!parallaxBg) return;
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    
    requestAnimationFrame(() => {
        parallaxBg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
    });
});

// Efecto 3D Parallax / Giroscopio (Móviles reales)
window.addEventListener('deviceorientation', (e) => {
    if (!parallaxBg || !e.gamma || !e.beta) return;
    
    // gamma: inclinación izquierda/derecha [-90, 90]
    // beta: inclinación adelante/atrás [-180, 180]
    let tiltX = e.gamma;
    let tiltY = e.beta;
    
    // Limitar inclinación para que el fondo no salga de los bordes
    if (tiltX > 40) tiltX = 40;
    if (tiltX < -40) tiltX = -40;
    if (tiltY > 60) tiltY = 60;
    if (tiltY < -20) tiltY = -20;
    
    // Convertir la inclinación a píxeles de desplazamiento (inverso para efecto parallax)
    const moveX = tiltX * -1.5;
    // Restamos 20 a tiltY asumiendo que el usuario sostiene el móvil ligeramente inclinado hacia él
    const moveY = (tiltY - 20) * -1.5;
    
    requestAnimationFrame(() => {
        parallaxBg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    });
});

// --- Lógica de Aves de Cristal ---
const birdsContainer = document.getElementById('birds-container');
const toggleBirdsBtn = document.getElementById('toggleBirdsBtn');
let birdsActive = true;

// Posibles colores de resplandor para simular distintas especies
const glowColors = [
    'rgba(59, 130, 246, 0.6)',  // Azul
    'rgba(168, 85, 247, 0.6)',  // Morado
    'rgba(236, 72, 153, 0.6)',  // Rosa
    'rgba(16, 185, 129, 0.6)',  // Esmeralda
    'rgba(245, 158, 11, 0.6)'   // Ámbar
];

// Diferentes especies (emojis que convertiremos en siluetas de cristal con CSS)
const birdSpecies = ['🦅', '🦆', '🦉', '🕊️', '🦩', '🐧', '🐓', '🦜', '🦢', '🦃', '🦚', '🐦'];

function createBirds() {
    // Crear unas 15 aves volando
    for (let i = 0; i < 15; i++) {
        const bird = document.createElement('div');
        bird.classList.add('glass-bird');
        
        // Asignar una especie al azar
        const species = birdSpecies[Math.floor(Math.random() * birdSpecies.length)];
        bird.textContent = species;
        
        // Propiedades aleatorias
        const size = Math.random() * 30 + 20; // de 20px a 50px
        const top = Math.random() * 80 + 10; // 10% a 90% altura
        const delay = Math.random() * 40; // 0s a 40s (para mayor dispersión inicial)
        const durationX = Math.random() * 20 + 15; // 15s a 35s cruzando la pantalla
        const durationY = Math.random() * 3 + 2; // 2s a 5s aleteando/oscilando
        const colorIndex = Math.floor(Math.random() * glowColors.length);
        
        // Mitad vuelan a la derecha, mitad a la izquierda
        const flyDirection = i % 2 === 0 ? 'flyLTR' : 'flyRTL';
        
        // Si vuelan de derecha a izquierda, voltear horizontalmente
        if (flyDirection === 'flyRTL') {
            bird.style.transform = 'scaleX(-1)';
        }
        
        bird.style.fontSize = `${size}px`;
        bird.style.top = `${top}%`;
        
        // Aplicar el color de resplandor usando una variable CSS inline
        bird.style.setProperty('--glow-color', glowColors[colorIndex]);
        
        // Asignar animaciones
        bird.style.animationName = `${flyDirection}, bob`;
        // DELAY NEGATIVO: Hace que la animación parezca que empezó hace tiempo.
        // Así las aves ya estarán distribuidas por toda la pantalla al cargar la página.
        bird.style.animationDelay = `-${delay}s, -${delay}s`;
        bird.style.animationDuration = `${durationX}s, ${durationY}s`;
        
        birdsContainer.appendChild(bird);
    }
}

// Generar las aves al iniciar
createBirds();

// Lógica del botón de encendido/apagado
toggleBirdsBtn.addEventListener('click', () => {
    birdsActive = !birdsActive;
    if (birdsActive) {
        birdsContainer.style.display = 'block';
        toggleBirdsBtn.classList.remove('disabled');
        toggleBirdsBtn.innerHTML = '<i class="ph-fill ph-bird"></i>';
    } else {
        birdsContainer.style.display = 'none';
        toggleBirdsBtn.classList.add('disabled');
        toggleBirdsBtn.innerHTML = '<i class="ph ph-bird"></i>';
    }
});
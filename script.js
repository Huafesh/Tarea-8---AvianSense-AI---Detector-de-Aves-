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
// proModel eliminado: ahora usamos iNaturalist API (sin modelo local, 100% preciso)
const dropzone = document.getElementById('dropzone');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const dropzoneContent = document.getElementById('dropzoneContent');
const predictBtn = document.getElementById('predictBtn');
const resultContent = document.getElementById('resultContent');
const resetBtn = document.getElementById('resetBtn');

// =====================================================================
// AvianSense PRO: Sistema Híbrido
// 1. Intenta Hugging Face (nateraw/bird-species-classifier, 400+ especies)
// 2. Si falla, usa MobileNet V2 local (siempre funciona, sin internet)
// =====================================================================
const BIRD_TRANSLATIONS = {
    "bald eagle": "Águila Calva",
    "great grey owl": "Búho Gran Gris",
    "screech owl": "Autillo / Tecolote",
    "snowy owl": "Búho Nival",
    "horned owl": "Búho Cornudo",
    "barn owl": "Lechuza de Campanario",
    "toucan": "Tucán",
    "macaw": "Guacamayo",
    "pelican": "Pelícano",
    "flamingo": "Flamenco",
    "penguin": "Pingüino",
    "king penguin": "Pingüino Rey",
    "crested penguin": "Pingüino Penachudo",
    "hummingbird": "Colibrí",
    "ruby throated hummingbird": "Colibrí de Garganta Rubí",
    "kingfisher": "Martín Pescador",
    "peacock": "Pavo Real",
    "ostrich": "Avestruz",
    "black swan": "Cisne Negro",
    "swan": "Cisne",
    "duck": "Pato",
    "mallard": "Ánade Real / Pato de Collar",
    "drake": "Pato Macho",
    "teal": "Cerceta",
    "goose": "Ganso / Oca",
    "canada goose": "Ganso del Canadá",
    "seagull": "Gaviota",
    "gull": "Gaviota",
    "heron": "Garza",
    "stork": "Cigüeña",
    "vulture": "Buitre",
    "condor": "Cóndor",
    "parrot": "Loro / Cotorra",
    "cockatoo": "Cacatúa",
    "lorikeet": "Lorichetto / Tricogloso",
    "woodpecker": "Pájaro Carpintero",
    "pileated woodpecker": "Carpintero Crestado",
    "red headed woodpecker": "Carpintero de Cabeza Roja",
    "downy woodpecker": "Carpintero Velloso",
    "robin": "Petirrojo",
    "sparrow": "Gorrión",
    "house sparrow": "Gorrión Común",
    "song sparrow": "Gorrión Melódico",
    "crow": "Cuervo",
    "raven": "Cuervo Grande",
    "blue jay": "Azulejo / Chara Azul",
    "goldfinch": "Jilguero",
    "american goldfinch": "Jilguero Americano",
    "cardinal": "Cardenal",
    "hen": "Gallina",
    "rooster": "Gallo",
    "cock": "Gallo",
    "turkey": "Pavo / Guajolote",
    "quail": "Codorniz",
    "partridge": "Perdiz",
    "pigeon": "Paloma",
    "dove": "Tórtola / Paloma",
    "mourning dove": "Tórtola Huilota",
    "chickadee": "Carbonero",
    "canary": "Canario",
    "hawk": "Halcón / Gavilán",
    "falcon": "Halcón",
    "peregrine falcon": "Halcón Peregrino",
    "osprey": "Águila Pescadora",
    "kite": "Milano",
    "hornbill": "Calao",
    "coot": "Focha",
    "ibis": "Ibis",
    "spoonbill": "Espátula",
    "merganser": "Serreta",
    "blue bunting": "Azulejo / Bunting Azul",
    "indigo bunting": "Azulejo Índigo",
    "painted Bunting": "Colorín Sietecolores",
    "wren": "Chochín / Ratona",
    "house wren": "Ratona Común",
    "cactus wren": "Matraca del Desierto",
    "carolina wren": "Chochín de Carolina",
    "night heron": "Garza Nocturna",
    "green heron": "Garza Verde",
    "great blue heron": "Garza Azulada",
    "egret": "Garceta",
    "snowy egret": "Garceta Nívea",
    "great egret": "Garceta Grande",
    "swallow": "Golondrina",
    "barn swallow": "Golondrina Dáurica / Común",
    "puffin": "Frailecillo",
    "atlantic puffin": "Frailecillo Atlántico",
    "mockingbird": "Sinsonte / Centzontle",
    "northern mockingbird": "Sinsonte Centzontle",
    "thrasher": "Cuitlacoche",
    "magpie": "Urraca",
    "yellow-breasted chat": "Buscabré",
    "warbler": "Reinita / Curruca",
    "yellow warbler": "Reinita Amarilla",
    "magnolia warbler": "Reinita de Magnolia",
    "black-and-white warbler": "Reinita Trepadora",
    "common yellowthroat": "Mascarita Común",
    "ovenbird": "Hornero / Reinita Hornera",
    "blackbird": "Tordo / Mirlo",
    "red-winged blackbird": "Tordo Sargento",
    "yellow-headed blackbird": "Tordo Cabeciamarillo",
    "cowbird": "Tordo Parásito",
    "brown-headed cowbird": "Tordo Cabecipardo",
    "grackle": "Zanate",
    "common grackle": "Zanate Norteño",
    "boat-tailed grackle": "Zanate Marismeño",
    "oriole": "Bolsero / Calandria",
    "baltimore oriole": "Calandria de Baltimore",
    "orchard oriole": "Calandria Café",
    "tanager": "Tangara",
    "scarlet tanager": "Piranga Capuchina",
    "summer tanager": "Piranga Roja",
    "grosbeak": "Picogordo",
    "rose-breasted grosbeak": "Picogordo Degollado",
    "blue grosbeak": "Picogordo Azul",
    "towhee": "Toquí",
    "eastern towhee": "Toquí Flancos Rojizos",
    "junco": "Junco",
    "dark-eyed junco": "Junco Ojioscuro",
    "purple finch": "Pinzón Púrpura",
    "house finch": "Pinzón Mexicano",
    "siskin": "Lúgano / Piñonero",
    "pine siskin": "Jilguero Pinero",
    "crossbill": "Piquituerto",
    "red crossbill": "Piquituerto Común",
    "lynx": "Lince (Mamífero - No es ave)",
    "cat": "Gato (Mamífero - No es ave)",
    "dog": "Perro (Mamífero - No es ave)",
    "person": "Persona (No es ave)",
    "human": "Humano (No es ave)",
    "groom": "Novio / Persona (No es ave)",
    "suit": "Traje / Vestimenta (No es ave)"
};

function translateBirdName(name) {
    if (!name) return 'Especie desconocida';
    const cleaned = name.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ').trim();
    
    // Buscar coincidencia exacta
    if (BIRD_TRANSLATIONS[cleaned]) {
        return `${BIRD_TRANSLATIONS[cleaned]}`;
    }
    
    // Buscar coincidencia parcial (por ejemplo, si contiene "hummingbird" pero no está la especie exacta)
    for (const key in BIRD_TRANSLATIONS) {
        if (cleaned.includes(key) && key.length > 3) {
            return `${BIRD_TRANSLATIONS[key]}`;
        }
    }
    
    // Retornar en formato Capitalizado si no hay traducción
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

let proModel = null; // MobileNet (fallback local)

// Palabras clave de aves para filtrar resultados de MobileNet
const BIRD_KEYWORDS = [
    'bird','owl','eagle','hawk','falcon','parrot','macaw','toucan','pelican',
    'flamingo','penguin','swan','duck','goose','crane','heron','stork','vulture',
    'condor','robin','finch','sparrow','jay','crow','raven','hummingbird',
    'woodpecker','kingfisher','peacock','ostrich','cockatoo','lorikeet','magpie',
    'pigeon','dove','quail','partridge','albatross','gull','tern','puffin',
    'cormorant','grouse','turkey','hen','rooster','junco','wren','warbler',
    'swift','swallow','martin','kite','osprey','nighthawk','cuckoo','hornbill',
    'mallard','drake','teal','pintail','merganser','eider','loon','grebe',
    'moorhen','coot','ibis','spoonbill','avocet','plover','sandpiper','snipe'
];

async function classifyProHuggingFace(blob) {
    const MODEL_ID = 'nateraw/bird-species-classifier';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
    try {
        const resp = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/octet-stream' },
                body: blob,
                signal: controller.signal
            }
        );
        clearTimeout(timeout);
        if (resp.status === 503) {
            // Modelo en cold start - esperar y reintentar
            await new Promise(r => setTimeout(r, 4000));
            const retry = await fetch(
                `https://api-inference.huggingface.co/models/${MODEL_ID}`,
                { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: blob }
            );
            if (!retry.ok) return null;
            const rd = await retry.json();
            if (Array.isArray(rd) && rd.length > 0 && rd[0].label) return rd;
            return null;
        }
        if (!resp.ok) return null;
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0 && data[0].label) return data;
        return null;
    } catch {
        clearTimeout(timeout);
        return null; // timeout o CORS
    }
}

async function classifyProMobileNet(imageElement) {
    if (!proModel) return null;
    try {
        const preds = await proModel.classify(imageElement, 10); // Top-10 para mejor filtrado
        const birdPred = preds.find(p =>
            BIRD_KEYWORDS.some(kw => p.className.toLowerCase().includes(kw))
        );
        if (birdPred) {
            return [{
                label: birdPred.className.split(',')[0].trim(),
                score: birdPred.probability,
                source: 'mobilenet'
            }];
        }
        // Si no encontró ave, devolver la mejor predicción de todos modos
        return [{ label: preds[0].className.split(',')[0].trim(), score: preds[0].probability, source: 'mobilenet_nf' }];
    } catch {
        return null;
    }
}

async function classifyPro(imageElement) {
    // Preparar blob una sola vez
    const canvas = document.createElement('canvas');
    canvas.width = 224; canvas.height = 224;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, 224, 224);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.90));

    // Intentar Hugging Face primero (en paralelo con MobileNet)
    const [hfResult, mnResult] = await Promise.all([
        classifyProHuggingFace(blob),
        classifyProMobileNet(imageElement)
    ]);

    if (hfResult && hfResult.length > 0) {
        // Éxito con Hugging Face
        return {
            source: 'huggingface',
            items: hfResult.slice(0, 3).map(item => ({
                commonName: item.label.replace(/_/g, ' '),
                score: item.score
            }))
        };
    }

    if (mnResult && mnResult.length > 0) {
        // Fallback a MobileNet
        return {
            source: 'mobilenet',
            birdFound: mnResult[0].source !== 'mobilenet_nf',
            items: mnResult.map(item => ({
                commonName: item.label.replace(/_/g, ' '),
                score: item.score
            }))
        };
    }

    return null;
}
// Cargar los modelos locales (TF, COCO-SSD y MobileNet fallback)
async function loadModels() {
    try {
        predictBtn.querySelector('span').textContent = 'Cargando modelos IA...';
        [model, cocoModel, proModel] = await Promise.all([
            tf.loadLayersModel(MODEL_PATH),
            cocoSsd.load(),
            mobilenet.load({ version: 2, alpha: 1.0 }) // Fallback local garantizado
        ]);
        
        predictBtn.disabled = false;
        predictBtn.querySelector('span').textContent = 'Analizar Imagen';
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
    } catch (e) {
        resultContent.innerHTML = `<div class="error-message"><i class="ph ph-warning-circle"></i> Error cargando el modelo. Revisa la consola o asegúrate de usar un servidor local.</div>`;
        console.error("Error loading model:", e);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
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

// Predicción: 3 fases paralelas
predictBtn.addEventListener('click', async () => {
    if (!model || !cocoModel || !previewImage.src) return;
    
    predictBtn.disabled = true;
    predictBtn.classList.add('loading');
    predictBtn.querySelector('span').textContent = 'Consultando IA...';
    
    setTimeout(async () => {
        try {
            // FASE 1: COCO-SSD — ¿Hay un ave en la imagen?
            const objectPredictions = await cocoModel.detect(previewImage);
            const isBirdDetected = objectPredictions.some(pred => pred.class === 'bird');
            
            // FASE 2: Modelo Universitario — Taxonomía general
            const tensor = tf.browser.fromPixels(previewImage)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims()
                .div(255.0);
            
            // FASE 3: PRO Híbrido (HuggingFace + MobileNet fallback) en paralelo
            const [predictions, proResult] = await Promise.all([
                model.predict(tensor).data(),
                classifyPro(previewImage)
            ]);
            tensor.dispose();

            const predictionArray = Array.from(predictions);
            const index = predictionArray.indexOf(Math.max(...predictionArray));
            const confidence = Math.max(...predictionArray);
            
            renderResult(index, confidence, isBirdDetected, proResult);
        } catch (error) {
            console.error("Prediction error:", error);
            resultContent.innerHTML = `<div class="error-message"><i class="ph ph-warning-circle"></i> Error durante la predicción. Intenta de nuevo.</div>`;
        } finally {
            predictBtn.disabled = false;
            predictBtn.classList.remove('loading');
            predictBtn.querySelector('span').textContent = 'Analizar Imagen';
        }
    }, 100);
});

function renderResult(index, confidence, isBirdDetected = true, proResult = null) {
    const percent = (confidence * 100).toFixed(1);
    
    const inatResults = proResult ? proResult.items : null;
    const proSource = proResult ? proResult.source : null;
    const proSourceLabel = proSource === 'huggingface' ? 'Hugging Face AI' : (proSource === 'mobilenet' ? 'MobileNet (Local)' : '');
    const birdFoundInPro = proResult ? (proSource !== 'mobilenet' || proResult.birdFound !== false) : false;
    
    // Determinar si realmente se detectó un ave
    const isBird = isBirdDetected || proSource === 'huggingface' || (proSource === 'mobilenet' && birdFoundInPro);

    const warningBadge = !isBird 
        ? `<div style="background:rgba(245,158,11,0.15);color:var(--warning);padding:5px 10px;border-radius:6px;font-size:0.8rem;margin-bottom:10px;display:inline-block;border:1px solid rgba(245,158,11,0.3);"><i class="ph-fill ph-warning"></i> Ave no detectada con seguridad</div>` 
        : '';

    // ---- Panel PRO ----
    let proHtml = '';

    if (inatResults && inatResults.length > 0) {
        const top = inatResults[0];
        const scorePercent = (top.score * 100).toFixed(1);
        
        // Traducir el nombre
        const rawName = top.commonName || 'Especie desconocida';
        const displayName = translateBirdName(rawName);
        
        let proProgressClass = 'progress-high';
        if (top.score < 0.7) proProgressClass = 'progress-medium';
        if (top.score < 0.4) proProgressClass = 'progress-low';

        // Configuración de título y colores si es ave vs si es otro objeto/animal
        let proTitle = '';
        let themeColor = 'var(--success)';
        let cardClass = 'result-pro';
        let badgeClass = 'result-badge-pro';
        let titleIcon = 'ph-fill ph-check-circle';
        
        if (isBird) {
            proTitle = (top.score >= 0.5) ? 'Especie Exacta' : 'Especie (Baja certeza)';
            themeColor = (top.score >= 0.7) ? 'var(--success)' : (top.score >= 0.4 ? 'var(--warning)' : '#ef4444');
            cardClass = 'result-pro';
            badgeClass = 'result-badge-pro';
            titleIcon = 'ph-fill ph-check-circle';
        } else {
            proTitle = 'Objeto / Animal (No es Ave)';
            themeColor = 'var(--warning)';
            cardClass = 'result-pro result-pro-warning';
            badgeClass = 'result-badge-pro result-badge-pro-warning';
            titleIcon = 'ph-fill ph-warning';
            proProgressClass = 'progress-medium'; // Color ámbar
        }

        proHtml = `
            <div class="result-item ${cardClass}">
                <div class="${badgeClass}"><i class="ph-fill ph-star"></i> AvianSense PRO AI · ${proSourceLabel}</div>
                <div class="result-group">
                    <span style="font-size:1.1rem;font-weight:700;color:${themeColor};"><i class="${titleIcon}"></i> ${proTitle}</span>
                    <span class="confidence-text" style="color:${themeColor};">${scorePercent}%</span>
                </div>
                <p style="color:var(--text-main);font-size:1.3rem;margin-top:1rem;border-left:3px solid ${themeColor};padding-left:12px;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.5);">
                    ${displayName}
                </p>
                <div style="margin-top:1.5rem;">
                    <span style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:600;">Precisión Neuronal Global</span>
                    <div class="progress-container">
                        <div class="progress-bar ${proProgressClass}" id="proBar"></div>
                    </div>
                </div>
            </div>`;
    }

    // ---- Panel Universitario ----
    let uniHtml = '';
    const groupInfo = GROUPS[index];
    
    let uniProgressClass = 'progress-high';
    if (confidence < 0.8) uniProgressClass = 'progress-medium';
    if (confidence < 0.6) uniProgressClass = 'progress-low';
    
    let uniTitleColor = confidence >= 0.6 ? 'var(--text-main)' : 'var(--warning)';
    let uniIcon = confidence >= 0.6 ? 'ph-fill ph-check-circle' : 'ph-fill ph-warning-circle';
    let uniTitleSuffix = confidence < 0.6 ? ' (Baja certeza)' : '';
    let borderLeftColor = confidence >= 0.6 ? 'var(--primary)' : 'var(--warning)';

    uniHtml = `
        <div class="result-item">
            <div style="margin-bottom:10px;"><span style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;">Modelo Universitario (Teachable Machine)</span></div>
            ${warningBadge}
            <div class="result-group" style="color:${uniTitleColor};">
                <span><i class="${uniIcon}"></i> Grupo: ${groupInfo.display}${uniTitleSuffix}</span>
                <span class="confidence-text" style="color:${uniTitleColor};">${percent}%</span>
            </div>
            <p style="color:var(--text-main);font-size:1.1rem;margin-top:1rem;border-left:3px solid ${borderLeftColor};padding-left:12px;font-weight:500;text-shadow:0 1px 2px rgba(0,0,0,0.5);">
                <span style="color:var(--text-muted);font-size:0.9rem;display:block;margin-bottom:0.2rem;">ESPECIES PRINCIPALES:</span>
                ${groupInfo.species}
            </p>
            <div style="margin-top:1.5rem;">
                <span style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:600;">Confianza Taxonómica</span>
                <div class="progress-container">
                    <div class="progress-bar ${uniProgressClass}" id="uniBar"></div>
                </div>
            </div>
        </div>`;

    resultContent.innerHTML = proHtml + uniHtml;

    // Animar barras de progreso tras insertar el HTML
    requestAnimationFrame(() => {
        const uniBar = document.getElementById('uniBar');
        if (uniBar) uniBar.style.width = `${percent}%`;
        const proBar = document.getElementById('proBar');
        if (proBar && inatResults && inatResults.length > 0) {
            proBar.style.width = `${(inatResults[0].score * 100).toFixed(1)}%`;
        }
    });
}

// Iniciar cargando los dos modelos (con pequeño delay para asegurar que el HTML de carga se dibuje)
setTimeout(loadModels, 100);

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

// Retrasar la generación de las aves para no bloquear la carga inicial pesada del modelo de IA (TensorFlow WebGL)
// Esto soluciona el lag de los primeros segundos
setTimeout(createBirds, 3000);

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
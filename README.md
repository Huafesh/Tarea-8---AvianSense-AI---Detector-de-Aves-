# BirdVision - Clasificador de Grupos de Aves

**BirdVision** es una aplicación web interactiva que permite cargar imágenes de aves y clasificarlas automáticamente en uno de los 30 grupos taxonómicos (órdenes de aves) predefinidos. El modelo analiza la imagen directamente en el navegador utilizando TensorFlow.js y muestra el grupo correspondiente junto a un porcentaje de confianza y especies representativas de esa categoría.

---

## Dataset y Modelo de Entrenamiento

Para el desarrollo del modelo se ha utilizado:

- **Dataset:** [Bird Groups Classification (Kaggle)](https://www.kaggle.com/datasets/imbikramsaha/bird-groups-classification). Un dataset compuesto por múltiples imágenes de aves organizadas por su grupo taxonómico.
- **Entrenamiento:** Se entrenó el modelo utilizando la plataforma interactiva **Teachable Machine** de Google.
- **Exportación:** El modelo resultante fue exportado en formato **TensorFlow.js (Layers Model)** para poder realizar la inferencia localmente en el cliente (navegador web), de forma rápida y sin necesidad de servidores adicionales.

---

## Tecnologías Utilizadas

- **HTML5 & CSS3:** Para construir una interfaz de usuario limpia, responsiva, moderna y fácil de utilizar.
- **JavaScript (Vanilla):** Manejo de la lógica de usuario, manipulación dinámica del DOM y gestión de eventos (cargar imagen, drag & drop).
- **TensorFlow.js:** Biblioteca de Machine Learning cargada vía CDN para cargar el modelo e interpretar la imagen de entrada en tiempo real.

---

## Estructura del Proyecto (`Tarea 08`)

El directorio contiene los siguientes archivos principales:

- **`index.html`**: Define la estructura de la aplicación. Contiene el encabezado, la zona de arrastre/subida de imagen (`drag & drop`), el visor de vista previa, el botón de inferencia y la sección de visualización de resultados.
- **`style.css`**: Define el diseño visual de la interfaz de usuario, incluyendo colores, tipografías, tarjetas de resultados, barras de confianza y efectos de carga interactivos.
- - **`script.js`**: Alberga la lógica del frontend y la interacción con TensorFlow.js:
  - Carga de forma asíncrona el modelo guardado.
  - Preprocesa las imágenes subidas por el usuario (las redimensiona a $224 \times 224$ píxeles y normaliza sus valores de píxeles a `[0, 1]`).
  - Valida la predicción con un umbral de confianza mínimo del 60%. Si la confianza del modelo es inferior al 60%, se asume que la imagen no corresponde a un ave del dataset y se muestra una advertencia.
  - Actualiza dinámicamente la UI con la categoría predicha, la barra de porcentaje y las especies del grupo.
- **`web_model/`**: Carpeta que contiene el modelo exportado de Teachable Machine:
  - `model.json`: Estructura y topología del modelo de red neuronal.
  - `weights.bin`: Los pesos de las conexiones neuronales calculados en el entrenamiento.
  - `metadata.json`: Metadatos del modelo, incluyendo el listado de clases.

---

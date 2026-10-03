// src/services/cloudinary.ts
import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Faltan configurar las variables de entorno de Cloudinary en .env.local'
    );
  }

  // Opciones de compresión
  const options = {
    maxSizeMB: 0.8,          // Tamaño máximo deseado (800 KB)
    maxWidthOrHeight: 1200,   // Redimensiona si supera 1200px de ancho/alto (ideal para web/móvil)
    useWebWorker: true,       // Utiliza hilos de fondo para no congelar la pantalla
  };

  try {
    // 1. Comprimir la imagen antes de subirla
    const compressedFile = await imageCompression(file, options);

    // 2. Preparar el formulario para Cloudinary con la imagen comprimida
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    // 3. Subir a Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error procesando o subiendo imagen:', error);
    throw error;
  }
};
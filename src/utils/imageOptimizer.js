/**
 * Utilitário para otimização de imagens
 * Inclui compressão, conversão para WebP, redimensionamento e validação
 */

// Configurações de otimização
const OPTIMIZATION_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  webpQuality: 0.85,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  thumbnailWidth: 300,
  thumbnailHeight: 300,
};

/**
 * Verifica se o navegador suporta WebP
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
};

/**
 * Cria um canvas para manipulação de imagem
 */
const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Calcula as dimensões mantendo a proporção
 */
const calculateDimensions = (width, height, maxWidth, maxHeight) => {
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newWidth * maxHeight) / newHeight;
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) };
};

/**
 * Redimensiona uma imagem
 */
const resizeImage = (image, maxWidth, maxHeight) => {
  const { width, height } = calculateDimensions(
    image.width,
    image.height,
    maxWidth,
    maxHeight
  );

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Configurações para melhor qualidade
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
};

/**
 * Converte imagem para WebP
 */
const convertToWebP = (canvas, quality = OPTIMIZATION_CONFIG.webpQuality) => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
};

/**
 * Converte imagem para JPEG
 */
const convertToJPEG = (canvas, quality = OPTIMIZATION_CONFIG.quality) => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });
};

/**
 * Cria uma thumbnail da imagem
 */
const createThumbnail = (image) => {
  const canvas = createCanvas(
    OPTIMIZATION_CONFIG.thumbnailWidth,
    OPTIMIZATION_CONFIG.thumbnailHeight
  );
  const ctx = canvas.getContext('2d');

  // Calcula dimensões para crop central
  const scale = Math.max(
    OPTIMIZATION_CONFIG.thumbnailWidth / image.width,
    OPTIMIZATION_CONFIG.thumbnailHeight / image.height
  );

  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;
  const x = (OPTIMIZATION_CONFIG.thumbnailWidth - scaledWidth) / 2;
  const y = (OPTIMIZATION_CONFIG.thumbnailHeight - scaledHeight) / 2;

  ctx.fillStyle = '#f3f4f6'; // Cor de fundo cinza claro
  ctx.fillRect(0, 0, OPTIMIZATION_CONFIG.thumbnailWidth, OPTIMIZATION_CONFIG.thumbnailHeight);
  
  ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
  
  return canvas;
};

/**
 * Valida arquivo de imagem
 */
export const validateImageFile = (file) => {
  const errors = [];

  // Verificar tipo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Formato de imagem não suportado. Use JPEG, PNG, WebP ou GIF.');
  }

  // Verificar tamanho
  if (file.size > OPTIMIZATION_CONFIG.maxFileSize) {
    errors.push(`Arquivo muito grande. Máximo: ${OPTIMIZATION_CONFIG.maxFileSize / (1024 * 1024)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Carrega imagem no canvas
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Otimiza uma imagem
 */
export const optimizeImage = async (file, options = {}) => {
  try {
    // Validação
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const config = { ...OPTIMIZATION_CONFIG, ...options };
    
    // Carrega a imagem
    const image = await loadImage(file);
    
    // Redimensiona se necessário
    const resizedCanvas = resizeImage(image, config.maxWidth, config.maxHeight);
    
    // Cria thumbnail
    const thumbnailCanvas = createThumbnail(image);
    
    // Converte para formato otimizado
    const useWebP = supportsWebP() && config.convertToWebP !== false;
    
    console.log('Otimização:', {
      browserSupportsWebP: supportsWebP(),
      convertToWebP: config.convertToWebP,
      willUseWebP: useWebP,
      originalFormat: file.type
    });
    
    const optimizedBlob = useWebP 
      ? await convertToWebP(resizedCanvas, config.webpQuality)
      : await convertToJPEG(resizedCanvas, config.quality);
    
    const thumbnailBlob = useWebP
      ? await convertToWebP(thumbnailCanvas, 0.7)
      : await convertToJPEG(thumbnailCanvas, 0.6);

    // Cria URLs para preview
    const optimizedUrl = URL.createObjectURL(optimizedBlob);
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

    return {
      original: file,
      optimized: optimizedBlob,
      thumbnail: thumbnailBlob,
      optimizedUrl,
      thumbnailUrl,
      width: resizedCanvas.width,
      height: resizedCanvas.height,
      format: useWebP ? 'webp' : 'jpeg',
      size: optimizedBlob.size,
      originalSize: file.size,
      compressionRatio: ((file.size - optimizedBlob.size) / file.size * 100).toFixed(1)
    };
  } catch (error) {
    console.error('Erro ao otimizar imagem:', error);
    throw error;
  }
};

/**
 * Otimiza múltiplas imagens
 */
export const optimizeMultipleImages = async (files, options = {}) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await optimizeImage(files[i], options);
      results.push(result);
    } catch (error) {
      errors.push({ file: files[i].name, error: error.message });
    }
  }

  return { results, errors };
};

/**
 * Gera placeholder blur para lazy loading
 */
export const generateBlurPlaceholder = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = createCanvas(20, 20);
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(img, 0, 0, 20, 20);
      
      const dataURL = canvas.toDataURL('image/jpeg', 0.1);
      resolve(dataURL);
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};

/**
 * Limpa URLs de objetos criados
 */
export const cleanupImageUrls = (optimizedImages) => {
  optimizedImages.forEach(img => {
    if (img.optimizedUrl) URL.revokeObjectURL(img.optimizedUrl);
    if (img.thumbnailUrl) URL.revokeObjectURL(img.thumbnailUrl);
  });
};

/**
 * Hook para lazy loading de imagens
 */
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError('Erro ao carregar imagem');
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return { src: imageSrc, isLoading, error };
}; 
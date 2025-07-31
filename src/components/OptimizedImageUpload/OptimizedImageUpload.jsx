import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, CheckCircle, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { optimizeImage, validateImageFile } from '../../utils/imageOptimizer';

/**
 * Componente de upload de imagem otimizada
 */
const OptimizedImageUpload = ({
  onUpload,
  multiple = false,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = '',
  disabled = false,
  showPreview = true,
  showProgress = true,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [errors, setErrors] = useState([]);

  // Função para processar arquivos
  const processFiles = useCallback(async (files) => {
    setIsProcessing(true);
    setProgress(0);
    setErrors([]);

    const fileArray = Array.from(files);
    const validFiles = [];
    const newErrors = [];

    // Validação inicial
    fileArray.forEach((file, index) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        newErrors.push({ file: file.name, errors: validation.errors });
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      return;
    }

    // Limitar número de arquivos
    if (validFiles.length > maxFiles) {
      setErrors([{ 
        file: 'Limite excedido', 
        errors: [`Máximo de ${maxFiles} arquivos permitidos`] 
      }]);
      setIsProcessing(false);
      return;
    }

    const results = [];
    
    for (let i = 0; i < validFiles.length; i++) {
      try {
        const result = await optimizeImage(validFiles[i], {
          maxFileSize,
          convertToWebP: true
        });
        
        results.push(result);
        setProgress(((i + 1) / validFiles.length) * 100);
      } catch (error) {
        newErrors.push({ 
          file: validFiles[i].name, 
          errors: [error.message] 
        });
      }
    }

    setOptimizedImages(prev => [...prev, ...results]);
    setErrors(newErrors);
    setIsProcessing(false);
    setProgress(0);

    // Chamar callback com imagens otimizadas
    if (results.length > 0) {
      onUpload?.(results);
    }
  }, [maxFiles, maxFileSize, onUpload]);

  // Handlers de eventos
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleRemoveImage = useCallback((index) => {
    setOptimizedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setOptimizedImages([]);
    setErrors([]);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="optimized-image-upload"
          disabled={disabled || isProcessing}
        />
        
        <label htmlFor="optimized-image-upload" className="block">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isDragging ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Formatos: JPEG, PNG, WebP • Máximo: {maxFileSize / (1024 * 1024)}MB
            </p>
            
            {multiple && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Máximo {maxFiles} arquivos
              </p>
            )}
          </div>
        </label>

        {/* Progress bar */}
        <AnimatePresence>
          {isProcessing && showProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-green-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Processando... {Math.round(progress)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Erros */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error.file}
                  </p>
                  <ul className="text-xs text-red-600 dark:text-red-300 mt-1">
                    {error.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview das imagens otimizadas */}
      {showPreview && optimizedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Imagens Otimizadas ({optimizedImages.length})
            </h4>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Limpar todas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimizedImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                {/* Imagem */}
                <div className="aspect-square">
                  <img
                    src={image.thumbnailUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm font-medium">
                      {image.format.toUpperCase()}
                    </p>
                    <p className="text-xs opacity-75">
                      {image.compressionRatio}% menor
                    </p>
                  </div>
                </div>

                {/* Botão remover */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Informações de compressão */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="text-white text-xs">
                    <p>Original: {(image.originalSize / 1024).toFixed(1)}KB</p>
                    <p>Otimizada: {(image.size / 1024).toFixed(1)}KB</p>
                    <p className="text-green-400 font-medium">
                      {image.compressionRatio}% de economia
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

OptimizedImageUpload.propTypes = {
  onUpload: PropTypes.func,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showPreview: PropTypes.bool,
  showProgress: PropTypes.bool,
};

export default OptimizedImageUpload; 
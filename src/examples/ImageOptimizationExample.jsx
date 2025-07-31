import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { optimizeImage, validateImageFile } from "../utils/imageOptimizer";
import OptimizedImage from "../components/OptimizedImage/OptimizedImage";
import OptimizedImageUpload from "../components/OptimizedImageUpload/OptimizedImageUpload";
import MenuTopo from "../components/MenuTopo/MenuTopo";

/**
 * Exemplo prático de uso do sistema de otimização de imagens
 */
const ImageOptimizationExample = () => {
  // Adicionar classe has-header para espaçamento do MenuTopo
  useEffect(() => {
    document.body.classList.add('has-header');
    return () => {
      document.body.classList.remove('has-header');
    };
  }, []);

  const [optimizedImages, setOptimizedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [stats, setStats] = useState({
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
    totalSavings: 0,
    averageCompression: 0,
  });

  // Exemplo 1: Otimização manual de arquivo
  const handleManualOptimization = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validar arquivo
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`Erro: ${validation.errors.join(", ")}`);
        return;
      }

      // Otimizar imagem
      const result = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85,
        convertToWebP: true,
      });

      setOptimizedImages((prev) => [...prev, result]);
      updateStats([...optimizedImages, result]);

      console.log("Imagem otimizada:", {
        nome: file.name,
        tamanhoOriginal: `${(result.originalSize / 1024).toFixed(1)}KB`,
        tamanhoOtimizado: `${(result.size / 1024).toFixed(1)}KB`,
        economia: `${result.compressionRatio}%`,
        formato: result.format,
      });
    } catch (error) {
      console.error("Erro na otimização:", error);
      alert("Erro ao otimizar imagem");
    }
  };

  // Exemplo 2: Upload com otimização automática
  const handleOptimizedUpload = (images) => {
    setUploadedImages((prev) => [...prev, ...images]);
    updateStats([...uploadedImages, ...images]);

    images.forEach((image) => {
      console.log("=== DETALHES DA OTIMIZAÇÃO ===");
      console.log(`📁 Arquivo: ${image.original.name}`);
      console.log(
        `📏 Tamanho Original: ${(image.originalSize / 1024).toFixed(1)}KB`
      );
      console.log(`📏 Tamanho Otimizado: ${(image.size / 1024).toFixed(1)}KB`);
      console.log(`💾 Economia: ${image.compressionRatio}%`);
      console.log(`🖼️ Formato Final: ${image.format.toUpperCase()}`);
      console.log(`📐 Dimensões: ${image.width}x${image.height}`);
      console.log("==============================");
    });
  };

  // Atualizar estatísticas
  const updateStats = (images) => {
    if (images.length === 0) return;

    const totalOriginal = images.reduce(
      (sum, img) => sum + img.originalSize,
      0
    );
    const totalOptimized = images.reduce((sum, img) => sum + img.size, 0);
    const totalSavings = totalOriginal - totalOptimized;
    const averageCompression = (totalSavings / totalOriginal) * 100;

    setStats({
      totalOriginalSize: totalOriginal,
      totalOptimizedSize: totalOptimized,
      totalSavings,
      averageCompression,
    });
  };

  // Limpar todas as imagens
  const clearAllImages = () => {
    setOptimizedImages([]);
    setUploadedImages([]);
    setStats({
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      totalSavings: 0,
      averageCompression: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MenuTopo />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sistema de Otimização de Imagens
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exemplo prático de como usar o sistema de otimização de imagens com
            compressão automática, conversão para WebP e lazy loading.
          </p>
        </motion.div>

        {/* Estatísticas */}
        {stats.totalOriginalSize > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Estatísticas de Otimização
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(stats.totalOriginalSize / 1024 / 1024).toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tamanho Original
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(stats.totalOptimizedSize / 1024 / 1024).toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tamanho Otimizado
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {(stats.totalSavings / 1024 / 1024).toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Economia
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.averageCompression.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Compressão Média
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exemplo 1: Otimização Manual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Otimização Manual
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Selecione uma imagem para otimização manual com configurações
              personalizadas.
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleManualOptimization}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-green-50 file:text-green-700
                          dark:file:bg-green-900/20 dark:file:text-green-400
                          hover:file:bg-green-100 dark:hover:file:bg-green-900/40"
              />

              {optimizedImages.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Imagens Otimizadas ({optimizedImages.length})
                  </h3>
                  {optimizedImages.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={image.thumbnailUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {image.original.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {image.format.toUpperCase()} •{" "}
                            {image.compressionRatio}% menor
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Exemplo 2: Upload Otimizado */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload com Otimização Automática
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use o componente de upload que otimiza automaticamente as imagens.
            </p>

            <OptimizedImageUpload
              onUpload={handleOptimizedUpload}
              multiple={true}
              maxFiles={3}
              maxFileSize={5 * 1024 * 1024}
              showPreview={true}
              showProgress={true}
            />
          </motion.div>
        </div>

        {/* Exemplo 3: Componente de Imagem Otimizada */}
        {uploadedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Componente de Imagem Otimizada
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Exemplo de como usar o componente OptimizedImage com lazy loading.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((image, index) => (
                <div key={index} className="space-y-3">
                  <OptimizedImage
                    src={image.optimizedUrl}
                    alt={`Imagem otimizada ${index + 1}`}
                    className="w-full h-48 rounded-lg shadow-md"
                    lazy={true}
                    onLoad={() => console.log(`Imagem ${index + 1} carregada`)}
                    onError={() =>
                      console.log(`Erro ao carregar imagem ${index + 1}`)
                    }
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {image.original.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {image.format.toUpperCase()} • {image.compressionRatio}%
                      economia
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Botão Limpar */}
        {(optimizedImages.length > 0 || uploadedImages.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={clearAllImages}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Limpar Todas as Imagens
            </button>
          </motion.div>
        )}

        {/* Informações Técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Informações Técnicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-medium mb-2">
                Funcionalidades Implementadas:
              </h4>
              <ul className="space-y-1">
                <li>• Compressão automática com Canvas API</li>
                <li>• Conversão para WebP quando suportado</li>
                <li>• Redimensionamento inteligente</li>
                <li>• Lazy loading com Intersection Observer</li>
                <li>• Validação de arquivos</li>
                <li>• Thumbnails automáticos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benefícios de Performance:</h4>
              <ul className="space-y-1">
                <li>• Redução de 70-80% no tamanho dos arquivos</li>
                <li>• Carregamento mais rápido das páginas</li>
                <li>• Menor uso de banda de internet</li>
                <li>• Melhor experiência do usuário</li>
                <li>• Compatibilidade com navegadores antigos</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageOptimizationExample;

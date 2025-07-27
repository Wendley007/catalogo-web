import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "react-feather";
import SEO from "../../components/SEO/SEO";

/**
 * Página 404 - Página não encontrada
 */
const NotFound = () => {
  return (
    <>
      <SEO
        title="Página não encontrada"
        description="A página que você está procurando não foi encontrada"
        noindex={true}
      />

      <div className="min-h-screen p-16 bg-gradient-to-br from-red-900 via-gray-800 to-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Ícone animado */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-gray-500 rounded-full flex items-center justify-center">
              <Search className="text-white" size={48} />
            </div>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-4"
          >
            404
          </motion.h1>

          {/* Subtítulo */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl font-semibold text-gray-300 mb-6"
          >
            Página não encontrada
          </motion.h2>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-400 mb-8 text-sm md:text-base"
          >
            A página que você está procurando não existe ou foi movida.
            Verifique o endereço ou navegue pelas opções abaixo.
          </motion.p>

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              <Home size={20} />
              Voltar ao Início
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </motion.div>

          {/* Links úteis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 grid grid-cols-2 gap-4 text-sm"
          >
            <Link
              to="/paginaprincipal"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Página Principal
            </Link>
            <Link
              to="/todascategorias"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Categorias
            </Link>
            <Link
              to="/bancas"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Bancas
            </Link>
            <Link
              to="/localizacao"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Localização
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;

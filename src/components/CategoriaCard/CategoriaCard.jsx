import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { doc, deleteDoc, collection, getDocs, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebaseConnection";
import ConfirmModal from "../Modal/ConfirmModal";
import { Modal } from "../Modal";

const CategoriaCard = ({
  categoria,
  index = 0,
  showAdminControls = false,
  onDeleteCategoria = null,
  variant = "default", // "default", "compact" ou "simple"
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
    type: "error"
  });



  const getImageUrl = () => {
    return (
      categoria.image ||
      categoria.produtos?.[0]?.images?.[0]?.url ||
      "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800"
    );
  };

  const handleDeleteCategoria = async () => {
    setIsDeleting(true);
    try {
      // Verificar se o usuário está autenticado
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error("Usuário não está autenticado");
      }

      // Primeiro, excluir todos os produtos da categoria
      const produtosQuery = query(
        collection(db, `categorias/${categoria.id}/produtos`)
      );
      const produtosSnapshot = await getDocs(produtosQuery);

      // Excluir todos os produtos em paralelo
      const deleteProdutosPromises = produtosSnapshot.docs.map((produtoDoc) =>
        deleteDoc(doc(db, `categorias/${categoria.id}/produtos`, produtoDoc.id))
      );

      await Promise.all(deleteProdutosPromises);

      // Depois, excluir a categoria
      await deleteDoc(doc(db, "categorias", categoria.id));

      // Chamar callback se fornecido
      if (onDeleteCategoria) {
        onDeleteCategoria(categoria);
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir categoria e produtos:", error);
      
      // Mostrar mensagem de erro mais específica
      let errorMessage = "Erro ao excluir categoria.";
      
      if (error.code === 'permission-denied') {
        errorMessage = "Você não tem permissão para excluir esta categoria. Verifique se está logado.";
      } else if (error.code === 'unauthenticated') {
        errorMessage = "Você precisa estar logado para excluir categorias.";
      } else if (error.message.includes("autenticado")) {
        errorMessage = "Você precisa estar logado para excluir categorias.";
      }
      
      // Mostrar modal de erro
      setErrorModal({
        isOpen: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }));
  };

  if (variant === "compact") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-green-200"
        >
          <div className="relative overflow-hidden">
            <img
              src={getImageUrl()}
              alt={categoria.nome}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Etiqueta simples */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-white/20"></div>
          </div>

          {/* Admin gerenciamento - variante compact */}
          {showAdminControls && (
            <button
              onClick={() => {
                setShowDeleteModal(true);
              }}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              title="Excluir categoria"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* Badge de destaque (se tiver muitos produtos) */}
          {(categoria.produtos?.length || 0) > 5 && (
            <div className="absolute top-4 left-4">
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                ⭐ Destaque
              </div>
            </div>
          )}

            {/* Botão overlay no hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Link
                to={`/categorias/${categoria.id}`}
                className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Ver Produtos</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="font-bold text-gray-900 text-xl">
                  {categoria.nome}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {categoria.description ||
                  `${categoria.produtos?.length || 0} produtos disponíveis`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Modal de Confirmação para Excluir Categoria - Variante Compact */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCategoria}
          type="error"
          title="Excluir Categoria"
          message={`Tem certeza que deseja excluir a categoria "${categoria.nome}" e todos os seus produtos? Esta ação não pode ser desfeita.`}
          confirmText={isDeleting ? "Excluindo..." : "Excluir"}
          cancelText="Cancelar"
        />

        {/* Modal de erro */}
        <Modal
          isOpen={errorModal.isOpen}
          onClose={closeErrorModal}
          type={errorModal.type}
          title="Erro"
          message={errorModal.message}
        />
      </>
    );
  }

  // Variant default (usado na página Todas Categorias)
  console.log("Renderizando componente, showDeleteModal:", showDeleteModal);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/50"
      >
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={categoria.nome}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Etiqueta simples */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-white/20"></div>
          </div>

          {/* Admin gerenciamento */}
          {showAdminControls && (
            <button
              onClick={() => {
                setShowDeleteModal(true);
              }}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              title="Excluir categoria"
              disabled={isDeleting}
            >
              <Trash2 size={20} />
            </button>
          )}

          {/* Badge de destaque (se tiver muitos produtos) */}
          {(categoria.produtos?.length || 0) > 5 && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                ⭐ Destaque
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link
              to={`/categorias/${categoria.id}`}
              className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Ver Produtos</span>
            </Link>
          </div>

          {/* Nomes das Categorias*/}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="rounded-xl p-2 shadow-lg transition-colors bg-white/95 group-hover:bg-gray-200">
              <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-black transition-colors">
                {categoria.nome}
              </h3>
              <p className="text-gray-600 text-center text-sm mt-1">
                {categoria.produtos?.length || 0} produto
                {(categoria.produtos?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Confirmação para Excluir Categoria */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCategoria}
        type="error"
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${categoria.nome}" e todos os seus produtos? Esta ação não pode ser desfeita.`}
        confirmText={isDeleting ? "Excluindo..." : "Excluir"}
        cancelText="Cancelar"
      />

      {/* Modal de erro */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        type={errorModal.type}
        title="Erro"
        message={errorModal.message}
      />
    </>
  );
};

CategoriaCard.propTypes = {
  categoria: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    produtos: PropTypes.array,
  }).isRequired,
  index: PropTypes.number,
  showAdminControls: PropTypes.bool,
  onDeleteCategoria: PropTypes.func,
  variant: PropTypes.oneOf(["default", "compact", "simple"]),
};

export default CategoriaCard;

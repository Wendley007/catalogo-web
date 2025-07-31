import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react";

/**
 * Componente reutilizável para modais
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {string} props.type - Tipo do modal ('success', 'error', 'warning', 'info', 'confirm', 'custom')
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem do modal
 * @param {Function} props.onConfirm - Função de confirmação (opcional)
 * @param {React.ElementType} props.icon - Ícone customizado (opcional)
 * @param {React.ReactNode} props.children - Conteúdo customizado (opcional)
 * @param {string} props.size - Tamanho do modal ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.showCloseButton - Se deve mostrar botão de fechar
 * @param {string} props.confirmText - Texto do botão de confirmação
 * @param {string} props.cancelText - Texto do botão de cancelar
 * @param {string} props.closeText - Texto do botão de fechar

 */
const Modal = ({
  isOpen,
  onClose,
  type = "info",
  title = "",
  message = "",
  onConfirm = null,
  icon: CustomIcon = null,
  children = null,
  size = "md",
  showCloseButton = true,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  closeText = "Fechar",

  }) => {

  // Gerenciamento de teclas e scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Impede scroll do body
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = ""; // Restaura scroll do body
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Função para obter ícone baseado no tipo
  const getIcon = () => {
    if (CustomIcon) {
      // Se CustomIcon já é um elemento JSX, retorná-lo diretamente
      if (React.isValidElement(CustomIcon)) {
        return CustomIcon;
      }
      // Se CustomIcon é um componente, renderizá-lo
      if (typeof CustomIcon === 'function' || typeof CustomIcon === 'object') {
        return <CustomIcon />;
      }
      return null;
    }

    const iconProps = { size: 48 };
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" {...iconProps} />;
      case "error":
      case "danger":
        return <XCircle className="text-red-500" {...iconProps} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" {...iconProps} />;
      case "info":
        return <AlertCircle className="text-blue-500" {...iconProps} />;
      default:
        return <AlertCircle className="text-blue-500" {...iconProps} />;
    }
  };

  // Função para obter cor do botão baseado no tipo
  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  // Função para obter tamanho do modal
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return "max-w-md";
    }
  };



  // Renderizar conteúdo customizado ou padrão
  const renderContent = () => {
    if (children) {
      return children;
    }

    return (
      <>
        {/* Ícone */}
        <div className="flex justify-center mb-4">{getIcon()}</div>

        {/* Título */}
        {title && (
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
        )}

        {/* Mensagem */}
        {message && (
          <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        )}

        {/* Botões */}
        <div className="flex space-x-3 justify-center">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 ${onConfirm ? 'bg-yellow-500 hover:bg-yellow-600' : getButtonColor()} text-white rounded-xl font-medium transition-colors`}
          >
            {onConfirm ? cancelText : closeText}
          </button>
        </div>
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <section
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 overflow-hidden"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-600 rounded-xl shadow-2xl p-8 ${getSizeClasses()} w-full mx-4 text-center relative max-h-[90vh] flex flex-col`}
          >
            {/* Botão de fechar (opcional) */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Fechar modal"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {/* Conteúdo do modal */}
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
};

// PropTypes para validação
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["success", "error", "danger", "warning", "info", "confirm", "custom"]),
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element, PropTypes.node]),
  children: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  showCloseButton: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  closeText: PropTypes.string,
};

// Props padrão
Modal.defaultProps = {
  type: "info",
  title: "",
  message: "",
  onConfirm: null,
  icon: null,
  children: null,
  size: "md",
  showCloseButton: true,
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  closeText: "Fechar",
};

export default Modal; 
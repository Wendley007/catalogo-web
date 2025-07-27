import Modal from "./Modal";
import PropTypes from "prop-types";
import { AlertTriangle } from "lucide-react";

/**
 * Componente especializado para modais de confirmação
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onConfirm - Função de confirmação
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem do modal
 * @param {string} props.confirmText - Texto do botão de confirmação
 * @param {string} props.cancelText - Texto do botão de cancelar
 * @param {string} props.type - Tipo do modal ('warning', 'danger', 'info')
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="text-red-500" size={48} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={48} />;
      case "info":
        return <AlertTriangle className="text-blue-500" size={48} />;
      default:
        return <AlertTriangle className="text-yellow-500" size={48} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      type={type}
      title={title}
      message={message}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      showCloseButton={false}
      icon={getIcon}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={onConfirm}
            className={`px-6 py-2 ${getConfirmButtonColor()} text-white rounded-xl font-medium transition-colors`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// PropTypes para validação
ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["warning", "danger", "info"]),
};

// Props padrão
ConfirmModal.defaultProps = {
  title: "Confirmação",
  message: "Tem certeza que deseja continuar?",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  type: "warning",
};

export default ConfirmModal; 
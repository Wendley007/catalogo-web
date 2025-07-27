import Modal from "./Modal";
import PropTypes from "prop-types";

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
    />
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
  type: PropTypes.oneOf(["warning", "danger", "error", "info"]),
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

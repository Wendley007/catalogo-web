import { FaWhatsapp } from "react-icons/fa";
import { useWhatsApp } from "../hooks/useWhatsApp";

/**
 * Componente reutilizável para botões do WhatsApp
 */
const WhatsAppButton = ({ 
  phoneNumber, 
  message, 
  context = "geral", 
  data = {}, 
  className = "", 
  size = 18,
  variant = "default",
  children 
}) => {
  const { generateWhatsAppLink, getDefaultMessage } = useWhatsApp();

  // Usa mensagem personalizada ou gera uma padrão
  const finalMessage = message || getDefaultMessage(context, data);
  const whatsAppLink = generateWhatsAppLink(phoneNumber, finalMessage);

  // Variantes de estilo
  const variants = {
    default: "bg-green-500 hover:bg-green-600 text-white",
    outline: "border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
    minimal: "text-green-500 hover:text-green-600",
    floating: "bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
  };

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300";
  const variantClasses = variants[variant] || variants.default;

  if (!phoneNumber) {
    return null; // Não renderiza se não houver número
  }

  return (
    <a
      href={whatsAppLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses} ${className}`}
      title="Conversar no WhatsApp"
    >
      <FaWhatsapp size={size} />
      {children || <span>Conversar no WhatsApp</span>}
    </a>
  );
};

export default WhatsAppButton;
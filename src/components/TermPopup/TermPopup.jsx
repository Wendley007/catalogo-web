import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { X, CheckCircle, Shield, Users, Clock, Heart } from "lucide-react";
import { useEffect } from "react";

/**
 * Componente reutilizável para popup de termos elegante e profissional
 */
const TermPopup = ({
  isOpen,
  onClose,
  onAccept,
  title = "Avaliação do Catálogo",
  subtitle = "Feira Livre de Buritizeiro",
  description = "Estamos conduzindo uma pesquisa sobre a usabilidade do catálogo web. Antes de prosseguir, leia atentamente nossos termos de ética e responsabilidade.",
  terms = [
    "Respostas confidenciais e dados usados para melhorias no catálogo.",
    "Questionário anônimo, sem coleta de dados pessoais.",
    "Participação voluntária e possibilidade de desistência.",
    "Pesquisa ética, sem riscos aos participantes.",
    "Seus dados serão tratados com total confidencialidade e segurança.",
    "A pesquisa visa melhorar a experiência de todos os usuários do catálogo.",
    "Você pode interromper sua participação a qualquer momento.",
    "Os resultados serão utilizados apenas para fins de melhoria do sistema.",
    "Não há identificação pessoal nos dados coletados.",
    "A participação é completamente opcional e gratuita.",
  ],
  acceptText = "Aceitar e Continuar",
  cancelText = "Voltar",
  thankYouText = "Agradecemos sua participação!",
  size = "lg",
}) => {
  // Gerenciamento de scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Função para obter tamanho do popup
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md w-full mx-4";
      case "md":
        return "max-w-lg w-full mx-4";
      case "lg":
        return "max-w-2xl w-full mx-4";
      default:
        return "max-w-2xl w-full mx-4";
    }
  };

  // Ícones para os termos
  const termIcons = [Shield, Users, Clock, Heart];

  // Função para fechar o popup
  const handleClose = () => {
    onClose();
  };

  // Função para aceitar
  const handleAccept = () => {
    onAccept();
  };

  // Função para prevenir propagação do click
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={`${getSizeClasses()} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}
            onClick={handleModalClick}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 py-2 px-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {title}
                  </h2>
                  <p className="text-emerald-100 text-sm">{subtitle}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 ml-2"
                  aria-label="Fechar popup"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Pesquisa de Usabilidade
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-blue-100 dark:border-gray-600 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                  Termos de Participação
                </h3>
                <div className="space-y-4">
                  {terms.map((term, index) => {
                    const Icon = termIcons[index % termIcons.length];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {term}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="py-2 px-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">
                  {thankYouText}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAccept}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {acceptText}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300"
                  >
                    {cancelText}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// PropTypes para validação
TermPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  terms: PropTypes.arrayOf(PropTypes.string),
  acceptText: PropTypes.string,
  cancelText: PropTypes.string,
  thankYouText: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

// Props padrão
TermPopup.defaultProps = {
  title: "Avaliação do Catálogo",
  subtitle: "Feira Livre de Buritizeiro",
  description:
    "Estamos conduzindo uma pesquisa sobre a usabilidade do catálogo web. Antes de prosseguir, leia atentamente nossos termos de ética e responsabilidade.",
  terms: [
    "Respostas confidenciais e dados usados para melhorias no catálogo.",
    "Questionário anônimo, sem coleta de dados pessoais.",
    "Participação voluntária e possibilidade de desistência.",
    "Pesquisa ética, sem riscos aos participantes.",
    "Seus dados serão tratados com total confidencialidade e segurança.",
    "A pesquisa visa melhorar a experiência de todos os usuários do catálogo.",
    "Você pode interromper sua participação a qualquer momento.",
    "Os resultados serão utilizados apenas para fins de melhoria do sistema.",
    "Não há identificação pessoal nos dados coletados.",
    "A participação é completamente opcional e gratuita.",
  ],
  acceptText: "Aceitar e Continuar",
  cancelText: "Voltar",
  thankYouText: "Agradecemos sua participação!",
  size: "lg",
};

export default TermPopup;

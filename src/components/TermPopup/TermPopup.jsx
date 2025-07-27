import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { X, CheckCircle, Shield, Users, Clock, Heart } from "lucide-react";

/**
 * Componente reutilizável para popup de termos elegante e profissional
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o popup está aberto
 * @param {Function} props.onClose - Função para fechar o popup
 * @param {Function} props.onAccept - Função executada ao aceitar
 * @param {string} props.title - Título do popup
 * @param {string} props.subtitle - Subtítulo do popup
 * @param {string} props.description - Descrição da avaliação
 * @param {Array} props.terms - Array de termos de participação
 * @param {string} props.acceptText - Texto do botão de aceitar
 * @param {string} props.cancelText - Texto do botão de cancelar
 * @param {string} props.thankYouText - Texto de agradecimento
 * @param {string} props.headerGradient - Classe CSS para gradiente do cabeçalho
 * @param {string} props.termsGradient - Classe CSS para gradiente dos termos
 * @param {string} props.acceptButtonClass - Classe CSS para o botão de aceitar
 * @param {string} props.cancelButtonClass - Classe CSS para o botão de cancelar
 * @param {string} props.size - Tamanho do popup ('sm', 'md', 'lg')
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
  ],
  acceptText = "Aceitar e Continuar",
  cancelText = "Voltar",
  thankYouText = "Agradecemos sua participação!",
  headerGradient = "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700",
  termsGradient = "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
  acceptButtonClass = "",
  cancelButtonClass = "",
  size = "lg",
}) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4">
          {/* Backdrop com animação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20"
            onClick={onClose}
          />

          {/* Popup principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className={`${getSizeClasses()} bg-white rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto`}
          >
            {/* Cabeçalho elegante */}
            <div
              className={`${headerGradient} overflow-hidden sticky top-0 z-10`}
            >
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative px-4 sm:px-8 py-4 sm:py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-sm truncate">
                      {title}
                    </h2>
                    <p className="text-emerald-100 font-medium text-sm sm:text-base truncate">
                      {subtitle}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 group flex-shrink-0 ml-2"
                    aria-label="Fechar popup"
                  >
                    <X
                      size={20}
                      className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-4 sm:p-8">
              {/* Descrição */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle
                      size={16}
                      className="sm:w-5 sm:h-5 text-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Pesquisa de Usabilidade
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Termos de Participação */}
              <div
                className={`${termsGradient} border border-blue-100 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8`}
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2 flex-shrink-0" />
                  Termos de Participação
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {terms.map((term, index) => {
                    const Icon = termIcons[index] || Shield;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 sm:space-x-4 group"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <Icon
                            size={12}
                            className="sm:w-4 sm:h-4 text-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                            {term}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Botões */}
              <div className="text-center">
                <p className="text-gray-500 mb-4 sm:mb-6 font-medium text-sm sm:text-base">
                  {thankYouText}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAccept}
                    className={`px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform text-sm sm:text-base ${acceptButtonClass}`}
                  >
                    {acceptText}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`px-6 sm:px-8 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${cancelButtonClass}`}
                  >
                    {cancelText}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
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
  headerGradient: PropTypes.string,
  termsGradient: PropTypes.string,
  acceptButtonClass: PropTypes.string,
  cancelButtonClass: PropTypes.string,
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
  ],
  acceptText: "Aceitar e Continuar",
  cancelText: "Voltar",
  thankYouText: "Agradecemos sua participação!",
  headerGradient:
    "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700",
  termsGradient: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
  acceptButtonClass: "",
  cancelButtonClass: "",
  size: "lg",
};

export default TermPopup;

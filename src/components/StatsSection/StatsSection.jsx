import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * Componente reutilizável para exibir seções de estatísticas
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.stats - Array de estatísticas
 * @param {string} props.title - Título da seção
 * @param {string} props.subtitle - Subtítulo da seção
 * @param {string} props.backgroundColor - Classe CSS para cor de fundo
 * @param {boolean} props.showBackground - Se deve mostrar elementos de fundo
 * @param {string} props.variant - Variante do componente ('default' | 'glass' | 'simple')
 */
const StatsSection = ({
  stats = [],
  title = "Estatísticas",
  subtitle = "Números que mostram nossa qualidade",
  backgroundColor = "bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900",
  showBackground = true,
  variant = "default",
}) => {
  // Função para renderizar o card de estatística baseado na variante
  const renderStatCard = (stat, index) => {
    const Icon = stat.icon;

    const baseClasses = "text-center group transition-all duration-500";
    const iconClasses = "mx-auto mb-4 transition-all duration-500";
    const valueClasses = "font-bold mb-2";
    const labelClasses = "font-semibold";

    switch (variant) {
      case "glass":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${baseClasses} bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20 dark:border-gray-700/20`}
          >
            <div
              className={`w-16 h-16 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center ${iconClasses} group-hover:scale-125 shadow-lg`}
            >
              <Icon className={stat.color} size={32} />
            </div>
            <h3
              className={`text-3xl ${valueClasses} bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent`}
            >
              {stat.value}
            </h3>
            <p className={`text-gray-700 dark:text-gray-300 ${labelClasses}`}>{stat.label}</p>
          </motion.div>
        );

      case "simple":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${baseClasses} bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-xl hover:scale-105`}
          >
            <div
              className={`w-16 h-16 ${stat.color} bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center ${iconClasses} group-hover:scale-110`}
            >
              <Icon className={stat.color} size={32} />
            </div>
            <h3 className={`text-3xl text-gray-900 dark:text-gray-100 ${valueClasses}`}>
              {stat.value}
            </h3>
            <p className={`text-gray-600 dark:text-gray-400 ${labelClasses}`}>{stat.label}</p>
          </motion.div>
        );

      default:
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${baseClasses} bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-xl hover:scale-105`}
          >
            <div
              className={`w-16 h-16 ${stat.color} bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center ${iconClasses} group-hover:scale-110`}
            >
              <Icon className={stat.color} size={32} />
            </div>
            <h3 className={`text-3xl text-gray-900 dark:text-gray-100 ${valueClasses}`}>
              {stat.value}
            </h3>
            <p className={`text-gray-600 dark:text-gray-400 ${labelClasses}`}>{stat.label}</p>
          </motion.div>
        );
    }
  };

  return (
    <section className={`py-16 ${backgroundColor} relative overflow-hidden`}>
      {/* Elementos de fundo decorativos */}
      {showBackground && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 dark:bg-gray-600/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/20 dark:bg-gray-600/20 rounded-full blur-xl"></div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 dark:from-gray-100 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Grid de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, index) => renderStatCard(stat, index))}
        </div>
      </div>
    </section>
  );
};

// PropTypes para validação
StatsSection.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundColor: PropTypes.string,
  showBackground: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "glass", "simple"]),
};

// Props padrão
StatsSection.defaultProps = {
  title: "Estatísticas",
  subtitle: "Números que mostram nossa qualidade",
  backgroundColor: "bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900",
  showBackground: true,
  variant: "default",
};

export default StatsSection;

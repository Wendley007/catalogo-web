import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Star } from "lucide-react";

const HeroSection = ({
  title,
  description,
  backgroundImage,
  icon: Icon,
  stats = [],
  className = "",
  showQuickInfo = false,
  primaryButton = null,
  secondaryButton = null,
  logo = null,
  subtitle = null,
}) => {
  return (
    <section
      className={`bg-cover bg-no-repeat bg-center bg-fixed min-h-screen relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-green-900/60 z-0"></div>

      {/* Elementos decorativos animados */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-lg animate-bounce delay-500"></div>

      <div className="relative z-10 w-full min-h-screen flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            {/* Logo com animação */}
            {logo && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <Link to="/" className="inline-block">
                  <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-40 h-40 md:w-48 md:h-48 mx-auto"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )}

            {/* Ícone principal */}
            {Icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon size={40} className="text-white" />
                </div>
              </motion.div>
            )}

            {/* Título principal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <h2 className="text-3xl md:text-5xl font-bold text-green-300">
                  {subtitle}
                </h2>
              )}
            </motion.div>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-xl text-gray-200 mb-10 mt-10 max-w-3xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Estatísticas */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300"
                  >
                    <stat.icon className="mx-auto mb-2 text-white" size={24} />
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Botões de ação */}
            {(primaryButton || secondaryButton) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                {primaryButton && (
                  <Link to={primaryButton.to}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600  hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <span>{primaryButton.text}</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>
                )}

                {secondaryButton && (
                  <Link to={secondaryButton.to}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-white/50 hover:border-white text-white px-8 py-3 rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                    >
                      {secondaryButton.text}
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            )}

            {/* Informações rápidas */}
            {showQuickInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <MapPin size={16} />
                  <span>Centro de Buritizeiro</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Clock size={16} />
                  <span>Domingos: 6h às 12h</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Star size={16} />
                  <span>Mais de 40 anos</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
  showQuickInfo: PropTypes.bool,
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  secondaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  logo: PropTypes.string,
  subtitle: PropTypes.string,
};

HeroSection.defaultProps = {
  stats: [],
  className: "",
  showQuickInfo: false,
  primaryButton: null,
  secondaryButton: null,
  logo: null,
  subtitle: null,
};

export default HeroSection;

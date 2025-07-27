import { motion } from "framer-motion";
import PropTypes from "prop-types";

const HeroSection = ({ 
  title, 
  description, 
  backgroundImage, 
  icon: Icon,
  stats = [],
  className = ""
}) => {
  return (
    <section
      className={`bg-cover bg-no-repeat bg-center py-20 scroll-snap relative ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.738), rgba(0, 0, 0, 0.728)), url(${backgroundImage})`,
      }}
    >
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-center">
            {Icon && (
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon size={40} className="text-white" />
                </div>
              </div>
            )}
            <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </motion.div>

        {/* Estatísticas rápidas */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto scroll-with-header">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <stat.icon className="mx-auto text-white mb-2" size={32} />
                <h3 className="font-semibold text-white">{stat.title}</h3>
                <p className="text-sm opacity-90 text-white">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}
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
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

HeroSection.defaultProps = {
  stats: [],
  className: "",
};

export default HeroSection; 
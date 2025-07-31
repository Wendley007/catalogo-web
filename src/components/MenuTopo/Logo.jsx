import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.webp";

/**
 * Componente para o logo
 */
const Logo = () => (
  <Link
    to="/"
    className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-1"
    aria-label="Ir para página inicial"
  >
    <motion.img
      src={logo1}
      alt="Logo Viva Bem Buritizeiro"
      className="w-16 h-16 drop-shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    />
    <div className="hidden sm:block">
      <h1 className="text-xl font-bold -ml-2 text-white">Viva Bem</h1>
      <p className="text-sm -ml-2 text-white/80">Buritizeiro</p>
    </div>
  </Link>
);

export default Logo; 
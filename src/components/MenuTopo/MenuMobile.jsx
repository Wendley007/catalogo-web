import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, LogIn, LogOut, UserPlus, ChevronRight } from "lucide-react";
import logo1 from "../../assets/logo1.png";

/**
 * Menu lateral mobile
 */
const MenuMobile = ({ isOpen, onClose, menuItems }) => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate("/");
  };

  // Fecha o menu com ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com blur */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            style={{ backdropFilter: "blur(8px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-black/60 via-green-900/30 to-black/60"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Sidebar Menu */}
            <motion.section
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-[90vh] w-[350px] rounded-l-2xl bg-gradient-to-r from-green-50 to-blue-50 shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <header className="relative bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-lg">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link to="/" onClick={onClose}>
                      <motion.img
                        src={logo1}
                        alt="Logo"
                        className="w-16 h-16 drop-shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    </Link>
                    <div>
                      <h2 className="text-xl font-bold text-white -ml-2">
                        Menu
                      </h2>
                      <p className="text-green-100 text-sm -ml-2">Navegação</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Fechar menu"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </header>

              {/* Itens de navegação */}
              <motion.nav
                className="px-6 py-8 space-y-3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="group flex items-center space-x-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label={`Ir para ${item.label}`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform transition-transform group-hover:scale-110">
                          <Icon size={20} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-900 font-semibold group-hover:text-green-700 transition-colors">
                            {item.label}
                          </span>
                          <div className="w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-300" />
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-green-600 transform transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Área do usuário */}
              <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-100 to-transparent">
                {user ? (
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Foto do usuário"
                          className="w-14 h-14 rounded-full object-cover border-3 border-green-200 shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">
                          {user.name}
                        </p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <div
                            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                            aria-label="Usuário online"
                          />
                          <span className="text-green-600 text-xs font-medium">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Sair da conta"
                    >
                      <LogOut size={18} aria-hidden="true" />
                      <span className="font-semibold">Sair da Conta</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Fazer login"
                    >
                      <LogIn size={18} aria-hidden="true" />
                      <span className="font-semibold">Fazer Login</span>
                    </Link>
                    <Link
                      to="/registro"
                      onClick={onClose}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label="Criar nova conta"
                    >
                      <UserPlus size={18} aria-hidden="true" />
                      <span className="font-semibold">Cadastrar</span>
                    </Link>
                  </div>
                )}
              </footer>
            </motion.section>
          </motion.main>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuMobile; 
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "../Modal";
import {
  ChevronDown,
  LogIn,
  LogOut,
  UserPlus,
  Edit3,
} from "lucide-react";
import { useUserMenu } from "./hooks";

/**
 * Componente para item do menu de navegação
 */
const MenuItem = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/75 hover:text-white hover:bg-white/10"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
};

/**
 * Menu do usuário para desktop
 */
const UserMenu = ({ isOpen, onToggle }) => {
  const menuRef = useRef(null);
  const { user, updateUserProfile, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    editingName,
    newName,
    modalOpen,
    modalMessage,
    modalSuccess,
    isLoading,
    setNewName,
    setEditingName,
    setModalOpen,
    setModalMessage,
    setModalSuccess,
    setIsLoading,
    closeMenu,
  } = useUserMenu();

  // Inicializa o nome quando o usuário muda
  useEffect(() => {
    setNewName(user?.name || "");
  }, [user?.name, setNewName]);

  // Fecha o menu se clicar fora
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      const modalElement = document.querySelector("[data-modal]");
      if (modalElement && modalElement.contains(e.target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onToggle();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onToggle]);

  const validateName = useCallback(
    (name) => /^[\p{L}\s.'-]{1,30}$/u.test(name),
    []
  );

  const handleSave = async () => {
    if (!validateName(newName)) {
      setModalMessage(
        "Nome inválido. Use apenas letras, acentos e espaços (máx. 30 caracteres)."
      );
      setModalSuccess(false);
      return setModalOpen(true);
    }

    setIsLoading(true);
    try {
      await updateUserProfile({ displayName: newName });
      setEditingName(false);
      setModalMessage("Nome atualizado com sucesso!");
      setModalSuccess(true);
      setModalOpen(true);
    } catch (error) {
      setModalMessage("Falha ao atualizar o nome.");
      setModalSuccess(false);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    signOut();
    closeMenu();
    navigate("/");
  }, [signOut, closeMenu, navigate]);

  return (
    <section ref={menuRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 -mr-24 mt-10 w-72 bg-white rounded-xl shadow-2xl border border-gray-300 z-[9998] py-3"
            role="menu"
            aria-label="Menu do usuário"
          >
            {user ? (
              <>
                {/* Perfil do usuário */}
                <div className="flex items-start space-x-3 px-4 pb-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Foto do usuário"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="flex-1">
                    {editingName ? (
                      <>
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Novo nome"
                          disabled={isLoading}
                          aria-label="Editar nome do usuário"
                        />
                        <div className="flex mt-2 space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Salvar nome"
                          >
                            {isLoading ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            onClick={() => setEditingName(false)}
                            disabled={isLoading}
                            className="flex-1 px-2 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Cancelar edição"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>
                          <span
                            className="w-2 h-2 bg-green-500 rounded-full"
                            aria-label="Usuário online"
                          />
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <button
                          onClick={() => setEditingName(true)}
                          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          aria-label="Editar nome do usuário"
                        >
                          <Edit3 size={12} aria-hidden="true" />
                          <span>Editar nome</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Botão de logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 justify-center text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Sair da conta"
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              // Caso não esteja logado
              <div className="space-y-1">
                <Link
                  to="/login"
                  onClick={onToggle}
                  className="w-full px-4 py-2 justify-center text-blue-600 hover:bg-blue-50 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Fazer login"
                >
                  <LogIn size={16} aria-hidden="true" />
                  <span>Entrar</span>
                </Link>
                <Link
                  to="/registro"
                  onClick={onToggle}
                  className="w-full px-4 py-2 justify-center text-green-600 hover:bg-green-50 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  aria-label="Criar nova conta"
                >
                  <UserPlus size={16} aria-hidden="true" />
                  <span>Cadastrar</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalSuccess ? "success" : "error"}
        title={modalSuccess ? "Sucesso!" : "Erro!"}
        message={modalMessage}
      />
    </section>
  );
};

/**
 * Componente principal do menu desktop
 */
const MenuDesktop = ({ menuItems, user, isUserMenuOpen, toggleUserMenu }) => {
  return (
    <nav
      className="hidden lg:flex items-center space-x-4"
      role="navigation"
      aria-label="Menu principal"
    >
      {menuItems.map((item, index) => (
        <MenuItem key={index} to={item.to} icon={item.icon}>
          {item.label}
        </MenuItem>
      ))}

      {/* Menu do usuário */}
      <div className="flex items-center space-x-2">
        <UserMenu isOpen={isUserMenuOpen} onToggle={toggleUserMenu} />
        <button
          onClick={toggleUserMenu}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Menu do usuário"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
        >
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Foto do usuário"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </>
          ) : (
            <span className="text-sm font-medium">Conta</span>
          )}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-200 ${
              isUserMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default MenuDesktop; 
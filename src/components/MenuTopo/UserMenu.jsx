import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Edit3,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * Modal para feedback de operações
 */
const FeedbackModal = ({ isOpen, message, success, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4">
        <div className="flex items-center justify-center mb-4">
          {success ? (
            <CheckCircle className="text-green-500" size={32} />
          ) : (
            <XCircle className="text-red-500" size={32} />
          )}
        </div>
        <h3
          className={`text-lg font-semibold text-center mb-2 ${
            success ? "text-green-700" : "text-red-700"
          }`}
        >
          {success ? "Sucesso!" : "Erro!"}
        </h3>
        <p className="text-gray-600 text-center text-sm mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            success
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

/**
 * Menu dropdown do usuário
 */
const UserMenu = ({ className = "" }) => {
  const { user, updateUserProfile, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleSave = async () => {
    if (!newName.trim()) {
      setModalMessage("Nome não pode estar vazio");
      setModalSuccess(false);
      setModalOpen(true);
      return;
    }

    try {
      await updateUserProfile({ displayName: newName });
      setEditingName(false);
      setModalMessage("Nome atualizado com sucesso!");
      setModalSuccess(true);
      setModalOpen(true);
    } catch (error) {
      setModalMessage("Erro ao atualizar nome. Tente novamente.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      setIsOpen(false);
    } catch (error) {
      setModalMessage("Erro ao fazer logout. Tente novamente.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  if (!user) {
    // Menu para usuários não autenticados
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center space-x-2">
          <Link
            to="/login"
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogIn size={16} />
            <span>Entrar</span>
          </Link>
          <Link
            to="/registro"
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <UserPlus size={16} />
            <span>Cadastrar</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Foto do usuário"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">{user.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4">
              {/* Perfil do usuário */}
              <div className="flex items-center space-x-3 mb-4">
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
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Novo nome"
                      />
                      <div className="flex mt-2 space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingName(false)}
                          className="flex-1 px-2 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-600"
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
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <button
                        onClick={() => setEditingName(true)}
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                      >
                        <Edit3 size={12} />
                        <span>Editar nome</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Botão de logout */}
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 justify-center text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors rounded-lg"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal
        isOpen={modalOpen}
        message={modalMessage}
        success={modalSuccess}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UserMenu;
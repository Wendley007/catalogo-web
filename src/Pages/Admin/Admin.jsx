import { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { updateUserRole } from "../../services/userService";
import { db } from "../../services/firebaseConnection";
import { FaSpinner, FaSearch, FaUsers, FaShieldAlt, FaTrashAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import MenuTopo from "../../components/MenuTopo/MenuTopo";
import Footer from "../../components/Footer";
import { ConfirmModal } from "../../components/Modal";
import SEO from "../../components/SEO/SEO";
import fundo from "../../assets/fundo.webp";

/**
 * Componente para exibir avatar do usuário
 */
const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-indigo-500", "bg-yellow-500", "bg-red-500", "bg-teal-500"
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (user.photoURL && !imageError) {
    return (
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        src={user.photoURL}
        alt={`Foto de ${user.name}`}
        onError={() => setImageError(true)}
        className="w-12 h-12 rounded-full shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-200 object-cover"
      />
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-12 h-12 ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-200`}
    >
      {getInitials(user.name)}
    </motion.div>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};

/**
 * Componente para card de usuário
 */
const UserCard = ({ user, onDelete, onRoleChange, isProtected }) => {
  const isAdmin = user.role === "admin";
  const isProtectedAdmin = isProtected && isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:border-white/30 transition-all duration-200"
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <UserAvatar user={user} />
        
        {!isProtectedAdmin && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(user)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors duration-200"
            aria-label={`Excluir ${user.name}`}
          >
            <FaTrashAlt className="text-red-400" size={16} />
          </motion.button>
        )}
      </div>

      {/* Informações do Usuário */}
      <div className="text-center mb-4">
        <h3 className="text-white font-semibold text-lg mb-1">
          {user.name || "Nome não disponível"}
        </h3>
        <p className="text-gray-300 text-sm mb-2">{user.email}</p>
        
        {/* Badge de Role */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium">
          {isAdmin ? (
            <span className="bg-green-500/20 text-green-300 border border-green-400/30">
              <FaShieldAlt className="inline mr-1" />
              Administrador
            </span>
          ) : (
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <FaUsers className="inline mr-1" />
              Cliente
            </span>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      {!isProtectedAdmin && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRoleChange(user)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            isAdmin
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/30"
              : "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30"
          }`}
        >
          {isAdmin ? "Despromover" : "Promover a Admin"}
        </motion.button>
      )}

      {isProtectedAdmin && (
        <div className="text-center">
          <span className="text-xs text-gray-400">
            Administrador Principal
          </span>
        </div>
      )}
    </motion.div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  isProtected: PropTypes.bool,
};

UserCard.defaultProps = {
  isProtected: false,
};

/**
 * Componente de paginação
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) return pages;
    
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    return pages.slice(start - 1, end);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
      >
        Anterior
      </motion.button>

      {getVisiblePages().map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-all duration-200 ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
          }`}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
      >
        Próximo
      </motion.button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

/**
 * Componente de busca
 */
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Buscar usuários por nome ou email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

/**
 * Componente de estatísticas
 */
const StatsSection = ({ users, filteredUsers }) => {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === "admin").length;
    const totalClients = users.filter(u => u.role === "cliente").length;
    const filteredCount = filteredUsers.length;

    return { totalUsers, totalAdmins, totalClients, filteredCount };
  }, [users, filteredUsers]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
        <div className="text-sm text-gray-300">Total de Usuários</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-green-400">{stats.totalAdmins}</div>
        <div className="text-sm text-gray-300">Administradores</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-blue-400">{stats.totalClients}</div>
        <div className="text-sm text-gray-300">Clientes</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-yellow-400">{stats.filteredCount}</div>
        <div className="text-sm text-gray-300">Resultados</div>
      </motion.div>
    </div>
  );
};

StatsSection.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    })
  ).isRequired,
  filteredUsers: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    })
  ).isRequired,
};

/**
 * Página principal de administração
 */
const Admin = () => {
  // Adicionar classe has-header para espaçamento do MenuTopo
  useEffect(() => {
    document.body.classList.add('has-header');
    return () => {
      document.body.classList.remove('has-header');
    };
  }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminUids, setAdminUids] = useState([]);

  const usersPerPage = 6;

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        
        setUsers(usersList);

        // Armazena os UIDs dos dois primeiros administradores
        const adminUsers = usersList.filter((user) => user.role === "admin");
        const firstTwoAdmins = adminUsers.slice(0, 2).map((user) => user.uid);
        setAdminUids(firstTwoAdmins);
      } catch (error) {
        setErrorMessage("Erro ao buscar usuários. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Paginação
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handlers
  const handleChangeRole = useCallback(async () => {
    if (!selectedUser) return;

    if (adminUids.includes(selectedUser.uid)) {
      setErrorMessage("Você não pode despromover um dos administradores principais.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await updateUserRole(
        selectedUser.uid,
        selectedUser.role === "admin" ? "cliente" : "admin"
      );
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === selectedUser.uid
            ? { ...user, role: user.role === "admin" ? "cliente" : "admin" }
            : user
        )
      );
      
      setSuccessMessage(`Usuário ${selectedUser.name} ${selectedUser.role === "admin" ? "despromovido" : "promovido"} com sucesso!`);
      setModalIsOpen(false);
    } catch (error) {
      setErrorMessage("Erro ao atualizar o papel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedUser, adminUids]);

  const handleDeleteUser = useCallback(async (user) => {
    if (adminUids.includes(user.uid)) {
      setErrorMessage("Você não pode excluir um dos administradores principais.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await deleteDoc(doc(db, "users", user.uid));
      setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
      setSuccessMessage("Usuário excluído com sucesso.");
    } catch (error) {
      setErrorMessage("Erro ao excluir usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [adminUids]);

  const handleRoleChange = useCallback((user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset para primeira página ao buscar
  }, []);

  return (
    <>
      <SEO 
        title="Painel Administrativo"
        description="Gerencie usuários e permissões da Feira Livre de Buritizeiro"
        noindex={true}
      />
      
      <div
        className="bg-cover bg-center min-h-screen text-white relative"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div className="bg-gray-900/90 min-h-screen relative">
          <MenuTopo />
          
          <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-300">
                Gerencie usuários e permissões do sistema
              </p>
            </motion.div>

            {/* Loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-8"
              >
                <div className="text-center">
                  <FaSpinner className="animate-spin text-white text-3xl mx-auto mb-4" />
                  <p className="text-white">Carregando usuários...</p>
                </div>
              </motion.div>
            )}

            {/* Mensagens */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6 text-center"
                >
                  <p className="text-red-300">{errorMessage}</p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6 text-center"
                >
                  <p className="text-green-300">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Estatísticas */}
            <StatsSection users={users} filteredUsers={filteredUsers} />

            {/* Busca */}
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

            {/* Grid de Usuários */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <AnimatePresence>
                {currentUsers.map((user) => (
                  <UserCard
                    key={user.uid}
                    user={user}
                    onDelete={handleDeleteUser}
                    onRoleChange={handleRoleChange}
                    isProtected={adminUids.includes(user.uid)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Links de Navegação */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-4 mt-8"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/resultados"
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white transition-all duration-200"
              >
                Ver Avaliações
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/otimizacao-imagens"
                className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-white transition-all duration-200"
              >
                Otimização de Imagens
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>

          <Footer className="absolute bottom-0 left-0 right-0" />

          {/* Modal de Confirmação */}
          <ConfirmModal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            onConfirm={handleChangeRole}
            title="Confirmar Alteração"
            message={`Você tem certeza que deseja ${
              selectedUser?.role === "admin" ? "despromover" : "promover"
            } ${selectedUser?.name}?`}
            confirmText="Confirmar"
            cancelText="Cancelar"
            type="warning"
          />
        </div>
      </div>
    </>
  );
};

export default Admin;

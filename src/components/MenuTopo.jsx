/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Info,
  MapPin,
  Settings,
  ChevronDown,
  LogIn,
  LogOut,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  ChevronRight,
} from "lucide-react";

import logo1 from "../assets/logo1.png";

// --------------------------------------------------------------- Componente para item do menu
const MenuItem = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/75 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

// ---------------------------------------------------------------  Modal para feedback
const Modal = ({ isOpen, message, success, onClose }) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
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
    </section>
  );
};

// --------------------------------------------------------------- Componente de contagem regressiva
const CountdownItem = ({ value, label }) => (
  <section className="text-center flex items-baseline gap-[2px]">
    <div className="text-sm font-bold">{value.toString().padStart(2, "0")}</div>
    <div className="text-xs opacity-80">{label}</div>
  </section>
);

// Função para calcular tempo restante
const calculateTimeRemaining = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  let feiraAberta = false;

  if (dayOfWeek === 0 && currentHour >= 6 && currentHour < 12) {
    feiraAberta = true;
  }

  let nextOpening;
  if (dayOfWeek === 0 && currentHour < 6) {
    nextOpening = new Date(now);
    nextOpening.setHours(6, 0, 0, 0);
  } else {
    nextOpening = new Date(now);
    nextOpening.setDate(now.getDate() + ((7 - dayOfWeek) % 7));
    nextOpening.setHours(6, 0, 0, 0);
  }

  if (nextOpening < now) {
    nextOpening.setDate(nextOpening.getDate() + 7);
  }

  const difference = nextOpening.getTime() - now.getTime();
  const days = Math.floor(difference / (24 * 3600000));
  const remainingHours = Math.floor((difference % (24 * 3600000)) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  return {
    feiraAberta,
    days,
    hours: remainingHours,
    minutes,
    seconds,
  };
};

// --------------------------------------------------------------- Menu do usuário para desktop

const UserMenu = ({ isOpen, onToggle }) => {
  const menuRef = useRef(null);
  const { user, updateUserProfile, signOut } = useContext(AuthContext);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);
  const navigate = useNavigate();

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onToggle();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const validateName = (name) => /^[\p{L}\s.'-]{1,30}$/u.test(name);

  const handleSave = async () => {
    if (!validateName(newName)) {
      setModalMessage(
        "Nome inválido. Use apenas letras, acentos e espaços (máx. 30 caracteres)."
      );
      setModalSuccess(false);
      return setModalOpen(true);
    }
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
    }
  };

  const handleLogout = () => {
    signOut();
    onToggle();
    navigate("/");
  };

  return (
    <section ref={menuRef} className="relative">
      {isOpen && (
        <div
          className="absolute right-0 -mr-24 mt-10 w-72 bg-white rounded-xl shadow-2xl border border-gray-300 z-50 py-3"
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
                onClick={handleLogout}
                className="w-full px-4 py-2 justify-center text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            // Caso não esteja logado
            <div className="space-y-1">
              <Link
                to="/login"
                onClick={onToggle}
                className="w-full px-4 py-2 justify-center text-blue-600 hover:bg-blue-50 flex items-center space-x-2 transition-colors"
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </Link>
              <Link
                to="/registro"
                onClick={onToggle}
                className="w-full px-4 py-2 justify-center text-green-600 hover:bg-green-50 flex items-center space-x-2 transition-colors"
              >
                <UserPlus size={16} />
                <span>Cadastrar</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        success={modalSuccess}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};

// ---------------------------------------------------------------  Menu lateral mobile

const MobileMenu = ({ isOpen, onClose, menuItems }) => {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await handleLogout();
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop com blur */}
      <main
        className="fixed inset-0 z-50 lg:hidden"
        style={{ backdropFilter: "blur(8px)" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-green-900/30 to-black/60"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sidebar Menu */}
        <section className="absolute top-0 right-0 h-screen w-[350px] rounded-l-2xl bg-gradient-to-r from-green-50 to-blue-50 shadow-2xl overflow-auto z-60">
          {" "}
          {/* Header */}
          <header className="relative bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-lg">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <motion.img
                    src={logo1}
                    alt="Logo"
                    className="w-16 h-16 drop-shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  />
                </Link>
                <div>
                  <h2 className="text-xl font-bold text-white -ml-2">Menu</h2>
                  <p className="text-green-100 text-sm -ml-2">Navegação</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition duration-300 transform hover:scale-110"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
          </header>
          {/* Itens de navegação */}
          <motion.nav
            className="px-6 py-8 space-y-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.to}
                  onClick={onClose}
                  className="group flex items-center space-x-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform transition-transform group-hover:scale-110">
                    <Icon size={20} />
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
                  />
                </Link>
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
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-600 text-xs font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <LogOut size={18} />
                  <span className="font-semibold">Sair da Conta</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <LogIn size={18} />
                  <span className="font-semibold">Fazer Login</span>
                </Link>
                <Link
                  to="/registro"
                  onClick={onClose}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-transform duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <UserPlus size={18} />
                  <span className="font-semibold">Cadastrar</span>
                </Link>
              </div>
            )}
          </footer>
        </section>
      </main>
    </>
  );
};

// --------------------------------------------------------------- Componente principal do MenuTopo

const MenuTopo = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [feiraAberta, setFeiraAberta] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const updateTime = () => {
      const { feiraAberta, days, hours, minutes, seconds } =
        calculateTimeRemaining();
      setFeiraAberta(feiraAberta);
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { to: "/paginaprincipal", icon: Home, label: "Início" },
    { to: "/historia", icon: Info, label: "História" },
    { to: "/localizacao", icon: MapPin, label: "Localização" },
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: Settings, label: "Admin" }]
      : []),
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-emerald-700 via-green-600 to-green-700 shadow-lg sticky top-0 z-40">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.img
                src={logo1}
                alt="Logo"
                className="w-16 h-16 drop-shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold -ml-2 text-white">Viva Bem</h1>
                <p className="text-sm -ml-2 text-white/80">Buritizeiro</p>
              </div>
            </Link>

            {/* Countdown/Status */}
            <div
              className={`hidden md:flex items-center space-x-4 px-4 py-0 rounded-lg ${
                feiraAberta ? "bg-green-500/30" : "bg-black/0"
              } backdrop-blur-sm`}
            >
              <Clock className="text-white mt-1" size={20} />
              <div className="text-white">
                {feiraAberta ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold">Feira Aberta!</p>
                    <p className="text-xs opacity-80">Aproveite até 12h</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium mb-1">
                      Próxima abertura em:
                    </p>
                    <div className="flex space-x-3">
                      {timeRemaining.days > 0 && (
                        <CountdownItem
                          value={timeRemaining.days}
                          label="dias"
                        />
                      )}
                      <CountdownItem value={timeRemaining.hours} label="h" />
                      <CountdownItem
                        value={timeRemaining.minutes}
                        label="min"
                      />
                      <CountdownItem value={timeRemaining.seconds} label="s" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <MenuItem key={index} to={item.to} icon={item.icon}>
                  {item.label}
                </MenuItem>
              ))}

              <div className="flex items-center space-x-2">
                <UserMenu
                  isOpen={isUserMenuOpen}
                  onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                />
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200"
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
                      {/* <span className="text-sm font-medium">{user.name}</span> */}
                    </>
                  ) : (
                    <span className="text-sm font-medium">Conta</span>
                  )}
                  <ChevronDown size={16} />
                </button>
              </div>
            </nav>

            {/* Mobile contagem regressiva */}

            <section
              className={`md:hidden flex px-4 py-2 rounded-lg ${
                feiraAberta ? "bg-green-500/5" : "bg-black/5"
              } backdrop-blur-sm`}
            >
              <div className="flex items-center justify-center space-x-3 text-white">
                <Clock size={16} />
                {feiraAberta ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold">Feira Aberta!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs mb-1 font-semibold">Abre em:</p>
                    <div className="flex space-x-2 text-xs text-white">
                      {timeRemaining.days > 0 && (
                        <span>
                          <span className="font-semibold">
                            {timeRemaining.days}
                          </span>
                          <span className="ml-[2px]  opacity-80">dias</span>
                        </span>
                      )}
                      <span>
                        <span className="font-semibold">
                          {timeRemaining.hours}
                        </span>
                        <span className="ml-[2px] opacity-80">h</span>
                      </span>
                      <span>
                        <span className="font-semibold">
                          {timeRemaining.minutes}
                        </span>
                        <span className="ml-[2px] opacity-80">m</span>
                      </span>
                      <span>
                        <span className="font-semibold">
                          {timeRemaining.seconds}
                        </span>
                        <span className="ml-[2px] opacity-80">s</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </section>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
};

export default MenuTopo;

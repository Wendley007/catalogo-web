/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Info, Menu as MenuIcon, X as CloseIcon } from "react-feather";
import { FiChevronDown } from "react-icons/fi";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo.png";
import { AuthContext } from "../contexts/AuthContext";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCog } from "react-icons/fa";

/* Item do Menu */

const MenuItem = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center text-gray-300 ml-28 hover:text-gray-100 transition duration-300"
  >
    {icon}
    <span className="text-xs ml-1 uppercase font-semibold">{children}</span>
  </Link>
);

/* Botão com Ícone */

const ButtonWithIcon = ({ onClick, icon, text }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center rounded-full border-2 border-white px-2 py-2 text-xs leading-normal transition duration-300 ease-in-out hover:border-neutral-100 hover:bg-white hover:bg-opacity-20 hover:text-white focus:border-white focus:text-white focus:outline-none focus:ring-0 active:border-white active:text-white dark:hover:bg-white dark:hover:bg-opacity-20"
    data-te-ripple-init
    data-te-ripple-color="light"
  >
    {icon}
    <span className="ml-1 text-xs">{text}</span>
  </button>
);

/* ---------------------------------  Menu Mobile -----------------------------------*/

const MobileMenu = ({ menuItems, isOpen, onClose, handleLogout }) => {
  const [isShrunk, setIsShrunk] = useState(false);
  const menuRef = useRef(null);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsShrunk(true);
    } else {
      setIsShrunk(false);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-90 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transform`}
      />
      <div
        ref={menuRef}
        className={`absolute top-0 right-0 w-full max-w-md bg-gray-800 rounded-l-lg transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6`}
      >
        <button
          onClick={onClose}
          className="self-end text-gray-500 hover:text-gray-200 focus:outline-none mb-4"
          aria-label="Fechar menu"
        >
          <FaTimes
            className={`w-6 h-6 transition-transform transform ${
              isShrunk ? "rotate-45" : ""
            }`}
          />
        </button>
        <h2
          className={`text-2xl text-green-400 uppercase font-bold text-center mb-4 transition-all duration-300 ${
            isShrunk ? "text-lg" : ""
          }`}
        >
          Menu
        </h2>
        <div className="flex flex-col items-center w-full space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center justify-center text-gray-300 hover:text-white transition duration-200 ease-in-out w-full text-center py-3 rounded-md hover:bg-gray-700 shadow-lg"
              onClick={onClose}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-md ml-2 uppercase font-semibold">
                {item.label}
              </span>
            </Link>
          ))}
          <div className="border-t border-gray-600 my-4 w-full"></div>
          <MobileUserMenu isOpen={isOpen} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, message, success, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg text-center ${
          success ? "text-green-600" : "text-red-600"
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          {success ? (
            <FaCheckCircle className="text-green-700 w-8 h-8" />
          ) : (
            <FaTimesCircle className="text-red-700 w-8 h-8" />
          )}
        </div>
        <h2
          className={`font-bold text-lg ${
            success ? "text-green-700" : "text-red-700"
          }`}
        >
          {success ? "Sucesso!" : "Erro!"}
        </h2>
        <p
          className={`mt-2 ${
            success ? "text-gray-700 text-xs" : "text-gray-600 text-xs"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`mt-4 ${
            success ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded hover:${
            success ? "bg-green-600" : "bg-red-600"
          } transition duration-300`}
          aria-label="Fechar modal"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

const MobileUserMenu = ({ isOpen, handleLogout }) => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);

  const validateName = (name) => /^[a-zA-Z0-9\s]{1,14}$/.test(name);

  const handleSave = async () => {
    if (!validateName(newName)) {
      setModalMessage(
        "Nome inválido. Certifique-se de que o nome contenha apenas letras, números e espaços, e tenha no máximo 14 caracteres."
      );
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
      console.error("Erro ao atualizar o nome:", error);
      setModalMessage("Falha ao atualizar o nome.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Dados do usuário:", user);
      console.log("Foto do usuário:", user.photoURL); // Verifique se este valor é correto.
    }
  }, [user]);

  return (
    <div
      className={`relative z-10 ${
        isOpen ? "block" : "hidden"
      } bg-green-300 bg-opacity-10 p-4 rounded-md mt-4 shadow-xl transition-opacity duration-300`}
    >
      {user ? (
        <div className="flex items-center space-x-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Foto do usuário"
              className="w-12 h-12 sm:w-16 rounded-full border-2 border-gray-600 shadow-lg transition-transform transform hover:scale-110"
              onError={(e) =>
                (e.target.src = "caminho/para/imagem/default.jpg")
              }
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user.name[0].toUpperCase()}
            </div>
          )}

          <div>
            {editingName ? (
              <div className="flex flex-col items-center space-y-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700 text-center text-white p-1 mb-1 rounded-md text-xs w-full max-w-xs"
                  placeholder="Digite seu novo nome"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-xs font-medium text-white p-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="bg-red-500 text-xs font-medium text-white p-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <div className="uppercase text-sm text-gray-200 font-semibold">
                    {user.name}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                </div>
                <div className="text-xs mt-2 text-gray-400">{user.email}</div>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-blue-400 text-xs text-center mt-2"
                >
                  Editar Nome
                </button>
              </div>
            )}
          </div>
          <Link
            to="/"
            onClick={handleLogout}
            className="px-4 py-2 text-sm flex items-center justify-center text-red-500 hover:bg-gray-700 hover:text-white transition duration-300"
          >
            <FaSignOutAlt className="w-4 h-4 mr-2" /> Sair
          </Link>
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <Link
            to="/Login"
            className="text-blue-400 text-sm hover:text-blue-500 transition duration-300"
            aria-label="Entrar"
          >
            Entrar
          </Link>
          <Link
            to="/Registro"
            className="text-green-400 text-sm hover:text-green-500 transition duration-300"
            aria-label="Cadastrar"
          >
            Cadastrar
          </Link>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        success={modalSuccess}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

/*-----------------------    Menu do Usuário versão WEB     ------------------------*/

const MenuUsuario = ({ isOpen, onToggle }) => {
  const menuRef = useRef(null);
  const { user, updateUserProfile, handleLogout } = useContext(AuthContext);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const validateName = (name) => /^[a-zA-Z0-9\s]{1,14}$/.test(name);

  const handleSave = async () => {
    if (!validateName(newName)) {
      setModalMessage(
        "Nome inválido. Certifique-se de que o nome contenha apenas letras, números e espaços, e tenha no máximo 14 caracteres."
      );
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
      console.error("Erro ao atualizar o nome:", error);
      setModalMessage("Falha ao atualizar o nome.");
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div ref={menuRef} className="relative ml-4">
      {isOpen && (
        <div className="absolute mt-6 right-0 -mr-12 z-10 bg-opacity-85 w-60 rounded-md bg-gray-900 py-2 shadow-lg ring-1 ring-white ring-opacity-25 focus:outline-none">
          {user ? (
            <>
              <div className="flex items-center space-x-2 px-2 py-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Photo"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <div>
                  {editingName ? (
                    <div className="flex flex-col items-center space-y-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-gray-700 text-center text-white p-1 mb-1 rounded-md text-xs w-full max-w-xs"
                        placeholder="Digite seu novo nome"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-xs font-medium text-white p-1 rounded-md hover:bg-green-600 transition duration-300"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingName(false)}
                          className="bg-red-500 text-xs font-medium text-white p-1 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center">
                        <div className="uppercase text-sm text-gray-200 font-semibold">
                          {user.name}
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                      </div>
                      <div className="text-xs mt-2 text-gray-400">
                        {user.email}
                      </div>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-blue-400 text-xs text-center mt-2"
                      >
                        Editar Nome
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Link
                to="/"
                onClick={() => {
                  handleLogout();
                  onToggle();
                }}
                className="px-4 py-2 text-sm flex items-center justify-center text-red-500 hover:bg-gray-700 hover:text-white transition duration-300"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" /> Sair
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/Login"
                className="px-4 py-2 text-sm flex items-center justify-center text-blue-500 hover:bg-gray-700 hover:text-white transition duration-300"
              >
                <FaSignInAlt className="w-4 h-4 mr-2" /> Entrar
              </Link>
              <Link
                to="/Registro"
                className="px-4 py-2 text-sm flex items-center justify-center text-green-500 hover:bg-gray-700 hover:text-white transition duration-300"
              >
                <FaUserPlus className="w-4 h-4 mr-2" /> Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto relative">
            <div
              className={`p-4 ${modalSuccess ? "bg-green-100" : "bg-red-100"}`}
            >
              <h2
                className={`text-lg font-semibold ${
                  modalSuccess ? "text-green-800" : "text-red-800"
                }`}
              >
                {modalSuccess ? "Sucesso!" : "Erro!"}
              </h2>
              <p className="mt-2 text-sm text-gray-700">{modalMessage}</p>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <FaTimesCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Item de Contagem Regressiva */

const CountdownItem = ({ value, label, isMobile }) => (
  <div className={`countdown-item ${isMobile ? "text-xs" : ""}`}>
    <p className={`text-sm ${isMobile ? "text-xs" : ""}`}>
      {value.toString().padStart(2, "0")}
    </p>
    <p className="text-xs">{label}</p>
  </div>
);

/* Função para Calcular o Tempo Restante */

const calculateTimeRemaining = () => {
  const agora = new Date();
  const diaDaSemana = agora.getDay();
  const horas = agora.getHours();
  let feiraAberta = false;

  if (diaDaSemana === 0 && horas >= 6 && horas < 12) {
    feiraAberta = true;
  }

  let proximaAbertura;
  if (diaDaSemana === 0 && horas < 6) {
    proximaAbertura = new Date(agora);
    proximaAbertura.setHours(6, 0, 0, 0);
  } else {
    proximaAbertura = new Date(agora);
    proximaAbertura.setDate(agora.getDate() + ((7 - diaDaSemana) % 7));
    proximaAbertura.setHours(6, 0, 0, 0);
  }

  if (proximaAbertura < agora) {
    proximaAbertura.setDate(proximaAbertura.getDate() + 7);
  }

  const diferenca = proximaAbertura - agora;
  const diasRestantes = Math.floor(diferenca / (24 * 3600000));
  const horasRestantes = Math.floor((diferenca % (24 * 3600000)) / 3600000);
  const minutosRestantes = Math.floor((diferenca % 3600000) / 60000);
  const segundosRestantes = Math.floor((diferenca % 60000) / 1000);

  return {
    feiraAberta,
    diasRestantes,
    horasRestantes,
    minutosRestantes,
    segundosRestantes,
  };
};

const DynamicMenuTopo = ({ logoSrc, menuItems, isMobile, handleLogout }) => {
  const [tempoRestante, setTempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const [feiraAberta, setFeiraAberta] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const updateTempoRestante = () => {
      const {
        feiraAberta,
        diasRestantes,
        horasRestantes,
        minutosRestantes,
        segundosRestantes,
      } = calculateTimeRemaining();

      setFeiraAberta(feiraAberta);

      if (!feiraAberta) {
        setTempoRestante({
          dias: diasRestantes,
          horas: horasRestantes,
          minutos: minutosRestantes,
          segundos: segundosRestantes,
        });
      }
    };

    updateTempoRestante();

    const intervalId = setInterval(updateTempoRestante, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <nav className="flex flex-col lg:flex-row justify-between items-center bg-green-600 bg-opacity-55 py-1 text-white shadow-lg hover:text-neutral-700 dark:text-neutral-200">
      <div className="flex items-center justify-between w-full md:px-14">
        <Link to="/">
          <motion.img
            src={logoSrc}
            alt="Logo"
            className="w-20 h-20"
            whileHover={{ scale: 1.1 }}
          />
        </Link>
        <div
          className={`info-box ${
            feiraAberta ? "bg-green-500" : "bg-black"
          } text-white bg-opacity-20 p-2 rounded-md shadow-sm text-center flex flex-col justify-center items-center`}
        >
          {feiraAberta ? (
            <h2 className="text-xs uppercase font-semibold">
              A feira está aberta. Aproveite!
            </h2>
          ) : (
            <>
              <h2 className="text-xs font-semibold uppercase">
                A feira abrirá em:
              </h2>
              <div className="countdown text-xs grid font-medium grid-cols-4 gap-5 text-center">
                {tempoRestante.dias > 0 && (
                  <CountdownItem
                    value={tempoRestante.dias}
                    label={tempoRestante.dias === 1 ? "Dia" : "Dias"}
                  />
                )}
                <CountdownItem
                  value={tempoRestante.horas}
                  label={tempoRestante.horas === 1 ? "Hora" : "Horas"}
                />
                <CountdownItem
                  value={tempoRestante.minutos}
                  label={tempoRestante.minutos === 1 ? "Minuto" : "Minutos"}
                />
                <CountdownItem
                  value={tempoRestante.segundos}
                  label={tempoRestante.segundos === 1 ? "Segundo" : "Segundos"}
                />
              </div>
            </>
          )}
        </div>
        {isMobile && (
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        )}
      </div>
      {isMobile && (
        <MobileMenu
          menuItems={menuItems}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
      {!isMobile && (
        <div className="flex mr-4 space-x-4 ml-auto items-center">
          {menuItems.map((item, index) => (
            <MenuItem key={index} to={item.to} icon={item.icon}>
              {item.label}
            </MenuItem>
          ))}
          <MenuUsuario
            isOpen={isUserMenuOpen}
            onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
            handleLogout={handleLogout}
          />
          <ButtonWithIcon
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            icon={<FiChevronDown />}
          />
        </div>
      )}
    </nav>
  );
};

/* -----------------------------  Menu Principal ------------------------------ */

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signed, user, signOut } = useContext(AuthContext);

  const handleLogout = () => {
    if (signed && user) {
      signOut();
      console.log("Logout realizado");
      setIsMobileMenuOpen(false);
    } else {
      console.log("Nenhum usuário autenticado para fazer logout.");
    }
  };

  // Itens do menu para a versão web
  const menuItems = [
    {
      to: "/paginaprincipal",
      icon: <Home className="inline-block h-4 w-4" />,
      label: "Início",
    },
    {
      to: "/historia",
      icon: <Info className="inline-block h-4 w-4" />,
      label: "Sobre",
    },
    {
      to: "/contato",
      icon: <AiOutlineEnvironment className="inline-block h-4 w-4" />,
      label: "Localização",
    },
    ...(user && user.role === "admin"
      ? [
          {
            to: "/Admin",
            icon: <FaCog className="inline-block h-4 w-4" />,
            label: "Admin",
          },
        ]
      : []),
  ];

  return (
    <>
      <DynamicMenuTopo
        logoSrc={logo}
        menuItems={menuItems}
        isMobile={window.innerWidth < 1000}
        handleLogout={handleLogout}
      />
      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Menu;

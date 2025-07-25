import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { updateUserRole } from "../../services/userService";
import { db } from "../../services/firebaseConnection";
import { FaUserAlt, FaSpinner, FaSearch } from "react-icons/fa";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import fundo from "../../assets/fundo.jpg";
import Modal from "react-modal";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [adminUids, setAdminUids] = useState([]);

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
        console.log(usersList);
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

  useEffect(() => {
    console.log("Users updated:", users); // Apenas para verificar no console
  }, [users]);

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    // Verifica se o usuário que está sendo despromovido é um dos dois primeiros admins
    if (adminUids.includes(selectedUser.uid)) {
      setErrorMessage(
        "Você não pode despromover um dos administradores principais."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await updateUserRole(
        selectedUser.uid,
        selectedUser.role === "admin" ? "user" : "admin"
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === selectedUser.uid
            ? { ...user, role: user.role === "admin" ? "user" : "admin" }
            : user
        )
      );
      setModalIsOpen(false);
    } catch (error) {
      setErrorMessage("Erro ao atualizar o papel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (adminUids.includes(user.uid)) {
      setErrorMessage(
        "Você não pode excluir um dos administradores principais."
      );
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
  };

  const getUserAvatar = (user) => {
    if (user.photoURL) {
      // Verifica se a imagem está acessível
      fetch(user.photoURL)
        .then((response) => {
          if (!response.ok) {
            console.log("Erro ao carregar imagem:", response.statusText);
            // Se não carregar, usa a imagem padrão
            user.photoURL = "/default/avatar.png";
          } else {
            console.log("Imagem carregada com sucesso");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar a imagem:", error);
          // Se houver erro ao buscar, usa a imagem padrão
          user.photoURL = "/default/avatar.png";
        });

      return (
        <img
          src={user.photoURL}
          alt="User Photo"
          onError={(e) => (e.target.src = "/default/avatar.png")}
          className="w-10 h-10 rounded-full shadow-md border-2 border-transparent hover:border-blue-400 transition duration-200"
        />
      );
    }

    if (user.name) {
      return (
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-transparent hover:border-blue-400 transition duration-200">
          {user.name[0].toUpperCase()}
        </div>
      );
    }

    return <FaUserAlt className="text-gray-500 w-10 h-10 shadow-md" />;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div
      className="bg-cover bg-center min-h-screen text-white relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-800 bg-opacity-85 min-h-screen relative">
        <MenuTopo />
        <div className="container mx-auto py-10">
          <h1 className="text-sm font-semibold text-green-400 text-center mb-8 uppercase">
            Painel do Administrador
          </h1>
          {loading && (
            <div className="flex justify-center mb-4">
              <FaSpinner className="animate-spin text-white text-2xl" />
              <span className="text-white ml-2">Carregando usuários...</span>
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <section className="bg-gray-400 bg-opacity-35 p-2 rounded-lg w-full max-w-xl mx-auto flex mb-14 justify-center items-center gap-2">
            <FaSearch className="ml-1 mt-1 text-gray-200" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border-2 text-gray-500 text-xs rounded-lg h-8 px-3 outline-none"
            />
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentUsers.map((user) => (
              <div
                key={user.uid}
                className="bg-gray-200 opacity-80 rounded-lg shadow-lg p-4 flex flex-col items-center relative"
              >
                {/* Botão de Excluir */}
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="absolute bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center top-2 right-2 shadow-md z-10"
                  aria-label={`Excluir ${user.name || "usuário"}`}
                >
                  <FiTrash2 size={20} color="#000" />
                </button>

                {/* Avatar do Usuário */}
                <div className="mb-4">{getUserAvatar(user)}</div>

                {/* Nome e Informações do Usuário */}
                <h2 className="text-gray-800 font-semibold text-sm mb-1">
                  {user.name || "Nome não disponível"}
                </h2>
                <p className="text-gray-600 text-xs mb-1">{user.email}</p>
                <p className="text-gray-600 text-xs uppercase mb-1">
                  {user.role || "cliente"}
                </p>

                {/* Botões de Ação */}
                <button
                  onClick={() => {
                    if (adminUids.includes(user.uid)) {
                      setErrorMessage(
                        "Você não pode despromover este administrador."
                      );
                      return;
                    }
                    setSelectedUser(user);
                    setModalIsOpen(true);
                  }}
                  className={`mt-2 ${
                    user.role === "admin"
                      ? "bg-green-500 text-sm cursor-not-allowed"
                      : "bg-red-500 text-sm"
                  } text-white py-1 px-1 rounded-md hover:${
                    user.role === "admin" ? "bg-green-600" : "bg-red-700"
                  } transition duration-300`}
                  disabled={
                    user.role === "admin" && adminUids.includes(user.uid)
                  }
                  aria-label={`Promover ${
                    user.name || "usuário"
                  } a administrador`}
                >
                  {user.role === "admin" ? "Administrador" : "Promover a Admin"}
                </button>

                {user.role === "admin" &&
                  adminUids.includes(user.uid) === false && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalIsOpen(true);
                      }}
                      className="mt-2 bg-yellow-500 text-sm text-white py-1 px-1 rounded-md hover:bg-yellow-600 transition duration-300"
                      aria-label={`Despromover ${
                        user.name || "usuário"
                      } de administrador`}
                    >
                      Despromover
                    </button>
                  )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-100 text-gray-700 py-2 px-4 text-sm rounded-md hover:bg-gray-300 mr-2"
            >
              Anterior
            </button>
            <span className="text-white text-xs mt-2">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-gray-100 text-gray-700 py-2 px-4 text-sm rounded-md hover:bg-gray-300 ml-2"
            >
              Próximo
            </button>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-5">
            <Link
              to="/resultados"
              className="flex items-center mt-4 justify-center py-1 px-2 border border-transparent text-xs rounded-xl text-white bg-opacity-55 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
            >
              Ver Avaliações
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
        <Footer className="absolute bottom-0 left-0 right-0" />

        {/* Modal de Confirmação */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="bg-white w-11/12 max-w-sm mx-auto p-6 rounded-lg my-60 shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <h2 className="text-sm text-center font-bold uppercase mb-4">
            Confirmação
          </h2>
          <p className="text-sm text-center mb-4">
            Você tem certeza que deseja{" "}
            {selectedUser?.role === "admin" ? "despromover" : "promover"}{" "}
            {selectedUser?.name}?
          </p>
          <div className="flex justify-around mt-4">
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-300 text-gray-700 py-2 text-sm px-4 rounded-md hover:bg-gray-400 w-1/3"
            >
              Cancelar
            </button>
            <button
              onClick={handleChangeRole}
              className="bg-green-500 text-white py-2 text-sm rounded-md hover:bg-green-600 w-1/3"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;

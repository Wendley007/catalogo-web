import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import fundo from "../../../assets/fundo.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Bancas = () => {
  const [bancas, setBancas] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [selectedBancaToDelete, setSelectedBancaToDelete] = useState(null);
  const [selectedVendedorToDelete, setSelectedVendedorToDelete] =
    useState(null);
  const [selectedBancaToEdit, setSelectedBancaToEdit] = useState(null);
  const [newBancaName, setNewBancaName] = useState("");
  const [selectedVendedorToEdit, setSelectedVendedorToEdit] = useState(null);
  const [newVendedorName, setNewVendedorName] = useState("");
  const [newVendedorCity, setNewVendedorCity] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const { user } = useContext(AuthContext);
  const vendedoresRef = useRef(null);
  const [filteredBancas, setFilteredBancas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBancas = async () => {
      try {
        setLoading(true);
        const snapshotBancas = await getDocs(collection(db, "bancas"));
        const bancasData = [];
        for (const doc of snapshotBancas.docs) {
          const banca = { id: doc.id, ...doc.data() };
          const vendedoresSnapshot = await getDocs(
            query(collection(db, `bancas/${banca.id}/vendedores`))
          );
          const vendedoresData = vendedoresSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const produtosData = banca.produtos || [];
          banca.vendedores = vendedoresData;
          banca.produtos = produtosData;
          bancasData.push(banca);
        }
        setBancas(bancasData);
        console.log("Bancas carregadas:", bancasData);
      } catch (error) {
        console.error("Erro ao buscar bancas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBancas();
  }, []);

  useEffect(() => {
    if (!searchProduct) {
      setFilteredBancas(bancas);
    }
    const filtered = bancas.filter((banca) => {
      console.log("Pesquisando em banca:", banca.id);
      return banca.produtos.some(
        (produto) =>
          produto.nome &&
          produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
      );
    });
    setFilteredBancas(filtered);
    console.log("Bancas filtradas:", filtered);
  }, [searchProduct, bancas]);

  {
    /*------------------------------------------------------------------------------- */
  }

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  const updateBancaName = async (bancaId, novoNome) => {
    try {
      const bancaRef = doc(db, "bancas", bancaId);
      await updateDoc(bancaRef, { nome: novoNome });

      setBancas((prevBancas) =>
        prevBancas.map((banca) =>
          banca.id === bancaId ? { ...banca, nome: novoNome } : banca
        )
      );

      setSuccessMessage("Nome alterado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao atualizar o nome da banca:", error);
    }
  };

  {
    /*------------------------------------------------------------------------------- */
  }

  const handleDeleteBanca = async (bancaId) => {
    try {
      const vendedoresRef = collection(db, `bancas/${bancaId}/vendedores`);
      const vendedoresSnapshot = await getDocs(vendedoresRef);
      vendedoresSnapshot.forEach(async (vendedorDoc) => {
        await deleteDoc(
          doc(db, `bancas/${bancaId}/vendedores`, vendedorDoc.id)
        );
      });

      await deleteDoc(doc(db, "bancas", bancaId));

      setBancas((prevBancas) =>
        prevBancas.filter((banca) => banca.id !== bancaId)
      );

      setSuccessMessage("Banca e vendedores excluídos com sucesso!");
      setSelectedBancaToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao excluir a banca:", error);
    }
  };

  {
    /*------------------------------------------------------------------------------- */
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  {
    /*------------------------------------------------------------------------------- */
  }

  const handleConfirmDeleteVendedor = async () => {
    try {
      if (selectedVendedorToDelete) {
        const { bancaId, id } = selectedVendedorToDelete;
        await deleteDoc(doc(db, `bancas/${bancaId}/vendedores/${id}`));
        setBancas((prevBancas) =>
          prevBancas.map((banca) =>
            banca.id === bancaId
              ? {
                  ...banca,
                  vendedores: banca.vendedores.filter(
                    (vendedor) => vendedor.id !== id
                  ),
                }
              : banca
          )
        );
        setSuccessMessage("Vendedor excluído com sucesso!");
        setSelectedVendedorToDelete(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao excluir o vendedor:", error);
    }
  };

  {
    /*------------------------------------------------------------------------------- */
  }

  const handleEditVendedor = async (
    bancaId,
    vendedorId,
    novoNome,
    novaCidade
  ) => {
    console.log("Editando vendedor com ID:", vendedorId);
    try {
      await updateDoc(doc(db, `bancas/${bancaId}/vendedores/${vendedorId}`), {
        nome: novoNome,
        cidade: novaCidade,
      });
      setBancas((prevBancas) =>
        prevBancas.map((banca) =>
          banca.id === bancaId
            ? {
                ...banca,
                vendedores: banca.vendedores.map((vendedor) =>
                  vendedor.id === vendedorId
                    ? { ...vendedor, nome: novoNome, cidade: novaCidade }
                    : vendedor
                ),
              }
            : banca
        )
      );
      setSuccessMessage("Vendedor editado com sucesso!");
      setSelectedVendedorToEdit(null);
      setNewVendedorName("");
      setNewVendedorCity("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao editar o vendedor:", error);
    }
  };

  {
    /*------------------------------------------------------------------------------- */
  }

  const openDeleteBancaModal = (banca) => {
    setSelectedBancaToDelete(banca);
  };

  const openDeleteVendedorModal = (bancaId, vendedor) => {
    setSelectedVendedorToDelete({ bancaId, ...vendedor });
  };

  const openEditBancaNameModal = (banca) => {
    setSelectedBancaToEdit(banca);
    setNewBancaName(banca.nome);
  };

  const cancelDeleteBanca = () => {
    setSelectedBancaToDelete(null);
  };

  const cancelDeleteVendedor = () => {
    setSelectedVendedorToDelete(null);
  };

  const cancelEditBancaName = () => {
    setSelectedBancaToEdit(null);
    setNewBancaName("");
  };

  const handleOutsideClick = (e) => {
    if (vendedoresRef.current && !vendedoresRef.current.contains(e.target)) {
      setSelectedBanca(null);
    }
  };

  const openEditVendedorModal = (bancaId, vendedor) => {
    setSelectedVendedorToEdit({ bancaId, ...vendedor });
    setNewVendedorName(vendedor.nome);
    setNewVendedorCity(vendedor.cidade);
  };

  const cancelEditVendedor = () => {
    setSelectedVendedorToEdit(null);
    setNewVendedorName("");
    setNewVendedorCity("");
  };

  const closeSuccessDeleteModal = () => {
    setSuccessMessage("");
  };

  {
    /*------------------------------------------------------------------------------- */
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen text-gray-800 relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-700 bg-opacity-75 min-h-screen h-full relative z-10">
        <MenuTopo />
        <div className="container mx-auto text-center text-green-100 py-8">
          <h1 className="text-sm uppercase font-bold mb-8 mt-4">
            Conheça nossas bancas e seus vendedores!
          </h1>
          {user && user.role === "admin" && (
            <Link
              to="/novoperfil"
              className="absolute left-6 mt-14 bg-green-500 text-xs text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors z-10"
            >
              Cadastrar Bancas
            </Link>
          )}
          <section className="bg-gray-400 bg-opacity-35 p-2 rounded-lg w-full max-w-xl mx-auto flex mb-14 justify-center items-center gap-2">
            <input
              className="w-full border-2 text-gray-500 text-xs rounded-lg h-8 px-3 outline-none"
              type="text"
              placeholder="Pesquise por um produto..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
          </section>
          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-center text-gray-400 text-lg">
                  Carregando bancas...
                </p>
              </div>
            ) : filteredBancas.length > 0 ? (
              <div className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
                {filteredBancas.map((banca) => (
                  <motion.div
                    key={banca.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0, delay: 0 }}
                    className={`bg-gray-800 bg-opacity-80 rounded-lg shadow-md ${
                      selectedBanca === banca.id ? "z-20" : ""
                    }`}
                  >
                    <div className="p-4 ">
                      <h2 className="relative flex items-center justify-between text-sm uppercase font-medium text-gray-200 mb-4">
                        {banca.nome}
                        <div className="absolute right-0 flex space-x-2">
                          {user && user.role === "admin" && (
                            <>
                              <button
                                className="bg-white bg-opacity-50 hover:bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center drop-shadow"
                                onClick={() => openEditBancaNameModal(banca)}
                              >
                                <FiEdit size={16} color="#000000" />
                              </button>
                              <button
                                onClick={() => openDeleteBancaModal(banca)}
                                className="bg-white bg-opacity-50 hover:bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center drop-shadow"
                              >
                                <FiTrash2 size={16} color="#000000" />
                              </button>
                            </>
                          )}
                        </div>
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {banca.vendedores.slice(0, 1).map((vendedor) => (
                          <motion.div
                            key={vendedor.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center"
                          >
                            <img
                              src={
                                vendedor.images && vendedor.images.length > 0
                                  ? vendedor.images[0].url
                                  : "placeholder.jpg"
                              }
                              alt={`Imagem de perfil de ${vendedor.nome}`}
                              className="object-cover w-28 h-28 shadow-md shadow-slate-900 rounded-full mb-2 transform scale-100 hover:scale-105 transition-transform duration-300"
                            />
                            <div className="text-sm text-gray-200 mt-1 mb-1 text-center">
                              {vendedor.nome}
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                              {vendedor.cidade}
                            </div>
                            <a
                              href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text= Olá! vi essa ${banca?.nome} no site da Feira de Buritizeiro e fique interessado!`}
                              target="_blank"
                              className="cursor-pointer bg-green-500 w-full text-white flex text-xs items-center justify-center gap-2 my-2 h-8 rounded-lg font-medium"
                            >
                              Conversar com vendedor
                              <FaWhatsapp size={16} color="#FFF" />
                            </a>
                            {user && user.role === "admin" && (
                              <div className="flex justify-end">
                                <button
                                  className="bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 mt-2 rounded-full flex items-center justify-center right-2 top-2 drop-shadow mr-2"
                                  onClick={() =>
                                    openDeleteVendedorModal(banca.id, vendedor)
                                  }
                                >
                                  <FiTrash2 size={20} color="#000000" />
                                </button>
                                <button
                                  className="bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 mt-2 rounded-full flex items-center justify-center drop-shadow ml-2"
                                  onClick={() =>
                                    openEditVendedorModal(banca.id, vendedor)
                                  }
                                >
                                  <FiEdit size={16} color="#000000" />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      <div className="relative ">
                        <div className="flex justify-between mt-4">
                          <Link
                            to={`/bancas/${banca.id}`}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 text-xs focus:outline-none focus:shadow-outline transition-colors mr-2"
                          >
                            Acessar banca
                          </Link>
                          <button
                            type="button"
                            className="bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-between hover:bg-gray-900 text-xs focus:outline-none focus:shadow-outline transition-colors"
                            onClick={() => handleSelectVendedores(banca.id)}
                          >
                            <span className="mr-2">
                              {selectedBanca === banca.id
                                ? "Fechar Vendedores"
                                : "Ver Vendedores"}
                            </span>
                            <svg
                              className={`w-4 h-4 transition-transform transform ${
                                selectedBanca === banca.id ? "rotate-180" : ""
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 6.293a1 1 0 011.414 0L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        {selectedBanca === banca.id && (
                          <div
                            ref={vendedoresRef}
                            className="absolute top-full ml-4 mt-2 w-64 bg-gray-200 bg-opacity-95 rounded-md shadow-lg z-10 overflow-hidden"
                          >
                            <ul>
                              {banca.vendedores.slice(1).map((vendedor) => (
                                <li
                                  key={vendedor.id}
                                  className="px-4 py-3 grid items-center justify-between hover:bg-gray-100 transition-colors relative"
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={
                                        vendedor.images &&
                                        vendedor.images.length > 0
                                          ? vendedor.images[0].url
                                          : "placeholder.jpg"
                                      }
                                      alt={`Imagem de perfil de ${vendedor.nome}`}
                                      className="object-cover w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                      <div className="text-sm text-gray-800">
                                        {vendedor.nome}
                                      </div>
                                      <div className="flex items-center">
                                        <div className="text-xs text-gray-600">
                                          {vendedor.cidade}
                                        </div>
                                        {user && user.role === "admin" && (
                                          <div className="flex ml-14">
                                            <button
                                              className="bg-white bg-opacity-50 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center drop-shadow"
                                              onClick={() =>
                                                openDeleteVendedorModal(
                                                  banca.id,
                                                  vendedor
                                                )
                                              }
                                            >
                                              <FiTrash2
                                                size={16}
                                                color="#000000"
                                              />
                                            </button>
                                            <button
                                              className="bg-white bg-opacity-50 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center drop-shadow ml-2"
                                              onClick={() =>
                                                openEditVendedorModal(
                                                  banca.id,
                                                  vendedor
                                                )
                                              }
                                            >
                                              <FiEdit
                                                size={16}
                                                color="#000000"
                                              />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 ml-14">
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text= Olá! vi essa ${banca?.nome} no site da Feira de Buritizeiro e fique interessado!`}
                                      target="_blank"
                                      className="cursor-pointer bg-green-500 text-white text-xs shadow-lg ring-1 ring-gray-400 flex items-center justify-center rounded-full px-4"
                                    >
                                      <FaWhatsapp size={12} color="#FFF" />
                                      <span className="ml-1">Conversar</span>
                                    </a>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <section className="flex items-center justify-center p-4 bg-gray-400 bg-opacity-35 rounded-lg">
                  <p className="text-center text-gray-400 text-lg">
                    Nenhuma banca encontrada para o produto pesquisado.
                  </p>
                </section>
              </div>
            )}
          </div>
          <div className=" mb-8 mt-8 flex justify-center space-x-4">
            <Link to="/todascategorias">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="bg-green-700 text-white text-xs py-2 px-6 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
                Conheça todas as categorias
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
      {/*---------------------- Modal de excluir banca------------------- */}
      {selectedBancaToDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
            <h2 className="text-sm font-semibold text-gray-800 text-center mb-4">
              Confirmar exclusão da banca
            </h2>
            <p className="text-gray-700 text-xs text-center mb-4">
              Tem certeza de que deseja excluir a banca{" "}
              {selectedBancaToDelete.nome}?
            </p>
            <div className="flex justify-center">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 text-xs rounded-md mr-2 hover:bg-gray-300"
                onClick={cancelDeleteBanca}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 text-xs rounded-md hover:bg-green-700"
                onClick={() => handleDeleteBanca(selectedBancaToDelete.id)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*---------------------- Modal de excluir vendedor ------------------- */}

      {selectedVendedorToDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
            <h2 className="text-sm font-semibold text-center text-gray-800 mb-4">
              Confirmar exclusão do vendedor
            </h2>
            <p className="text-gray-700 text-xs text-center mb-4">
              Tem certeza de que deseja excluir o vendedor{" "}
              {selectedVendedorToDelete.nome}?
            </p>
            <div className="flex justify-center">
              <button
                className="bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                onClick={cancelDeleteVendedor}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded-md hover:bg-green-700"
                onClick={handleConfirmDeleteVendedor}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*---------------------- Modal de editar nome da banca ------------------- */}
      {selectedBancaToEdit && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
            <h2 className="text-sm text-center font-semibold text-gray-800 mb-4">
              Editar nome da banca
            </h2>
            <input
              type="text"
              className="border border-gray-400 rounded-md px-3 py-2 w-full mb-4"
              placeholder="Novo nome da banca"
              value={newBancaName}
              onChange={(e) => setNewBancaName(e.target.value)}
            />
            <div className="flex justify-center">
              <button
                className="bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                onClick={cancelEditBancaName}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => {
                  updateBancaName(selectedBancaToEdit.id, newBancaName);
                  setSelectedBancaToEdit(null);
                  setNewBancaName("");
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*---------------------- Modal de mensagem de sucesso ------------------- */}
      {successMessage && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-sm leading-6 font-medium text-gray-900">
                    Mensagem
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500"> {successMessage}</p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    onClick={closeSuccessDeleteModal}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*---------------------- Modal de editar vendedor ------------------- */}
      {selectedVendedorToEdit && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
            <h2 className="text-sm text-center font-semibold text-gray-800 mb-2">
              Editar vendedor:
            </h2>
            <input
              type="text"
              className="border border-gray-400 rounded-md px-3 py-2 w-full mb-2"
              placeholder="Novo nome do vendedor"
              value={newVendedorName}
              onChange={(e) => setNewVendedorName(e.target.value)}
            />
            <h2 className="text-sm text-center font-semibold text-gray-800 mb-2">
              Editar cidade:
            </h2>
            <input
              type="text"
              className="border border-gray-400 rounded-md px-3 py-2 w-full mb-4"
              placeholder="Nova cidade do vendedor"
              value={newVendedorCity}
              onChange={(e) => setNewVendedorCity(e.target.value)}
            />
            <div className="flex justify-center">
              <button
                className="bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                onClick={cancelEditVendedor}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => {
                  if (newVendedorName && newVendedorCity) {
                    handleEditVendedor(
                      selectedVendedorToEdit.bancaId,
                      selectedVendedorToEdit.id,
                      newVendedorName,
                      newVendedorCity
                    );
                    setSuccessMessage("Vendedor editado com sucesso!");
                    setSelectedVendedorToEdit(null);
                  } else {
                    console.error(
                      "Nome do vendedor ou cidade do vendedor não definidos."
                    );
                  }
                }}
              >
                {" "}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Bancas;

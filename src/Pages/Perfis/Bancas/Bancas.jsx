/* eslint-disable react/prop-types */
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";
import banner from "../../../assets/banner.jpg";
import { FaWhatsapp } from "react-icons/fa";

import ScrollTopoButton from "../../../components/ScrollTopoButton";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Users,
  MapPin,
  Plus,
  XCircle,
  CheckCircle,
  Loader,
  Store,
  User,
  AlertCircle,
  Award,
  Leaf,
} from "lucide-react";

//  --------------------------------------------------------------- Modal Component
const Modal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  children,
}) => {
  const getIcon = () => {
    const iconProps = { size: 48 };
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" {...iconProps} />;
      case "error":
        return <XCircle className="text-red-500" {...iconProps} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" {...iconProps} />;
      default:
        return <AlertCircle className="text-blue-500" {...iconProps} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-800 ring-1 ring-gray-200 dark:ring-gray-600 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative"
          >
            {!children && (
              <>
                <div className="flex justify-center mb-4">{getIcon()}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {message}
                </p>
                <div className="flex space-x-3 justify-center">
                  {onConfirm && (
                    <button
                      onClick={onConfirm}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Confirmar
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className={`px-6 py-2 ${getButtonColor()} text-white rounded-xl font-medium transition-colors`}
                  >
                    {onConfirm ? "Cancelar" : "Fechar"}
                  </button>
                </div>
              </>
            )}
            {children}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

// --------------------------------------------------------------- Estatísticas das bancas

const StatsSection = ({ bancas }) => {
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length,
    0
  );
  const totalProdutos = bancas.reduce(
    (acc, banca) => acc + (banca.produtos?.length || 0),
    0
  );

  const stats = [
    {
      icon: Store,
      value: bancas.length,
      label: "Bancas Ativas",
      color: "text-blue-500",
    },
    {
      icon: Users,
      value: totalVendedores,
      label: "Vendedores",
      color: "text-green-500",
    },
    {
      icon: Leaf,
      value: totalProdutos,
      label: "Produtos",
      color: "text-purple-500",
    },
    { icon: Award, value: "100%", label: "Qualidade", color: "text-red-500" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
            {" "}
            Nossas Bancas em números
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Conectando produtores locais com a comunidade
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg  rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 text-center group hover:scale-105 border border-white/20"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 transition-all duration-500 shadow-lg`}
                >
                  <Icon className={stat.color} size={32} />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-700 font-semibold">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ======================================================= Página Principal de Bancas

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
    } else {
      const filtered = bancas.filter((banca) => {
        return banca.produtos.some(
          (produto) =>
            produto.nome &&
            produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
        );
      });
      setFilteredBancas(filtered);
    }
  }, [searchProduct, bancas]);

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

  const handleEditVendedor = async (
    bancaId,
    vendedorId,
    novoNome,
    novaCidade
  ) => {
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (vendedoresRef.current && !vendedoresRef.current.contains(e.target)) {
        setSelectedBanca(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuTopo />

      {/* Seção Hero */}
      <section
        className="bg-cover bg-no-repeat bg-center py-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.738), rgba(0, 0, 0, 0.728)), url(${banner})`,
        }}
      >
        {/* Background */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Store size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl text-white font-bold mb-4 drop-shadow-2xl">
              Nossas Bancas
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Conheça nossos vendedores e descubra produtos frescos e de
              qualidade
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <StatsSection bancas={bancas} />

      {/* Seção de pesquisa */}
      <section className="py-10 bg-gradient-to-br bg-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 left-32 w-96 h-96 bg-gradient-to-r from-blue-50 to-green-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-green-200 to-teal-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-gray-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-10">
            {/* Espaço de pesquisa */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                  size={20}
                />
                <input
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 shadow-lg"
                  type="text"
                  placeholder="Pesquise por um produto específico..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>
            </div>

            {/* Admin Button */}
            {user && user.role === "admin" && (
              <Link
                to="/novoperfil"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3  rounded-xl font-medium text-sm hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                <span>Cadastrar Nova Banca</span>
              </Link>
            )}
          </div>
        </div>

        {/* Seção das BANCAS  */}

        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 relative z-10"
            >
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Explore nossas Bancas
              </h2>
              <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto">
                Cada banca oferece produtos únicos e de qualidade
              </p>
            </motion.div>

            <section className="relative min-h-[400px] z-10">
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Loader
                      className="animate-spin mx-auto mb-4 text-green-600"
                      size={48}
                    />
                    <p className="text-gray-600 text-lg">
                      Carregando bancas...
                    </p>
                  </div>
                </div>
              ) : filteredBancas.length > 0 ? (
                /* Cards*/
                <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
                  {filteredBancas.map((banca, index) => (
                    <motion.div
                      key={banca.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="p-2 mt-2 text-center relative">
                        <h2 className="text-center drop-shadow-lg flex items-center justify-center text-lg font-semibold uppercase text-gray-800 mb-3">
                          {banca.nome}
                        </h2>
                        <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full"></div>

                        {user && user.role === "admin" && (
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBancaToEdit(banca);
                                setNewBancaName(banca.nome);
                              }}
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-all duration-300 transform hover:scale-105"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setSelectedBancaToDelete(banca)}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-all duration-300 transform hover:scale-105"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        {banca.vendedores && banca.vendedores.length > 0 ? (
                          <div className="text-center">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl flex flex-col items-center justify-center"
                            >
                              <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 rounded-full blur-lg"></div>
                                <img
                                  src={
                                    banca.vendedores[0].images?.[0]?.url ||
                                    "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400"
                                  }
                                  alt={banca.vendedores[0].nome}
                                  className="relative w-28 h-28 rounded-full object-cover shadow-xs border-white"
                                />
                              </div>
                              <h4 className="font-bold text-gray-900 -mt-2 text-xl mb-2">
                                {banca.vendedores[0].nome}
                              </h4>
                              <p className="text-gray-600 mb-4 text-sm flex items-center justify-center space-x-1">
                                <MapPin size={10} />
                                <span>{banca.vendedores[0].cidade}</span>
                              </p>

                              {user && user.role === "admin" && (
                                <div className="flex justify-center space-x-3">
                                  <button
                                    onClick={() => {
                                      setSelectedVendedorToEdit({
                                        bancaId: banca.id,
                                        ...banca.vendedores[0],
                                      });
                                      setNewVendedorName(
                                        banca.vendedores[0].nome
                                      );
                                      setNewVendedorCity(
                                        banca.vendedores[0].cidade
                                      );
                                    }}
                                    className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-all duration-300 transform hover:scale-105"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setSelectedVendedorToDelete({
                                        bancaId: banca.id,
                                        ...banca.vendedores[0],
                                      })
                                    }
                                    className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-all duration-300 transform hover:scale-105"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}

                              <a
                                href={`https://api.whatsapp.com/send?phone=${banca.vendedores[0].whatsapp}&text=Olá! Vi sua banca no site da Feira de Buritizeiro e fiquei interessado!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm space-x-2 mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <FaWhatsapp size={18} />
                                <span>Conversar no WhatsApp</span>
                              </a>
                            </motion.div>
                          </div>
                        ) : (
                          <p>Nenhum vendedor disponível nesta banca.</p>
                        )}

                        {/* Botões de Ação */}
                        <div className="relative">
                          <div className="flex space-x-4 mt-4">
                            <Link
                              to={`/bancas/${banca.id}`}
                              className="inline-flex text-xs items-center font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 shadow-xl py-3 rounded-xl hover:from-pink-600 hover:to-red-600 duration-300 focus:outline-none focus:shadow-outline transition-colors mr-2"
                            >
                              Acessar Banca
                            </Link>
                            <button
                              type="button"
                              className="flex-1 text-xs bg-gradient-to-r font-medium from-gray-700 to-gray-800 text-white py-2 px-4 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                              onClick={() => handleSelectVendedores(banca.id)}
                            >
                              <span className="mr-2">
                                {selectedBanca === banca.id
                                  ? "Fechar Vendedores"
                                  : "Ver Vendedores"}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  selectedBanca === banca.id ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>
                          {/* Vendedores adicionais */}
                          <AnimatePresence>
                            {selectedBanca === banca.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="absolute top-full ring-1 ring-gray-300 ml-5 mt-2 max-h-60 w-64 bg-gray-100 hover:bg-gray-50 transition-colors rounded-xl shadow-xl z-10"
                                ref={vendedoresRef}
                              >
                                <div className="flex bg-gradient-to-t from-gray-200 to-gray-300 justify-end py-1 px-1 rounded-t-xl">
                                  <button
                                    onClick={() => handleSelectVendedores(null)}
                                    className="text-gray-600 w-6 h-6 flex items-center justify-center hover:text-gray-900 rounded-full bg-gray-100 text-sm font-bold"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>

                                {banca.vendedores.length > 1 ? (
                                  <ul className="list-none">
                                    {banca.vendedores
                                      .slice(1)
                                      .map((vendedor, index) => (
                                        <div key={vendedor.id}>
                                          <li className="px-4 py-3 items-center relative">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <img
                                                  src={
                                                    vendedor.images &&
                                                    vendedor.images.length > 0
                                                      ? vendedor.images[0].url
                                                      : "placeholder.jpg"
                                                  }
                                                  alt={`Imagem de perfil de ${vendedor.nome}`}
                                                  className="object-cover w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                  <div className="text-sm font-bold">
                                                    {vendedor.nome}
                                                  </div>
                                                  <div className="text-gray-600 mb-4 gap-1 text-sm flex items-center justify-center space-x-1">
                                                    <MapPin size={10} />
                                                    {vendedor.cidade}
                                                  </div>
                                                </div>
                                              </div>
                                              <a
                                                href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text=Olá! Vi essa ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado!`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                title="Conversar no WhatsApp"
                                              >
                                                <FaWhatsapp size={18} />
                                              </a>
                                            </div>

                                            {user && user.role === "admin" && (
                                              <div className="flex justify-center -mt-2 space-x-2">
                                                <button
                                                  onClick={() => {
                                                    setSelectedVendedorToEdit({
                                                      bancaId: banca.id,
                                                      ...vendedor,
                                                    });
                                                    setNewVendedorName(
                                                      vendedor.nome
                                                    );
                                                    setNewVendedorCity(
                                                      vendedor.cidade
                                                    );
                                                  }}
                                                  className="w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-all duration-300 transform hover:scale-105"
                                                >
                                                  <Edit3 size={14} />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setSelectedVendedorToDelete(
                                                      {
                                                        bancaId: banca.id,
                                                        ...vendedor,
                                                      }
                                                    )
                                                  }
                                                  className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-all duration-300 transform hover:scale-105"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            )}
                                          </li>

                                          {/* Linha divisória entre vendedores adicionais */}
                                          {index <
                                            banca.vendedores.slice(1).length -
                                              1 && (
                                            <div className="h-px w-3/4 bg-gray-300 mx-auto my-1" />
                                          )}
                                        </div>
                                      ))}
                                  </ul>
                                ) : (
                                  <p className="px-4 py-3 text-sm text-gray-600">
                                    Nenhum outro vendedor disponível nesta
                                    Banca.
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </article>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="bg-white/80 backdrop-blur-lg  rounded-xl p-12 shadow-xl text-center border border-white/50">
                    <Search className="mx-auto mb-4 text-gray-400" size={64} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Nenhuma banca encontrada
                    </h3>
                    <p className="text-gray-600">
                      Não encontramos bancas com o produto pesquisado.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Chamada para ação */}
            <div className="text-center mt-16 relative z-10">
              <Link to="/todascategorias">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-10 py-3 rounded-xl font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-purple-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm"
                >
                  <span>Explorar Todas as Categorias</span>
                  <ChevronRight size={24} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </section>

      <ScrollTopoButton />
      <Footer />

      {/* Modals */}
      <Modal
        isOpen={!!selectedBancaToDelete}
        onClose={() => setSelectedBancaToDelete(null)}
        type="warning"
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a banca "${selectedBancaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={() => {
          handleDeleteBanca(selectedBancaToDelete.id);
          setSelectedBancaToDelete(null);
        }}
      />

      <Modal
        isOpen={!!selectedVendedorToDelete}
        onClose={() => setSelectedVendedorToDelete(null)}
        type="warning"
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o vendedor "${selectedVendedorToDelete?.nome}"?`}
        onConfirm={handleConfirmDeleteVendedor}
      />

      <Modal
        isOpen={!!selectedBancaToEdit}
        onClose={() => {
          setSelectedBancaToEdit(null);
          setNewBancaName("");
        }}
        type="edit"
      >
        <div className="text-center">
          <Edit3 className="mx-auto mb-4 text-blue-500" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Editar Nome da Banca
          </h3>
          <input
            type="text"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nome da banca"
            value={newBancaName}
            onChange={(e) => setNewBancaName(e.target.value)}
          />
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => {
                updateBancaName(selectedBancaToEdit.id, newBancaName);
                setSelectedBancaToEdit(null);
                setNewBancaName("");
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setSelectedBancaToEdit(null);
                setNewBancaName("");
              }}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedVendedorToEdit}
        onClose={() => {
          setSelectedVendedorToEdit(null);
          setNewVendedorName("");
          setNewVendedorCity("");
        }}
        type="edit"
      >
        <div className="text-center">
          <User className="mx-auto mb-4 text-blue-500" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Editar Vendedor
          </h3>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nome do vendedor"
              value={newVendedorName}
              onChange={(e) => setNewVendedorName(e.target.value)}
            />
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Cidade do vendedor"
              value={newVendedorCity}
              onChange={(e) => setNewVendedorCity(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => {
                if (newVendedorName && newVendedorCity) {
                  handleEditVendedor(
                    selectedVendedorToEdit.bancaId,
                    selectedVendedorToEdit.id,
                    newVendedorName,
                    newVendedorCity
                  );
                }
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setSelectedVendedorToEdit(null);
                setNewVendedorName("");
                setNewVendedorCity("");
              }}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage("")}
        type="success"
        title="Sucesso!"
        message={successMessage}
      />
    </div>
  );
};

export default Bancas;

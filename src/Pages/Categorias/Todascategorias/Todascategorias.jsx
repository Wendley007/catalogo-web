/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import { collection, doc, deleteDoc, getDocs, query } from "firebase/firestore";
import banner from "../../../assets/banner.jpg";
import { FaWhatsapp } from "react-icons/fa";

import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import ScrollTopoButton from "../../../components/ScrollTopoButton";

import {
  Eye,
  ChevronRight,
  Search,
  Trash2,
  Users,
  MapPin,
  Package,
  Store,
  X,
  ShoppingBag,
  Plus,
  Loader,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// --------------------------------------------------------------- Modal Component
const Modal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  icon: Icon,
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-500",
          button: "bg-green-500 hover:bg-green-600",
          title: "text-green-800",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-500",
          button: "bg-red-500 hover:bg-red-600",
          title: "text-red-800",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: "text-yellow-500",
          button: "bg-yellow-500 hover:bg-yellow-600",
          title: "text-yellow-800",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-500",
          button: "bg-blue-500 hover:bg-blue-600",
          title: "text-blue-800",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${colors.bg} ${colors.border} border-2 rounded-xl shadow-2xl p-8 max-w-md w-full text-center`}
      >
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}
          >
            <Icon className={colors.icon} size={32} />
          </div>
        </div>
        <h3 className={`text-xl font-bold ${colors.title} mb-3`}>{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex space-x-3 justify-center">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Confirmar
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 ${colors.button} text-white rounded-lg font-medium transition-colors`}
          >
            {onConfirm ? "Cancelar" : "Fechar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --------------------------------------------------------------- Estatísticas component

const StatsSection = ({ categorias, bancas }) => {
  const totalProdutos = categorias.reduce(
    (acc, categoria) => acc + categoria.produtos.length,
    0
  );
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length,
    0
  );

  const stats = [
    {
      icon: Package,
      value: categorias.length,
      label: "Categorias",
      color: "text-blue-500",
    },
    {
      icon: ShoppingBag,
      value: totalProdutos,
      label: "Produtos",
      color: "text-green-500",
    },
    {
      icon: Store,
      value: bancas.length,
      label: "Bancas",
      color: "text-purple-500",
    },
    {
      icon: Users,
      value: totalVendedores,
      label: "Vendedores",
      color: "text-red-500",
    },
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
            Nosso Catálogo em Números
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Diversidade e qualidade em cada categoria
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
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 text-center group hover:scale-105 border border-white/20"
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

// ======================================================= Todas Categorias

const TodasCategorias = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    onConfirm: null,
    icon: null,
  });
  const vendedoresRef = useRef(null);

  const showModal = (type, title, message, icon, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, icon, onConfirm });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
      icon: null,
      onConfirm: null,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categorias
        const snapshotCategorias = await getDocs(collection(db, "categorias"));
        const categoriasData = [];
        for (const doc of snapshotCategorias.docs) {
          const categoria = { id: doc.id, ...doc.data() };
          const produtosSnapshot = await getDocs(
            query(collection(db, `categorias/${categoria.id}/produtos`))
          );
          const produtosData = produtosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          categoria.produtos = produtosData;
          categoriasData.push(categoria);
        }
        setCategorias(categoriasData);

        // Fetch bancas
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
        console.error("Erro ao buscar dados:", error);
        showModal(
          "error",
          "Erro!",
          "Erro ao carregar dados. Tente novamente.",
          XCircle
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (vendedoresRef.current && !vendedoresRef.current.contains(e.target)) {
        setSelectedBanca(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredBancas = searchProduct
    ? bancas.filter((banca) =>
        banca.produtos.some(
          (produto) =>
            produto.nome &&
            produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
        )
      )
    : [];

  const filteredCategorias = searchProduct
    ? categorias.filter((categoria) =>
        categoria.produtos.some(
          (produto) =>
            produto.nome &&
            produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
        )
      )
    : categorias;

  const handleDeleteCategoria = async (categoria) => {
    showModal(
      "warning",
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${categoria.nome}" e todos os seus produtos?`,
      AlertTriangle,
      async () => {
        try {
          await deleteDoc(doc(db, "categorias", categoria.id));

          const produtosQuery = query(
            collection(db, `categorias/${categoria.id}/produtos`)
          );
          const produtosSnapshot = await getDocs(produtosQuery);

          produtosSnapshot.forEach(async (produtoDoc) => {
            await deleteDoc(
              doc(db, `categorias/${categoria.id}/produtos`, produtoDoc.id)
            );
          });

          setCategorias(categorias.filter((item) => item.id !== categoria.id));
          closeModal();
          showModal(
            "success",
            "Sucesso!",
            "Categoria e produtos excluídos com sucesso!",
            CheckCircle
          );
        } catch (error) {
          console.error("Erro ao excluir categoria e produtos:", error);
          showModal(
            "error",
            "Erro!",
            "Erro ao excluir categoria. Tente novamente.",
            XCircle
          );
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MenuTopo />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader
              className="animate-spin mx-auto mb-4 text-green-600"
              size={48}
            />
            <p className="text-gray-600 text-lg">Carregando categorias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  return (
    <main className="min-h-screen bg-gray-50">
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
                <Package size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
              Catálogo de Categorias
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Explore nossas incríveis categorias de produtos frescos e
              saudáveis
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <StatsSection categorias={categorias} bancas={bancas} />

      {/* Seção de Pesquisa  */}
      <section className="py-10 bg-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-green-210 to-blue-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-10">
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
                to="/novo"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3  rounded-xl font-medium text-sm hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                <span>Cadastrar Produtos</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Pesquisa de Resultados- Bancas */}
      {searchProduct && filteredBancas.length > 0 && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14 relative z-10"
            >
              <h2 className="text-3xl text-center lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Bancas Encontradas
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Vendedores que possuem o produto pesquisado
              </p>
            </motion.div>
            {/* Cards */}
            <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
              {filteredBancas.map((banca, index) => (
                <motion.div
                  key={banca.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <section className="p-4">
                    <h2 className="relative text-center drop-shadow-lg flex items-center justify-center text-lg font-semibold uppercase text-gray-800 mb-4">
                      {banca.nome}
                    </h2>
                    <div className="w-16 h-1 mb-6 bg-gray-200 mx-auto rounded-full"></div>

                    {banca.vendedores && banca.vendedores.length > 0 ? (
                      banca.vendedores.slice(0, 1).map((vendedor) => (
                        <div key={vendedor.id} className="text-center mb-6">
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
                              {vendedor.nome}
                            </h4>
                            <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
                              <MapPin size={10} />
                              <span>{banca.vendedores[0].cidade}</span>
                            </p>

                            <a
                              href={`https://api.whatsapp.com/send?phone=${vendedor.whatsapp}&text=Olá! Vi sua banca no site da Feira de Buritizeiro e fiquei interessado!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm space-x-2 mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <FaWhatsapp size={18} />
                              <span>Conversar no WhatsApp</span>
                            </a>
                          </motion.div>
                        </div>
                      ))
                    ) : (
                      <p>Nenhum vendedor disponível nesta banca.</p>
                    )}

                    <div className="relative">
                      <div className="flex space-x-4 mt-4">
                        <Link
                          to={`/bancas/${banca.id}`}
                          className="inline-flex text-xs items-center font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 shadow-xl py-3 rounded-xl hover:from-pink-600 hover:to-red-600 duration-300 focus:outline-none focus:shadow-outline transition-colors mr-2"
                        >
                          Acessar banca
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
                            ref={vendedoresRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="absolute top-full ring-1 ring-gray-300 ml-4 mt-2 max-h-60 w-64 bg-gray-100 hover:bg-gray-50 transition-colors rounded-xl shadow-xl z-50"
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
                                Nenhum outro vendedor disponível nesta Banca.
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>
                </motion.div>
              ))}
            </article>
          </div>
        </section>
      )}

      {/* Seção de Categorias */}

      <section className="py-20 bg-gradient-to-br bg-white relative">
        {/* Background */}

        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 relative z-10"
          >
            <h2 className="text-3xl lg:text-4xl font-bold leading-normal bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
              {searchProduct ? "Categorias Encontradas" : "Todas as Categorias"}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {searchProduct
                ? "Categorias que contêm o produto pesquisado"
                : "Explore nossa variedade completa de produtos"}
            </p>
          </motion.div>

          {filteredCategorias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
              {filteredCategorias.map((categoria, index) => (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/50"
                >
                  <div className="relative">
                    {categoria.produtos[0]?.images?.[0] && (
                      <img
                        src={categoria.produtos[0].images[0].url}
                        alt={categoria.nome}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Admin gerenciamento */}
                    {user && user.role === "admin" && (
                      <button
                        onClick={() => handleDeleteCategoria(categoria)}
                        className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Link
                        to={`/categorias/${categoria.id}`}
                        className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
                      >
                        <Eye size={20} />
                        <span>Ver Produtos</span>
                      </Link>
                    </div>

                    {/* Nomes das Categorias*/}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="rounded-xl p-2 shadow-lg transition-colors bg-white/95 group-hover:bg-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-black transition-colors">
                          {categoria.nome}
                        </h3>
                        <p className="text-gray-600 text-center text-sm mt-1">
                          {categoria.produtos.length} produto
                          {categoria.produtos.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 relative z-10">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-12 shadow-xl border border-white/50 max-w-md mx-auto">
                <Search className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-gray-600">
                  Não encontramos categorias com o produto pesquisado.
                </p>
              </div>
            </div>
          )}
        </article>

        {/* Botão de navegação */}

        <article className="py-4 mt-14 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
              <Link to="/bancas">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
                >
                  <ChevronRight size={24} />
                  <span>Conheça todas as bancas</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </article>
      </section>

      <ScrollTopoButton />
      <Footer />

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        icon={modal.icon}
      />
    </main>
  );
};

export default TodasCategorias;

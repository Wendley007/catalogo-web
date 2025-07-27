
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import { collection, doc, deleteDoc, getDocs, query } from "firebase/firestore";
import banner from "../../../assets/banner.jpg";


import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import ScrollTopoButton from "../../../components/ScrollTopoButton";
import BancaCard from "../../../components/BancaCard/BancaCard";
import StatsSection from "../../../components/StatsSection";
import { Modal } from "../../../components/Modal";
import SEO from "../../../components/SEO/SEO";
import HeroSection from "../../../components/HeroSection";

import {
  Eye,
  ChevronRight,
  Search,
  Trash2,
  Users,
  Package,
  Store,
  ShoppingBag,
  Plus,
  Loader,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";



// Função para gerar estatísticas das categorias
const getCategoriasStats = (categorias, bancas) => {
  const totalProdutos = categorias.reduce(
    (acc, categoria) => acc + categoria.produtos.length,
    0
  );
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length,
    0
  );

  return [
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
};

// Dados do hero da página de Todas as Categorias
const getTodasCategoriasHeroData = () => ({
  title: "Catálogo de Categorias",
  description: "Explore nossas incríveis categorias de produtos frescos e saudáveis",
  backgroundImage: banner,
  icon: Package,
});

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
    type: "info",
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
    setModal({ isOpen: false, type: "info", title: "", message: "", onConfirm: null, icon: null });
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
      <SEO
        title="Todas Categorias - Feira de Buritizeiro"
        description="Explore nossas incríveis categorias de produtos frescos e saudáveis na Feira de Buritizeiro."
        keywords={["categorias", "produtos", "feira", "buritizeiro", "saúde", "frescos"]}
      />

      {/* Seção Hero */}
      <HeroSection {...getTodasCategoriasHeroData()} />

      {/* Seção de Estatísticas */}
      <StatsSection 
        stats={getCategoriasStats(categorias, bancas)}
        title="Nosso Catálogo em Números"
        subtitle="Diversidade e qualidade em cada categoria"
        variant="glass"
      />

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
                <BancaCard
                  key={banca.id}
                  banca={banca}
                  index={index}
                  showAdminControls={false}
                  showVendedoresDropdown={true}
                  onSelectVendedores={handleSelectVendedores}
                  selectedBanca={selectedBanca}
                  whatsappMessage="Olá! Vi sua banca no site da Feira de Buritizeiro e fiquei interessado!"
                  acessarBancaText="Acessar banca"
                  verVendedoresText="Ver Vendedores"
                  fecharVendedoresText="Fechar Vendedores"
                />
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

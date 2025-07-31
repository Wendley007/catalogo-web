import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import { collection, getDocs, query } from "firebase/firestore";
import banner from "../../../assets/banner.webp";
import MenuTopo from "../../../components/MenuTopo/MenuTopo";
import Footer from "../../../components/Footer";
import ScrollTopoButton from "../../../components/ScrollTopoButton";
import BancaCard from "../../../components/BancaCard/BancaCard";
import StatsSection from "../../../components/StatsSection";
import { Modal } from "../../../components/Modal";
import SEO from "../../../components/SEO/SEO";
import HeroSection from "../../../components/HeroSection";
import CategoriaCard from "../../../components/CategoriaCard";

import {
  ChevronRight,
  Search,
  Users,
  Package,
  Store,
  ShoppingBag,
  Plus,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Função para gerar estatísticas das categorias
const getCategoriasStats = (categorias, bancas) => {
  const totalProdutos = categorias.reduce(
    (acc, categoria) => acc + (categoria.produtos?.length || 0),
    0
  );
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + (banca.vendedores?.length || 0),
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
  description:
    "Explore nossas incríveis categorias de produtos frescos e saudáveis",
  backgroundImage: banner,
  icon: Package,
});

// ======================================================= Todas Categorias

const TodasCategorias = () => {
  const { user } = useContext(AuthContext);

  // Adicionar classe has-header para espaçamento do MenuTopo
  useEffect(() => {
    document.body.classList.add('has-header');
    return () => {
      document.body.classList.remove('has-header');
    };
  }, []);

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
    setModal({ ...modal, isOpen: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar categorias
        const snapshotCategorias = await getDocs(collection(db, "categorias"));
        const categoriasData = [];
        
        for (const doc of snapshotCategorias.docs) {
          const categoria = { id: doc.id, ...doc.data() };
          
          // Buscar produtos da categoria
          const produtosSnapshot = await getDocs(
            query(collection(db, `categorias/${categoria.id}/produtos`))
          );
          const produtosData = produtosSnapshot.docs.map((produtoDoc) => ({
            id: produtoDoc.id,
            ...produtoDoc.data(),
          }));
          
          categoria.produtos = produtosData;
          categoriasData.push(categoria);
        }
        
        setCategorias(categoriasData);

        // Buscar bancas
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
          banca.vendedores = vendedoresData;
          bancasData.push(banca);
        }
        setBancas(bancasData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        showModal(
          "error",
          "Erro",
          "Erro ao carregar as categorias. Tente novamente.",
          XCircle
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtro de produtos
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [filteredBancas, setFilteredBancas] = useState([]);

  useEffect(() => {
    if (searchProduct.trim() === "") {
      setFilteredCategorias(categorias);
      setFilteredBancas([]);
    } else {
      // Filtrar categorias
      const categoriasFiltradas = categorias.filter((categoria) =>
        categoria.produtos?.some((produto) =>
          produto.nome?.toLowerCase().includes(searchProduct.toLowerCase())
        )
      );
      setFilteredCategorias(categoriasFiltradas);

      // Filtrar bancas
      const bancasFiltradas = bancas.filter((banca) =>
        banca.produtos?.some((produto) =>
          produto.nome?.toLowerCase().includes(searchProduct.toLowerCase())
        )
      );
      setFilteredBancas(bancasFiltradas);
    }
  }, [searchProduct, categorias, bancas]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (vendedoresRef.current && !vendedoresRef.current.contains(e.target)) {
        setSelectedBanca(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleDeleteCategoria = (categoria) => {
    showModal(
      "warning",
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${categoria.nome}"? Esta ação não pode ser desfeita.`,
      XCircle,
      async () => {
        try {
          // Aqui você implementaria a lógica de exclusão
          // await deleteDoc(doc(db, "categorias", categoria.id));
          
          // Atualizar a lista local
          setCategorias(categorias.filter((cat) => cat.id !== categoria.id));
          
          showModal(
            "success",
            "Sucesso",
            "Categoria excluída com sucesso!",
            CheckCircle
          );
        } catch (error) {
          console.error("Erro ao excluir categoria:", error);
          showModal(
            "error",
            "Erro",
            "Erro ao excluir a categoria. Tente novamente.",
            XCircle
          );
        }
      }
    );
  };

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MenuTopo />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader
              className="animate-spin mx-auto mb-4 text-green-600 dark:text-green-400"
              size={48}
            />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Carregando categorias...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MenuTopo />
      <SEO
        title="Todas Categorias - Feira de Buritizeiro"
        description="Explore nossas incríveis categorias de produtos frescos e saudáveis na Feira de Buritizeiro."
        keywords={[
          "categorias",
          "produtos",
          "feira",
          "buritizeiro",
          "saúde",
          "frescos",
        ]}
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
      <section className="py-10 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-green-210 to-blue-200 dark:from-green-900/20 dark:to-blue-900/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-purple-100 to-teal-100 dark:from-purple-900/20 dark:to-teal-900/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-10">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
                  size={20}
                />
                <input
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg bg-white dark:bg-gray-700"
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
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-8 py-3  rounded-xl font-medium text-sm hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
        <section className="py-6 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14 relative z-10"
            >
              <h2 className="text-3xl text-center lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 dark:from-gray-100 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
                Bancas Encontradas
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
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

      <section className="py-20 bg-gradient-to-br bg-white dark:bg-gray-800 relative">
        {/* Background */}

        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 relative z-10"
          >
            <h2 className="text-3xl lg:text-4xl font-bold leading-normal bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 dark:from-gray-100 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
              {searchProduct ? "Categorias Encontradas" : "Todas as Categorias"}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {searchProduct
                ? "Categorias que contêm o produto pesquisado"
                : "Explore nossa variedade completa de produtos"}
            </p>
          </motion.div>

          {filteredCategorias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {filteredCategorias.map((categoria, index) => (
                <CategoriaCard
                  key={categoria.id}
                  categoria={categoria}
                  index={index}
                  showAdminControls={user && user.role === "admin"}
                  onDeleteCategoria={handleDeleteCategoria}
                  variant="compact"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 relative z-10">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-12 shadow-xl border border-white/50 dark:border-gray-700/50 max-w-md mx-auto">
                <Search className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={64} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Não encontramos categorias com o produto pesquisado.
                </p>
              </div>
            </div>
          )}
        </article>

        {/* Botão de navegação */}

        <article className="py-4 mt-14 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-1">
              <Link to="/bancas">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 font-semibold text-white hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
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


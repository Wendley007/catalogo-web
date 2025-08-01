
import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import banner from "../../../assets/banner.webp";
import BancaCard from "../../../components/BancaCard/BancaCard";
import StatsSection from "../../../components/StatsSection";

import ScrollTopoButton from "../../../components/ScrollTopoButton";
import MenuTopo from "../../../components/MenuTopo/MenuTopo";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO/SEO";
import HeroSection from "../../../components/HeroSection";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import {
  ChevronRight,
  Search,
  Users,
  Loader,
  Store,
  Award,
  Leaf,
  Plus,
} from "lucide-react";



// Função para gerar estatísticas das bancas
const getBancasStats = (bancas) => {
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length,
    0
  );
  const totalProdutos = bancas.reduce(
    (acc, banca) => acc + (banca.produtos?.length || 0),
    0
  );

  return [
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
};

// Dados do hero da página de Bancas
const getBancasHeroData = () => ({
  title: "Nossas Bancas",
  description: "Conheça nossos vendedores e descubra produtos frescos e de qualidade",
  backgroundImage: banner,
  icon: Store,
});

// ======================================================= Página Principal de Bancas

const Bancas = () => {
  // Adicionar classe has-header para espaçamento do MenuTopo
  useEffect(() => {
    document.body.classList.add('has-header');
    return () => {
      document.body.classList.remove('has-header');
    };
  }, []);

  const { user } = useContext(AuthContext);
  const [bancas, setBancas] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
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
          
          // Buscar vendedores da banca
          const vendedoresSnapshot = await getDocs(
            query(collection(db, `bancas/${banca.id}/vendedores`))
          );
          const vendedoresData = vendedoresSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          banca.vendedores = vendedoresData;
          
          // Os produtos já estão no documento da banca como array
          banca.produtos = banca.produtos || [];
          
          bancasData.push(banca);
        }
        setBancas(bancasData);
        setFilteredBancas(bancasData);
      } catch (error) {
        console.error("Erro ao buscar bancas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBancas();
  }, []);

  // Filtro de produtos
  useEffect(() => {
    if (searchProduct.trim() === "") {
      setFilteredBancas(bancas);
    } else {
      const filtered = bancas.filter((banca) =>
        banca.produtos?.some((produto) =>
          produto.nome?.toLowerCase().includes(searchProduct.toLowerCase())
        )
      );
      setFilteredBancas(filtered);
    }
  }, [searchProduct, bancas]);

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Bancas - Feira Livre de Buritizeiro"
        description="Conheça todas as bancas da Feira Livre de Buritizeiro. Encontre vendedores, produtos e informações de contato."
        keywords={["bancas feira", "vendedores feira", "feira livre bancas", "produtos feira"]}
      />
      <MenuTopo />

      {/* Seção Hero */}
      <HeroSection {...getBancasHeroData()} />

      {/* Seção de Estatísticas */}
      <StatsSection
        stats={getBancasStats(bancas)}
        title="Nossas Bancas em números"
        subtitle="Conectando produtores locais com a comunidade"
        variant="glass"
      />

      {/* Seção de pesquisa */}
      <section className="py-10 bg-gradient-to-br bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 left-32 w-96 h-96 bg-gradient-to-r from-blue-50 to-green-200 dark:from-blue-900/20 dark:to-green-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-green-200 to-teal-200 dark:from-green-900/20 dark:to-teal-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-gray-200 dark:from-green-900/20 dark:to-gray-700/20 rounded-full blur-3xl"></div>
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
                to="/novoperfil"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-8 py-3 rounded-xl font-medium text-sm hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                <span>Novo Perfil</span>
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
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 dark:from-gray-100 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
                Explore nossas Bancas
              </h2>
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Cada banca oferece produtos únicos e de qualidade
              </p>
            </motion.div>

            <section className="relative min-h-[400px] z-10">
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Loader
                      className="animate-spin mx-auto mb-4 text-green-600 dark:text-green-400"
                      size={48}
                    />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Carregando bancas...
                    </p>
                  </div>
                </div>
              ) : filteredBancas.length > 0 ? (
                /* Cards*/
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
                      whatsappMessage={`Olá! Vi essa ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado!`}
                      acessarBancaText="Acessar Banca"
                      verVendedoresText="Ver Vendedores"
                      fecharVendedoresText="Fechar Vendedores"
                    />
                  ))}
                </article>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-12 shadow-xl text-center border border-white/50 dark:border-gray-700/50">
                    <Search className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={64} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Nenhuma banca encontrada
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
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
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 text-white dark:text-gray-900 px-10 py-3 rounded-xl font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-purple-800 dark:hover:from-gray-200 dark:hover:via-blue-300 dark:hover:to-purple-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm"
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


    </main>
  );
};

export default Bancas;

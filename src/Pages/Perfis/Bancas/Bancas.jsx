
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";
import banner from "../../../assets/banner.jpg";
import BancaCard from "../../../components/BancaCard/BancaCard";
import StatsSection from "../../../components/StatsSection";
import { Modal } from "../../../components/Modal";
import ScrollTopoButton from "../../../components/ScrollTopoButton";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO/SEO";
import HeroSection from "../../../components/HeroSection";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Edit3,
  ChevronRight,
  Search,
  Users,
  Plus,
  Loader,
  Store,
  User,
  Award,
  Leaf,
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
    <main className="min-h-screen bg-gray-50">
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
                    <BancaCard
                      key={banca.id}
                      banca={banca}
                      index={index}
                      showAdminControls={user && user.role === "admin"}
                      showVendedoresDropdown={true}
                      onEditBanca={(banca) => {
                        setSelectedBancaToEdit(banca);
                        setNewBancaName(banca.nome);
                      }}
                      onDeleteBanca={(banca) => setSelectedBancaToDelete(banca)}
                      onEditVendedor={handleEditVendedor}
                      onDeleteVendedor={(vendedorData) => setSelectedVendedorToDelete(vendedorData)}
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
    </main>
  );
};

export default Bancas;

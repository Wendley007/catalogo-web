import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import banner from "../../../assets/banner.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";

import MenuTopo from "../../../components/MenuTopo/MenuTopo";
import Footer from "../../../components/Footer";
import ScrollTopoButton from "../../../components/ScrollTopoButton";
import StatsSection from "../../../components/StatsSection";
import { Modal } from "../../../components/Modal";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import SEO from "../../../components/SEO/SEO";
import HeroSection from "../../../components/HeroSection";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../services/firebaseConnection";

import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Store,
  Users,
  Package,
  Loader,
  ShoppingBag,
  MapPin,
  Award,
  Heart,
  Edit3,
  Save,
  X,
  User,
} from "lucide-react";

// Função para gerar estatísticas dos vendedores
const getVendedoresStats = (vendedores, produtosAdicionados) => [
  {
    icon: Users,
    value: vendedores.length,
    label: "Vendedores",
    color: "text-blue-500",
  },
  {
    icon: Package,
    value: produtosAdicionados.length,
    label: "Produtos",
    color: "text-green-500",
  },
  {
    icon: Award,
    value: "100%",
    label: "Qualidade",
    color: "text-purple-500",
  },
  {
    icon: Heart,
    value: "Local",
    label: "Produção",
    color: "text-red-500",
  },
];

// Dados do hero da página de Vendedor
const getVendedorHeroData = (banca) => ({
  title: banca?.nome || "Banca",
  description: "Conheça nossos vendedores e produtos de qualidade",
  backgroundImage: banner,
  icon: Store,
});

// ======================================================= Página do vendedor

const Vendedor = () => {
  const { bancaId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [banca, setBanca] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [produtosExistentes, setProdutosExistentes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para edição
  const [showEditVendedorModal, setShowEditVendedorModal] = useState(false);
  const [newVendedorName, setNewVendedorName] = useState("");
  const [newVendedorCity, setNewVendedorCity] = useState("");
  const [newVendedorImage, setNewVendedorImage] = useState(null);
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [removeVendedorImage, setRemoveVendedorImage] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [vendedorToDelete, setVendedorToDelete] = useState(null);
  const [isEditingBancaName, setIsEditingBancaName] = useState(false);
  const [newBancaName, setNewBancaName] = useState("");
  const [showDeleteBancaModal, setShowDeleteBancaModal] = useState(false);

  // Modal estados
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    icon: null,
  });

  const showModal = (type, title, message, icon) => {
    setModal({ isOpen: true, type, title, message, icon });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
      icon: null,
    });
  };

  // Função para abrir modal de confirmação de remoção
  const openDeleteConfirmModal = (vendedor) => {
    setVendedorToDelete(vendedor);
    setShowDeleteConfirmModal(true);
  };

  // Função para editar nome da banca
  const handleEditBancaName = async () => {
    try {
      if (!newBancaName.trim()) {
        showModal(
          "warning",
          "Atenção!",
          "Digite um nome para a banca.",
          AlertTriangle
        );
        return;
      }

      await updateDoc(doc(db, "bancas", bancaId), {
        nome: newBancaName.trim(),
      });

      setBanca((prev) => ({ ...prev, nome: newBancaName.trim() }));
      setIsEditingBancaName(false);
      setNewBancaName("");
      showModal(
        "success",
        "Sucesso!",
        "Nome da banca atualizado com sucesso!",
        CheckCircle
      );
    } catch (error) {
      console.error("Erro ao atualizar nome da banca:", error);
      showModal("error", "Erro!", "Erro ao atualizar nome da banca.", XCircle);
    }
  };

  // Função para remover vendedor
  const handleDeleteVendedor = async () => {
    try {
      await deleteDoc(
        doc(db, `bancas/${bancaId}/vendedores/${vendedorToDelete.id}`)
      );

      setVendedores((prev) => prev.filter((v) => v.id !== vendedorToDelete.id));
      setShowDeleteConfirmModal(false);
      setVendedorToDelete(null);
      showModal(
        "success",
        "Sucesso!",
        "Vendedor removido com sucesso!",
        CheckCircle
      );
    } catch (error) {
      console.error("Erro ao remover vendedor:", error);
      showModal("error", "Erro!", "Erro ao remover vendedor.", XCircle);
    }
  };

  // Função para excluir a banca completa
  const handleDeleteBanca = async () => {
    try {
      // Primeiro, excluir todos os vendedores da banca
      const vendedoresSnapshot = await getDocs(
        collection(db, `bancas/${bancaId}/vendedores`)
      );

      const deleteVendedoresPromises = vendedoresSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all(deleteVendedoresPromises);

      // Remover produtos da banca (se houver)
      if (banca && banca.produtos && banca.produtos.length > 0) {
        await updateDoc(doc(db, "bancas", bancaId), {
          produtos: [],
        });
      }

      // Depois, excluir a banca
      await deleteDoc(doc(db, "bancas", bancaId));

      showModal(
        "success",
        "Sucesso!",
        "Banca excluída com sucesso! Redirecionando...",
        CheckCircle
      );

      // Redirecionar para a página de bancas após 2 segundos
      setTimeout(() => {
        navigate("/bancas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir banca:", error);
      showModal("error", "Erro!", "Erro ao excluir banca.", XCircle);
    }
  };

  // Função para editar vendedor
  const handleEditVendedor = async (vendedorId) => {
    try {
      if (!newVendedorName.trim() || !newVendedorCity.trim()) {
        showModal(
          "warning",
          "Atenção!",
          "Preencha todos os campos.",
          AlertTriangle
        );
        return;
      }

      const updateData = {
        nome: newVendedorName.trim(),
        cidade: newVendedorCity.trim(),
      };

      // Se há uma nova imagem, fazer upload
      if (newVendedorImage) {
        try {
          const imageRef = ref(
            storage,
            `vendedores/${bancaId}/${vendedorId}/${newVendedorImage.name}`
          );
          const snapshot = await uploadBytes(imageRef, newVendedorImage);
          const downloadURL = await getDownloadURL(snapshot.ref);

          updateData.images = [{ url: downloadURL }];
        } catch (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          showModal(
            "error",
            "Erro!",
            "Erro ao fazer upload da imagem.",
            XCircle
          );
          return;
        }
      }

      // Se deve remover a imagem
      if (removeVendedorImage) {
        updateData.images = [];
      }

      await updateDoc(
        doc(db, `bancas/${bancaId}/vendedores/${vendedorId}`),
        updateData
      );

      setVendedores((prev) =>
        prev.map((v) =>
          v.id === vendedorId
            ? {
                ...v,
                nome: newVendedorName.trim(),
                cidade: newVendedorCity.trim(),
                ...(newVendedorImage && {
                  images: [
                    { url: updateData.images?.[0]?.url || v.images?.[0]?.url },
                  ],
                }),
                ...(removeVendedorImage && { images: [] }),
              }
            : v
        )
      );

      setShowEditVendedorModal(false);
      setNewVendedorName("");
      setNewVendedorCity("");
      setNewVendedorImage(null);
      setSelectedVendedor(null);
      setRemoveVendedorImage(false);
      showModal(
        "success",
        "Sucesso!",
        "Dados do vendedor atualizados com sucesso!",
        CheckCircle
      );
    } catch (error) {
      console.error("Erro ao atualizar vendedor:", error);
      showModal(
        "error",
        "Erro!",
        "Erro ao atualizar dados do vendedor.",
        XCircle
      );
    }
  };

  // Função para iniciar edição do nome da banca
  const startEditBancaName = () => {
    setNewBancaName(banca?.nome || "");
    setIsEditingBancaName(true);
  };

  // Função para iniciar edição do vendedor
  const startEditVendedor = (vendedor) => {
    setSelectedVendedor(vendedor);
    setNewVendedorName(vendedor.nome || "");
    setNewVendedorCity(vendedor.cidade || "");
    setNewVendedorImage(null);
    setShowEditVendedorModal(true);
  };

  // Função para cancelar edições
  const cancelEdit = () => {
    setShowEditVendedorModal(false);
    setNewVendedorName("");
    setNewVendedorCity("");
    setNewVendedorImage(null);
    setSelectedVendedor(null);
    setRemoveVendedorImage(false);
    setIsEditingBancaName(false);
    setNewBancaName("");
  };

  useEffect(() => {
    const fetchBanca = async () => {
      try {
        const bancaDoc = await getDoc(doc(db, "bancas", bancaId));
        if (bancaDoc.exists()) {
          setBanca({ id: bancaDoc.id, ...bancaDoc.data() });
          const vendedoresCollection = collection(
            db,
            `bancas/${bancaId}/vendedores`
          );
          const snapshot = await getDocs(vendedoresCollection);
          const vendedoresData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVendedores(vendedoresData);
        } else {
          console.log("A banca não foi encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar a banca:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanca();
  }, [bancaId]);

  useEffect(() => {
    const fetchProdutosExistentes = async () => {
      try {
        const snapshotCategorias = await getDocs(collection(db, "categorias"));
        const categoriasData = [];
        for (const doc of snapshotCategorias.docs) {
          const categoria = { id: doc.id, ...doc.data() };
          const produtosSnapshot = await getDocs(
            query(collection(db, `categorias/${categoria.id}/produtos`))
          );
          const produtosData = produtosSnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome,
            created: doc.data().created,
            images: doc.data().images,
          }));

          categoria.produtos = produtosData;
          categoriasData.push(categoria);
        }
        setProdutosExistentes(categoriasData);
      } catch (error) {
        console.error("Erro ao buscar produtos existentes:", error);
      }
    };

    fetchProdutosExistentes();
  }, []);

  useEffect(() => {
    const fetchProdutosAdicionados = async () => {
      try {
        const bancaDoc = await getDoc(doc(db, `bancas/${bancaId}`));
        if (bancaDoc.exists()) {
          const bancaData = bancaDoc.data();
          if (bancaData.produtos) {
            setProdutosAdicionados(bancaData.produtos);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar produtos adicionados:", error);
      }
    };

    fetchProdutosAdicionados();
  }, [bancaId]);

  const handleProdutoChange = (e) => {
    setProdutoSelecionado(e.target.value);
  };

  const handleAddProduto = async () => {
    try {
      if (!vendedores[0] || !produtoSelecionado) {
        showModal(
          "warning",
          "Atenção!",
          "Selecione um produto antes de adicionar.",
          AlertTriangle
        );
        return;
      }

      if (produtosAdicionados.length >= 24) {
        showModal(
          "warning",
          "Limite Atingido!",
          "Limite de 24 produtos atingido!",
          AlertTriangle
        );
        return;
      }

      const produtoId = produtoSelecionado;

      // Verificar se o produto já foi adicionado
      const produtoExistente = produtosAdicionados.find(
        (prod) => prod.id === produtoId
      );
      if (produtoExistente) {
        showModal(
          "error",
          "Produto Duplicado!",
          "Este produto já foi adicionado!",
          XCircle
        );
        return;
      }

      // Encontrar os detalhes do produto selecionado
      const produtoSelecionadoDados = produtosExistentes
        .flatMap((categoria) => categoria.produtos)
        .find((produto) => produto.id === produtoId);

      if (!produtoSelecionadoDados) {
        console.log("Produto não encontrado nos produtos existentes.");
        return;
      }

      const { nome, images } = produtoSelecionadoDados;

      // Adicionar o produto à banca no Firestore
      const bancaRef = doc(db, `bancas/${banca.id}`);
      await updateDoc(bancaRef, {
        produtos: arrayUnion({ id: produtoId, nome, images }),
      });

      // Atualizar o estado local dos produtos adicionados
      setProdutosAdicionados((prevProdutos) => [
        ...prevProdutos,
        { id: produtoId, nome, images },
      ]);

      // Remover o produto da lista de produtos disponíveis
      setProdutosExistentes((prevProdutosExistentes) =>
        prevProdutosExistentes.map((categoria) => ({
          ...categoria,
          produtos: categoria.produtos.filter(
            (produto) => produto.id !== produtoId
          ),
        }))
      );

      showModal(
        "success",
        "Sucesso!",
        "Produto adicionado com sucesso!",
        CheckCircle
      );
      setProdutoSelecionado("");
      console.log("Produto adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      showModal(
        "error",
        "Erro!",
        "Erro ao adicionar produto. Tente novamente.",
        XCircle
      );
    }
  };

  const handleRemoverProduto = async (produtoId) => {
    try {
      const bancaRef = doc(db, `bancas/${banca.id}`);
      const novosProdutosAdicionados = produtosAdicionados.filter(
        (produto) => produto.id !== produtoId
      );

      await updateDoc(bancaRef, {
        produtos: novosProdutosAdicionados,
      });

      setProdutosAdicionados(novosProdutosAdicionados);
      showModal(
        "success",
        "Sucesso!",
        "Produto removido com sucesso!",
        CheckCircle
      );
      console.log("Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      showModal(
        "error",
        "Erro!",
        "Erro ao remover produto. Tente novamente.",
        XCircle
      );
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gray-50">
        <MenuTopo />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader
              className="animate-spin mx-auto mb-4 text-green-600"
              size={48}
            />
            <p className="text-gray-600 text-lg">
              Carregando informações da banca...
            </p>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MenuTopo />
      <SEO
        title={`${banca?.nome} - Vendedores`}
        description={`Conheça os vendedores da ${banca?.nome} em Feira de Buritizeiro. Produtos de qualidade e variedade.`}
        keywords={[
          `${banca?.nome}`,
          "vendedores",
          "produtos",
          "Feira de Buritizeiro",
        ]}
      />

      {/* Hero Section */}
      <HeroSection {...getVendedorHeroData(banca)} />

      {/* Botão para editar nome da banca */}
      {user && user.role === "admin" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {isEditingBancaName ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Editar nome da Banca
                </h3>
                <input
                  type="text"
                  value={newBancaName}
                  onChange={(e) => setNewBancaName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                  placeholder="Nome da banca"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleEditBancaName}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBancaName(false);
                      setNewBancaName("");
                    }}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={startEditBancaName}
                  className="bg-green-100 hover:bg-green-200 text-green-600 px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  title="Editar nome da Banca"
                >
                  <Edit3 size={20} />
                  <span>Editar nome da Banca</span>
                </button>

                <button
                  onClick={() => setShowDeleteBancaModal(true)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  title="Excluir Banca"
                >
                  <Trash2 size={20} />
                  <span>Excluir Banca</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Estatísticas Section */}
      <StatsSection
        stats={getVendedoresStats(vendedores, produtosAdicionados)}
        title="Estatísticas da Banca"
        subtitle="Números que mostram nossa qualidade e variedade"
        variant="glass"
      />

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br bg-white from-slate-50 relative overflow-hidden">
        {/* Background */}

        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Vendedores Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent text-center mb-16">
              Nossos Vendedores
            </h3>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendedores.map((vendedor, index) => (
                <motion.div
                  key={vendedor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/50"
                >
                  {/* Card do vendedor*/}
                  <div className="bg-gradient-to-r bg-white via-teal-50 to-green-100 p-6 text-center">
                    <div className="w-36 h-36 mx-auto relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 rounded-full blur-lg"></div>
                      {vendedor.images && vendedor.images.length > 0 ? (
                        <img
                          src={vendedor.images[0].url}
                          alt={`Imagem de perfil de ${vendedor.nome}`}
                          className="relative w-full h-full rounded-full object-cover shadow-2xl border-1 border-white"
                        />
                      ) : (
                        <div className="relative w-full h-full rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shadow-2xl border-1 border-white flex items-center justify-center">
                          <User size={48} className="text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {vendedor.nome}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4 flex items-center justify-center space-x-2">
                      <MapPin size={16} />
                      <span>{vendedor.cidade}</span>
                    </p>

                    {/* Botões de editar e remover vendedor - apenas para admin */}
                    {user && user.role === "admin" && (
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => startEditVendedor(vendedor)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                          title="Editar Vendedor"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmModal(vendedor)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                          title="Remover Vendedor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    <a
                      href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text=Olá ${vendedor?.nome}! Vi sua ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
                    >
                      <FaWhatsapp size={22} />
                      <span>Conversar no WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </section>
          </motion.div>

          {/* Admin gerencimento dos produtos */}
          {user && user.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-white/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Gerenciar Produtos
                </h3>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label
                      htmlFor="produto"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Selecione um produto:
                    </label>
                    <select
                      id="produto"
                      onChange={handleProdutoChange}
                      value={produtoSelecionado}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione um produto...</option>
                      {produtosExistentes
                        .flatMap((categoria) => categoria.produtos)
                        .filter(
                          (produto) =>
                            !produtosAdicionados.some(
                              (adicionado) => adicionado.id === produto.id
                            )
                        )
                        .sort((a, b) => a.nome.localeCompare(b.nome))
                        .map((produto) => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddProduto}
                    className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
                  >
                    <Plus size={20} />
                    <span>Adicionar Produto</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Produtos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl mt-32 text-center lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-12">
              Produtos Disponíveis
            </h2>

            {produtosAdicionados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {produtosAdicionados.map((produto, index) => (
                  <motion.div
                    key={produto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/50"
                  >
                    <div className="relative">
                      {produto.images && produto.images.length > 0 && (
                        <img
                          src={produto.images[0].url}
                          alt={`Imagem de ${produto.nome}`}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 text-center">
                        {produto.nome}
                      </h3>

                      {user && user.role === "admin" && (
                        <button
                          onClick={() => handleRemoverProduto(produto.id)}
                          className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 size={16} />
                          <span>Remover</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-lg rounded-xl p-12 shadow-lg border border-white/50 max-w-md mx-auto">
                  <ShoppingBag
                    className="mx-auto mb-4 text-gray-400"
                    size={64}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum produto disponível
                  </h3>
                  <p className="text-gray-600">
                    Esta banca ainda não possui produtos cadastrados.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Botões de navegação */}

          <article className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/todascategorias"
                className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-lg transform hover:scale-105"
              >
                <ChevronRight size={24} />
                <span>Conheça todas as categorias</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                to="/bancas"
                className="inline-flex items-center text-sm space-x-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <ChevronRight size={24} />
                <span>Conheça todas as bancas</span>
              </Link>
            </motion.div>
          </article>
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
        icon={modal.icon}
      />

      {/* Modal de Edição do Vendedor */}
      <Modal
        isOpen={showEditVendedorModal}
        onClose={cancelEdit}
        type="info"
        size="xl"
      >
        <div className="text-center p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Editar Vendedor
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Nome do Vendedor
              </label>
              <input
                type="text"
                value={newVendedorName}
                onChange={(e) => setNewVendedorName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do vendedor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Cidade
              </label>
              <input
                type="text"
                value={newVendedorCity}
                onChange={(e) => setNewVendedorCity(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Foto de Perfil
              </label>

              {/* Mostrar imagem atual se existir */}
              {selectedVendedor?.images &&
                selectedVendedor.images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Foto atual:</p>
                    <img
                      src={selectedVendedor.images[0].url}
                      alt="Foto atual"
                      className="w-20 h-20 object-cover rounded-lg mx-auto"
                    />
                  </div>
                )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewVendedorImage(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {newVendedorImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(newVendedorImage)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {newVendedorImage.name}
                  </p>
                </div>
              )}

              {/* Opção para remover foto */}
              {selectedVendedor?.images &&
                selectedVendedor.images.length > 0 && (
                  <div className="mt-3">
                    <label className="flex items-center space-x-2 text-sm text-red-600">
                      <input
                        type="checkbox"
                        checked={removeVendedorImage}
                        onChange={(e) =>
                          setRemoveVendedorImage(e.target.checked)
                        }
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span>Remover foto atual</span>
                    </label>
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={() =>
                selectedVendedor && handleEditVendedor(selectedVendedor.id)
              }
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Salvar</span>
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação para Remover Vendedor */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setVendedorToDelete(null);
        }}
        onConfirm={handleDeleteVendedor}
        title="Remover Vendedor"
        message={`Tem certeza que deseja remover o vendedor "${vendedorToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Confirmação para Excluir Banca */}
      <ConfirmModal
        isOpen={showDeleteBancaModal}
        onClose={() => setShowDeleteBancaModal(false)}
        onConfirm={handleDeleteBanca}
        title="Excluir Banca"
        message={`Tem certeza que deseja excluir a banca "${
          banca?.nome
        }" com todos os seus vendedores${
          banca?.produtos && banca.produtos.length > 0 ? " e produtos" : ""
        }? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </main>
  );
};

export default Vendedor;

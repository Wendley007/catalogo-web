/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import banner from "../../../assets/banner.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";

import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import ScrollTopoButton from "../../../components/ScrollTopoButton";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

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
} from "lucide-react";

// --------------------------------------------------------------- Modal Component

const Modal = ({ isOpen, onClose, type, title, message, icon: Icon }) => {
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
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
        <button
          onClick={onClose}
          className={`${colors.button} text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-lg`}
        >
          Fechar
        </button>
      </motion.div>
    </section>
  );
};

// --------------------------------------------------------------- Estatísticas dos vendedores

const StatsSection = ({ vendedores, produtosAdicionados }) => {
  const stats = [
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
    { icon: Heart, value: "Local", label: "Produção", color: "text-red-500" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Estatísticas da Banca
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Números que mostram nossa qualidade e variedade
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
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 text-center group hover:scale-105 border border-white/20"
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
      </article>
    </section>
  );
};

// ======================================================= Página do vendedor

const Vendedor = () => {
  const { bancaId } = useParams();
  const { user } = useContext(AuthContext);
  const [banca, setBanca] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [produtosExistentes, setProdutosExistentes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal estados
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    icon: null,
  });

  const showModal = (type, title, message, icon) => {
    setModal({ isOpen: true, type, title, message, icon });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "", icon: null });
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
            <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
              {banca?.nome}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Conheça nossos vendedores e produtos de qualidade
            </p>
          </motion.div>
        </div>
      </section>

      {/* Estatísticas Section */}
      <StatsSection
        vendedores={vendedores}
        produtosAdicionados={produtosAdicionados}
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
            <h2 className="text-3xl text-center lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-12">
              Nossos Vendedores
            </h2>

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
                      <img
                        src={
                          vendedor.images && vendedor.images.length > 0
                            ? vendedor.images[0].url
                            : "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400"
                        }
                        alt={`Imagem de perfil de ${vendedor.nome}`}
                        className="relative w-full h-full rounded-full object-cover shadow-2xl border-1 border-white"
                      />
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
          {user?.role === "admin" && (
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

                      {user?.role === "admin" && (
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
    </main>
  );
};

export default Vendedor;

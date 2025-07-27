
import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/banner.jpg";
import { db, storage } from "../../services/firebaseConnection";
import ScrollTopoButton from "../../components/ScrollTopoButton";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import BancaCard from "../../components/BancaCard/BancaCard";
import StatsSection from "../../components/StatsSection";
import { Modal, UploadModal } from "../../components/Modal";
import TermPopup from "../../components/TermPopup";
import SEO from "../../components/SEO/SEO";
import ModernCarousel from "../../components/ModernCarousel";
import HeroSection from "../../components/HeroSection";
import CategoriaCard from "../../components/CategoriaCard";

import {
  ChevronRight,
  Star,
  MapPin,
  Users,
  Award,
  Heart,
  ShoppingBag,
  Phone,
} from "lucide-react";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
} from "firebase/firestore";

import { v4 as uuidV4 } from "uuid";
import { AuthContext } from "../../contexts/AuthContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Dados das estatísticas da página principal - Memoizado para performance
const getMainPageStats = () => [
  {
    icon: Users,
    value: "40+",
    label: "Anos de Tradição",
    color: "text-blue-500",
    description: "Décadas de experiência e qualidade",
  },
  {
    icon: ShoppingBag,
    value: "32",
    label: "Boxes Disponíveis",
    color: "text-green-500",
    description: "Espaços para vendedores locais",
  },
  {
    icon: Award,
    value: "100%",
    label: "Produtos Locais",
    color: "text-purple-500",
    description: "Frescos e de qualidade",
  },
  {
    icon: Heart,
    value: "10000+",
    label: "Famílias Atendidas",
    color: "text-red-500",
    description: "Comunidade satisfeita",
  },
];

// Dados do hero da página principal
const getMainPageHeroData = () => ({
  title: "Bem-vindo à Feira Livre de Buritizeiro",
  description:
    "Descubra produtos frescos e de alta qualidade diretamente da nossa comunidade local.",
  backgroundImage: banner,
});

// Dados das categorias em destaque
const getFeaturedCategories = () => [
  {
    id: "1",
    nome: "Frutas Frescas",
    icon: "🍎",
    description: "Frutas da estação direto do produtor",
    color: "from-orange-50 to-red-50",
    image:
      "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    nome: "Verduras",
    icon: "🥬",
    description: "Verduras frescas e orgânicas",
    color: "from-green-50 to-emerald-50",
    image:
      "https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

// ======================================================= Página Principal

const PaginaPrincipal = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
  });
  const vendedoresRef = useRef(null);
  const navigate = useNavigate();

  // Imagens padrão do carrossel
  const defaultSliderImages = useMemo(
    () => [
      "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    []
  );

  // Funções
  const showModal = useCallback((type, title, message, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
      onConfirm: null,
    });
  }, []);

  const uploadImageToFirestore = useCallback(
    async (imageFile, userId, title = "", description = "") => {
      const storageRef = ref(storage, `slides/${userId}/${uuidV4()}`);
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        const docRef = await addDoc(collection(db, "slides"), {
          userId: userId,
          imageUrl: downloadUrl,
          title: title || "Slide do Carrossel",
          description:
            description ||
            "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
          createdAt: new Date(),
        });
        return { imageUrl: downloadUrl, docId: docRef.id };
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw new Error("Erro ao fazer upload da imagem. Tente novamente.");
      }
    },
    []
  );

  const handleCarouselUpload = useCallback(async () => {
    console.log("handleCarouselUpload chamado");

    if (sliderImages.length >= 10) {
      showModal(
        "warning",
        "Limite Atingido",
        "Você atingiu o limite máximo de 10 imagens. Exclua outras para continuar."
      );
      return;
    }

    console.log("Abrindo modal de upload");
    setUploadModal({
      isOpen: true,
    });
  }, [sliderImages.length, showModal]);

  const handleDeleteSlide = useCallback(
    (id, imageUrl, title = "imagem") => {
      if (!id) {
        console.error("ID não definido. Não é possível excluir a imagem.");
        return;
      }

      showModal(
        "warning",
        "Confirmar Exclusão",
        `Tem certeza que deseja excluir a imagem "${title}"?`,
        async () => {
          try {
            await deleteObject(ref(storage, imageUrl));
            await deleteDoc(doc(db, "slides", id));
            setSliderImages((prev) => prev.filter((img) => img.id !== id));
            closeModal();
            showModal(
              "success",
              "Sucesso!",
              `Imagem "${title}" excluída com sucesso!`
            );
          } catch (error) {
            console.error("Erro ao excluir imagem:", error);
            showModal(
              "error",
              "Erro!",
              `Erro ao excluir imagem "${title}". Tente novamente.`
            );
          }
        }
      );
    },
    [showModal, closeModal]
  );

  const handleUploadConfirm = useCallback(
    async (uploadData) => {
      if (!uploadData.imageFile) return;

      try {
        const { imageUrl, docId } = await uploadImageToFirestore(
          uploadData.imageFile,
          user.uid,
          uploadData.title,
          uploadData.description
        );

        setSliderImages((prev) => [
          ...prev,
          {
            id: docId,
            imageUrl,
            title: uploadData.title || "Slide do Carrossel",
            description:
              uploadData.description ||
              "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
          },
        ]);

        showModal("success", "Sucesso!", "Imagem cadastrada com sucesso!");
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        showModal(
          "error",
          "Erro!",
          "Erro ao cadastrar imagem. Tente novamente."
        );
      }
    },
    [uploadImageToFirestore, user?.uid, showModal]
  );

  const closeUploadModal = useCallback(() => {
    setUploadModal({
      isOpen: false,
    });
  }, []);

  // --------------------------------------------------------------- Busca efeitos de dados

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "slides"));
        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          title: doc.data().title || "Slide do Carrossel",
          description:
            doc.data().description ||
            "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
        }));
        setSliderImages(
          images.length > 0
            ? images
            : defaultSliderImages.map((url, index) => ({
                id: `default-${index}`,
                imageUrl: url,
                title: `Slide ${index + 1}`,
                description:
                  "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
              }))
        );
      } catch (error) {
        console.error("Erro ao buscar imagens do Firestore:", error);
        setSliderImages(
          defaultSliderImages.map((url, index) => ({
            id: `default-${index}`,
            imageUrl: url,
            title: `Slide ${index + 1}`,
            description:
              "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
          }))
        );
      }
    };

    fetchSliderImages();
  }, [defaultSliderImages]);

  useEffect(() => {
    const fetchCategorias = async () => {
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
            ...doc.data(),
          }));
          categoria.produtos = produtosData;
          categoriasData.push(categoria);
        }
        // Ordenar categorias por quantidade de produtos (mais produtos primeiro)
        const categoriasOrdenadas = categoriasData.sort(
          (a, b) => (b.produtos?.length || 0) - (a.produtos?.length || 0)
        );
        setCategorias(categoriasOrdenadas.slice(0, 2));
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        // Usando dados memoizados para demonstração
        setCategorias(getFeaturedCategories());
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchBancas = async () => {
      try {
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
        // Ordenar bancas por quantidade de produtos (mais produtos primeiro)
        const bancasOrdenadas = bancasData.sort(
          (a, b) => (b.produtos?.length || 0) - (a.produtos?.length || 0)
        );
        setBancas(bancasOrdenadas.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar bancas:", error);
        setBancas([
          {
            id: "1",
            nome: "Banca das Frutas",
            vendedores: [
              {
                id: "1",
                nome: "João Silva",
                cidade: "Buritizeiro - MG",
                whatsapp: "5538999999999",
                images: [
                  {
                    url: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
                  },
                ],
              },
            ],
          },
        ]);
      }
    };

    fetchBancas();
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

  // Função para simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectVendedores = useCallback(
    (bancaId) => {
      setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
    },
    [selectedBanca]
  );

  const handleEvaluationAccept = useCallback(() => {
    setShowEvaluationPopup(false);
    navigate("/avaliacao");
  }, [navigate]);

  // Renderização condicional de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando Feira Livre...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 scroll-smooth">
      <MenuTopo />
      <SEO
        title="Feira Livre de Buritizeiro - Produtos Frescos e de Qualidade"
        description="Descubra a Feira Livre de Buritizeiro, onde você encontra produtos frescos e de alta qualidade diretamente da nossa comunidade local. Todos os domingos das 6h às 12h, você encontra produtos frescos e de qualidade no coração de Buritizeiro."
        keywords={[
          "Feira Livre",
          "Buritizeiro",
          "produtos frescos",
          "alimentos orgânicos",
          "mercado livre",
          "banca de produtos",
          "comércio local",
        ]}
      />

      {/* Hero Section */}
      <HeroSection {...getMainPageHeroData()} />

      {/* Seção Principal com Carrossel e Categorias */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Carrossel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <ModernCarousel
                images={sliderImages}
                onDeleteSlide={handleDeleteSlide}
                isAdmin={user?.role === "admin"}
                onAddImage={handleCarouselUpload}
              />
            </motion.div>

            {/* Categorias */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-10">
                Categorias em Destaque
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categorias.map((categoria, index) => (
                  <CategoriaCard
                    key={categoria.id}
                    categoria={categoria}
                    index={index}
                    variant="compact"
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/todascategorias"
                  className="inline-flex mt-10 items-center text-sm space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Ver todas as Categorias</span>
                  <ChevronRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section id="estatisticas" className="scroll-to-element">
        <StatsSection
          stats={getMainPageStats()}
          title="Nossa Feira em números"
          subtitle="Décadas de tradição e qualidade comprovada"
          variant="modern"
        />
      </section>

      {/* Seção de Bancas Modernizada */}
      <section
        id="bancas"
        className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 scroll-to-element"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Conheça Nossas Bancas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vendedores locais com produtos de qualidade garantida
            </p>
          </motion.div>

          {/* Cards de Bancas */}
          <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2 scroll-container">
            <AnimatePresence>
              {bancas.map((banca, index) => (
                <motion.div
                  key={banca.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BancaCard
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
                </motion.div>
              ))}
            </AnimatePresence>
          </article>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/bancas"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-10 py-3 rounded-xl font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-purple-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Ver todas as Bancas</span>
                <ChevronRight size={20} />
              </Link>
              <button
                onClick={() => setShowEvaluationPopup(true)}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Star size={20} />
                <span>Avaliar o Site!</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Contato Modernizada */}
      <section
        id="contato"
        className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-green-800 relative overflow-hidden"
      >
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Venha nos Visitar!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Todos os domingos das 6h às 12h, você encontra produtos frescos e
              de qualidade no coração de Buritizeiro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/localizacao"
                className="inline-flex items-center space-x-2 bg-white text-green-700 px-8 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <MapPin size={20} />
                <span>Ver Localização</span>
              </Link>
              <a
                href="tel:+553837421011"
                className="inline-flex items-center space-x-2 bg-green-800 text-white px-8 py-2 rounded-xl font-semibold hover:bg-green-900 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Phone size={20} />
                <span>(38) 3742-1011</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollTopoButton />

      <Footer />

      {/* Modais */}
      <AnimatePresence>
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
        />

        <TermPopup
          isOpen={showEvaluationPopup}
          onClose={() => setShowEvaluationPopup(false)}
          onAccept={handleEvaluationAccept}
        />

        <UploadModal
          isOpen={uploadModal.isOpen}
          onClose={closeUploadModal}
          onUpload={handleUploadConfirm}
          title="Adicionar Imagem ao Carrossel"
          size="md"
        />
      </AnimatePresence>
    </main>
  );
};

export default PaginaPrincipal;

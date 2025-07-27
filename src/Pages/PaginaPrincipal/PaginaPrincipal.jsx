/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/banner.jpg";
import { db, storage } from "../../services/firebaseConnection";
import ScrollTopoButton from "../../components/ScrollTopoButton";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import BancaCard from "../../components/BancaCard/BancaCard";
import StatsSection from "../../components/StatsSection";
import { Modal } from "../../components/Modal";
import TermPopup from "../../components/TermPopup";
import SEO from "../../components/SEO/SEO";
import ModernCarousel from "../../components/ModernCarousel";
import HeroSection from "../../components/HeroSection";

import {
  Eye,
  ChevronRight,
  Star,
  MapPin,
  Clock,
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
// --------------------------------------------------------------- Carousel de imagens

// Dados das estatísticas da página principal
const getMainPageStats = () => [
  {
    icon: Users,
    value: "40+",
    label: "Anos de Tradição",
    color: "text-blue-500",
  },
  {
    icon: ShoppingBag,
    value: "32",
    label: "Boxes Disponíveis",
    color: "text-green-500",
  },
  {
    icon: Award,
    value: "100%",
    label: "Produtos Locais",
    color: "text-purple-500",
  },
  {
    icon: Heart,
    value: "10000+",
    label: "Famílias Atendidas",
    color: "text-red-500",
  },
];

// Dados do hero da página principal
const getMainPageHeroData = () => ({
  title: "Bem-vindo à Feira Livre de Buritizeiro",
  description:
    "Descubra produtos frescos e de alta qualidade diretamente da nossa comunidade local",
  backgroundImage: banner,
  stats: [
    {
      icon: MapPin,
      title: "Localização",
      value: "Centro de Buritizeiro",
    },
    {
      icon: Clock,
      title: "Horário",
      value: "Domingos: 6h às 12h",
    },
    {
      icon: Star,
      title: "Tradição",
      value: "Mais de 40 anos",
    },
  ],
});

// ======================================================= Página Principal

const PaginaPrincipal = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
    imageFile: null,
    title: "",
    description: "",
  });
  const vendedoresRef = useRef(null);
  const navigate = useNavigate();

  const defaultSliderImages = [
    "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const uploadImageToFirestore = async (
    imageFile,
    userId,
    title = "",
    description = ""
  ) => {
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
  };

  const handleCarouselUpload = async (file) => {
    console.log("handleCarouselUpload chamado com:", file);
    if (!file) return;

    if (sliderImages.length >= 10) {
      showModal(
        "warning",
        "Limite Atingido",
        "Você atingiu o limite máximo de 10 imagens. Exclua outras para continuar."
      );
      return;
    }

    console.log("Abrindo modal de upload");
    // Abrir modal para capturar título e descrição
    setUploadModal({
      isOpen: true,
      imageFile: file,
      title: "",
      description: "",
    });
  };

  const handleDeleteSlide = (id, imageUrl, title = "imagem") => {
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
  };

  const handleConfirmUpload = async () => {
    if (!uploadModal.imageFile) return;

    try {
      const { imageUrl, docId } = await uploadImageToFirestore(
        uploadModal.imageFile,
        user.uid,
        uploadModal.title,
        uploadModal.description
      );

      setSliderImages((prev) => [
        ...prev,
        {
          id: docId,
          imageUrl,
          title: uploadModal.title || "Slide do Carrossel",
          description:
            uploadModal.description ||
            "Descrição do slide do carrossel da Feira Livre de Buritizeiro",
        },
      ]);

      setUploadModal({
        isOpen: false,
        imageFile: null,
        title: "",
        description: "",
      });
      showModal("success", "Sucesso!", "Imagem cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      showModal("error", "Erro!", "Erro ao cadastrar imagem. Tente novamente.");
    }
  };

  const closeUploadModal = () => {
    setUploadModal({
      isOpen: false,
      imageFile: null,
      title: "",
      description: "",
    });
  };

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
  }, []);

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
        setCategorias(categoriasData.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        // Dados simulados para demonstração
        setCategorias([
          {
            id: "1",
            nome: "Frutas Frescas",
            produtos: [
              {
                images: [
                  {
                    url: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            nome: "Verduras",
            produtos: [
              {
                images: [
                  {
                    url: "https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800",
                  },
                ],
              },
            ],
          },
          {
            id: "3",
            nome: "Legumes",
            produtos: [
              {
                images: [
                  {
                    url: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800",
                  },
                ],
              },
            ],
          },
          {
            id: "4",
            nome: "Temperos",
            produtos: [
              {
                images: [
                  {
                    url: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800",
                  },
                ],
              },
            ],
          },
        ]);
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
        setBancas(bancasData.slice(0, 3));
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

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  const handleEvaluationAccept = () => {
    setShowEvaluationPopup(false);
    navigate("/avaliacao");
  };

  return (
    <main className="min-h-screen bg-gray-50 scroll-smooth">
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

      <section className="py-16 scroll-overscroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
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
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Categorias em Destaque
              </h2>

              <div className="grid grid-cols-2 gap-4 scroll-container">
                {categorias.map((categoria) => (
                  <motion.div
                    key={categoria.id}
                    whileHover={{ scale: 1.05 }}
                    className="group bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={
                          categoria.produtos[0]?.images?.[0]?.url ||
                          "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800"
                        }
                        alt={categoria.nome}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          to={`/categorias/${categoria.id}`}
                          className="bg-white text-gray-900 px-3 py-1 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                          <Eye size={16} />
                          <span>Ver produtos</span>
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-center text-sm">
                        {categoria.nome}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/todascategorias"
                className="inline-flex mt-8 items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Ver todas as Categorias</span>
                <ChevronRight size={20} />
              </Link>
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
          variant="default"
        />
      </section>

      {/* Vendedores*/}
      <section
        id="bancas"
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 scroll-to-element"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Conheça Nossas Bancas
            </h2>
            <p className="text-xl text-gray-600">
              Vendedores locais com produtos de qualidade
            </p>
          </motion.div>

          {/* Cards */}
          <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2 scroll-container">
            {bancas.map((banca, index) => (
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

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/bancas"
                className="inline-flex mt-14 items-center space-x-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-10 py-3 rounded-xl font-semibold hover:from-gray-800 hover:via-blue-800 hover:to-purple-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm"
              >
                <span>Ver todas as Bancas</span>
                <ChevronRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="contato"
        className="py-16 bg-gradient-to-r from-green-600 to-green-700 scroll-to-element"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Venha nos Visitar!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Todos os domingos das 6h às 12h, você encontra produtos frescos e
              de qualidade no coração de Buritizeiro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/localizacao"
                className="inline-flex items-center space-x-2 bg-white text-green-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-xl transform hover:scale-105"
              >
                <MapPin size={20} />
                <span>Ver Localização</span>
              </Link>
              <a
                href="tel:+553837421011"
                className="inline-flex items-center space-x-2 bg-green-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-900 transition-colors shadow-xl hover:shadow-xl transform hover:scale-105"
              >
                <Phone size={20} />
                <span>(38) 3742-1011</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-16 bg-gray-50 scroll-momentum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowEvaluationPopup(true)}
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-xl hover:shadow-xl transform hover:scale-105"
            >
              <Star size={20} />
              <span>Avalie o Site!</span>
            </button>
          </div>
        </div>
      </section>

      <ScrollTopoButton />

      <Footer />

      {/* Modals */}
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

      {/* Modal de Upload de Imagem */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Adicionar Imagem ao Carrossel
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Slide (opcional)
                </label>
                <input
                  type="text"
                  value={uploadModal.title}
                  onChange={(e) =>
                    setUploadModal((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Ex: Produtos Frescos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Slide (opcional)
                </label>
                <textarea
                  value={uploadModal.description}
                  onChange={(e) =>
                    setUploadModal((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Ex: Descrição detalhada do slide..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="text-xs text-gray-500">
                <p>• Se não preencher, serão usados valores padrão</p>
                <p>• Título padrão: &quot;Slide do Carrossel&quot;</p>
                <p>
                  • Descrição padrão: &quot;Descrição do slide do carrossel da
                  Feira Livre de Buritizeiro&quot;
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeUploadModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Adicionar Imagem
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default PaginaPrincipal;

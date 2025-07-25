/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/banner.jpg";
import { db, storage } from "../../services/firebaseConnection";

import ScrollTopoButton from "../../components/ScrollTopoButton";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";

import {
  Eye,
  ChevronRight,
  Upload,
  ChevronDown,
  Trash2,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  ChevronLeft,
  Leaf,
  Award,
  TrendingUp,
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

// ---------------------------------------------------------------  Modal Componente

const Modal = ({ isOpen, onClose, type, title, message, onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Impede scroll
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
        <section
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-800 ring-1 ring-gray-200 dark:ring-gray-600 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative"
          >
            <div className="flex justify-center mb-4">{getIcon()}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
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
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
};

// --------------------------------------------------------------- Popup de avaliação

const EvaluationPopup = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-2 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Avaliação do Catálogo</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-green-100 mt-2">Feira Livre de Buritizeiro</p>
        </div>
        <div className="py-2 px-8">
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              Estamos conduzindo uma pesquisa sobre a usabilidade do catálogo
              web. Antes de prosseguir, leia atentamente nossos termos de ética
              e responsabilidade.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4 rounded-xl mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Termos de Participação:
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ">
                  1
                </div>
                <p>
                  Respostas confidenciais e dados usados para melhorias no
                  catálogo.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ">
                  2
                </div>
                <p>Questionário anônimo, sem coleta de dados pessoais.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <p>Participação voluntária e possibilidade de desistência.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ">
                  4
                </div>
                <p>Pesquisa ética, sem riscos aos participantes.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">Agradecemos sua participação!</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={onAccept}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors transform hover:scale-105"
              >
                Aceitar e Continuar
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// --------------------------------------------------------------- Carousel de imagens

const ModernCarousel = ({ images, onDeleteSlide, isAdmin }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((api) => setScrollSnaps(api.scrollSnapList()), []);
  const onSelect = useCallback(
    (api) => setSelectedIndex(api.selectedScrollSnap()),
    []
  );

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <section className="relative">
      {/* Carousel container */}
      <div className="overflow-hidden rounded-xl shadow-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] relative">
              {/* Imagem do slide */}
              <div className="relative">
                <img
                  src={image.imageUrl}
                  alt={image.alt || `Slide ${index + 1}`}
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão fixo de exclusão */}
      {isAdmin && (
        <button
          onClick={() => {
            const currentImage = images[selectedIndex];
            if (!currentImage.id.toString().startsWith("default")) {
              onDeleteSlide(currentImage.id, currentImage.imageUrl);
            }
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-white/60 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-md z-20"
        >
          <Trash2 size={20} className="text-black" />
        </button>
      )}

      {/* Botões de navegação */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-xl transition-transform duration-300 hover:scale-110 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-xl transition-transform duration-300 hover:scale-110 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pontos */}
      <div className="flex justify-center space-x-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-8 bg-green-500"
                : "w-3 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// --------------------------------------------------------------- Estatísticas componente

const StatsSection = () => {
  const stats = [
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

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Nossa Feira em números
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Décadas de tradição e qualidade comprovada
          </p>
        </motion.div>

        <article className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-xl hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div
                  className={`w-16 h-16 ${stat.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={stat.color} size={32} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </article>
      </div>
    </section>
  );
};

// --------------------------------------------------------------- Características componente

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "Produtos Orgânicos",
      description: "Frutas, verduras e legumes cultivados sem agrotóxicos",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Apoio Local",
      description: "Fortalecendo a economia e os produtores da região",
      color: "text-blue-500",
    },
    {
      icon: Clock,
      title: "Sempre Frescos",
      description: "Produtos colhidos e entregues no mesmo dia",
      color: "text-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Preços Justos",
      description: "Valores acessíveis direto do produtor",
      color: "text-purple-500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Por que escolher nossa Feira?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma experiência única que combina tradição, qualidade e
            sustentabilidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 ${feature.color} bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300`}
                >
                  <Icon className={feature.color} size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

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
    type: "",
    title: "",
    message: "",
    onConfirm: null,
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

  const uploadImageToFirestore = async (imageFile, userId) => {
    const storageRef = ref(storage, `slides/${userId}/${uuidV4()}`);
    try {
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, "slides"), {
        userId: userId,
        imageUrl: downloadUrl,
        createdAt: new Date(),
      });
      return downloadUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw new Error("Erro ao fazer upload da imagem. Tente novamente.");
    }
  };

  const handleFileUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    try {
      if (sliderImages.length >= 10) {
        showModal(
          "warning",
          "Limite Atingido",
          "Você atingiu o limite máximo de 10 imagens. Exclua outras para continuar."
        );
        return;
      }

      const imageUrl = await uploadImageToFirestore(imageFile, user.uid);
      setSliderImages((prev) => [...prev, { id: null, imageUrl }]);
      showModal("success", "Sucesso!", "Imagem cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      showModal("error", "Erro!", "Erro ao cadastrar imagem. Tente novamente.");
    }
  };

  const handleDeleteSlide = (id, imageUrl) => {
    if (!id) {
      console.error("ID não definido. Não é possível excluir a imagem.");
      return;
    }

    showModal(
      "warning",
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta imagem?",
      async () => {
        try {
          await deleteObject(ref(storage, imageUrl));
          await deleteDoc(doc(db, "slides", id));
          setSliderImages((prev) => prev.filter((img) => img.id !== id));
          closeModal();
          showModal("success", "Sucesso!", "Imagem excluída com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir imagem:", error);
          showModal(
            "error",
            "Erro!",
            "Erro ao excluir imagem. Tente novamente."
          );
        }
      }
    );
  };

  // --------------------------------------------------------------- Busca efeitos de dados

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "slides"));
        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
        }));
        setSliderImages(
          images.length > 0
            ? images
            : defaultSliderImages.map((url, index) => ({
                id: `default-${index}`,
                imageUrl: url,
              }))
        );
      } catch (error) {
        console.error("Erro ao buscar imagens do Firestore:", error);
        setSliderImages(
          defaultSliderImages.map((url, index) => ({
            id: `default-${index}`,
            imageUrl: url,
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
    <main className="min-h-screen bg-gray-50">
      <MenuTopo />

      {/* Hero Section */}
      <section
        className="bg-cover bg-no-repeat bg-center py-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.738), rgba(0, 0, 0, 0.728)), url(${banner})`,
        }}
      >
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
              Bem-vindo à Feira Livre de Buritizeiro
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Descubra produtos frescos e de alta qualidade diretamente da nossa
              comunidade local
            </p>
          </motion.div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <MapPin className="mx-auto text-white mb-2" size={32} />
              <h3 className="font-semibold text-white">Localização</h3>
              <p className="text-sm opacity-90 text-white">
                Centro de Buritizeiro
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <Clock className="mx-auto text-white mb-2" size={32} />
              <h3 className="font-semibold text-white">Horário</h3>
              <p className="text-sm text-white opacity-90">
                Domingos: 6h às 12h
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <Star className="mx-auto text-white mb-2" size={32} />
              <h3 className="font-semibold text-white">Tradição</h3>
              <p className="text-sm opacity-90 text-white">Mais de 40 anos</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {user?.role === "admin" && (
                <div className="mb-6">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Upload size={20} />
                    <span>Adicionar Imagem</span>
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </div>
              )}

              <ModernCarousel
                images={sliderImages}
                onDeleteSlide={handleDeleteSlide}
                isAdmin={user?.role === "admin"}
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

              <div className="grid grid-cols-2 gap-4">
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
      <StatsSection />

      {/* Características */}
      <FeaturesSection />

      {/* Vendedores*/}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
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
          <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
            {bancas.map((banca, index) => (
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
                          className="absolute top-full ring-1 ring-gray-300 ml-4 mt-2 max-h-60 w-64 bg-gray-100 hover:bg-gray-50 transition-colors rounded-xl shadow-xl z-10"
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
                                      banca.vendedores.slice(1).length - 1 && (
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
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
      <section className="py-16 bg-gray-50">
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

      <EvaluationPopup
        isOpen={showEvaluationPopup}
        onClose={() => setShowEvaluationPopup(false)}
        onAccept={handleEvaluationAccept}
      />
    </main>
  );
};

export default PaginaPrincipal;

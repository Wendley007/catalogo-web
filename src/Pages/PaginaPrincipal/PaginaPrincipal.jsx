import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faChevronRight,
  faUpload,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import fundo from "../../assets/fundo.jpg";
import Slider from "react-slick";
import { FiTrash2 } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db, storage } from "../../services/firebaseConnection";
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

const PaginaPrincipal = () => {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const vendedoresRef = useRef(null);
  const [selectedBanca, setSelectedBanca] = useState(null);

  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false);
  const [showErrorUploadModal, setShowErrorUploadModal] = useState(false);
  const [showUploadLimitModal, setShowUploadLimitModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [showErrorDeleteModal, setShowErrorDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const openSuccessUploadModal = () => setShowSuccessUploadModal(true);
  const closeSuccessUploadModal = () => setShowSuccessUploadModal(false);
  const openErrorUploadModal = () => setShowErrorUploadModal(true);
  const closeErrorUploadModal = () => setShowErrorUploadModal(false);
  const openUploadLimitModal = () => setShowUploadLimitModal(true);
  const closeUploadLimitModal = () => setShowUploadLimitModal(false);
  const openConfirmDeleteModal = () => setShowConfirmDeleteModal(true);
  const closeConfirmDeleteModal = () => setShowConfirmDeleteModal(false);
  const openSuccessDeleteModal = () => setShowSuccessDeleteModal(true);
  const closeSuccessDeleteModal = () => setShowSuccessDeleteModal(false);
  const openErrorDeleteModal = () => setShowErrorDeleteModal(true);
  const closeErrorDeleteModal = () => setShowErrorDeleteModal(false);

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

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "slides"));
        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
        }));
        setSliderImages(images);
      } catch (error) {
        console.error("Erro ao buscar imagens do Firestore:", error);
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
        setCategorias(categoriasData.slice(0, 2));
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
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
      }
    };

    fetchBancas();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  const handleOutsideClick = (e) => {
    if (vendedoresRef.current && !vendedoresRef.current.contains(e.target)) {
      setSelectedBanca(null);
    }
  };

  const handleFileUpload = async (e) => {
    const imageFile = e.target.files[0];
    try {
      if (sliderImages.length >= 10) {
        openUploadLimitModal();
        return;
      }

      const imageUrl = await uploadImageToFirestore(imageFile, user.uid);
      setUploadedImageUrl(imageUrl);

      setSliderImages((prevImages) => [...prevImages, { id: null, imageUrl }]);
      openSuccessUploadModal();
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      openErrorUploadModal();
    }
  };

  const handleDeleteSlide = async (id, imageUrl) => {
    if (!id) {
      console.error("ID não definido. Não é possível excluir a imagem.");
      return;
    }

    setImageToDelete({ id, imageUrl });
    openConfirmDeleteModal();
  };

  const confirmDeleteSlide = async () => {
    closeConfirmDeleteModal();
    const { id, imageUrl } = imageToDelete;

    try {
      await deleteObject(ref(storage, imageUrl));
      await deleteDoc(doc(db, "slides", id));

      setSliderImages((prevImages) =>
        prevImages.filter((img) => img.id !== id)
      );

      if (uploadedImageUrl === imageUrl) {
        setUploadedImageUrl("");
      }

      openSuccessDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      openErrorDeleteModal();
    }
  };

  const cancelDeleteSlide = () => {
    closeConfirmDeleteModal();
    setImageToDelete(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const handleAgree = () => {
    setShowPopup(false);
    navigate("/avaliacao");
  };

  const handleBack = () => {
    setShowPopup(false);
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------//

  return (
    <div
      className="bg-cover bg-center min-h-screen text-gray-800 relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-800 bg-opacity-75 min-h-screen h-full relative z-10">
        <MenuTopo />
        <div className="container mx-auto py-6 text-white">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-6"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg uppercase font-bold text-green-400 mb-2"
            >
              Bem-vindo à Feira Livre de Buritizeiro
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm"
            >
              Descubra produtos frescos e de alta qualidade diretamente da nossa
              comunidade.
            </motion.p>
          </motion.header>

          {user?.role === "admin" && (
            <>
              <label
                htmlFor="file-upload"
                className="bg-gray-500 w-40 mb-4 h-6 text-xs hover:bg-gray-600 text-white py-2 px-4 rounded-md cursor-pointer flex items-center"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Adicionar Imagem
              </label>
              <input
                type="file"
                id="file-upload"
                className="opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                accept="image/*"
              />
            </>
          )}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div key={index} className="relative">
                  {user?.role === "admin" && (
                    <button
                      onClick={() =>
                        handleDeleteSlide(image.id, image.imageUrl)
                      }
                      className="absolute bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center top-2 right-2 shadow-md z-10"
                    >
                      <FiTrash2 size={20} color="#000" />
                    </button>
                  )}
                  <img
                    src={image.imageUrl}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-96 object-cover mb-4 rounded-md shadow-md"
                  />
                </div>
              ))}
            </Slider>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <h2 className="text-xs font-bold uppercase mb-4">
                Categorias em Destaque
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {categorias.map((categoria) => (
                  <motion.div
                    key={categoria.id}
                    className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-green-800 bg-opacity-50 to-green-300"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative overflow-hidden">
                      {categoria.produtos[0]?.images &&
                        categoria.produtos[0].images[0] && (
                          <img
                            src={categoria.produtos[0].images[0].url}
                            alt={categoria.nome}
                            className="w-full h-auto object-cover"
                            style={{ height: "260px" }}
                          />
                        )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center transition-opacity opacity-0 hover:opacity-100">
                        <Link
                          to={`/categorias/${categoria.id}`}
                          className="text-center text-white text-sm bg-green-500 py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline transition-colors"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          Ver Produtos
                        </Link>
                      </div>
                    </div>
                    <div className="p-2">
                      <h2 className="text-xs text-center uppercase font-semibold text-gray-100">
                        {categoria.nome}
                      </h2>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="mt-4"
              >
                <Link
                  to="/todascategorias"
                  className="bg-gradient-to-r text-xs from-green-700 to-green-400 text-white py-2 px-4 rounded-md hover:bg-gradient-to-r hover:from-green-800 hover:to-green-500 focus:outline-none focus:shadow-outline transition-colors flex items-center"
                >
                  Conhecer todas as categorias
                </Link>
              </motion.div>
            </motion.section>
          </motion.section>
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mt-12"
          >
            <section>
              <h2 className="text-xs font-bold uppercase mb-4">
                Conheça nossas bancas
              </h2>
              <div className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
                {bancas.map((banca) => (
                  <motion.div
                    key={banca.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                    className={`bg-gray-800 bg-opacity-80 rounded-lg shadow-md ${
                      selectedBanca === banca.id ? "z-20" : ""
                    }`}
                  >
                    <div className="p-4">
                      <h2 className="relative flex items-center justify-between text-sm uppercase font-medium text-gray-200 mb-4">
                        {banca.nome}
                        <div className="absolute right-0 flex space-x-2"></div>
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {banca.vendedores && banca.vendedores.length > 0 ? (
                          banca.vendedores.slice(0, 1).map((vendedor) => (
                            <motion.div
                              key={vendedor.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center"
                            >
                              <img
                                src={
                                  vendedor.images && vendedor.images.length > 0
                                    ? vendedor.images[0].url
                                    : "placeholder.jpg"
                                }
                                alt={`Imagem de perfil de ${vendedor.nome}`}
                                className="object-cover w-28 h-28 shadow-md shadow-slate-900 rounded-full mb-2 transform scale-100 hover:scale-105 transition-transform duration-300"
                              />
                              <div className="text-sm text-gray-200 mt-1 mb-1 text-center">
                                {vendedor.nome}
                              </div>
                              <div className="text-xs text-gray-400 mb-2">
                                {vendedor.cidade}
                              </div>
                              <a
                                href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text= Olá! vi essa ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer bg-green-500 w-full text-white flex text-xs items-center justify-center gap-2 my-2 h-8 rounded-lg font-medium"
                              >
                                Conversar com vendedor
                                <FaWhatsapp size={16} color="#FFF" />
                              </a>
                            </motion.div>
                          ))
                        ) : (
                          <p>Nenhum vendedor disponível nesta banca.</p>
                        )}
                      </div>
                      <div className="relative">
                        <div className="flex justify-between mt-4">
                          <Link
                            to={`/bancas/${banca.id}`}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 text-xs focus:outline-none focus:shadow-outline transition-colors mr-2"
                          >
                            Acessar banca
                          </Link>
                          <button
                            type="button"
                            className="bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-between hover:bg-gray-900 text-xs focus:outline-none focus:shadow-outline transition-colors"
                            onClick={() => handleSelectVendedores(banca.id)}
                          >
                            <span className="mr-2">
                              {selectedBanca === banca.id
                                ? "Fechar Vendedores"
                                : "Ver Vendedores"}
                            </span>
                            <svg
                              className={`w-4 h-4 transition-transform transform ${
                                selectedBanca === banca.id ? "rotate-180" : ""
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 6.293a1 1 0 011.414 0L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        {selectedBanca === banca.id && (
                          <div
                            ref={vendedoresRef}
                            className="absolute top-full ml-4 mt-2 w-64 bg-gray-200 bg-opacity-95 rounded-md shadow-lg z-10 overflow-hidden"
                          >
                            <ul>
                              {banca.vendedores.slice(1).map((vendedor) => (
                                <li
                                  key={vendedor.id}
                                  className="px-4 py-3 grid items-center justify-between hover:bg-gray-100 transition-colors relative"
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={
                                        vendedor.images &&
                                        vendedor.images.length > 0
                                          ? vendedor.images[0].url
                                          : "placeholder.jpg"
                                      }
                                      alt={`Imagem de perfil de ${vendedor.nome}`}
                                      className="object-cover w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                      <div className="text-sm text-gray-800">
                                        {vendedor.nome}
                                      </div>
                                      <div className="flex items-center">
                                        <div className="text-xs text-gray-600">
                                          {vendedor.cidade}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 ml-14">
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text= Olá! vi essa ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado!`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="cursor-pointer bg-green-500 text-white text-xs shadow-lg ring-1 ring-gray-400 flex items-center justify-center rounded-full px-4"
                                    >
                                      <FaWhatsapp size={12} color="#FFF" />
                                      <span className="ml-1">Conversar</span>
                                    </a>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Link to="/bancas">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    className="bg-green-700 text-white text-xs -mt-2 py-2 px-6 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
                    Conheça todas as bancas e os vendedores
                  </motion.button>
                </Link>
              </div>
            </section>
          </motion.section>
          <div className="flex justify-center items-center space-x-4 mt-5">
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onClick={scrollToTop}
                className="text-center items-center text-xs bg-red-500 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors"
              >
                <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
                Voltar ao Topo
              </motion.button>
            )}

            <div className="relative">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="bg-blue-500 text-white text-xs py-2 px-6 rounded-md hover:bg-blue-600  focus:ring-blue-300 shadow-md focus:shadow-outline transition-colors flex items-center"
                onClick={() => setShowPopup(true)}
              >
                <FontAwesomeIcon icon={faChevronRight} className="mr-3" />
                Avalie o site!
              </motion.button>

              {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-2">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fadeIn relative flex">
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="flex-1 p-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Avaliação do Catálogo da Feira Livre
                      </h2>
                      <hr className="border-gray-400 mb-4" />
                      <p className="text-sm text-gray-700 text-left mb-4 leading-relaxed">
                        Estamos conduzindo uma pesquisa sobre a usabilidade do
                        catálogo web. Antes de prosseguir, leia atentamente
                        nossos termos de ética e responsabilidade.
                      </p>
                      <div className="bg-gray-100 leading-6 p-4 rounded-lg text-left outline-hidden text-xs text-gray-700 mb-8 border-l-4 border-green-500">
                        <p>
                          <strong>1.</strong> Respostas confidenciais e para uso
                          acadêmico.
                        </p>
                        <p>
                          <strong>2.</strong> Questionário anônimo, sem coleta
                          de dados pessoais.
                        </p>
                        <p>
                          <strong>3.</strong> Participação voluntária e
                          possibilidade de desistência.
                        </p>
                        <p>
                          <strong>4.</strong> Dados usados para melhorias no
                          catálogo.
                        </p>
                        <p>
                          <strong>5.</strong> Pesquisa ética, sem riscos aos
                          participantes.
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Agradecemos sua participação!
                      </p>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleAgree}
                          className="bg-green-500 text-white px-2 py-1 text-sm font-medium rounded-lg hover:bg-green-600 transition-all shadow-md"
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={handleBack}
                          className="text-gray-500 px-1 py-1 text-xs font-medium rounded-lg hover:bg-gray-200 transition-all shadow-md"
                        >
                          Voltar
                        </button>
                      </div>
                      <hr className="border-gray-400 mt-8 -mb-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/*Modal para exibição de sucesso ao cadastrar imagem */}
      {showSuccessUploadModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md text-sm text-center">
            <p>Imagem cadastrada com sucesso!</p>
            <button
              onClick={closeSuccessUploadModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/*Modal para exibição de erro ao cadastrar imagem */}
      {showErrorUploadModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md text-sm text-center">
            <p>Erro ao cadastrar imagem. Tente novamente.</p>
            <button
              onClick={closeErrorUploadModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal para upload de imagem excedendo limite */}
      {showUploadLimitModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 text-sm rounded-md text-center">
            <p>
              Você atingiu o limite máximo de 10 imagens. EXCLUA outras para
              continuar.
            </p>
            <button
              onClick={closeUploadLimitModal}
              className="bg-gray-300 px-4 py-2 rounded-md mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      {/* Modal para confirmar exclusão de imagem */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 text-sm rounded-md text-center">
            <p>Tem certeza que deseja excluir esta imagem?</p>
            <button
              onClick={confirmDeleteSlide}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2"
            >
              Sim
            </button>
            <button
              onClick={cancelDeleteSlide}
              className="bg-gray-300 px-4 py-2 rounded-md mt-4 ml-2"
            >
              Não
            </button>
          </div>
        </div>
      )}
      {/* Modal para exibição de sucesso ao excluir imagem */}
      {showSuccessDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 text-sm rounded-md text-center">
            <p>Imagem excluída com sucesso!</p>
            <button
              onClick={closeSuccessDeleteModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      {/* Modal para exibição de erro ao excluir imagem */}
      {showErrorDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 text-sm rounded-md text-center">
            <p>Erro ao excluir imagem. Tente novamente.</p>
            <button
              onClick={closeErrorDeleteModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaPrincipal;

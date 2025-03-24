import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faEye } from "@fortawesome/free-solid-svg-icons";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import fundo from "../../../assets/fundo.jpg";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import { FiTrash2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { collection, doc, deleteDoc, getDocs, query } from "firebase/firestore";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const TodasCategorias = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [bancas, setBancas] = useState([]);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedBanca, setSelectedBanca] = useState(null);

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
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

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

          const produtosData = banca.produtos || [];
          banca.vendedores = vendedoresData;
          banca.produtos = produtosData;
          bancasData.push(banca);
        }
        setBancas(bancasData);
        console.log("Bancas carregadas:", bancasData);
      } catch (error) {
        console.error("Erro ao buscar bancas:", error);
      }
    };

    fetchCategorias();
    fetchBancas();

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

  const filteredBancas = searchProduct
    ? bancas.filter((banca) =>
        banca.produtos.some(
          (produto) =>
            produto.nome &&
            produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
        )
      )
    : [];

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.produtos.some(
      (produto) =>
        produto.nome &&
        produto.nome.toLowerCase().includes(searchProduct.toLowerCase())
    )
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDeleteCategoria = (categoria) => {
    setCategoriaToDelete(categoria);
  };

  const cancelDeleteCategoria = () => {
    setCategoriaToDelete(null);
  };

  async function handleDeleteCategoria(categoria) {
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
      setCategoriaToDelete(null);

      console.log("Categoria e produtos excluídos com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir categoria e produtos:", error);
    }
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen text-gray-800 relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-800 min-h-screen bg-opacity-85 relative z-10">
        <MenuTopo />
        <div className="text-center text-green-100 py-12">
          <h1 className="text-sm uppercase font-bold mb-4">
            Catálogo de Categorias
          </h1>
          <p className="text-sm mb-6">
            Explore nossas incríveis categorias de produtos frescos e saudáveis
          </p>
          {user && user.role === "admin" && (
            <Link
              to="/novo"
              className="absolute left-6 bg-green-500 text-xs text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors z-10"
            >
              Cadastrar Produtos
            </Link>
          )}
        </div>
        <section className="bg-gray-400 bg-opacity-35 p-2  mb-12 rounded-lg w-full max-w-xl mx-auto flex justify-center items-center gap-2">
          <input
            className="w-full border-2 text-xs text-gray-500 rounded-lg h-8 px-3 outline-none"
            type="text"
            placeholder="Pesquisar por um produto..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
        </section>
        <div className="relative">
          {searchProduct && filteredBancas.length > 0 ? (
            <>
              <h2 className="text-xs mb-6 font-semibold uppercase text-center text-white">
                Bancas encontradas
              </h2>
              <div className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
                {filteredBancas.map((banca) => (
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
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {banca.vendedores.slice(0, 1).map((vendedor) => (
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
                              className="cursor-pointer bg-green-500 w-full text-white flex text-xs items-center justify-center gap-2 my-2 h-8 rounded-md hover:bg-green-700"
                            >
                              <FaWhatsapp size={12} color="#FFF" />
                              Conversar
                            </a>
                          </motion.div>
                        ))}
                        <div className="flex items-center justify-between mt-4">
                          <Link
                            to={`/bancas/${banca.id}`}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 text-xs focus:outline-none focus:shadow-outline transition-colors mr-2"
                          >
                            Acessar banca
                          </Link>
                          <button
                            type="button"
                            className="bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-between hover:bg-gray-900 text-xs focus:outline-none focus:shadow-outline transition-colors"
                            onClick={() =>
                              setSelectedBanca(
                                selectedBanca === banca.id ? null : banca.id
                              )
                            }
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
                          <div className="absolute top-full ml-4 mt-2 w-64 bg-gray-200 bg-opacity-95 rounded-md shadow-lg z-10 overflow-hidden">
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
              </div>
            </>
          ) : (
            searchProduct && (
              <div className="flex items-center justify-center min-h-[400px]">
                <section className="flex items-center justify-center p-4 bg-gray-400 bg-opacity-35 rounded-lg">
                  <p className="text-center text-gray-400 text-lg">
                    Nenhuma BANCA encontrada para o produto pesquisado.
                  </p>
                </section>
              </div>
            )
          )}
        </div>

        {searchProduct && filteredBancas.length > 0 ? (
          <>
            <h2 className="text-xs mb-16 mt-10 font-semibold uppercase text-center text-white">
              Categorias encontradas
            </h2>
          </>
        ) : null}
        <div className="grid grid-cols-1 gap-8 mt-2 md:grid-cols-2 lg:grid-cols-3 mx-6">
          {filteredCategorias.map((categoria) => (
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
                {categoria.produtos[0]?.images?.[0] && (
                  <img
                    src={categoria.produtos[0].images[0].url}
                    alt={categoria.nome}
                    className="w-full h-auto object-cover"
                    style={{ height: "220px" }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center transition-opacity opacity-0 hover:opacity-100">
                  {user && user.role === "admin" && (
                    <button
                      onClick={() => confirmDeleteCategoria(categoria)}
                      className="absolute bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                    >
                      <FiTrash2 size={20} color="#000" />
                    </button>
                  )}
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
                <h2 className="text-sm text-center uppercase font-bold mb-2 mt-2 text-gray-100">
                  {categoria.nome}
                </h2>
              </div>
            </motion.div>
          ))}
          <div className="grid-item mb-18"></div>
        </div>

        {!filteredCategorias.length && searchProduct && (
          <div className="flex items-center justify-center min-h-[400px]">
            <section className="flex items-center justify-center p-4 bg-gray-400 bg-opacity-35 rounded-lg">
              <p className="text-center text-gray-400 text-lg">
                Nenhuma CATEGORIA encontrada para o produto pesquisado.
              </p>
            </section>
          </div>
        )}

        <div className="mb-8 mt-8 flex justify-center space-x-4">
          <Link to="/Bancas">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="bg-green-700 text-white text-xs py-2 px-6 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
              Conheça todas as bancas
            </motion.button>
          </Link>
        </div>

        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToTop}
            className="text-xs mb-8 mt-8 ml-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors"
          >
            <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
            Voltar ao Topo
          </motion.button>
        )}
      </div>
      <Footer />

      {/* Modal de confirmação de exclusão */}
      {categoriaToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center text-sm justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 rounded-lg bg-opacity-95 p-8">
            <p className="text-sm text-center font-medium mb-4">
              Tem certeza que deseja excluir a categoria{" "}
              {categoriaToDelete.nome} e todos os seus produtos?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => handleDeleteCategoria(categoriaToDelete)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4"
              >
                Excluir
              </button>
              <button
                onClick={cancelDeleteCategoria}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodasCategorias;

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import fundo from "../../../assets/fundo.jpg";
import { FaWhatsapp } from "react-icons/fa";
import { RiCheckLine } from "react-icons/ri";
import { HiX, HiExclamationCircle } from "react-icons/hi";
import { AuthContext } from "../../../contexts/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Vendedor = () => {
  const { bancaId } = useParams();
  const { user } = useContext(AuthContext);
  const [banca, setBanca] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [produtosExistentes, setProdutosExistentes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [adicionadoModalVisible, setAdicionadoModalVisible] = useState(false);
  const [removidoModalVisible, setRemovidoModalVisible] = useState(false);
  const [limiteExcedidoModalVisible, setLimiteExcedidoModalVisible] =
    useState(false);
  const [produtoDuplicadoModalVisible, setProdutoDuplicadoModalVisible] =
    useState(false);
  const [produtoSelecionadoModalVisible, setProdutoSelecionadoModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        setProdutoSelecionadoModalVisible(true);
        return;
      }

      if (produtosAdicionados.length >= 24) {
        setLimiteExcedidoModalVisible(true);
        return;
      }

      const produtoId = produtoSelecionado;

      // Verificar se o produto já foi adicionado
      const produtoExistente = produtosAdicionados.find(
        (prod) => prod.id === produtoId
      );
      if (produtoExistente) {
        setProdutoDuplicadoModalVisible(true);
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

      setAdicionadoModalVisible(true);
      console.log("Produto adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
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
      setRemovidoModalVisible(true);
      console.log("Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen text-gray-800 relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-800 bg-opacity-70 min-h-screen h-full relative z-10 flex flex-col">
        <MenuTopo />
        <div className="container mx-auto py-8 flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="bg-gray-200 bg-opacity-85 rounded-lg shadow-md p-8">
              <h1 className="text-2xl uppercase text-center font-bold text-gray-800 mb-6">
                {banca.nome}
              </h1>
              <div className="mb-8">
                <h2 className="text-sm uppercase text-center font-semibold text-gray-800 mb-4">
                  Vendedores
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {vendedores.map((vendedor) => (
                    <div
                      key={vendedor.id}
                      className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transition duration-300 transform hover:scale-105"
                    >
                      <div className="w-48 h-48 mb-2 overflow-hidden rounded-full">
                        <img
                          src={
                            vendedor.images && vendedor.images.length > 0
                              ? vendedor.images[0].url
                              : "placeholder.jpg"
                          }
                          alt={`Imagem de perfil de ${vendedor.nome}`}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {vendedor.nome}
                      </h3>
                      <p className="text-gray-600 mb-1">{vendedor.cidade}</p>
                      <a
                        href={`https://api.whatsapp.com/send?phone=${vendedor?.whatsapp}&text= Olá ${vendedor?.nome}! vi sua ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block bg-green-500 text-white py-2 px-4 rounded-lg font-medium text-xs hover:bg-green-600"
                      >
                        Conversar com vendedor{" "}
                        <FaWhatsapp className="inline-block ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              {user?.role === "admin" && (
                <div className="mb-2">
                  <label
                    htmlFor="produto"
                    className="block text-sm font-medium"
                  >
                    Selecione um produto:
                  </label>
                  <select
                    id="produto"
                    onChange={handleProdutoChange}
                    value={produtoSelecionado}
                    className="border border-green-600 text-sm py-1 rounded text-green-700"
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
                  <button
                    className="bg-red-500 text-sm ml-4 text-white px-2 py-1 rounded-lg inline-flex items-center transition duration-300 hover:bg-red-600 focus:outline-none mt-4"
                    onClick={handleAddProduto}
                  >
                    Adicionar Produto
                  </button>
                </div>
              )}
              <div className="mt-2">
                <h2 className="text-sm uppercase text-center mb-4 mt-6 font-semibold text-gray-800">
                  Produtos Disponíveis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {produtosAdicionados.map((produto) => (
                    <div
                      key={produto.id}
                      className="bg-white rounded-lg shadow-md p-4 transition duration-300 transform hover:scale-105"
                    >
                      <h3 className="text-sm text-center font-semibold text-gray-800 mb-2">
                        {produto.nome}
                      </h3>
                      {produto.images && produto.images.length > 0 && (
                        <div className="w-full h-48 mb-2 overflow-hidden rounded-md">
                          <img
                            src={produto.images[0].url}
                            alt={`Imagem de ${produto.nome}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      {user?.role === "admin" && (
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded-lg font-medium text-sm hover:bg-red-600"
                          onClick={() => handleRemoverProduto(produto.id)}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className=" mb-8 mt-8 flex justify-center space-x-4">
                <Link to="/todascategorias">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    className="bg-green-700 text-white text-xs py-2 px-6 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
                    Conheça todas as categorias
                  </motion.button>
                </Link>
                <Link to="/bancas">
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
            </div>
          )}
          {/* Modal de produto adicionado */}
          {adicionadoModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                <RiCheckLine className="text-green-500 text-3xl mb-4" />
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Produto adicionado com sucesso!
                </p>
                <button
                  onClick={() => setAdicionadoModalVisible(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal de produto removido */}
          {removidoModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                <RiCheckLine className="text-green-500 text-4xl mb-4" />
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Produto removido com sucesso!
                </p>
                <button
                  onClick={() => setRemovidoModalVisible(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal de limite de produtos atingidos */}
          {limiteExcedidoModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Limite de 20 produtos atingido!
                </p>
                <button
                  onClick={() => setLimiteExcedidoModalVisible(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal de produto já foi adicionado */}
          {produtoDuplicadoModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                <div className="flex items-center justify-center rounded-full bg-red-500 text-white w-12 h-12 mb-6">
                  <HiX className="text-3xl" />
                </div>
                <p className="text-sm text-center font-semibold text-gray-800 mb-4">
                  Este produto já foi adicionado!
                </p>
                <button
                  onClick={() => setProdutoDuplicadoModalVisible(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-4"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal de produto não selecionado */}
          {produtoSelecionadoModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                <div className="flex items-center justify-center rounded-full bg-yellow-500 text-white w-12 h-12 mb-4">
                  <HiExclamationCircle className="text-3xl" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Selecione um produto antes de adicionar.
                </p>
                <button
                  onClick={() => setProdutoSelecionadoModalVisible(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mt-4"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Vendedor;

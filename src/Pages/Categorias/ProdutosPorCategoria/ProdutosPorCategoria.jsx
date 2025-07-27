import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../contexts/AuthContext";
import { db } from "../../../services/firebaseConnection";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import fundo from "../../../assets/fundo.jpg";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import SEO from "../../../components/SEO/SEO";
import {
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaArrowLeft,
  FaStore,
} from "react-icons/fa";
import PropTypes from "prop-types";
import React from "react";

/**
 * Componente para exibir imagem do produto
 */
const ProductImage = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-60 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
        <span className="text-white text-lg">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-60 overflow-hidden group">
      <motion.img
        key={currentImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        src={images[currentImageIndex].url}
        alt={`${name} - Imagem ${currentImageIndex + 1}`}
        className="object-cover w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-300"
      />

      {/* Overlay com nome do produto */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white font-bold text-lg text-center px-4">{name}</p>
      </div>

      {/* Navegação de imagens */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            →
          </button>

          {/* Indicadores de imagem */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

ProductImage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
    })
  ),
  name: PropTypes.string.isRequired,
};

/**
 * Componente para card de produto
 */
const ProductCard = ({ produto, onSelect, onDelete, isAdmin }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Clique no card do produto:", produto.id);
    onSelect(produto.id);
  };

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <section className="relative bg-gradient-to-br from-green-300 to-green-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-green-400">
        <ProductImage images={produto.images} name={produto.nome} />

        {/* Botão de deletar para admin */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(produto);
            }}
            className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600/90 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
            aria-label={`Excluir ${produto.nome}`}
          >
            <FaTrashAlt size={16} />
          </button>
        )}
      </section>
    </div>
  );
};

ProductCard.propTypes = {
  produto: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    images: PropTypes.array,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

ProductCard.defaultProps = {
  isAdmin: false,
};

/**
 * Componente para lista de bancas
 */
const BancasList = ({ bancas, produtoName }) => {
  return (
    <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <FaStore className="text-green-400" />
        Bancas que vendem {produtoName}
      </h3>

      {bancas.length > 0 ? (
        <div className="space-y-2">
          {bancas.map((banca) => (
            <div key={banca.id}>
              <Link
                to={`/bancas/${banca.id}`}
                className="block text-green-400 hover:text-white hover:bg-green-500/20 rounded-lg px-3 py-2 transition-colors duration-200 text-sm font-medium"
              >
                {banca.nome || "Nome da banca não disponível"}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-sm text-center py-4">
          Este produto ainda não faz parte de nenhuma banca.
        </p>
      )}
    </div>
  );
};

BancasList.propTypes = {
  bancas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nome: PropTypes.string,
    })
  ).isRequired,
  produtoName: PropTypes.string.isRequired,
};

/**
 * Componente de busca
 */
const SearchBar = React.memo(({ searchTerm, onSearchChange }) => {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // A busca é automática, não precisa fazer nada aqui
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm p-2 rounded-xl w-full max-w-xl mx-auto mb-16 border border-white/20">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-colors duration-200"
            placeholder="Digite para buscar produtos..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </section>
  );
});

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchTerm: "",
};

SearchBar.displayName = "SearchBar";

/**
 * Componente de estatísticas
 */
const StatsSection = ({ produtos, categoria }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-white mb-2">
        Catálogo de {categoria.nome}
      </h1>
      <p className="text-gray-300 mb-4">
        {produtos.length} produto{produtos.length !== 1 ? "s" : ""} encontrado
        {produtos.length !== 1 ? "s" : ""}
      </p>
    </motion.div>
  );
};

StatsSection.propTypes = {
  produtos: PropTypes.array.isRequired,
  categoria: PropTypes.shape({
    nome: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * Página principal de produtos por categoria
 */
const ProdutosPorCategoria = () => {
  const { idCategoria } = useParams();
  const { user } = useContext(AuthContext);
  const [allProdutos, setAllProdutos] = useState([]); // Todos os produtos
  const [produtos, setProdutos] = useState([]); // Produtos filtrados
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState({ nome: "" });
  const [bancasProduto, setBancasProduto] = useState([]);
  const [selectedProdutoId, setSelectedProdutoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    produto: null,
  });
  const listRef = useRef(null);

  // Buscar categoria
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const docRef = doc(db, "categorias", idCategoria);
        const categoriaDoc = await getDoc(docRef);
        if (categoriaDoc.exists()) {
          const categoriaData = categoriaDoc.data();
          setCategoria(categoriaData);
        }
      } catch (error) {
        setError("Erro ao buscar categoria");
        console.error("Erro ao buscar categoria:", error);
      }
    };
    fetchCategoria();
  }, [idCategoria]);

  // Buscar produtos
  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const q = query(collection(db, `categorias/${idCategoria}/produtos`));
      const produtosSnapshot = await getDocs(q);
      const produtosData = produtosSnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        created: doc.data().created,
        images: doc.data().images || [],
      }));

      produtosData.sort((a, b) => a.nome.localeCompare(b.nome));
      setAllProdutos(produtosData);
    } catch (error) {
      setError("Erro ao buscar produtos");
      console.error("Erro ao buscar produtos por categoria:", error);
    } finally {
      setLoading(false);
    }
  }, [idCategoria]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Filtrar produtos em tempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setProdutos(allProdutos);
    } else {
      const filtered = allProdutos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProdutos(filtered);
    }
  }, [searchTerm, allProdutos]);

  // Buscar bancas por produto
  const fetchBancasPorProduto = useCallback(async (produtoId) => {
    try {
      console.log("Buscando bancas para o produto:", produtoId);
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

        // Verificar se a banca tem produtos
        const produtosData = banca.produtos || [];
        console.log(`Banca ${banca.nome} tem produtos:`, produtosData);

        // Verificar se algum produto da banca corresponde ao produtoId
        const temProduto = produtosData.some((produto) => {
          console.log(`Comparando produto ${produto.id} com ${produtoId}`);
          return produto.id === produtoId;
        });

        if (temProduto) {
          console.log(`Banca ${banca.nome} vende o produto ${produtoId}`);
          banca.vendedores = vendedoresData;
          banca.produtos = produtosData;
          bancasData.push(banca);
        }
      }

      console.log("Bancas encontradas:", bancasData);
      setBancasProduto(bancasData);
    } catch (error) {
      console.error("Erro ao buscar bancas por produto:", error);
      setBancasProduto([]);
    }
  }, []);

  // Deletar produto
  const handleDeleteProduto = useCallback(async () => {
    if (!deleteModal.produto) return;

    try {
      await deleteDoc(
        doc(db, `categorias/${idCategoria}/produtos`, deleteModal.produto.id)
      );
      setProdutos(
        produtos.filter((item) => item.id !== deleteModal.produto.id)
      );
      if (selectedProdutoId === deleteModal.produto.id) {
        setSelectedProdutoId(null);
      }
      setDeleteModal({ isOpen: false, produto: null });
    } catch (error) {
      setError("Erro ao excluir produto");
      console.error("Erro ao excluir produto:", error);
    }
  }, [deleteModal.produto, idCategoria, produtos, selectedProdutoId]);

  // Handlers
  const handleProdutoClick = useCallback(
    async (produtoId) => {
      console.log("Clique no produto:", produtoId);
      console.log("Produto selecionado atual:", selectedProdutoId);

      if (selectedProdutoId === produtoId) {
        console.log("Fechando detalhes do produto");
        setSelectedProdutoId(null);
      } else {
        console.log("Abrindo detalhes do produto:", produtoId);
        setSelectedProdutoId(produtoId);
        await fetchBancasPorProduto(produtoId);
      }
    },
    [selectedProdutoId, fetchBancasPorProduto]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleDeleteClick = useCallback((produto) => {
    setDeleteModal({ isOpen: true, produto });
  }, []);

  // Click outside para fechar detalhes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setSelectedProdutoId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <SEO
        title={`Produtos ${categoria.nome}`}
        description={`Descubra os melhores produtos de ${categoria.nome} na Feira Livre de Buritizeiro. Produtos frescos e de qualidade direto dos produtores locais.`}
        keywords={[
          categoria.nome,
          "produtos",
          "feira buritizeiro",
          "frescos",
          "qualidade",
        ]}
        image="/logo.png"
        url={window.location.href}
        type="website"
      />

      <div
        className="bg-cover bg-center min-h-screen text-gray-800 relative overflow-hidden"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div className="bg-gray-900/90 min-h-screen relative overflow-hidden">
          <MenuTopo />

          <div className="container mx-auto py-8 px-4 overflow-hidden">
            {/* Header e Estatísticas */}
            <StatsSection produtos={produtos} categoria={categoria} />

            {/* Barra de Busca */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />

            {/* Mensagem de Erro */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6 text-center"
                >
                  <p className="text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-12"
              >
                <div className="text-center">
                  <FaSpinner className="animate-spin text-white text-3xl mx-auto mb-4" />
                  <p className="text-white">Carregando produtos...</p>
                </div>
              </motion.div>
            )}

            {/* Grid de Produtos */}
            {!loading && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                ref={listRef}
              >
                {produtos.length > 0 ? (
                  produtos.map((produto) => (
                    <div key={produto.id}>
                      <ProductCard
                        produto={produto}
                        onSelect={handleProdutoClick}
                        onDelete={handleDeleteClick}
                        isAdmin={user?.role === "admin"}
                      />

                      {selectedProdutoId === produto.id && (
                        <BancasList
                          bancas={bancasProduto}
                          produtoName={produto.nome}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-300 text-lg">
                      {searchTerm
                        ? `Nenhum produto encontrado para "${searchTerm}"`
                        : "Nenhum produto disponível nesta categoria"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Botão Voltar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Link
                to="/todascategorias"
                className="inline-flex mt-10 items-center text-sm space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaArrowLeft />
                Voltar para todas as categorias
              </Link>
            </motion.div>
          </div>

          <Footer />

          {/* Modal de Confirmação de Exclusão */}
          <ConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, produto: null })}
            onConfirm={handleDeleteProduto}
            title="Confirmar Exclusão"
            message={`Você tem certeza que deseja excluir o produto "${deleteModal.produto?.nome}"?`}
            confirmText="Excluir"
            cancelText="Cancelar"
            type="danger"
          />
        </div>
      </div>
    </>
  );
};

ProdutosPorCategoria.displayName = "ProdutosPorCategoria";

export default ProdutosPorCategoria;

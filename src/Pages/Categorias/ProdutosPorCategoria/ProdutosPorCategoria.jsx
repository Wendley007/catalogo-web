import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import MenuTopo from "../../../components/MenuTopo";
import Footer from "../../../components/Footer";
import fundo from "../../../assets/fundo.jpg";
import { AuthContext } from "../../../contexts/AuthContext";
import { FiTrash2 } from "react-icons/fi";

const ProdutosPorCategoria = () => {
  const { idCategoria } = useParams();
  const { user } = useContext(AuthContext);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState({ nome: "" });
  const [bancasProduto, setBancasProduto] = useState([]);
  const [selectedProdutoId, setSelectedProdutoId] = useState(null);

  const listRef = useRef(null);

  // Função para buscar a categoria
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
        console.error("Erro ao buscar categoria:", error);
      }
    };
    fetchCategoria();
  }, [idCategoria]);

  // Função para buscar produtos por categoria
  useEffect(() => {
    const fetchProdutosPorCategoria = async () => {
      try {
        let q = query(collection(db, `categorias/${idCategoria}/produtos`));
        if (searchTerm) {
          q = query(
            collection(db, `categorias/${idCategoria}/produtos`),
            where("nome", "==", searchTerm)
          );
        }

        const produtosSnapshot = await getDocs(q);
        const produtosData = produtosSnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          created: doc.data().created,
          images: doc.data().images,
        }));

        produtosData.sort((a, b) => a.nome.localeCompare(b.nome));
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao buscar produtos por categoria:", error);
      }
    };
    fetchProdutosPorCategoria();
  }, [idCategoria, searchTerm]);

  // Função para buscar bancas que possuem o produto
  const fetchBancasPorProduto = async (produtoId) => {
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

        // Filtrar produtos na banca para encontrar o produtoId
        const produtosData = banca.produtos || [];
        if (produtosData.some((produto) => produto.id === produtoId)) {
          banca.vendedores = vendedoresData;
          banca.produtos = produtosData;
          bancasData.push(banca);
        }
      }

      setBancasProduto(bancasData);
    } catch (error) {
      console.error("Erro ao buscar bancas por produto:", error);
    }
  };

  // Função para deletar produto
  async function handleDeleteProduto(produto, e) {
    e.stopPropagation(); // Impede que o clique no botão acione o clique no card
    try {
      await deleteDoc(
        doc(db, `categorias/${idCategoria}/produtos`, produto.id)
      );
      setProdutos(produtos.filter((item) => item.id !== produto.id));
      if (selectedProdutoId === produto.id) {
        setSelectedProdutoId(null); // Limpa o produto selecionado após a exclusão
      }
      console.log("Produto excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  }

  // Função de busca de produto por nome
  const handleSearchProduto = async () => {
    try {
      let q = query(collection(db, `categorias/${idCategoria}/produtos`));
      if (searchTerm) {
        const searchTermUpperCase = searchTerm.toUpperCase();
        q = query(
          collection(db, `categorias/${idCategoria}/produtos`),
          where("nome", "==", searchTermUpperCase)
        );
      }

      const produtosSnapshot = await getDocs(q);
      const produtosData = produtosSnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        created: doc.data().created,
        images: doc.data().images,
      }));

      produtosData.sort((a, b) => a.nome.localeCompare(b.nome));
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos por categoria:", error);
    }
  };

  const handleProdutoClick = async (produtoId) => {
    if (selectedProdutoId === produtoId) {
      // Fecha o card se o mesmo produto for clicado novamente
      setSelectedProdutoId(null);
    } else {
      // Abre o card e busca as bancas
      setSelectedProdutoId(produtoId);
      await fetchBancasPorProduto(produtoId);
    }
  };

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
    <div
      className="bg-cover bg-center min-h-screen text-gray-800 relative"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="bg-gray-800 min-h-screen bg-opacity-85 h-full relative z-10">
        <MenuTopo />
        <h1 className="font-bold text-center text-white mt-10 text-sm uppercase mb-10">
          Catálogo de {categoria.nome}
        </h1>

        <section className="bg-gray-400 bg-opacity-35 p-2 rounded-lg w-full max-w-xl mx-auto flex mb-14 justify-center items-center gap-2">
          <input
            className="w-full border-2 text-xs rounded-lg h-8 px-3 outline-none"
            placeholder="Digite o nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchProduto();
              }
            }}
          />
          <button
            className="bg-red-500 h-8 px-8 rounded-lg hover:bg-red-600 text-white font-medium text-xs"
            onClick={handleSearchProduto}
          >
            Buscar
          </button>
        </section>

        <main className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mx-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="cursor-pointer"
              onClick={() => handleProdutoClick(produto.id)}
            >
              <section className="relative bg-gradient-to-br from-green-300 to-green-900 text-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-60 overflow-hidden relative">
                  {produto.images.map((image) => (
                    <img
                      key={image.uid}
                      src={image.url}
                      alt={image.name}
                      className="object-cover w-full h-full transform scale-100 hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <p className="text-white font-bold text-lg">{produto.nome}</p>
                </div>
                {user && user.role === "admin" && (
                  <button
                    onClick={(e) => handleDeleteProduto(produto, e)}
                    className="absolute bg-white bg-opacity-50 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                  >
                    <FiTrash2 size={20} color="#000" />
                  </button>
                )}
              </section>
              {selectedProdutoId === produto.id && (
                <div
                  ref={listRef}
                  className="p-4 bg-gray-800 bg-opacity-80 text-white rounded-lg text-center border-gray-200 shadow-md"
                >
                  {bancasProduto.length > 0 ? (
                    <ul>
                      {bancasProduto.map((banca) => (
                        <li key={banca.id} className="mb-2">
                          <Link
                            to={`/bancas/${banca.id}`}
                            className="text-green-400 justify-center hover:bg-gray-700  hover:text-white transition duration-300 uppercase text-xs"
                          >
                            {banca.nome || "Nome da banca não disponível"}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">
                      Este produto ainda não faz parte de nenhuma banca.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </main>

        <button className="mt-8 text-xs mx-auto mb-4 block bg-red-500 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors">
          <Link to="/Todascategorias" className="text-white">
            Voltar para todas as categorias
          </Link>
        </button>
        <Footer />
      </div>
    </div>
  );
};

export default ProdutosPorCategoria;

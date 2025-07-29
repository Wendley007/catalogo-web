/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import MenuTopo from "../../components/MenuTopo/MenuTopo";
import fundo from "../../assets/fundo.jpg";
import Footer from "../../components/Footer";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SEO from "../../components/SEO/SEO";

const Avaliacao = () => {
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);
  const [catalogo, setCatalogo] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [dificuldades, setDificuldades] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [avaliacoesCount, setAvaliacoesCount] = useState(0);
  const [nomeError, setNomeError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const fetchAvaliacoesCount = async () => {
      const querySnapshot = await getDocs(collection(db, "avaliacoes"));
      setAvaliacoesCount(querySnapshot.size);
      if (querySnapshot.size >= 100) setLimiteAtingido(true);
    };
    fetchAvaliacoesCount();
  }, []);

  const checkUserExists = async (email, nome) => {
    const usersQuery = query(
      collection(db, "avaliacoes"),
      where("email", "==", email),
      where("nome", "==", nome)
    );
    const usersSnapshot = await getDocs(usersQuery);
    return !usersSnapshot.empty;
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value);
    setNomeError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nomeValido = nome.trim().split(" ").length > 1;
    if (!nomeValido) {
      setNomeError("Por favor, insira um nome e sobrenome válidos.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }

    if (limiteAtingido) return;

    const userExists = await checkUserExists(email, nome);
    if (userExists) {
      setErrorMessage("Este nome ou e-mail já avaliou.");
      return;
    }

    try {
      await addDoc(collection(db, "avaliacoes"), {
        nome,
        email,
        avaliacao,
        catalogo,
        experiencia,
        dificuldades,
        data: new Date().toISOString(),
      });

      setSuccessMessage(true);
      setNome("");
      setEmail("");
      setAvaliacao(0);
      setCatalogo("");
      setExperiencia("");
      setDificuldades("");
      setErrorMessage("");
      setAvaliacoesCount((prevCount) => prevCount + 1);
    } catch (error) {
      setErrorMessage("Erro ao enviar sua avaliação. Tente novamente.");
    }
  };

  return (
    <>
      <SEO
        title="Avalie a Feira Livre de Buritizeiro"
        description="Deixe sua avaliação sobre a Feira Livre de Buritizeiro. Ajude a melhorar a experiência dos usuários."
      />
      <div
        className="bg-cover bg-center min-h-screen text-gray-800 relative"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div className="bg-gray-800 bg-opacity-65 min-h-screen h-full relative z-10">
          <MenuTopo />
          <div className="max-w-md mx-auto p-8 rounded-xl mt-2 mb-4 bg-gray-200 bg-opacity-80 shadow-md">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-green-700 font-semibold text-center uppercase mb-4"
            >
              Avalie a Feira Livre de Buritizeiro
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-xs font-medium uppercase mb-2 text-center text-gray-800"
                >
                  Nome e Sobrenome:
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={handleNomeChange}
                  className="w-full mt-1 px-2 py-1 text-gray-500 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nome e Sobrenome"
                  required
                />
                {nomeError && (
                  <p className="text-xs text-red-500">{nomeError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase mb-2 text-center text-gray-800"
                >
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full mt-1 px-2 py-1 text-gray-500 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Email"
                  required
                />
                {emailError && (
                  <p className="text-xs text-red-500">{emailError}</p>
                )}
              </div>

              {/* Perguntas adicionais */}
              <div>
                <label
                  htmlFor="catalogo"
                  className="block text-xs font-medium uppercase mb-2 text-center text-gray-800"
                >
                  Qual sua familiaridade com catálogos de feiras livres?
                </label>
                <select
                  id="catalogo"
                  value={catalogo}
                  onChange={(e) => setCatalogo(e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-gray-500 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Alta">Alta</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Pouca">Pouca</option>
                  <option value="Nenhuma">Nenhuma</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="experiencia"
                  className="block text-xs font-medium uppercase mb-2 text-center text-gray-800"
                >
                  Como você avalia sua experiência geral ao utilizar o catálogo?
                </label>
                <select
                  id="experiencia"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-gray-500 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Excelente">Excelente</option>
                  <option value="Muito boa">Muito boa</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dificuldades"
                  className="block text-xs font-medium uppercase mb-2 text-center text-gray-800"
                >
                  Quais dificuldades encontradas no catálogo?
                </label>
                <select
                  id="dificuldades"
                  value={dificuldades}
                  onChange={(e) => setDificuldades(e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-gray-500 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Funcionalidades">Funcionalidades</option>
                  <option value="Navegacao">Navegação confusa</option>
                  <option value="Problemas">Problemas técnicos</option>
                  <option value="Nenhuma">Nenhuma dificuldade</option>
                </select>
              </div>

              <div className="text-center">
                <label className="block text-xs font-medium uppercase mb-2">
                  Avaliação
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`cursor-pointer text-2xl ${
                        star <= avaliacao ? "text-yellow-500" : "text-gray-500"
                      } hover:text-yellow-400`}
                      onClick={() =>
                        setAvaliacao(star === avaliacao ? 0 : star)
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {/* Botão de Enviar Avaliação */}
                <button
                  type="submit"
                  className="w-full bg-green-500 text-sm text-white py-2 px-2 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Enviar Avaliação
                </button>

                {/* Mensagem de erro */}
                {errorMessage && (
                  <p className="text-xs text-red-500 text-center">
                    {errorMessage}
                  </p>
                )}

                {/* Botão para Página Principal */}
                <Link to="/Paginaprincipal">
                  <motion.button
                    className="flex items-center justify-center w-full py-1 px-1 border border-transparent text-xs rounded-xl text-gray-700 bg-opacity-65 bg-gray-300 hover:bg-gray-400"
                    aria-label="Ir para a Página Principal"
                  >
                    {" "}
                    Página Principal
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </motion.button>
                </Link>

                {/* Botão de Resultados (visível apenas para admin) */}
                {user?.role === "admin" && (
                  <Link
                    to="/resultados"
                    className="flex items-center justify-center w-full py-1 px-1 border border-transparent text-xs rounded-xl text-gray-700 bg-opacity-55 bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out"
                  >
                    Resultados
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </form>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-80 flex items-center justify-center z-20"
              >
                <div className="bg-white p-6 text-sm uppercase rounded-lg text-center text-green-700">
                  <p className="font-bold">Avaliação enviada com sucesso!</p>
                  <button
                    className="mt-4 text-sm text-white bg-green-500 py-1 px-2 rounded-md"
                    onClick={() => setSuccessMessage(false)}
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-80 flex items-center justify-center z-20"
              >
                <div className="bg-white p-6 text-sm uppercase rounded-lg text-center text-red-500">
                  <p className="font-bold">Erro ao enviar avaliação!</p>
                  <button
                    className="mt-4 text-sm text-white bg-red-500 py-1 px-2 rounded-md"
                    onClick={() => setErrorMessage(false)}
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            )}

            {limiteAtingido && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-gray-700 bg-opacity-80 flex items-center justify-center z-20"
              >
                <div className="bg-white p-6 rounded-lg text-red-700">
                  <p className="font-bold">
                    O limite de 100 avaliações foi atingido!
                  </p>
                  <button
                    className="mt-4 text-sm text-white bg-gray-700 py-1 px-2 rounded-md"
                    onClick={() => setLimiteAtingido(false)}
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Avaliacao;

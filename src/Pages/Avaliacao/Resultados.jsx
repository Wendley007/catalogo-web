import { useEffect, useState, useMemo, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { motion } from "framer-motion";
import MenuTopo from "../../components/MenuTopo/MenuTopo";
import fundo from "../../assets/fundo.jpg";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import SEO from "../../components/SEO/SEO";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const Resultados = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "avaliacoes"));
        const avaliacoesData = querySnapshot.docs.map((doc) => doc.data());
        setAvaliacoes(avaliacoesData);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvaliacoes();
  }, []);

  const data = useMemo(() => {
    if (avaliacoes.length === 0) return null;

    const avaliacoesPorEstrela = [0, 0, 0, 0, 0];
    const catalogoContagem = { Alta: 0, Moderada: 0, Pouca: 0, Nenhuma: 0 };
    const experienciaContagem = {
      Excelente: 0,
      "Muito boa": 0,
      Regular: 0,
      Ruim: 0,
    };
    const dificuldadesContagem = {
      Funcionalidades: 0,
      Navegacao: 0,
      Problemas: 0,
      Nenhuma: 0,
    };

    avaliacoes.forEach((avaliacao) => {
      if (avaliacao.avaliacao >= 1 && avaliacao.avaliacao <= 5) {
        avaliacoesPorEstrela[avaliacao.avaliacao - 1] += 1;
      }
      if (avaliacao.catalogo in catalogoContagem) {
        catalogoContagem[avaliacao.catalogo] += 1;
      }
      if (avaliacao.experiencia in experienciaContagem) {
        experienciaContagem[avaliacao.experiencia] += 1;
      }
      if (avaliacao.dificuldades in dificuldadesContagem) {
        dificuldadesContagem[avaliacao.dificuldades] += 1;
      }
    });

    return {
      estrelas: {
        datasets: [
          {
            data: avaliacoesPorEstrela,
            backgroundColor: [
              "#E63946",
              "#F4A261",
              "#E9C46A",
              "#2A9D8F",
              "#264653",
            ],
          },
        ],
        labels: [
          "1 Estrela",
          "2 Estrelas",
          "3 Estrelas",
          "4 Estrelas",
          "5 Estrelas",
        ],
      },
      catalogo: {
        datasets: [
          {
            data: Object.values(catalogoContagem),
            backgroundColor: ["#264653", "#2A9D8F", "#E76F51", "#F4A261"],
          },
        ],
        labels: Object.keys(catalogoContagem),
      },
      experiencia: {
        datasets: [
          {
            data: Object.values(experienciaContagem),
            backgroundColor: ["#264653", "#2A9D8F", "#E76F51", "#F4A261"],
          },
        ],
        labels: Object.keys(experienciaContagem),
      },
      dificuldades: {
        datasets: [
          {
            data: Object.values(dificuldadesContagem),
            backgroundColor: ["#264653", "#2A9D8F", "#E76F51", "#F4A261"],
          },
        ],
        labels: Object.keys(dificuldadesContagem),
      },
    };
  }, [avaliacoes]);

  const renderChartCard = useCallback(
    (title, chartData) => (
      <motion.div
        className="bg-gray-200 bg-opacity-80 rounded-lg shadow p-4 relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-700 text-center ml-32 mb-4">
          {title}
        </h3>
        <div className="absolute top-2 left-2 bg-gray-300 bg-opacity-85 p-2 rounded-md shadow">
          {chartData.labels.map((label, index) => (
            <div key={index} className="flex items-center mb-2">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                }}
              ></span>
              <span className="text-xs text-gray-500">
                {label}:{" "}
                <span className="font-semibold">
                  {chartData.datasets[0].data[index]}
                </span>
              </span>
            </div>
          ))}
        </div>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1) + "%";
                  return percentage;
                },
                color: "#fff",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          }}
          style={{ maxHeight: "280px", maxWidth: "280px", marginLeft: "114px" }}
        />
      </motion.div>
    ),
    []
  );

  return (
    <div
      className="bg-cover bg-center min-h-screen text-gray-800"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <SEO
        title="Resultados das Avaliações"
        description="Veja os resultados detalhados das avaliações realizadas sobre o catálogo de feiras livres."
      />
      <div className="bg-gray-800 bg-opacity-75 min-h-screen">
        <MenuTopo />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-sm uppercase font-medium text-center text-white mb-8">
            Resultados das Avaliações
          </h1>
          <h4 className="text-xs uppercase font-medium text-center text-gray-300 mb-8">
            Total de respostas:{" "}
            <span className="font-bold">{avaliacoes.length}</span>
          </h4>
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <FaSpinner className="animate-spin text-green-400 text-4xl" />
              <span className="text-gray-300 mt-2 text-sm">
                Aguarde, carregando os resultados...
              </span>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {renderChartCard(
                "Qual sua familiaridade com catálogos de feiras livres?",
                data.catalogo
              )}
              {renderChartCard(
                "Como você avalia sua experiência geral ao utilizar o catálogo?",
                data.experiencia
              )}
              {renderChartCard(
                "Quais dificuldades encontradas no catálogo?",
                data.dificuldades
              )}
              {renderChartCard("Distribuição das Estrelas", data.estrelas)}
            </div>
          ) : (
            <p className="text-center text-white">Nenhum dado encontrado.</p>
          )}
          <div className="flex justify-center items-center space-x-4 mt-5">
            <Link to="/Paginaprincipal">
              <motion.button
                className="flex items-center justify-center w-full py-1 px-2 border border-transparent text-xs rounded-xl text-white bg-opacity-65 bg-green-600 hover:bg-gray-500"
                aria-label="Ir para a Página Principal"
              >
                <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
                Página Principal
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Resultados;

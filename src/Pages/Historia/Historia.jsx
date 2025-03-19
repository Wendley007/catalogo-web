import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import fundo from "../../assets/fundo.jpg";

const Historia = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Função para rolar até o topo da página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Adiciona/remova evento de rolagem para exibir o botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Fundo e estrutura principal */}
      <div
        className="bg-gradient-to-r from-purple-700 via-pink-500 to-orange-400 text-white bg-cover bg-center min-h-screen"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div className="bg-black min-h-screen bg-opacity-75 relative z-10">
          <MenuTopo />

          {/* Conteúdo da página */}
          <div className="container mx-auto py-12 flex flex-col md:flex-row items-center">
            {/* Seção lateral: Informações sobre a feira */}
            <aside className="w-full md:w-1/3 text-center p-4 border-t border-gray-500">
              <h2 className="text-lg md:text-lg lg:text-xl font-bold mb-4 text-yellow-300">
                Feira de Buritizeiro
              </h2>
              <p className="text-sm leading-relaxed text-justify mb-4">
                A feira livre de Buritizeiro, localizada em Minas Gerais, ocorre
                aos domingos, das seis horas da manhã ao meio-dia. Situada no
                centro da cidade, ocupa uma área de aproximadamente um hectare,
                delimitada pelas ruas Melchior Roquete, Prefeito Antônio Cândido
                e José Vicente. O terreno, de natureza arenosa, é embelezado por
                mangueiras de grande porte que se distribuem ao longo do espaço,
                conferindo um charme único ao ambiente.
              </p>
              <p className="text-sm leading-relaxed text-justify">
                Essa feira, realizada no mesmo local há mais de 40 anos, carrega
                uma rica história que tem sido registrada pelos olhares atentos
                dos indivíduos que, de diferentes formas, participam de sua
                trajetória e da emancipação deste importante patrimônio cultural
                e social da cidade.
              </p>
            </aside>

            {/* Conteúdo principal */}
            <div className="w-full md:w-2/3 border-l border-gray-500 p-4 relative">
              <h1 className="text-lg md:text-lg lg:text-xl font-bold mb-4 text-yellow-300">
                Mercado Municipal: Transformação na Feira Livre
              </h1>
              <p className="text-sm md:text-sm lg:text-sm leading-relaxed text-justify mb-4">
                O Mercado Municipal representa a nova fase da feira, contando
                com 32 boxes projetados para atender a uma ampla variedade de
                necessidades comerciais. Entre as inovações, destacam-se o
                espaço gourmet, áreas estratégicas para açougues e peixarias,
                quiosques na praça, um espaço dedicado ao artesanato e amplas
                áreas destinadas às bancas móveis.
              </p>
              <p className="text-sm md:text-sm lg:text-sm leading-relaxed text-justify mb-4">
                O empreendimento comporta até 45 operações comerciais, todas
                rigorosamente alinhadas às exigências sanitárias vigentes. A
                renovação da praça trouxe melhorias significativas, incluindo
                calçamento, iluminação, sinalização, sanitários modernos, ponto
                de ônibus, áreas gramadas e arborização, substituindo as antigas
                barracas, bancas e tendas de forma funcional e atrativa.
              </p>
              <p className="text-sm md:text-sm lg:text-sm leading-relaxed text-justify">
                Essa transformação beneficia diretamente feirantes, vendedores
                ambulantes e pequenos produtores rurais, promovendo um ambiente
                favorável ao trabalho e ao empreendedorismo. Priorizamos o
                conforto, a comodidade e a higiene dos consumidores, criando um
                espaço ideal para o desenvolvimento econômico e social da
                comunidade.
              </p>
              <p className="text-sm md:text-sm lg:text-sm leading-relaxed text-justify">
                Convidamos você a conhecer o Mercado Municipal e desfrutar de
                uma experiência única, que combina compras, lazer e incentivo ao
                empreendedorismo local, no coração de Buritizeiro.
              </p>
            </div>
          </div>

          {/* Botão para voltar ao topo */}
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={scrollToTop}
              className="absolute bottom-4 right-4 text-xs bg-red-500 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:shadow-outline transition-colors"
            >
              <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
              Voltar ao Topo
            </motion.button>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Historia;

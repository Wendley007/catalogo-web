import banner from "../../assets/banner.jpg";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

import { ArrowUp, MapPin, Clock, Calendar } from "lucide-react";

const Historia = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const timeline = [
    {
      year: "1980s",
      title: "Início da Tradição",
      description:
        "A feira livre de Buritizeiro começou suas atividades no centro da cidade, ocupando o mesmo local há mais de 40 anos.",
    },
    {
      year: "2000s",
      title: "Crescimento da Comunidade",
      description:
        "A feira se consolidou como ponto de encontro da comunidade, reunindo produtores locais e moradores.",
    },
    {
      year: "2020s",
      title: "Modernização",
      description:
        "Implementação do Mercado Municipal com 32 boxes, melhorando a infraestrutura e condições sanitárias.",
    },
  ];

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
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Info size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
                Nossa História
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                Mais de 40 anos de tradição, comunidade e produtos frescos no
                coração de Buritizeiro
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                  Feira de Buritizeiro
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin
                      className="text-green-600 mt-1 min-w-[20px]"
                      size={20}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Localização
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Centro da cidade, delimitada pelas ruas Melchior
                        Roquete, Prefeito Antônio Cândido e José Vicente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="text-green-600 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-gray-900">Horário</h3>
                      <p className="text-gray-600 text-sm">
                        Domingos das 6h às 12h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="text-green-600 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-gray-900">Tradição</h3>
                      <p className="text-gray-600 text-sm">
                        Mais de 40 anos no mesmo local
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 leading-relaxed">
                    O terreno arenoso é embelezado por mangueiras de grande
                    porte que conferem um charme único ao ambiente.
                  </p>
                </div>
              </div>
            </aside>

            <article className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                  Mercado Municipal: Uma Nova Era
                </h2>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <p>
                    O Mercado Municipal representa a nova fase da feira,
                    contando com
                    <strong> 32 boxes</strong> projetados para atender a uma
                    ampla variedade de necessidades comerciais. Entre as
                    inovações, destacam-se o espaço gourmet, áreas estratégicas
                    para açougues e peixarias, quiosques na praça, um espaço
                    dedicado ao artesanato e amplas áreas destinadas às bancas
                    móveis.
                  </p>

                  <p>
                    O empreendimento comporta até{" "}
                    <strong>45 operações comerciais</strong>, todas
                    rigorosamente alinhadas às exigências sanitárias vigentes. A
                    renovação da praça trouxe melhorias significativas,
                    incluindo calçamento, iluminação, sinalização, sanitários
                    modernos, ponto de ônibus, áreas gramadas e arborização.
                  </p>

                  <p>
                    Essa transformação beneficia diretamente feirantes,
                    vendedores ambulantes e pequenos produtores rurais,
                    promovendo um ambiente favorável ao trabalho e ao
                    empreendedorismo. Priorizamos o conforto, a comodidade e a
                    higiene dos consumidores, criando um espaço ideal para o
                    desenvolvimento econômico e social da comunidade.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 bg-clip-text text-transparent mb-6">
                  Linha do Tempo
                </h2>

                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                              {item.year}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Venha Conhecer o Mercado Municipal
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Convidamos você a conhecer o Mercado Municipal e desfrutar de
                  uma experiência única, que combina compras, lazer e incentivo
                  ao empreendedorismo local, no coração de Buritizeiro.
                </p>
                <button
                  onClick={scrollToTop}
                  className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                >
                  <ArrowUp size={20} />
                  <span>Voltar ao Topo</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Historia;

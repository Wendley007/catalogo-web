import banner from "../../assets/banner.jpg";
import MenuTopo from "../../components/MenuTopo/MenuTopo";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../../components/SEO/SEO";

import {
  ArrowUp,
  MapPin,
  Clock,
  Calendar,
  Leaf,
  Award,
  TrendingUp,
  Heart,
} from "lucide-react";

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

  const asideFeatures = [
    {
      icon: Leaf,
      title: "Produtos Orgânicos",
      description:
        "Produtos frescos e orgânicos diretamente dos produtores locais",
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description:
        "Produtos selecionados com os mais altos padrões de qualidade",
    },
    {
      icon: TrendingUp,
      title: "Preços Justos",
      description: "Preços acessíveis e competitivos para toda a comunidade",
    },
    {
      icon: Heart,
      title: "Comunidade Unida",
      description:
        "Apoio aos produtores locais e fortalecimento da economia regional",
    },
  ];

  // Dados do hero da página de história
  const getHistoriaHeroData = () => ({
    title: "Nossa História",
    description:
      "Mais de 40 anos de tradição, comunidade e produtos frescos no coração de Buritizeiro",
    backgroundImage: banner,
    icon: Info,
  });

  return (
    <>
      <SEO
        title="História da Feira"
        description="Conheça a rica história da Feira Livre de Buritizeiro, com mais de 40 anos de tradição, comunidade e produtos frescos no coração da cidade."
        keywords={[
          "história",
          "feira buritizeiro",
          "tradição",
          "comunidade",
          "mercado municipal",
          "40 anos",
        ]}
        image="/banner.jpg"
        url={window.location.href}
        type="article"
        publishedTime="2024-01-01T00:00:00.000Z"
        modifiedTime={new Date().toISOString()}
        section="História"
        tags={["feira", "buritizeiro", "história", "tradição", "comunidade"]}
      />
      <main className="min-h-screen bg-gray-50 scroll-smooth">
        <MenuTopo />

        {/* Hero Section */}
        <HeroSection {...getHistoriaHeroData()} />

        <section className="py-20 scroll-overscroll">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <aside className="lg:col-span-1 space-y-8">
                {/* Card de Informações da Feira */}
                <section className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 scroll-with-header">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-6">
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
                        <h3 className="font-semibold text-gray-900">
                          Tradição
                        </h3>
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
                </section>

                {/* Card de Características */}
                <section className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 scroll-with-header">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Por que escolher nossa feira?
                  </h3>
                  <article className="grid grid-cols-2 gap-4">
                    {asideFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 text-center hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="text-white" size={18} />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </article>
                </section>
              </aside>

              <article className="lg:col-span-2 scroll-container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-6">
                    Mercado Municipal: Uma Nova Era
                  </h2>

                  <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                    <p>
                      O Mercado Municipal representa a nova fase da feira,
                      contando com
                      <strong> 32 boxes</strong> projetados para atender a uma
                      ampla variedade de necessidades comerciais. Entre as
                      inovações, destacam-se o espaço gourmet, áreas
                      estratégicas para açougues e peixarias, quiosques na
                      praça, um espaço dedicado ao artesanato e amplas áreas
                      destinadas às bancas móveis.
                    </p>

                    <p>
                      O empreendimento comporta até{" "}
                      <strong>45 operações comerciais</strong>, todas
                      rigorosamente alinhadas às exigências sanitárias vigentes.
                      A renovação da praça trouxe melhorias significativas,
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-6">
                    Linha do Tempo
                  </h2>

                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-6 hover-lift">
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
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Venha Conhecer o Mercado Municipal
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    Convidamos você a conhecer o Mercado Municipal e desfrutar
                    de uma experiência única, que combina compras, lazer e
                    incentivo ao empreendedorismo local, no coração de
                    Buritizeiro.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                  >
                    <ArrowUp size={20} />
                    <span>Voltar ao Topo</span>
                  </motion.button>
                </motion.div>
              </article>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Historia;

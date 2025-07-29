import banner from "../../assets/banner.jpg";
import localizacao from "../../assets/localização.png";
import MenuTopo from "../../components/MenuTopo/MenuTopo";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import { motion } from "framer-motion";
import SEO from "../../components/SEO/SEO";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  Calendar,
  Users,
  Car,
  Bus,
} from "lucide-react";

const Localizacao = () => {
  const endereco =
    "Rua Professor Antonio Candido, S/N - Centro, Buritizeiro - MG";
  const linkGoogleMaps =
    "https://www.google.com/maps/dir/Buritizeiro,+MG,+39280-000/-17.3589395,-44.9577023/@-17.3605393,-44.967312,16z";

  const informacoes = [
    {
      icon: Clock,
      titulo: "Horário de Funcionamento",
      descricao: "Domingos das 6h às 12h",
      cor: "text-blue-600",
    },
    {
      icon: Calendar,
      titulo: "Tradição",
      descricao: "Mais de 40 anos no mesmo local",
      cor: "text-green-600",
    },
    {
      icon: Users,
      titulo: "Capacidade",
      descricao: "32 boxes + bancas móveis",
      cor: "text-purple-600",
    },
  ];

  const comoChegar = [
    {
      icon: Car,
      titulo: "De Carro",
      descricao: "Estacionamento disponível nas ruas próximas ao centro",
    },
    {
      icon: Bus,
      titulo: "Transporte Público",
      descricao: "Ponto de ônibus localizado próximo à feira",
    },
    {
      icon: Navigation,
      titulo: "A Pé",
      descricao: "Localização central, fácil acesso caminhando",
    },
  ];

  // Dados do hero da página de localização
  const getLocalizacaoHeroData = () => ({
    title: "Nossa Localização",
    description: "Encontre a Feira Livre de Buritizeiro no coração da cidade",
    backgroundImage: banner,
    icon: MapPin,
  });

  return (
    <main className="min-h-screen bg-gray-50 scroll-smooth">
      <SEO
        title="Localização - Feira Livre de Buritizeiro"
        description="Encontre a Feira Livre de Buritizeiro no coração da cidade. Rua Professor Antonio Candido, S/N - Centro, Buritizeiro - MG. Todos os domingos das 6h às 12h."
        keywords={["localização feira", "Buritizeiro MG", "endereço feira", "como chegar", "feira livre localização"]}
      />
      <MenuTopo />

      {/* Hero Section */}
      <HeroSection {...getLocalizacaoHeroData()} />

      {/* Main Content */}
      <section className="py-20 scroll-overscroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Mapa Interativo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover-lift">
                <div className="p-6 bg-gradient-to-r from-green-600 to-green-700">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Localização no Mapa
                  </h2>
                  <p className="text-green-100">
                    Clique no mapa para abrir no Google Maps
                  </p>
                </div>

                <div className="relative group">
                  <a
                    href={linkGoogleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden"
                  >
                    {/* Placeholder do mapa - substitua pela imagem real */}
                    <div
                      className="w-full h-80 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${localizacao})`,
                      }}
                    >
                      <div className="text-center">
                        <MapPin
                          size={64}
                          className="text-green-600 mx-auto mb-4"
                        />
                        <p className="text-green-600 font-semibold text-lg">
                          Feira Livre de Buritizeiro
                        </p>
                        <p className="text-green-600 text-sm mt-2">
                          Centro da cidade
                        </p>
                      </div>

                      {/* Overlay de hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center space-x-2">
                          <ExternalLink size={20} className="text-green-600" />
                          <span className="text-gray-900 font-semibold">
                            Abrir no Google Maps
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="p-6 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <MapPin
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Endereço Completo
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {endereco}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Informações */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 space-y-8 scroll-container"
            >
              {/* Cards de Informações */}
              <div className="grid grid-cols-1 gap-6">
                {informacoes.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${info.cor}`}
                        >
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {info.titulo}
                          </h3>
                          <p className="text-gray-600">{info.descricao}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Contato */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Informações de Contato
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-green-600 flex-shrink-0" size={20} />
                    <a
                      href="tel:+553837421011"
                      className="text-gray-700 hover:text-green-600 transition-colors"
                    >
                      (38) 3742-1011
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="text-green-600 flex-shrink-0" size={20} />
                    <a
                      href="mailto:ouvidoria@buritizeiro.mg.gov.br"
                      className="text-gray-700 hover:text-green-600 transition-colors break-all"
                    >
                      ouvidoria@buritizeiro.mg.gov.br
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Como Chegar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Como Chegar
                </h3>

                <div className="space-y-4">
                  {comoChegar.map((opcao, index) => {
                    const Icon = opcao.icon;
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="text-green-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {opcao.titulo}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {opcao.descricao}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 scroll-momentum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Venha nos Visitar!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Todos os domingos das 6h às 12h, você encontra produtos frescos e de
              qualidade no coração de Buritizeiro
            </p>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={linkGoogleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              <Navigation size={20} />
              <span>Ver Direções no Google Maps</span>
              <ExternalLink size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Localizacao;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Instagram,
  ExternalLink,
  Heart,
  ArrowUp,
} from "lucide-react";
import logo1 from "../assets/logo1.png";
import ifnmgLogo from "../assets/ifnmg.jpg";
import prefeituraLogo from "../assets/logo_Buritizeiro.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/paginaprincipal", label: "Início", icon: "🏠" },
    { to: "/historia", label: "Nossa História", icon: "📖" },
    { to: "/localizacao", label: "Localização", icon: "📍" },
    { to: "/bancas", label: "Bancas", icon: "🏪" },
    { to: "/todascategorias", label: "Categorias", icon: "📦" },
    { to: "/avaliacao", label: "Avaliação", icon: "⭐" },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/buritizeiroprefeitura/?locale=pt_BR",
      icon: Facebook,
      label: "Facebook",
      color: "hover:text-blue-400",
      ariaLabel: "Siga-nos no Facebook",
    },
    {
      href: "https://www.instagram.com/buritizeiroprefeitura/",
      icon: Instagram,
      label: "Instagram",
      color: "hover:text-pink-400",
      ariaLabel: "Siga-nos no Instagram",
    },
  ];

  const partners = [
    {
      name: "IFNMG Pirapora",
      href: "https://www.ifnmg.edu.br/pirapora",
      logo: ifnmgLogo,
      description: "Instituto Federal do Norte de Minas Gerais",
    },
    {
      name: "Prefeitura de Buritizeiro",
      href: "https://www.buritizeiro.mg.gov.br/",
      logo: prefeituraLogo,
      description: "Administração Municipal",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Endereço",
      content: "Rua Professor Antonio Candido, S/N",
      subContent: "Centro, Buritizeiro - MG",
      link: "https://www.google.com/maps/dir/Buritizeiro,+MG,+39280-000/-17.3589395,-44.9577023/@-17.3605393,-44.967312,16z",
      linkText: "Ver no mapa",
    },
    {
      icon: Clock,
      label: "Horário",
      content: "Domingos: 6h às 12h",
      subContent: "Tradição de mais de 40 anos",
    },
    {
      icon: Phone,
      label: "Telefone",
      content: "(38) 3742-1011",
      link: "tel:+553837421011",
    },
    {
      icon: Mail,
      label: "E-mail",
      content: "ouvidoria@buritizeiro.mg.gov.br",
      link: "mailto:ouvidoria@buritizeiro.mg.gov.br",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden" role="contentinfo">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-600 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex w-20 h-18 items-center justify-center">
                <motion.img
                  src={logo1}
                  alt="Logo Viva Bem Buritizeiro"
                  whileHover={{ scale: 1.1 }}
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-xl -ml-4 font-bold">Viva Bem</h3>
                <p className="text-gray-400 -ml-4 text-sm">Buritizeiro</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Descubra a diversidade da Feira Livre de Buritizeiro. Produtos
              frescos, tradição e comunidade em um só lugar.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4" role="group" aria-label="Redes sociais">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-700 transform hover:scale-110 ${social.color} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                    aria-label={social.ariaLabel}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">
              Links Rápidos
            </h4>
            <nav className="space-y-3" role="navigation" aria-label="Links rápidos">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">
              Contato
            </h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon
                      className="text-green-400 mt-1 flex-shrink-0"
                      size={18}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {info.content}
                        {info.subContent && (
                          <>
                            <br />
                            <span className="text-gray-400 text-xs">{info.subContent}</span>
                          </>
                        )}
                      </p>
                      {info.link && (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? "_blank" : undefined}
                          rel={info.link.startsWith('http') ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center space-x-1 text-green-400 hover:text-green-300 text-xs mt-1 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                        >
                          <span>{info.linkText}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">
              Parceiros
            </h4>
            <div className="space-y-4">
              {partners.map((partner, index) => (
                <motion.a
                  key={index}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                      {partner.name}
                    </p>
                    {partner.description && (
                      <p className="text-xs text-gray-400">{partner.description}</p>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-green-400 transition-colors">
                      <span>Visitar site</span>
                      <ExternalLink size={10} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} Feira Livre de Buritizeiro</span>
              <span>•</span>
              <span>Todos os direitos reservados</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Feito com</span>
                <Heart className="text-red-500" size={16} fill="currentColor" />
                <span>para nossa comunidade</span>
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Voltar ao topo"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

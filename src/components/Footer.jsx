import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ifnmg from "../assets/ifnmg.jpg";
import buritizeiro from "../assets/buritizeiro.jpg";

const logos = [
  { src: ifnmg, link: "https://www.ifnmg.edu.br/pirapora" },
  { src: buritizeiro, link: "https://www.buritizeiro.mg.gov.br/" },
];

const endereco =
  "Rua Professor Antonio Candido, S/N - Centro, Buritizeiro - MG";
const linkGoogleMaps =
  "https://www.google.com/maps/dir/Buritizeiro,+MG,+39280-000/-17.3589395,-44.9577023/@-17.3605393,-44.967312,16z/data=!3m1!4b1!4m8!4m7!1m5!1m1!1s0xaa0bcd1cc31d93:0x3509703457e77a38!2m2!1d-44.9662399!2d-17.3623205!1m0?entry=ttu";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-500 p-2 text-white">
      <div className="max-w-screen-xl px-4 pt-4 pb-4 mx-auto sm:px-4 lg:px-4 lg:pt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="text-center">
            <div className="flex uppercase text-xs items-center justify-center lg:justify-start space-x-6 text-gray-300">
              <Link
                to="/paginaprincipal"
                className="hover:text-yellow-300 hover:underline transition-all duration-300"
              >
                Início
              </Link>
              <Link
                to="/historia"
                className="hover:text-yellow-300 hover:underline transition-all duration-300"
              >
                Sobre nós
              </Link>
              <Link
                to="/contato"
                className="hover:text-yellow-300 hover:underline transition-all duration-300"
              >
                Nossa localização
              </Link>
            </div>
            <p className="max-w-md mx-auto mt-6 leading-relaxed text-center text-gray-400 text-sm sm:max-w-xs sm:mx-0 sm:text-left">
              Explore a diversidade da Feira Livre de Buritizeiro. Descubra
              eventos, produtos locais e tudo o que nossa comunidade tem a
              oferecer. Bem-vindo e aproveite sua visita!
            </p>
            <ul className="flex justify-center lg:justify-start gap-6 mt-8 md:gap-8 mb-2 sm:justify-start">
              <li>
                <a
                  href="https://www.facebook.com/buritizeiroprefeitura/?locale=pt_BR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-2xl hover:text-blue-500 transition-all duration-300 ease-in-out transform hover:rotate-12" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/buritizeiroprefeitura/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-2xl hover:text-pink-500 transition-all duration-300 ease-in-out transform hover:rotate-12" />
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <nav className="mt-8">
              <ul className="flex justify-center lg:justify-start ml-0 lg:ml-10 space-x-2 text-sm">
                {logos.map((logo, index) => (
                  <li key={index} className="mr-4">
                    <Link to={logo.link} className="hover:opacity-80">
                      <motion.img
                        src={logo.src}
                        alt="Logo"
                        className="w-24 h-24"
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, 10, -10, 0],
                          transition: { duration: 0.3 },
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="text-center sm:text-left">
            <p className="uppercase text-xs items-center justify-center text-white">
              Contato
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <a
                  className="flex items-center justify-center sm:justify-start gap-1.5 group"
                  href="mailto:ouvidoria@buritizeiro.mg.gov.br"
                >
                  <FaEnvelope className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white transition hover:text-yellow-300">
                    ouvidoria@buritizeiro.mg.gov.br
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center justify-center sm:justify-start gap-1.5 group"
                  href="tel:+553837421011"
                >
                  <FaPhone className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white transition hover:text-yellow-300">
                    (38) 3742-1011
                  </span>
                </a>
              </li>
              <li className="flex items-start justify-center gap-1.5 sm:justify-start">
                <FaMapMarkerAlt className="w-4 h-4 text-white shrink-0 hover:text-yellow-300" />
                <a
                  href={linkGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300"
                >
                  {endereco}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 mt -4 border-t border-green-200">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-400">
              <span>&middot;</span>
              <a
                className="inline-block text-gray-200 underline transition hover:text-yellow-300"
                href="/"
              >
                Todos os direitos reservados
              </a>
            </p>
            <p className="text-sm text-gray-200 sm:order-first sm:mt-0">
              &copy; 2024 Feira Livre de Buritizeiro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

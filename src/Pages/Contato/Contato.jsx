
import fundo from '../../assets/fundo.jpg';
import MenuTopo from '../../components/MenuTopo';
import Footer from '../../components/Footer';
import mapa from '../../assets/mapa.png';

const Localização = () => {
  return (
    <>
      <div className="bg-cover bg-center min-h-screen text-gray-800 relative" style={{ backgroundImage: `url(${fundo})` }}>
        <div className="bg-gray-800 bg-opacity-65 min-h-screen relative z-10">
          {/* Componente do MenuTopo */}
          <MenuTopo />

          {/* Seção de Contato */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-white text-sm uppercase font-bold text-center mb-6 ">Localização da feira de Buritizeiro</p>
            <a
              href="https://www.google.com/maps/dir/Buritizeiro,+MG,+39280-000/-17.3589395,-44.9577023/@-17.3601762,-44.966968,15.72z/data=!4m8!4m7!1m5!1m1!1s0xaa0bcd1cc31d93:0x3509703457e77a38!2m2!1d-44.9662399!2d-17.3623205!1m0?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Imagem do Mapa */}
              <img
                src={mapa}
                alt="Mapa do Local"
                className="object-cover mt-6 rounded-md max-w-full"
                style={{ maxHeight: '300px', width: '100%' }} 
              />
            </a>
          </div>
        </div>
        <Footer />
      </div>

      {/* Componente do Footer */}
    </>
  );
};

export default Localização;

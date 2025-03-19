import { useState } from "react";
import MenuTopo from "../../components/MenuTopo";
import Footer from "../../components/Footer";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import fundo from "../../assets/fundo.jpg";

const images = [
  {
    original: "https://sorocaba.com.br/wp-content/uploads/2022/05/20190916_00_feira_ceagesp4.webp",
    thumbnail: "https://sorocaba.com.br/wp-content/uploads/2022/05/20190916_00_feira_ceagesp4.webp",
    description: "Feira no Ceagesp",
  },
  // Adicione outras imagens aqui...
];

const Galeria = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index) => {
    setCurrentIndex(index);
  };

  const renderCustomControls = () => {
    return (
      <div className="custom-gallery-controls">
        <button
          className="gallery-nav-button left"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex > 0 ? prevIndex - 1 : images.length - 1
            )
          }
        >
          &#8249;
        </button>
        <button
          className="gallery-nav-button right"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex < images.length - 1 ? prevIndex + 1 : 0
            )
          }
        >
          &#8250;
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="bg-cover bg-center min-h-screen text-green-700 relative" style={{ backgroundImage: `url(${fundo})` }}>
        <div className="bg-gray-800 bg-opacity-75 min-h-screen relative">
          <MenuTopo />
          <div className="container mx-auto py-4 md:py-8 px-4 md:px-10 text-center">
            <h1 className="text-lg uppercase md:text-xl font-bold text-yellow-300 md:mb-2">
              Nossa jornada em fotos
            </h1>
            <p className="text-sm text-yellow-400 mb-2 md:mb-4 font-semibold">
              Explore e reviva momentos inesquecíveis da nossa feira.
            </p>
            <div className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-lg p-6 md:p-10 relative">
              <Gallery
                items={images}
                showIndex
                lazyLoad
                currentIndex={currentIndex}
                onClick={handleImageClick}
                renderCustomControls={renderCustomControls}
                slideDuration={550}
                slideInterval={5000} // Defina o intervalo de tempo entre os slides
                showThumbnails={false} // Desative as miniaturas
              />
            </div>
          </div>
          <Footer className="absolute bottom-0 left-0 right-0" />
        </div>
      </div>
    </>
  );
};

export default Galeria;

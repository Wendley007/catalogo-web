/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

/**
 * Componente SEO para otimização de motores de busca
 */
const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  author = "Feira de Buritizeiro",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  // Título padrão
  const defaultTitle = "Feira Livre de Buritizeiro";
  const fullTitle = title ? `${title} - ${defaultTitle}` : defaultTitle;

  // Descrição padrão
  const defaultDescription =
    "Descubra produtos frescos e de qualidade na Feira Livre de Buritizeiro. Tradição e qualidade em um só lugar.";
  const metaDescription = description || defaultDescription;

  // URL canônica
  const canonicalUrl = canonical || url || window.location.href;

  // Imagem padrão
  const defaultImage = "/logo.png";
  const metaImage = image || defaultImage;

  // Meta robots
  const robots = [];
  if (noindex) robots.push("noindex");
  if (nofollow) robots.push("nofollow");
  if (robots.length === 0) robots.push("index, follow");

  useEffect(() => {
    // Atualiza título da página
    document.title = fullTitle;

    // Atualiza meta description
    let metaDescriptionElement = document.querySelector(
      'meta[name="description"]'
    );
    if (!metaDescriptionElement) {
      metaDescriptionElement = document.createElement("meta");
      metaDescriptionElement.name = "description";
      document.head.appendChild(metaDescriptionElement);
    }
    metaDescriptionElement.content = metaDescription;

    // Atualiza meta keywords
    if (keywords.length > 0) {
      let metaKeywordsElement = document.querySelector('meta[name="keywords"]');
      if (!metaKeywordsElement) {
        metaKeywordsElement = document.createElement("meta");
        metaKeywordsElement.name = "keywords";
        document.head.appendChild(metaKeywordsElement);
      }
      metaKeywordsElement.content = keywords.join(", ");
    }

    // Atualiza meta robots
    let metaRobotsElement = document.querySelector('meta[name="robots"]');
    if (!metaRobotsElement) {
      metaRobotsElement = document.createElement("meta");
      metaRobotsElement.name = "robots";
      document.head.appendChild(metaRobotsElement);
    }
    metaRobotsElement.content = robots.join(", ");
  }, [fullTitle, metaDescription, keywords, robots]);

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="robots" content={robots.join(", ")} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebPage",
          name: fullTitle,
          description: metaDescription,
          url: canonicalUrl,
          image: metaImage,
          author: {
            "@type": "Organization",
            name: author,
          },
          publisher: {
            "@type": "Organization",
            name: "Feira de Buritizeiro",
            logo: {
              "@type": "ImageObject",
              url: "/logo.png",
            },
          },
          mainEntity: {
            "@type": "LocalBusiness",
            name: "Feira Livre de Buritizeiro",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rua Professor Antonio Candido, S/N",
              addressLocality: "Buritizeiro",
              addressRegion: "MG",
              postalCode: "39280-000",
              addressCountry: "BR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -17.3589395,
              longitude: -44.9577023,
            },
            openingHours: "Su 06:00-12:00",
            telephone: "+553837421011",
          },
        })}
      </script>

      {/* Preconnect para melhor performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://firestore.googleapis.com" />
      <link rel="preconnect" href="https://storage.googleapis.com" />

      {/* Favicon */}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEO;

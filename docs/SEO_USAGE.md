# Como Utilizar o Componente SEO

O componente SEO foi criado para otimizar o SEO (Search Engine Optimization) do projeto da Feira de Buritizeiro. Ele utiliza a biblioteca `react-helmet-async` para gerenciar as meta tags do HTML.

## Configuração Inicial

### 1. Instalar Dependência
```bash
npm install react-helmet-async
```

### 2. Configurar HelmetProvider
No arquivo `src/main.jsx`, adicione o HelmetProvider:

```jsx
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

## Como Usar o Componente SEO

### Importação
```jsx
import SEO from "../../components/SEO/SEO";
```

### Uso Básico
```jsx
const MinhaPagina = () => {
  return (
    <>
      <SEO 
        title="Título da Página"
        description="Descrição da página para SEO"
      />
      {/* Conteúdo da página */}
    </>
  );
};
```

### Uso Completo
```jsx
const MinhaPagina = () => {
  return (
    <>
      <SEO 
        title="Título da Página"
        description="Descrição detalhada da página para motores de busca"
        keywords={["palavra-chave1", "palavra-chave2", "palavra-chave3"]}
        image="/caminho/para/imagem.jpg"
        url={window.location.href}
        type="website" // ou "article" para artigos
        author="Nome do Autor"
        publishedTime="2024-01-01T00:00:00.000Z" // Para artigos
        modifiedTime={new Date().toISOString()} // Para artigos
        section="Seção do Site" // Para artigos
        tags={["tag1", "tag2", "tag3"]} // Para artigos
        noindex={false} // true para não indexar
        nofollow={false} // true para não seguir links
        canonical="https://exemplo.com/pagina" // URL canônica
      />
      {/* Conteúdo da página */}
    </>
  );
};
```

## Propriedades Disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `title` | string | - | Título da página (será combinado com o título padrão) |
| `description` | string | Descrição padrão | Meta description da página |
| `keywords` | array | [] | Palavras-chave para SEO |
| `image` | string | "/logo.png" | URL da imagem para Open Graph |
| `url` | string | window.location.href | URL da página |
| `type` | string | "website" | Tipo de conteúdo ("website" ou "article") |
| `author` | string | "Feira de Buritizeiro" | Autor do conteúdo |
| `publishedTime` | string | - | Data de publicação (para artigos) |
| `modifiedTime` | string | - | Data de modificação (para artigos) |
| `section` | string | - | Seção do site (para artigos) |
| `tags` | array | [] | Tags do conteúdo (para artigos) |
| `noindex` | boolean | false | Se a página deve ser indexada |
| `nofollow` | boolean | false | Se os links devem ser seguidos |
| `canonical` | string | - | URL canônica da página |

## Exemplos de Uso

### Página Simples (Website)
```jsx
<SEO 
  title="Página Inicial"
  description="Bem-vindo à Feira Livre de Buritizeiro. Descubra produtos frescos e de qualidade."
  keywords={["feira", "buritizeiro", "produtos frescos"]}
/>
```

### Página de Artigo
```jsx
<SEO 
  title="História da Feira"
  description="Conheça a rica história da Feira Livre de Buritizeiro, com mais de 40 anos de tradição."
  keywords={["história", "feira buritizeiro", "tradição"]}
  type="article"
  publishedTime="2024-01-01T00:00:00.000Z"
  modifiedTime={new Date().toISOString()}
  section="História"
  tags={["feira", "buritizeiro", "história"]}
/>
```

### Página que não deve ser indexada
```jsx
<SEO 
  title="Página Privada"
  description="Página interna do sistema"
  noindex={true}
  nofollow={true}
/>
```

## Funcionalidades Automáticas

O componente SEO automaticamente:

1. **Combina o título** com o título padrão "Feira Livre de Buritizeiro"
2. **Define meta tags** para Open Graph (Facebook) e Twitter
3. **Adiciona dados estruturados** (Schema.org) para melhor indexação
4. **Configura preconnect** para melhor performance
5. **Define favicon e ícones** da aplicação
6. **Adiciona meta tags** para tema e cores

## Dados Estruturados

O componente inclui automaticamente dados estruturados do Schema.org para:
- Informações da organização
- Dados de localização da feira
- Horários de funcionamento
- Informações de contato

## Boas Práticas

1. **Sempre use o componente** em todas as páginas
2. **Escreva descrições únicas** para cada página
3. **Use palavras-chave relevantes** mas não exagere
4. **Forneça imagens de qualidade** para Open Graph
5. **Use URLs canônicas** quando necessário
6. **Configure noindex/nofollow** para páginas privadas

## Estrutura de Dados Automática

O componente gera automaticamente dados estruturados para a Feira de Buritizeiro:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Feira Livre de Buritizeiro",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Professor Antonio Candido, S/N",
    "addressLocality": "Buritizeiro",
    "addressRegion": "MG",
    "postalCode": "39280-000",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -17.3589395,
    "longitude": -44.9577023
  },
  "openingHours": "Su 06:00-12:00",
  "telephone": "+553837421011"
}
``` 
# Como Utilizar o Componente StatsSection

O componente `StatsSection` foi criado para padronizar e reutilizar a exibição de seções de estatísticas em todo o projeto da Feira de Buritizeiro.

## 📁 Localização

```
src/components/StatsSection/
├── StatsSection.jsx    # Componente principal
└── index.js           # Arquivo de exportação
```

## 🚀 Importação

```jsx
import StatsSection from "../../components/StatsSection";
```

## 📋 Propriedades Disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `stats` | Array | **Obrigatório** | Array de estatísticas |
| `title` | string | "Estatísticas" | Título da seção |
| `subtitle` | string | "Números que mostram nossa qualidade" | Subtítulo da seção |
| `backgroundColor` | string | "bg-gradient-to-r from-green-50 to-blue-50" | Classe CSS para cor de fundo |
| `showBackground` | boolean | true | Se deve mostrar elementos de fundo |
| `variant` | string | "default" | Variante do componente |

## 📊 Estrutura de Dados das Estatísticas

```javascript
const stats = [
  {
    icon: Users,           // Ícone do Lucide React
    value: "40+",          // Valor da estatística
    label: "Anos de Tradição", // Rótulo da estatística
    color: "text-blue-500", // Cor do ícone
  },
  // ... mais estatísticas
];
```

## 🎨 Variantes Disponíveis

### 1. **Default** (Padrão)
```jsx
<StatsSection 
  stats={stats}
  variant="default"
/>
```

### 2. **Glass** (Vidro)
```jsx
<StatsSection 
  stats={stats}
  variant="glass"
/>
```

### 3. **Simple** (Simples)
```jsx
<StatsSection 
  stats={stats}
  variant="simple"
/>
```

## 🎯 Exemplos de Uso

### **Página Principal**
```jsx
const getMainPageStats = () => [
  {
    icon: Users,
    value: "40+",
    label: "Anos de Tradição",
    color: "text-blue-500",
  },
  {
    icon: ShoppingBag,
    value: "32",
    label: "Boxes Disponíveis",
    color: "text-green-500",
  },
  {
    icon: Award,
    value: "100%",
    label: "Produtos Locais",
    color: "text-purple-500",
  },
  {
    icon: Heart,
    value: "10000+",
    label: "Famílias Atendidas",
    color: "text-red-500",
  },
];

<StatsSection 
  stats={getMainPageStats()}
  title="Nossa Feira em números"
  subtitle="Décadas de tradição e qualidade comprovada"
  variant="default"
/>
```

### **Página de Bancas**
```jsx
const getBancasStats = (bancas) => {
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length, 0
  );
  const totalProdutos = bancas.reduce(
    (acc, banca) => acc + (banca.produtos?.length || 0), 0
  );

  return [
    {
      icon: Store,
      value: bancas.length,
      label: "Bancas Ativas",
      color: "text-blue-500",
    },
    {
      icon: Users,
      value: totalVendedores,
      label: "Vendedores",
      color: "text-green-500",
    },
    {
      icon: Leaf,
      value: totalProdutos,
      label: "Produtos",
      color: "text-purple-500",
    },
    { 
      icon: Award, 
      value: "100%", 
      label: "Qualidade", 
      color: "text-red-500" 
    },
  ];
};

<StatsSection 
  stats={getBancasStats(bancas)}
  title="Nossas Bancas em números"
  subtitle="Conectando produtores locais com a comunidade"
  variant="glass"
/>
```

### **Página de Categorias**
```jsx
const getCategoriasStats = (categorias, bancas) => {
  const totalProdutos = categorias.reduce(
    (acc, categoria) => acc + categoria.produtos.length, 0
  );
  const totalVendedores = bancas.reduce(
    (acc, banca) => acc + banca.vendedores.length, 0
  );

  return [
    {
      icon: Package,
      value: categorias.length,
      label: "Categorias",
      color: "text-blue-500",
    },
    {
      icon: ShoppingBag,
      value: totalProdutos,
      label: "Produtos",
      color: "text-green-500",
    },
    {
      icon: Store,
      value: bancas.length,
      label: "Bancas",
      color: "text-purple-500",
    },
    {
      icon: Users,
      value: totalVendedores,
      label: "Vendedores",
      color: "text-red-500",
    },
  ];
};

<StatsSection 
  stats={getCategoriasStats(categorias, bancas)}
  title="Nosso Catálogo em Números"
  subtitle="Diversidade e qualidade em cada categoria"
  variant="glass"
/>
```

## 🎨 Personalização

### **Cores de Fundo**
```jsx
<StatsSection 
  stats={stats}
  backgroundColor="bg-gradient-to-r from-blue-50 to-purple-50"
/>
```

### **Sem Elementos de Fundo**
```jsx
<StatsSection 
  stats={stats}
  showBackground={false}
/>
```

### **Título e Subtítulo Personalizados**
```jsx
<StatsSection 
  stats={stats}
  title="Estatísticas Personalizadas"
  subtitle="Descrição personalizada das estatísticas"
/>
```

## 🎨 Funcionalidades Automáticas

O componente `StatsSection` inclui automaticamente:

### ✅ **Animações**
- Animação de entrada com delay baseado no índice
- Hover effects com scale
- Transições suaves

### ✅ **Responsividade**
- Grid responsivo (2 colunas em mobile, 4 em desktop)
- Adaptação para diferentes tamanhos de tela

### ✅ **Acessibilidade**
- Títulos e descrições para screen readers
- Contraste adequado
- Navegação por teclado

### ✅ **Variantes Visuais**
- **Default**: Cards brancos com sombra
- **Glass**: Cards com efeito de vidro
- **Simple**: Design minimalista

## 🔧 Ícones Disponíveis

O componente aceita qualquer ícone do Lucide React:

```javascript
import { 
  Users, 
  ShoppingBag, 
  Award, 
  Heart, 
  Store, 
  Leaf, 
  Package 
} from "lucide-react";
```

## 📱 Layout Responsivo

- **Mobile**: 2 colunas
- **Desktop**: 4 colunas
- **Espaçamento**: Gap de 6 (1.5rem)
- **Padding**: 6 (1.5rem) nos cards

## 🚨 Tratamento de Erros

O componente trata automaticamente:

- **Stats vazias**: Mostra seção vazia
- **Ícones inválidos**: Fallback para ícone padrão
- **Valores undefined**: Exibe "0" ou "-"
- **Cores inválidas**: Usa cor padrão

## 📋 Checklist de Implementação

Para usar o componente `StatsSection`:

- [ ] Importar o componente
- [ ] Criar função para gerar estatísticas
- [ ] Definir array de stats com estrutura correta
- [ ] Configurar título e subtítulo
- [ ] Escolher variante apropriada
- [ ] Testar responsividade
- [ ] Verificar animações

## 🔄 Migração de Código Existente

Para migrar código existente:

1. **Substituir o JSX da seção** pelo componente `StatsSection`
2. **Criar função para gerar stats** baseada nos dados existentes
3. **Passar as props** necessárias
4. **Remover código duplicado** de animações e estilos
5. **Testar funcionalidades** específicas de cada página

## 📈 Benefícios

- ✅ **Código reutilizável** e padronizado
- ✅ **Manutenção simplificada**
- ✅ **Consistência visual**
- ✅ **Performance otimizada**
- ✅ **Funcionalidades centralizadas**
- ✅ **Fácil personalização**
- ✅ **Múltiplas variantes** para diferentes contextos 
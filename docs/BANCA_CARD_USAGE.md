# Como Utilizar o Componente BancaCard

O componente `BancaCard` foi criado para padronizar e reutilizar a exibição de cards de bancas em todo o projeto da Feira de Buritizeiro. Ele substitui o código duplicado que existia em várias páginas.

## 📁 Localização

```
src/components/BancaCard/
├── BancaCard.jsx    # Componente principal
└── index.js         # Arquivo de exportação
```

## 🚀 Importação

```jsx
import BancaCard from "../../components/BancaCard";
```

## 📋 Propriedades Disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `banca` | Object | **Obrigatório** | Dados da banca |
| `index` | number | 0 | Índice para animação |
| `showAdminControls` | boolean | false | Mostrar controles de admin |
| `showVendedoresDropdown` | boolean | true | Mostrar dropdown de vendedores |
| `onEditBanca` | Function | - | Função para editar banca (admin) |
| `onDeleteBanca` | Function | - | Função para deletar banca (admin) |
| `onSelectVendedores` | Function | - | Função para selecionar vendedores |
| `selectedBanca` | string | - | ID da banca selecionada |
| `whatsappMessage` | string | Mensagem padrão | Mensagem para WhatsApp |
| `acessarBancaText` | string | "Acessar Banca" | Texto do botão |
| `verVendedoresText` | string | "Ver Vendedores" | Texto do botão |
| `fecharVendedoresText` | string | "Fechar Vendedores" | Texto do botão |

## 📊 Estrutura de Dados da Banca

```javascript
const banca = {
  id: "banca_id",
  nome: "Nome da Banca",
  vendedores: [
    {
      id: "vendedor_id",
      nome: "Nome do Vendedor",
      cidade: "Cidade do Vendedor",
      whatsapp: "5538999999999",
      images: [
        {
          url: "https://exemplo.com/imagem.jpg"
        }
      ]
    }
  ]
};
```

## 🎯 Exemplos de Uso

### 1. **Uso Básico (Página Principal)**

```jsx
import BancaCard from "../../components/BancaCard";

const PaginaPrincipal = () => {
  const [bancas, setBancas] = useState([]);
  const [selectedBanca, setSelectedBanca] = useState(null);

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  return (
    <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
      {bancas.map((banca, index) => (
        <BancaCard
          key={banca.id}
          banca={banca}
          index={index}
          showAdminControls={false}
          showVendedoresDropdown={true}
          onSelectVendedores={handleSelectVendedores}
          selectedBanca={selectedBanca}
          whatsappMessage="Olá! Vi sua banca no site da Feira de Buritizeiro e fiquei interessado!"
          acessarBancaText="Acessar banca"
          verVendedoresText="Ver Vendedores"
          fecharVendedoresText="Fechar Vendedores"
        />
      ))}
    </article>
  );
};
```

### 2. **Com Controles de Admin (Página de Bancas)**

```jsx
import BancaCard from "../../../components/BancaCard";

const Bancas = () => {
  const { user } = useContext(AuthContext);
  const [selectedBanca, setSelectedBanca] = useState(null);
  const [selectedBancaToEdit, setSelectedBancaToEdit] = useState(null);
  const [selectedBancaToDelete, setSelectedBancaToDelete] = useState(null);

  const handleSelectVendedores = (bancaId) => {
    setSelectedBanca(selectedBanca === bancaId ? null : bancaId);
  };

  return (
    <article className="grid grid-cols-1 mt-6 gap-8 md:grid-cols-3 lg:grid-cols-3 mx-2">
      {filteredBancas.map((banca, index) => (
        <BancaCard
          key={banca.id}
          banca={banca}
          index={index}
          showAdminControls={user && user.role === "admin"}
          showVendedoresDropdown={true}
          onEditBanca={(banca) => {
            setSelectedBancaToEdit(banca);
            setNewBancaName(banca.nome);
          }}
          onDeleteBanca={(banca) => setSelectedBancaToDelete(banca)}
          onSelectVendedores={handleSelectVendedores}
          selectedBanca={selectedBanca}
          whatsappMessage={`Olá! Vi essa ${banca?.nome} no site da Feira de Buritizeiro e fiquei interessado!`}
          acessarBancaText="Acessar Banca"
          verVendedoresText="Ver Vendedores"
          fecharVendedoresText="Fechar Vendedores"
        />
      ))}
    </article>
  );
};
```

### 3. **Sem Dropdown de Vendedores**

```jsx
<BancaCard
  banca={banca}
  index={index}
  showAdminControls={false}
  showVendedoresDropdown={false}
  whatsappMessage="Mensagem personalizada para WhatsApp"
/>
```

### 4. **Com Mensagem Personalizada**

```jsx
<BancaCard
  banca={banca}
  index={index}
  whatsappMessage="Olá! Vi sua banca no site e gostaria de fazer um pedido!"
  acessarBancaText="Ver Detalhes"
  verVendedoresText="Ver Todos"
  fecharVendedoresText="Fechar"
/>
```

## 🎨 Funcionalidades Automáticas

O componente `BancaCard` inclui automaticamente:

### ✅ **Animações**
- Animação de entrada com delay baseado no índice
- Hover effects com scale
- Animações suaves no dropdown

### ✅ **Responsividade**
- Layout responsivo com grid
- Adaptação para diferentes tamanhos de tela

### ✅ **Acessibilidade**
- Títulos e descrições para screen readers
- Navegação por teclado
- Contraste adequado

### ✅ **Funcionalidades**
- Dropdown de vendedores adicionais
- Links para WhatsApp
- Navegação para página da banca
- Controles de admin (quando habilitado)

## 🔧 Personalização

### **Estilos Customizados**

O componente usa classes do Tailwind CSS. Para personalizar:

```jsx
// No componente BancaCard.jsx
className="bg-white rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
```

### **Mensagens Personalizadas**

```jsx
<BancaCard
  banca={banca}
  whatsappMessage="Mensagem personalizada para WhatsApp"
  acessarBancaText="Ver Detalhes"
  verVendedoresText="Ver Todos"
  fecharVendedoresText="Fechar"
/>
```

### **Controles Condicionais**

```jsx
<BancaCard
  banca={banca}
  showAdminControls={user?.role === "admin"}
  showVendedoresDropdown={banca.vendedores.length > 1}
/>
```

## 📱 Funcionalidades do Dropdown

### **Vendedores Adicionais**
- Mostra vendedores além do principal
- Botão WhatsApp individual para cada vendedor
- Fechamento automático ao clicar fora

### **Controles de Admin**
- Botões de editar e excluir
- Integração com modais de confirmação
- Atualização automática da lista

## 🚨 Tratamento de Erros

O componente trata automaticamente:

- **Vendedores sem imagem**: Usa imagem padrão
- **Vendedores sem WhatsApp**: Não mostra botão WhatsApp
- **Bancas sem vendedores**: Mostra mensagem informativa
- **Dados incompletos**: Fallbacks para campos obrigatórios

## 📋 Checklist de Implementação

Para usar o componente `BancaCard`:

- [ ] Importar o componente
- [ ] Definir estado para `selectedBanca` (se usar dropdown)
- [ ] Criar função `handleSelectVendedores` (se usar dropdown)
- [ ] Passar dados da banca no formato correto
- [ ] Configurar props conforme necessidade
- [ ] Testar responsividade
- [ ] Verificar funcionalidades de admin (se aplicável)

## 🔄 Migração de Código Existente

Para migrar código existente:

1. **Substituir o JSX do card** pelo componente `BancaCard`
2. **Manter as funções** de estado e handlers
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
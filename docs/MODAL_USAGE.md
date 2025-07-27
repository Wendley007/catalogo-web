# Como Utilizar o Componente Modal

O componente `Modal` foi criado para padronizar e reutilizar a exibição de modais em todo o projeto da Feira de Buritizeiro.

## 📁 Localização

```
src/components/Modal/
├── Modal.jsx           # Componente principal
├── ConfirmModal.jsx    # Componente especializado para confirmações
└── index.js           # Arquivo de exportação
```

## 🚀 Importação

```jsx
// Modal básico
import { Modal } from "../../components/Modal";

// Modal de confirmação
import { ConfirmModal } from "../../components/Modal";

// Ou importar ambos
import { Modal, ConfirmModal } from "../../components/Modal";
```

## 📋 Propriedades Disponíveis

### **Modal Principal**

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `isOpen` | boolean | **Obrigatório** | Se o modal está aberto |
| `onClose` | Function | **Obrigatório** | Função para fechar o modal |
| `type` | string | "info" | Tipo do modal |
| `title` | string | "" | Título do modal |
| `message` | string | "" | Mensagem do modal |
| `onConfirm` | Function | null | Função de confirmação |
| `icon` | React.ElementType | null | Ícone customizado |
| `children` | React.ReactNode | null | Conteúdo customizado |
| `size` | string | "md" | Tamanho do modal |
| `showCloseButton` | boolean | true | Se deve mostrar botão de fechar |
| `confirmText` | string | "Confirmar" | Texto do botão de confirmação |
| `cancelText` | string | "Cancelar" | Texto do botão de cancelar |
| `closeText` | string | "Fechar" | Texto do botão de fechar |

### **ConfirmModal**

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `isOpen` | boolean | **Obrigatório** | Se o modal está aberto |
| `onClose` | Function | **Obrigatório** | Função para fechar o modal |
| `onConfirm` | Function | **Obrigatório** | Função de confirmação |
| `title` | string | "Confirmação" | Título do modal |
| `message` | string | "Tem certeza que deseja continuar?" | Mensagem do modal |
| `confirmText` | string | "Confirmar" | Texto do botão de confirmação |
| `cancelText` | string | "Cancelar" | Texto do botão de cancelar |
| `type` | string | "warning" | Tipo do modal |

## 🎨 Tipos de Modal Disponíveis

### **Modal Principal**
- `success` - Verde, para sucessos
- `error` - Vermelho, para erros
- `warning` - Amarelo, para avisos
- `info` - Azul, para informações
- `confirm` - Para confirmações
- `custom` - Para conteúdo customizado

### **ConfirmModal**
- `warning` - Amarelo, para avisos
- `danger` - Vermelho, para ações perigosas
- `info` - Azul, para informações

## 📏 Tamanhos Disponíveis

- `sm` - Pequeno (max-w-sm)
- `md` - Médio (max-w-md) - **Padrão**
- `lg` - Grande (max-w-lg)
- `xl` - Extra grande (max-w-xl)

## 🎯 Exemplos de Uso

### **Modal Básico de Sucesso**
```jsx
const [modal, setModal] = useState({
  isOpen: false,
  type: "",
  title: "",
  message: "",
  onConfirm: null,
});

const showModal = (type, title, message, onConfirm = null) => {
  setModal({ isOpen: true, type, title, message, onConfirm });
};

const closeModal = () => {
  setModal({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    onConfirm: null,
  });
};

// Uso
<Modal
  isOpen={modal.isOpen}
  onClose={closeModal}
  type={modal.type}
  title={modal.title}
  message={modal.message}
  onConfirm={modal.onConfirm}
/>
```

### **Modal de Confirmação**
```jsx
const [showConfirmModal, setShowConfirmModal] = useState(false);

const handleDelete = () => {
  // Lógica de exclusão
  setShowConfirmModal(false);
};

<ConfirmModal
  isOpen={showConfirmModal}
  onClose={() => setShowConfirmModal(false)}
  onConfirm={handleDelete}
  title="Excluir Item"
  message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
  type="danger"
  confirmText="Excluir"
  cancelText="Cancelar"
/>
```

### **Modal com Conteúdo Customizado**
```jsx
const [showCustomModal, setShowCustomModal] = useState(false);

<Modal
  isOpen={showCustomModal}
  onClose={() => setShowCustomModal(false)}
  type="custom"
  size="lg"
>
  <div className="text-center">
    <h3 className="text-xl font-bold mb-4">Formulário Customizado</h3>
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Nome"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-3 justify-center">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={() => setShowCustomModal(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</Modal>
```

### **Modal com Ícone Customizado**
```jsx
import { Star } from "lucide-react";

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  type="custom"
  icon={Star}
  title="Avaliação"
  message="Obrigado pela sua avaliação!"
/>
```

## 🎨 Funcionalidades Automáticas

### ✅ **Animações**
- Entrada e saída suaves
- Scale animation
- Backdrop blur

### ✅ **Acessibilidade**
- Suporte a tecla Escape
- ARIA labels
- Role dialog
- Focus management

### ✅ **Responsividade**
- Adaptação para diferentes telas
- Padding responsivo
- Tamanhos configuráveis

### ✅ **Gerenciamento de Scroll**
- Bloqueia scroll do body quando aberto
- Restaura scroll quando fechado

## 🔧 Casos de Uso Comuns

### **1. Feedback de Sucesso**
```jsx
showModal("success", "Sucesso!", "Operação realizada com sucesso!");
```

### **2. Feedback de Erro**
```jsx
showModal("error", "Erro!", "Ocorreu um erro. Tente novamente.");
```

### **3. Confirmação de Exclusão**
```jsx
showModal("warning", "Confirmar Exclusão", "Tem certeza?", () => {
  // Lógica de exclusão
  closeModal();
});
```

### **4. Informação**
```jsx
showModal("info", "Informação", "Esta é uma informação importante.");
```

## 🎨 Personalização

### **Cores de Botões**
Os botões são coloridos automaticamente baseado no tipo:
- **Success**: Verde
- **Error**: Vermelho
- **Warning**: Amarelo
- **Info**: Azul

### **Ícones Automáticos**
- **Success**: CheckCircle
- **Error**: XCircle
- **Warning**: AlertTriangle
- **Info**: AlertCircle

### **Tamanhos**
```jsx
<Modal size="sm" />   // Pequeno
<Modal size="md" />   // Médio (padrão)
<Modal size="lg" />   // Grande
<Modal size="xl" />   // Extra grande
```

## 📱 Responsividade

- **Mobile**: Padding reduzido, texto adaptado
- **Desktop**: Tamanho completo, melhor espaçamento
- **Tablet**: Intermediário entre mobile e desktop

## 🚨 Tratamento de Erros

O componente trata automaticamente:

- **Props inválidas**: Usa valores padrão
- **Eventos de teclado**: Escape para fechar
- **Cliques fora**: Fecha ao clicar no backdrop
- **Scroll**: Bloqueia quando aberto

## 📋 Checklist de Implementação

Para usar o componente `Modal`:

- [ ] Importar o componente
- [ ] Configurar estado do modal
- [ ] Criar funções de abertura/fechamento
- [ ] Definir tipo e conteúdo
- [ ] Testar responsividade
- [ ] Verificar acessibilidade
- [ ] Testar animações

## 🔄 Migração de Código Existente

Para migrar código existente:

1. **Substituir o JSX do modal** pelo componente `Modal`
2. **Configurar estado** com as propriedades necessárias
3. **Criar funções** de abertura e fechamento
4. **Remover código duplicado** de animações e estilos
5. **Testar funcionalidades** específicas

## 📈 Benefícios

- ✅ **Código reutilizável** e padronizado
- ✅ **Manutenção simplificada**
- ✅ **Consistência visual**
- ✅ **Performance otimizada**
- ✅ **Funcionalidades centralizadas**
- ✅ **Fácil personalização**
- ✅ **Múltiplos tipos** para diferentes contextos
- ✅ **Acessibilidade integrada**
- ✅ **Animações suaves**
- ✅ **Responsividade automática** 
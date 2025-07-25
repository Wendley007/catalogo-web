/**
 * Hook customizado para gerenciar funcionalidades do WhatsApp
 */
export const useWhatsApp = () => {
  /**
   * Gera link do WhatsApp com validação de número
   * @param {string} phoneNumber - Número do WhatsApp
   * @param {string} message - Mensagem personalizada
   * @returns {string} URL do WhatsApp
   */
  const generateWhatsAppLink = (phoneNumber, message = "") => {
    if (!phoneNumber) {
      console.warn("Número do WhatsApp não fornecido");
      return "#";
    }

    // Remove caracteres não numéricos
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    
    // Adiciona código do país se não estiver presente
    const formattedNumber = cleanNumber.startsWith("55") 
      ? cleanNumber 
      : `55${cleanNumber}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;
  };

  /**
   * Mensagens padrão para diferentes contextos
   */
  const getDefaultMessage = (context, data = {}) => {
    const messages = {
      banca: `Olá! Vi sua banca "${data.nome || 'na feira'}" no site da Feira de Buritizeiro e fiquei interessado!`,
      vendedor: `Olá ${data.nome || ''}! Vi sua ${data.bancaNome || 'banca'} no site da Feira de Buritizeiro e fiquei interessado.`,
      produto: `Olá! Vi o produto "${data.nome || ''}" no site da Feira de Buritizeiro e gostaria de saber mais informações!`,
      geral: "Olá! Vi sua página no site da Feira de Buritizeiro e fiquei interessado!"
    };

    return messages[context] || messages.geral;
  };

  return {
    generateWhatsAppLink,
    getDefaultMessage
  };
};
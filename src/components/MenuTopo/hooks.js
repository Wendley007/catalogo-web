import { useState, useEffect, useCallback } from "react";

/**
 * Hook para gerenciar o status da feira
 */
export const useFeiraStatus = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [feiraAberta, setFeiraAberta] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Detecta se o componente está visível
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Calcula o tempo restante até a próxima abertura da feira
  const calculateTimeRemaining = useCallback(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    let feiraAberta = false;

    if (dayOfWeek === 0 && currentHour >= 6 && currentHour < 12) {
      feiraAberta = true;
    }

    let nextOpening;
    if (dayOfWeek === 0 && currentHour < 6) {
      nextOpening = new Date(now);
      nextOpening.setHours(6, 0, 0, 0);
    } else {
      nextOpening = new Date(now);
      nextOpening.setDate(now.getDate() + ((7 - dayOfWeek) % 7));
      nextOpening.setHours(6, 0, 0, 0);
    }

    if (nextOpening < now) {
      nextOpening.setDate(nextOpening.getDate() + 7);
    }

    const difference = nextOpening.getTime() - now.getTime();
    const days = Math.floor(difference / (24 * 3600000));
    const remainingHours = Math.floor((difference % (24 * 3600000)) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    return {
      feiraAberta,
      days,
      hours: remainingHours,
      minutes,
      seconds,
    };
  }, []);

  // Atualiza o tempo restante apenas quando visível
  useEffect(() => {
    if (!isVisible) return;

    const updateTime = () => {
      const { feiraAberta, days, hours, minutes, seconds } =
        calculateTimeRemaining();
      setFeiraAberta(feiraAberta);
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isVisible, calculateTimeRemaining]);

  return { timeRemaining, feiraAberta };
};

/**
 * Hook para gerenciar o menu do usuário
 */
export const useUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    editingName,
    newName,
    modalOpen,
    modalMessage,
    modalSuccess,
    isLoading,
    setNewName,
    setEditingName,
    setModalOpen,
    setModalMessage,
    setModalSuccess,
    setIsLoading,
    toggleMenu,
    closeMenu,
  };
}; 
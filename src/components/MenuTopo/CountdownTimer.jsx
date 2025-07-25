import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

/**
 * Componente para item individual do countdown
 */
const CountdownItem = ({ value, label }) => (
  <div className="text-center flex items-baseline gap-[2px]">
    <div className="text-sm font-bold">{value.toString().padStart(2, "0")}</div>
    <div className="text-xs opacity-80">{label}</div>
  </div>
);

/**
 * Função para calcular tempo restante até a próxima feira
 */
const calculateTimeRemaining = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  let feiraAberta = false;

  // Verifica se é domingo (0) entre 6h e 12h
  if (dayOfWeek === 0 && currentHour >= 6 && currentHour < 12) {
    feiraAberta = true;
    const endTime = new Date(now);
    endTime.setHours(12, 0, 0, 0);
    const diff = endTime - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { feiraAberta, days: 0, hours, minutes, seconds };
  }

  // Calcula próximo domingo 6h
  let nextSunday = new Date(now);
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(6, 0, 0, 0);

  // Se já passou das 12h do domingo atual, vai para o próximo
  if (dayOfWeek === 0 && currentHour >= 12) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }

  const diff = nextSunday - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { feiraAberta, days, hours, minutes, seconds };
};

/**
 * Componente do Timer de Countdown para a feira
 */
const CountdownTimer = ({ className = "" }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [feiraAberta, setFeiraAberta] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const { feiraAberta, days, hours, minutes, seconds } = calculateTimeRemaining();
      setFeiraAberta(feiraAberta);
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-1">
        {feiraAberta ? (
          <CheckCircle className="text-green-400" size={16} />
        ) : (
          <Clock className="text-white/75" size={16} />
        )}
        <span className="text-xs font-medium text-white/90">
          {feiraAberta ? "Feira Aberta" : "Próxima Feira"}
        </span>
      </div>
      
      {!feiraAberta && (
        <div className="flex items-center space-x-2 text-white/90">
          {timeRemaining.days > 0 && (
            <CountdownItem value={timeRemaining.days} label="d" />
          )}
          <CountdownItem value={timeRemaining.hours} label="h" />
          <CountdownItem value={timeRemaining.minutes} label="m" />
          <CountdownItem value={timeRemaining.seconds} label="s" />
        </div>
      )}
      
      {feiraAberta && (
        <div className="flex items-center space-x-2 text-green-400">
          <span className="text-xs">Encerra em:</span>
          <CountdownItem value={timeRemaining.hours} label="h" />
          <CountdownItem value={timeRemaining.minutes} label="m" />
          <CountdownItem value={timeRemaining.seconds} label="s" />
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
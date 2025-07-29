import { Clock } from "lucide-react";

/**
 * Componente para exibir contagem regressiva
 */
const CountdownItem = ({ value, label }) => (
  <section
    className="text-center flex items-baseline gap-[2px]"
    role="group"
    aria-label={`${label}: ${value}`}
  >
    <div className="text-sm font-bold" aria-live="polite">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="text-xs opacity-80">{label}</div>
  </section>
);

/**
 * Componente para exibir status da feira
 */
const FeiraStatus = ({ feiraAberta, timeRemaining }) => {
  const statusText = feiraAberta ? "Feira Aberta" : "Feira Fechada";

  return (
    <div
      className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
        feiraAberta ? "bg-green-500/30" : "bg-black/0"
      } backdrop-blur-sm transition-all duration-300`}
      role="status"
      aria-live="polite"
      aria-label={statusText}
    >
      <Clock className="text-white mt-1" size={20} aria-hidden="true" />
      <div className="text-white">
        {feiraAberta ? (
          <div className="text-center">
            <p className="text-sm font-semibold">Feira Aberta!</p>
            <p className="text-xs opacity-80 hidden md:block">
              Aproveite até 12h
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium mb-1 hidden md:block">
              Próxima abertura em:
            </p>
            <p className="text-xs mb-1 font-semibold md:hidden">Abre em:</p>
            <div
              className="flex space-x-3"
              role="group"
              aria-label="Tempo restante para abertura"
            >
              {timeRemaining.days > 0 && (
                <CountdownItem value={timeRemaining.days} label="dias" />
              )}
              <CountdownItem value={timeRemaining.hours} label="h" />
              <CountdownItem value={timeRemaining.minutes} label="min" />
              <CountdownItem value={timeRemaining.seconds} label="s" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeiraStatus; 
import { RingLoader } from "react-spinners";

/**
 * Componente reutilizável para loading
 */
const LoadingSpinner = ({ 
  size = 50, 
  color = "#10b981", 
  loading = true, 
  text = "Carregando...",
  className = "",
  overlay = false 
}) => {
  if (!loading) return null;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <RingLoader color={color} loading={loading} size={size} />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
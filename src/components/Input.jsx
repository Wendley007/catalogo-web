import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export function Input({ 
  name, 
  placeholder, 
  type, 
  register, 
  rules, 
  error, 
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputId = `input-${name}`;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-300 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400
            ${error 
              ? "border-red-400 focus:border-red-400 focus:ring-red-500/50" 
              : "border-gray-600 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          placeholder={placeholder}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...register(name, rules)}
          {...props}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
            onClick={togglePasswordVisibility}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 transition-colors" size={18} />
            ) : (
              <Eye className="text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 transition-colors" size={18} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 flex items-center gap-1"
        >
          <span className="w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "email", "password", "number", "tel", "url"]),
  register: PropTypes.func,
  rules: PropTypes.object,
  error: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  disabled: false,
  required: false,
  className: "",
};

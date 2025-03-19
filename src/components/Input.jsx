/* eslint-disable react/prop-types */
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

export function Input({ name, placeholder, type, register, rules, error }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        className="w-full border-2 rounded-md h-8 px-2"
        placeholder={placeholder}
        type={showPassword ? "text" : type}
        {...register(name, rules)}
        id={name}
      />
      {type === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="text-gray-400" />
          ) : (
            <Eye className="text-gray-400" />
          )}
        </button>
      )}
      {error && <p className="my-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

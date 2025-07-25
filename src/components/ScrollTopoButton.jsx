import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollTopoButton() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showScrollButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_12px_rgba(244,114,182,0.7)] hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
}

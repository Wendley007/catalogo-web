// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollTopo() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Comportamento suave
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

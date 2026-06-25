import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

/**
 * Hook pour préserver la position de scroll entre navigations
 * Sauvegarde dans sessionStorage et restaure automatiquement
 */
export function useScrollRestoration(enabled = true) {
  const location = useLocation();
  const scrollKey = `scroll_${location.pathname}`;
  const isRestoringRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Restaurer la position de scroll au mount
    const savedPosition = sessionStorage.getItem(scrollKey);
    if (savedPosition && !isRestoringRef.current) {
      isRestoringRef.current = true;

      // Attendre que le contenu soit rendu
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        isRestoringRef.current = false;
      });
    }

    // Sauvegarder la position avant unmount
    return () => {
      sessionStorage.setItem(scrollKey, window.scrollY.toString());
    };
  }, [scrollKey, enabled]);
}

/**
 * Détecte si l'utilisateur utilise le navigateur Brave
 */
export async function isBraveBrowser(): Promise<boolean> {
  // Brave expose une API spécifique
  if ((navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function') {
    try {
      return await (navigator as any).brave.isBrave();
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Détecte si le navigateur est sur iOS (où les web push ne sont supportées que pour les PWA installées)
 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Vérifie si les notifications web sont supportées dans ce navigateur/contexte
 */
export async function areNotificationsSupported(): Promise<{
  supported: boolean;
  reason?: string;
}> {
  // Vérifier support basique
  if (!('Notification' in window)) {
    return { supported: false, reason: 'not-available' };
  }

  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'no-service-worker' };
  }

  // Vérifier Brave
  if (await isBraveBrowser()) {
    return {
      supported: false,
      reason: 'brave-browser'
    };
  }

  // Vérifier iOS (sauf si c'est une PWA installée)
  if (isIOS() && !window.matchMedia('(display-mode: standalone)').matches) {
    return {
      supported: false,
      reason: 'ios-browser'
    };
  }

  return { supported: true };
}

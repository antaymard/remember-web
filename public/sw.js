// Service Worker unifié : VitePWA (Workbox) + Firebase Messaging
// Utilise les imports ES6 modernes (pas importScripts)

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCO90ozXxLczxmAwtZC5MEhaeG732bizBs",
  authDomain: "remember-248c6.firebaseapp.com",
  projectId: "remember-248c6",
  storageBucket: "remember-248c6.firebasestorage.app",
  messagingSenderId: "101663562577",
  appId: "1:101663562577:web:96aeef95ec08d9cc125170",
  measurementId: "G-CHHMTRZD92"
};

// Initialiser Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Gérer les messages push en arrière-plan
onBackgroundMessage(messaging, (payload) => {
  console.log('[sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Remember';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    requireInteraction: false,
    silent: false,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.js] Notification clicked:', event.notification);

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === self.location.origin + '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Configuration Workbox pour le caching PWA

// self.__WB_MANIFEST est le point d'injection par défaut de VitePWA
precacheAndRoute(self.__WB_MANIFEST);

// Nettoyer les anciens caches
cleanupOutdatedCaches();

// Allowlist pour le mode dev
let allowlist;
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// Navigation offline
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('index.html'),
    { allowlist }
  )
);

// Runtime caching pour Google Fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Runtime caching pour les images
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Prendre le contrôle immédiatement
self.skipWaiting();
clientsClaim();

console.log('[sw.js] Service Worker loaded (Firebase + Workbox)');

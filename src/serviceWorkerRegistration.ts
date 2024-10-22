// src/serviceWorkerRegistration.ts
// Ce fichier permet d'enregistrer le service worker pour gérer le cache et le hors-ligne

export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('Service Worker enregistré avec succès :', registration);
        }).catch(error => {
          console.log('Échec de l\'enregistrement du Service Worker :', error);
        });
      });
    }
  
  }
  
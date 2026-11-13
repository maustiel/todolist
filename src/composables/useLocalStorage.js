// src/composables/useLocalStorage.js
import { watch, isRef } from 'vue'

export function useLocalStorage(cleStorage, donneeReactive) {
  // 1. Récupération des données sauvegardées
  const donneeEnregistree = localStorage.getItem(cleStorage)

  if (donneeEnregistree) {
    try {
      const donneeParse = JSON.parse(donneeEnregistree)
      
      // Si la donnée est une "ref", on met à jour sa propriété ".value"
      if (isRef(donneeReactive)) {
        donneeReactive.value = donneeParse
      } 
      // Si c'est un "reactive" (tableau), on vide et on remplit avec splice
      else if (Array.isArray(donneeReactive)) {
        donneeReactive.splice(0, donneeReactive.length, ...donneeParse)
      }
    } catch (e) {
      console.warn("Erreur lors de la lecture du localStorage pour la clé", cleStorage)
    }
  }

  // 2. Mise en place de l'observateur pour sauvegarder automatiquement
  watch(donneeReactive, (nouvelleValeur) => {
    try {
      localStorage.setItem(cleStorage, JSON.stringify(nouvelleValeur))
    } catch (e) {
      console.warn("Erreur lors de la sauvegarde dans le localStorage")
    }
  }, { deep: true }) // "deep" permet de voir à l'intérieur des tableaux d'objets
}
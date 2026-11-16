
import { watch, isRef } from 'vue'

export function useLocalStorage(cleStorage, donneeReactive) {
  
  const donneeEnregistree = localStorage.getItem(cleStorage)

  if (donneeEnregistree) {
    try {
      const donneeParse = JSON.parse(donneeEnregistree)
      
   
      if (isRef(donneeReactive)) {
        donneeReactive.value = donneeParse
      } 
      
      else if (Array.isArray(donneeReactive)) {
        donneeReactive.splice(0, donneeReactive.length, ...donneeParse)
      }
    } catch (e) {
      console.warn("Erreur lors de la lecture du localStorage pour la clé", cleStorage)
    }
  }

  watch(donneeReactive, (nouvelleValeur) => {
    try {
      localStorage.setItem(cleStorage, JSON.stringify(nouvelleValeur))
    } catch (e) {
      console.warn("Erreur lors de la sauvegarde dans le localStorage")
    }
  }, { deep: true }) 
}
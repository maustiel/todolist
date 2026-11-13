// src/composables/useTodolistTri.js
import { computed } from 'vue'

export function useTodolistTri(taches, triCritere) {
  
  const peutUtiliserTriManuel = computed(() => triCritere.value === 'manuel')

  const tachesTriees = computed(() => {
    const copie = [...taches.value]
    
    if (triCritere.value === 'manuel') {
      return copie.sort((a, b) => a.ordre - b.ordre)
    } 
    else if (triCritere.value === 'creation') {
      return copie.sort((a, b) => a.id - b.id)
    } 
    else if (triCritere.value === 'libelleAsc') {
      return copie.sort((a, b) => a.libelle.localeCompare(b.libelle))
    } 
    else if (triCritere.value === 'libelleDesc') {
      return copie.sort((a, b) => b.libelle.localeCompare(a.libelle))
    } 
    else if (triCritere.value === 'terminee') {
      return copie.sort((a, b) => {
        if (a.terminee === b.terminee) {
          return a.libelle.localeCompare(b.libelle)
        }
        return a.terminee ? 1 : -1
      })
    }
    return copie
  })

  // On renvoie les deux variables dont App.vue aura besoin
  return {
    peutUtiliserTriManuel,
    tachesTriees
  }
}
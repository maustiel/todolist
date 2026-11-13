// src/composables/useTodolistStats.js
import { computed } from 'vue'

export function useTodolistStats(taches) {
  
  const nombreTotalTaches = computed(() => taches.value.length)
  
  const nombreTachesTerminees = computed(() => {
    return taches.value.filter(t => t.terminee).length
  })
  
  const aDesTaches = computed(() => taches.value.length > 0)

  // On renvoie un objet avec nos 3 calculs pour pouvoir les utiliser dans App.vue
  return {
    nombreTotalTaches,
    nombreTachesTerminees,
    aDesTaches
  }
}
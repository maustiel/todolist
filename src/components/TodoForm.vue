<script setup>
// On importe les nouveaux outils de Vue !
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

const nouvelleTache = ref('')
const emit = defineEmits(['demanderAjoutTache'])

// 1. On crée une référence pour attraper notre balise <input>
const champSaisie = useTemplateRef('champSaisie')

function gererSoumission() {
  const texteNettoye = nouvelleTache.value.trim()
  if (texteNettoye === '') return
  emit('demanderAjoutTache', texteNettoye)
  nouvelleTache.value = ''
}

// 2. La fonction qui réagit quand on appuie sur une touche
const gererRaccourci = (event) => {
  // On ignore si l'utilisateur est déjà en train de taper dans un champ texte
  if (event.target.matches('input, textarea')) return
  
  // On ignore si l'utilisateur fait un raccourci système (ex: Ctrl+N, Alt+N)
  if (event.ctrlKey || event.altKey || event.metaKey) return

  // Si on appuie sur la touche "N" ou "n"
  if (event.key.toLowerCase() === 'n') {
    event.preventDefault() // Empêche de taper la lettre "n" dans le vide
    if (champSaisie.value) {
      champSaisie.value.focus() // On force le curseur dans le champ !
    }
  }
}

// 3. onMounted : Se déclenche UNE FOIS, quand le formulaire apparaît à l'écran
onMounted(() => {
  // Exo 1 : On donne le focus automatiquement à l'ouverture
  if (champSaisie.value) {
    champSaisie.value.focus()
  }
  // Exo 2 : On commence à écouter le clavier sur toute la page
  window.addEventListener('keydown', gererRaccourci)
})

// 4. onUnmounted : Se déclenche quand le formulaire est détruit (masqué par un v-if)
onUnmounted(() => {
  // Exo 2 : On ARRÊTE d'écouter le clavier pour ne pas créer de bugs fantômes
  window.removeEventListener('keydown', gererRaccourci)
})
</script>

<template>
  <form class="ajout-tache" @submit.prevent="gererSoumission">
    <!-- On relie notre constante "champSaisie" à cette vraie balise avec ref="..." -->
    <input 
      ref="champSaisie"
      type="text" 
      v-model="nouvelleTache" 
      placeholder="Ajouter une nouvelle tâche..."
    >
    <button type="submit" class="btn-ajouter" :disabled="!nouvelleTache">
      +
    </button>
  </form>
</template>

<style scoped>
/* Le même design qu'avant */
.ajout-tache { display: flex; gap: 10px; margin-bottom: 15px; }
.ajout-tache input {
  flex-grow: 1; background-color: #f8f9fa; border: none;
  border-radius: 16px; padding: 15px; font-size: 1rem;
  outline: none; transition: background 0.2s;
}
.ajout-tache input:focus { background-color: #f1f3f5; }

.btn-ajouter {
  background-color: #000; color: #fff; border: none;
  border-radius: 16px; width: 50px; font-size: 1.5rem;
  cursor: pointer; transition: transform 0.2s;
}
.btn-ajouter:disabled { background-color: #e9ecef; cursor: not-allowed; }
.btn-ajouter:not(:disabled):hover { transform: scale(1.05); }
</style>
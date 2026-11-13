<script setup>
import { ref } from 'vue'

const nouvelleTache = ref('')
const emit = defineEmits(['demanderAjoutTache'])

function gererSoumission() {
  const texteNettoye = nouvelleTache.value.trim()
  if (texteNettoye === '') return
  
  // On envoie le texte nettoyé au parent
  emit('demanderAjoutTache', texteNettoye)
  
  // On vide le champ
  nouvelleTache.value = ''
}
</script>

<template>
  <!-- Le @submit.prevent empêche la page de se recharger quand on tape "Entrée" -->
  <form class="ajout-tache" @submit.prevent="gererSoumission">
    <input 
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
.ajout-tache {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
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
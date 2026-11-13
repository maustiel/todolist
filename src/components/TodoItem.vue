<script setup>
// On définit ce que le composant reçoit (les infos de la tâche)
const props = defineProps({
  id: { type: Number, required: true },
  libelle: { type: String, required: true },
  terminee: { type: Boolean, required: true },
  peutUtiliserTriManuel: { type: Boolean, required: true }
})

// On définit les événements que le composant peut "crier" (émettre) vers le parent
const emit = defineEmits([
  'demanderChangementStatut',
  'demanderMonter',
  'demanderDescendre',
  'demanderSuppression'
])
</script>

<template>
  <li class="item-tache">
    <!-- Bouton pour cocher -->
    <button 
      class="checkbox-ronde" 
      :class="{ 'cochee': terminee }" 
      @click="emit('demanderChangementStatut', id)"
    >
      <span v-if="terminee">✓</span>
    </button>

    <!-- Le texte -->
    <span class="libelle" :class="{ 'tache-barree': terminee }">
      {{ libelle }}
    </span>

    <!-- Les flèches et la suppression -->
    <div class="actions-visibles">
      <button class="btn-icon" @click="emit('demanderMonter', id)" :disabled="!peutUtiliserTriManuel">⬆</button>
      <button class="btn-icon" @click="emit('demanderDescendre', id)" :disabled="!peutUtiliserTriManuel">⬇</button>
      <button class="btn-icon btn-supprimer" @click="emit('demanderSuppression', id)">✕</button>
    </div>
  </li>
</template>

<style scoped>
/* On rapatrie ici le CSS spécifique à une SEULE tâche */
.item-tache {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f8f9fa;
}
.item-tache:last-child { border-bottom: none; }

.checkbox-ronde {
  width: 26px; height: 26px; border-radius: 8px;
  border: 2px solid #dee2e6; background-color: transparent;
  margin-right: 15px; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  color: white; font-weight: bold; font-size: 14px;
  transition: all 0.2s ease;
}
.checkbox-ronde.cochee { background-color: #40c057; border-color: #40c057; }

.libelle {
  flex-grow: 1; font-size: 1.05rem; font-weight: 500;
  color: #212529; transition: color 0.2s;
}
.tache-barree { text-decoration: line-through; color: #adb5bd; }

.actions-visibles { display: flex; gap: 4px; }
.btn-icon {
  background: transparent; border: none; font-size: 1.1rem;
  color: #495057; cursor: pointer; padding: 5px;
  border-radius: 6px; transition: background 0.2s;
}
.btn-icon:hover:not(:disabled) { background-color: #f1f3f5; color: #212529; }
.btn-icon:disabled { opacity: 0.2; cursor: not-allowed; }
.btn-supprimer:hover { background-color: #ffe3e3 !important; color: #fa5252 !important; }
</style>
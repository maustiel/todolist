<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps({
  taches: { type: Array, required: true },
  peutUtiliserTriManuel: { type: Boolean, required: true }
})

const emit = defineEmits([
  'demanderChangementStatut',
  'demanderMonter',
  'demanderDescendre',
  'demanderSuppression'
])
</script>

<template>
  <ul v-if="taches.length > 0" class="liste-taches">
    <TodoItem
      v-for="tache in taches"
      :key="tache.id"
      :id="tache.id"
      :libelle="tache.libelle"
      :terminee="tache.terminee"
      :peutUtiliserTriManuel="peutUtiliserTriManuel"
      @demanderChangementStatut="(id) => emit('demanderChangementStatut', id)"
      @demanderMonter="(id) => emit('demanderMonter', id)"
      @demanderDescendre="(id) => emit('demanderDescendre', id)"
      @demanderSuppression="(id) => emit('demanderSuppression', id)"
    />
  </ul>
  <p v-else class="message-vide">Vous n'avez aucune tâche en cours.</p>
</template>

<style scoped>
.liste-taches {
  list-style: none;
  padding: 0;
  margin: 0;
}
.message-vide {
  text-align: center;
  color: #adb5bd;
  margin-top: 40px;
  font-weight: 500;
}
</style>
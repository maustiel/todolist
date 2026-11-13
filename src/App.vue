<script setup>
import { ref } from 'vue'

// --- IMPORT DES COMPOSANTS ---
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

// --- IMPORT DES COMPOSABLES ---
import { useLocalStorage } from './composables/useLocalStorage.js'
import { useTodolistStats } from './composables/useTodolistStats.js'
import { useTodolistTri } from './composables/useTodolistTri.js'

// --- DONNÉES DE BASE ---
const taches = ref([
  { id: 1, libelle: "Apprendre Vue.js", terminee: false, ordre: 1 },
  { id: 2, libelle: "Faire les exercices", terminee: false, ordre: 2 },
  { id: 3, libelle: "Créer la todolist", terminee: false, ordre: 3 }
])
const prochainId = ref(4)
const triCritere = ref('manuel')

// --- 1. PERSISTANCE (Magique !) ---
// Ces deux simples lignes remplacent TOUTE ton ancienne logique de sauvegarde
useLocalStorage('todolist:taches_v4', taches)
useLocalStorage('todolist:prochainId_v4', prochainId)

// --- 2. STATISTIQUES ---
// On récupère nos calculs depuis le composable
const { nombreTotalTaches, nombreTachesTerminees, aDesTaches } = useTodolistStats(taches)

// --- 3. TRI ---
// On récupère notre liste triée depuis le composable
const { peutUtiliserTriManuel, tachesTriees } = useTodolistTri(taches, triCritere)

const afficherFormulaire = ref(true)

// --- FONCTIONS MÉTIER (Actions utilisateur) ---
function ajouterTache(texte) {
  taches.value.push({
    id: prochainId.value,
    libelle: texte,
    terminee: false,
    ordre: prochainId.value
  })
  prochainId.value++
}

function basculerTerminee(id) {
  const tache = taches.value.find(t => t.id === id)
  if (tache) tache.terminee = !tache.terminee
}

function supprimerTache(id) {
  taches.value = taches.value.filter(t => t.id !== id)
}

function monter(id) {
  if (!peutUtiliserTriManuel.value) return
  const indexVisuel = tachesTriees.value.findIndex(t => t.id === id)
  if (indexVisuel > 0) {
    const act = tachesTriees.value[indexVisuel]
    const dest = tachesTriees.value[indexVisuel - 1]
    const temp = act.ordre
    act.ordre = dest.ordre
    dest.ordre = temp
  }
}

function descendre(id) {
  if (!peutUtiliserTriManuel.value) return
  const indexVisuel = tachesTriees.value.findIndex(t => t.id === id)
  if (indexVisuel !== -1 && indexVisuel < tachesTriees.value.length - 1) {
    const act = tachesTriees.value[indexVisuel]
    const dest = tachesTriees.value[indexVisuel + 1]
    const temp = act.ordre
    act.ordre = dest.ordre
    dest.ordre = temp
  }
}
</script>

<template>
  <div class="app-mobile">
    <header class="header">
      <h1>Exo Synthèse</h1>
    </header>

    <div class="compteurs">
      <span class="tag tag-blue">{{ nombreTotalTaches }} Total</span>
      <span class="tag tag-green">{{ nombreTachesTerminees }} Terminées</span>
    </div>

    <button class="btn-toggle" @click="afficherFormulaire = !afficherFormulaire">
  {{ afficherFormulaire ? 'Masquer le formulaire' : 'Afficher le formulaire' }}
</button>

<TodoForm 
  v-if="afficherFormulaire" 
  @demanderAjoutTache="ajouterTache" 
/>

    <div class="bloc-tri">
      <select v-model="triCritere">
        <option value="manuel">Ordre personnalisé</option>
        <option value="creation">Ordre de création</option>
        <option value="libelleAsc">Libellé A→Z</option>
        <option value="libelleDesc">Libellé Z→A</option>
        <option value="terminee">Non terminées d'abord</option>
      </select>
      <p class="info-tri">Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est sur "Ordre personnalisé".</p>
    </div>

    <!-- On n'affiche la liste que si on a des tâches -->
    <TodoList 
      v-if="aDesTaches"
      :taches="tachesTriees" 
      :peutUtiliserTriManuel="peutUtiliserTriManuel"
      @demanderChangementStatut="basculerTerminee"
      @demanderMonter="monter"
      @demanderDescendre="descendre"
      @demanderSuppression="supprimerTache"
    />
    <p v-else class="message-vide">Vous n'avez aucune tâche en cours.</p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-mobile {
  font-family: 'Inter', sans-serif;
  max-width: 420px; margin: 40px auto;
  background-color: #ffffff; border-radius: 30px;
  padding: 30px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}
.header h1 { font-size: 2rem; font-weight: 700; color: #000; margin-bottom: 20px; }
.compteurs { display: flex; gap: 10px; margin-bottom: 25px; }
.tag { padding: 8px 14px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
.tag-blue { background-color: #eef2ff; color: #5c7cfa; }
.tag-green { background-color: #ebfbee; color: #40c057; }
.bloc-tri select {
  width: 100%; padding: 12px 15px; border-radius: 12px;
  border: 1px solid #f1f3f5; background-color: #fff;
  font-family: inherit; color: #495057; outline: none;
  margin-bottom: 10px; cursor: pointer;
}
.info-tri { font-size: 0.8rem; color: #adb5bd; margin: 0 0 20px 5px; font-weight: 500; }
.message-vide { text-align: center; color: #adb5bd; margin-top: 40px; font-weight: 500; }

.btn-toggle {
  width: 100%;
  background-color: #f1f3f5;
  border: none;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  transition: background 0.2s;
}
.btn-toggle:hover { background-color: #e9ecef; }
</style>
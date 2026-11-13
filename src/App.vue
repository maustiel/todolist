<script setup>
import { ref, computed, watch } from 'vue'

// composants enfants 
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

const CLE_LOCALSTORAGE_TACHES = 'todolist:taches_v3'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId_v3'

// --- DONNÉES ---
const taches = ref([
  { id: 1, libelle: "Apprendre Vue.js", terminee: false, ordre: 1 },
  { id: 2, libelle: "Faire les exercices", terminee: false, ordre: 2 },
  { id: 3, libelle: "Créer la todolist", terminee: false, ordre: 3 }
])

const triCritere = ref('manuel')
const prochainId = ref(4)

const tachesEnregistrees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
const prochainIdEnregistre = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)

if (tachesEnregistrees) { taches.value = JSON.parse(tachesEnregistrees) }
if (prochainIdEnregistre) { prochainId.value = parseInt(prochainIdEnregistre) }

// --- WATCHERS ---
watch(taches, (nouvellesTaches) => {
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(nouvellesTaches))
}, { deep: true })

watch(prochainId, (nouvelleValeur) => {
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(nouvelleValeur))
})

// --- PROPRIÉTÉS CALCULÉES ---
const nombreTotalTaches = computed(() => taches.value.length)
const nombreTachesTerminees = computed(() => taches.value.filter(t => t.terminee).length)
const peutUtiliserTriManuel = computed(() => triCritere.value === 'manuel')

const tachesTriees = computed(() => {
  const copie = [...taches.value]
  if (triCritere.value === 'manuel') return copie.sort((a, b) => a.ordre - b.ordre)
  if (triCritere.value === 'creation') return copie.sort((a, b) => a.id - b.id)
  if (triCritere.value === 'libelleAsc') return copie.sort((a, b) => a.libelle.localeCompare(b.libelle))
  if (triCritere.value === 'libelleDesc') return copie.sort((a, b) => b.libelle.localeCompare(a.libelle))
  if (triCritere.value === 'terminee') {
    return copie.sort((a, b) => {
      if (a.terminee === b.terminee) return a.libelle.localeCompare(b.libelle)
      return a.terminee ? 1 : -1
    })
  }
  return copie
})

// --- FONCTIONS MÉTIER ---
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
    const tacheActuelle = tachesTriees.value[indexVisuel]
    const tacheAuDessus = tachesTriees.value[indexVisuel - 1]
    const ordreTemp = tacheActuelle.ordre
    tacheActuelle.ordre = tacheAuDessus.ordre
    tacheAuDessus.ordre = ordreTemp
  }
}

function descendre(id) {
  if (!peutUtiliserTriManuel.value) return
  const indexVisuel = tachesTriees.value.findIndex(t => t.id === id)
  if (indexVisuel !== -1 && indexVisuel < tachesTriees.value.length - 1) {
    const tacheActuelle = tachesTriees.value[indexVisuel]
    const tacheEnDessous = tachesTriees.value[indexVisuel + 1]
    const ordreTemp = tacheActuelle.ordre
    tacheActuelle.ordre = tacheEnDessous.ordre
    tacheEnDessous.ordre = ordreTemp
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

    <!-- On utilise notre nouveau composant Formulaire -->
    <TodoForm @demanderAjoutTache="ajouterTache" />

    <div class="bloc-tri">
      <select v-model="triCritere">
        <option value="manuel">Ordre personnalisé</option>
        <option value="creation">Ordre de création</option>
        <option value="libelleAsc">Libellé A→Z</option>
        <option value="libelleDesc">Libellé Z→A</option>
        <option value="terminee">Non terminées d'abord</option>
      </select>
      <p class="info-tri">ℹ️ Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est sur "Ordre personnalisé".</p>
    </div>

    <!-- On utilise notre nouveau composant Liste -->
    <TodoList 
      :taches="tachesTriees" 
      :peutUtiliserTriManuel="peutUtiliserTriManuel"
      @demanderChangementStatut="basculerTerminee"
      @demanderMonter="monter"
      @demanderDescendre="descendre"
      @demanderSuppression="supprimerTache"
    />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* On ne garde ici QUE le CSS global de l'application */
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
</style>
<script setup>

import { ref, computed, watch } from 'vue'

const CLE_LOCALSTORAGE_TACHES = 'todolist:taches_v3'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId_v3'

// --- DONNÉES DE BASE ---
const taches = ref([
  { id: 1, libelle: "Apprendre Vue.js", terminee: false, ordre: 1 },
  { id: 2, libelle: "Faire les exercices", terminee: false, ordre: 2 },
  { id: 3, libelle: "Créer la todolist", terminee: false, ordre: 3 }
])

const nouvelleTache = ref('')
const triCritere = ref('manuel')
const prochainId = ref(4)

// --- LECTURE INITIALE DU LOCALSTORAGE ---
const tachesEnregistrees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
const prochainIdEnregistre = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)

if (tachesEnregistrees) {
  taches.value = JSON.parse(tachesEnregistrees)
}
if (prochainIdEnregistre) {
  prochainId.value = parseInt(prochainIdEnregistre)
}

// --- 🪄 LES OBSERVATEURS (WATCHERS) ---

// Premier observateur : Surveille le tableau "taches"
watch(taches, (nouvellesTaches) => {
  // Cette fonction se déclenche toute seule dès qu'une tâche est ajoutée, modifiée ou supprimée !
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(nouvellesTaches))
}, { deep: true }) // deep: true est OBLIGATOIRE avec ref([]) pour détecter les changements à l'intérieur des objets du tableau

// Second observateur : Surveille le compteur "prochainId"
watch(prochainId, (nouvelleValeur) => {
  // Se déclenche tout seul quand prochainId augmente
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(nouvelleValeur))
})

// --- PROPRIÉTÉS CALCULÉES ---
const nombreTotalTaches = computed(() => taches.value.length)
const nombreTachesTerminees = computed(() => taches.value.filter(t => t.terminee).length)
const aDesTaches = computed(() => taches.value.length > 0)
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

// --- FONCTIONS D'ACTIONS (Maintenant beaucoup plus propres !) ---
// Remarque : Il n'y a plus AUCUN appel à la sauvegarde manuelle ici. 
// Les fonctions font juste leur travail métier (ajouter, supprimer...), et les "watch" s'occupent du reste.

function ajouterTache() {
  taches.value.push({
    id: prochainId.value,
    libelle: nouvelleTache.value,
    terminee: false,
    ordre: prochainId.value
  })
  
  prochainId.value++
  nouvelleTache.value = ''
}

function basculerTerminee(id) {
  const tache = taches.value.find(t => t.id === id)
  if (tache) {
    tache.terminee = !tache.terminee
  }
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
    <!-- En-tête mis à jour -->
    <header class="header">
      <h1>Exo Synthèse</h1>
    </header>

    <!-- Les compteurs sous forme de mini-tags pastel -->
    <div class="compteurs">
      <span class="tag tag-blue">{{ taches.length }} Total</span>
      <span class="tag tag-green"
        >{{ taches.filter((t) => t.terminee).length }} Terminées</span
      >
    </div>

    <!-- Formulaire d'ajout épuré -->
    <div class="ajout-tache">
      <input
        type="text"
        v-model="nouvelleTache"
        placeholder="Ajouter une nouvelle tâche..."
      />
      <button
        class="btn-ajouter"
        @click="ajouterTache"
        :disabled="!nouvelleTache"
      >
        +
      </button>
    </div>

    <!-- Bloc de tri avec la phrase d'information restaurée -->
    <div class="bloc-tri">
     <select v-model="triCritere">
        <option value="manuel">Ordre personnalisé</option>
        <option value="creation">Ordre de création</option>
        <option value="libelleAsc">Libellé A→Z</option>
        <option value="libelleDesc">Libellé Z→A</option>
        <option value="terminee">Non terminées d'abord</option>
      </select>

      <p class="info-tri">
        Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est sur "Ordre
        personnalisé".
      </p>
    </div>

    <!-- La liste des tâches -->
    <ul v-if="aDesTaches" class="liste-taches">
     <li v-for="tache in tachesTriees" :key="tache.id" class="item-tache">
        <!-- Case à cocher arrondie à gauche -->
        <button
          class="checkbox-ronde"
          :class="{ cochee: tache.terminee }"
          @click="basculerTerminee(tache.id)"
        >
          <span v-if="tache.terminee">✓</span>
        </button>

        <!-- Le libellé au centre -->
        <span class="libelle" :class="{ 'tache-barree': tache.terminee }">
          {{ tache.libelle }}
        </span>

        <!-- Les actions discrètes à droite -->
        <div class="actions">
          <!-- On désactive (!) le bouton si on NE peut PAS utiliser le tri manuel -->
          <button
            class="btn-icon"
            @click="monter(tache.id)"
            :disabled="!peutUtiliserTriManuel"
          >
            ↑
          </button>
          <button
            class="btn-icon"
            @click="descendre(tache.id)"
            :disabled="!peutUtiliserTriManuel"
          >
            ↓
          </button>

          <button
            class="btn-icon btn-supprimer"
            @click="supprimerTache(tache.id)"
          >
            ✕
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="message-vide">Vous n'avez aucune tâche en cours.</p>
  </div>

  
</template>

<style scoped>
/* Typographie globale moderne */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

/* Conteneur simulant un écran mobile */
.app-mobile {
  font-family: "Inter", sans-serif;
  max-width: 420px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* En-tête */
.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

/* Compteurs façon pastels */
.compteurs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
.tag {
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
.tag-blue {
  background-color: #eef2ff;
  color: #5c7cfa;
}
.tag-green {
  background-color: #ebfbee;
  color: #40c057;
}

/* Formulaire d'ajout sans bordure dure */
.ajout-tache {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.ajout-tache input {
  flex-grow: 1;
  background-color: #f8f9fa;
  border: none;
  border-radius: 16px;
  padding: 15px;
  font-size: 1rem;
  outline: none;
  transition: background 0.2s;
}
.ajout-tache input:focus {
  background-color: #f1f3f5;
}

.btn-ajouter {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  width: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-ajouter:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
.btn-ajouter:not(:disabled):hover {
  transform: scale(1.05);
}

/* Sélecteur de tri minimaliste */
.bloc-tri select {
  width: 100%;
  padding: 12px 15px;
  border-radius: 12px;
  border: 1px solid #f1f3f5;
  background-color: #fff;
  font-family: inherit;
  color: #495057;
  outline: none;
  margin-bottom: 10px;
  cursor: pointer;
}

/* Texte informatif pour les flèches */
.info-tri {
  font-size: 0.8rem;
  color: #adb5bd;
  margin: 0 0 20px 5px;
  font-weight: 500;
}

/* Liste des tâches épurée */
.liste-taches {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item-tache {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f8f9fa;
}
.item-tache:last-child {
  border-bottom: none;
}

/* Case à cocher (bouton rond carré) */
.checkbox-ronde {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  background-color: transparent;
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
}
.checkbox-ronde.cochee {
  background-color: #40c057;
  border-color: #40c057;
}

/* Texte de la tâche */
.libelle {
  flex-grow: 1;
  font-size: 1.05rem;
  font-weight: 500;
  color: #212529;
  transition: color 0.2s;
}
.tache-barree {
  text-decoration: line-through;
  color: #adb5bd;
}

/* Boutons d'action (flèches et suppression) */
.actions {
  display: flex;
  gap: 4px;
  opacity: 0.3;
  transition: opacity 0.2s;
}
.item-tache:hover .actions {
  opacity: 1;
}
.btn-icon {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #868e96;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
}
.btn-icon:hover:not(:disabled) {
  background-color: #f1f3f5;
  color: #212529;
}
.btn-icon:disabled {
  opacity: 0.3;
  cursor: default;
}

.btn-supprimer:hover {
  background-color: #ffe3e3 !important;
  color: #fa5252 !important;
}

/* Message vide */
.message-vide {
  text-align: center;
  color: #adb5bd;
  margin-top: 40px;
  font-weight: 500;
}
</style>

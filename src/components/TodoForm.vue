<script setup>
import { ref, onMounted, onUnmounted, useTemplateRef } from "vue";

const nouvelleTache = ref("");
const emit = defineEmits(["demanderAjoutTache"]);

const champSaisie = useTemplateRef("champSaisie");

function gererSoumission() {
  const texteNettoye = nouvelleTache.value.trim();
  if (texteNettoye === "") return;
  emit("demanderAjoutTache", texteNettoye);
  nouvelleTache.value = "";
}

const gererRaccourci = (event) => {
  if (event.target.matches("input, textarea")) return;

  if (event.ctrlKey || event.altKey || event.metaKey) return;

  if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    if (champSaisie.value) {
      champSaisie.value.focus();
    }
  }
};

onMounted(() => {
  if (champSaisie.value) {
    champSaisie.value.focus();
  }

  window.addEventListener("keydown", gererRaccourci);
});

onUnmounted(() => {
  window.removeEventListener("keydown", gererRaccourci);
});
</script>

<template>
  <form class="ajout-tache" @submit.prevent="gererSoumission">
    <input
      ref="champSaisie"
      type="text"
      v-model="nouvelleTache"
      placeholder="Ajouter une nouvelle tâche..."
    />
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
</style>

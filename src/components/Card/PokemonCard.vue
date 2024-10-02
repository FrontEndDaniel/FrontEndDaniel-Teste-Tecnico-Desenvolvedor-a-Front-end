<template>
  <div class="pokemon-card" :style="{ backgroundColor: bgColor }">
    <div class="card-header">
      <span class="pokemon-name">{{ pokeName }}</span>
      <span class="pokemon-number">{{ pokeId }}</span>
    </div>
    <div class="pokemon-types">
      <span 
        class="type" 
        :style="{ backgroundColor: typeColors[type01] }">
        {{ type01 }}
      </span>
      <br>
      <span 
        v-if="type02" 
        class="type" 
        :style="{ backgroundColor: typeColors[type02] }">
        {{ type02 }}
      </span>
    </div>
    <div class="pokemon-image">
      <img :src='pokeImg' alt="Pokemon Image">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    pokeName: {
      type: String,
      required: true
    },
    pokeId: {
      type: Number,
      required: true
    },
    type01: {
      type: String,
      required: true
    },
    type02: {
      type: String,
      default: null
    },
    pokeImg: {
      type: String,
      required: true
    },
    typeColors: {
      type: Object as () => Record<string, string>,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

.pokemon-card {
  width: 150px;
  height: 100px;
  border-radius: 15px;
  padding: 20px;
  color: white;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.pokemon-number {
  color: white;
}

.pokemon-types {
  margin: 10px 0;
}

.type {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  margin-top: 10px;
  margin-right: 5px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  border: 1px black solid;
}

.pokemon-image {
  position: absolute;
  bottom: 1px;
  right: 1px;
  top: 35px;
  left: 90px;
}

.pokemon-image img {
  width: 100px;
}
</style>

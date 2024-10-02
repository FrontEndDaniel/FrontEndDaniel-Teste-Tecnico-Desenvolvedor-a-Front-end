<template>
    <div  :class="['container', { 'single-result': pokemonList.length === 1 }]">
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png" alt="logo">
      <span class="subTitle">Faça sua pesquisa, pelo Id, Nome e Tipo </span>
      <input class="input" type="text" placeholder="Pesquisar!!" v-model="pokemonSearch" @keyup.enter="pokeSearchList()">
      <div :class="['pokemon-grid', { 'single-result': pokemonList.length === 1 }]">
        <div v-for="item in pokemonList" :key="item.id">
          <PokemonCard 
            :pokeName="item.name" 
            :pokeId=" item.id" 
            :type01="item.type01" 
            :type02="item.type02" 
            :typeColors="typeColors" 
            :pokeImg="item.pokeImg" 
            :bgColor="typeColors[item.type01]" 
            @click="infosPoke(item)" />
        </div>
      </div>
    </div>
    <div>
      <div class="button" v-if="disabledPag">
        <button class="btn" @click="previusPokemon">Anterior</button>
        <button class="btn" @click="nextPokemon">Proximo</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">

  import PokemonCard from '../Card/PokemonCard.vue';
  import axios from 'axios';
  import { defineComponent } from 'vue';
  
  interface Pokemon {
    name: string;
    id: number;
    pokeImg: string;
    type01: string | any;
    type02?: string | undefined;
    totalinfos: any;
  }
  
  export default defineComponent({
    components: { PokemonCard },
    data() {
      return {
        pokemonList: [] as Pokemon[],
        pokemonSearch: '',
        offset: 0,
        limit: 20,
        disabledPag: true ,
        currentPage: 1 as number,
        typeColors: {
          fire: '#F08030',
          water: '#6890F0',
          grass: '#78C850',
          electric: '#F8D030',
          ground: '#E0C068',
          rock: '#B8A038',
          fairy: '#EE99AC',
          poison: '#A040A0',
          bug: '#A8B820',
          dragon: '#7038F8',
          psychic: '#F85888',
          flying: '#A890F0',
          fighting: '#C03028',
          normal: '#A8A878',
          ghost: '#705898',
          ice: '#98D8D8',
          steel: '#B8B8D0',
          dark: '#705848',
        } as Record<string, string>, // Tipagem do objeto typeColors
      };
    },
    methods: {
      async pokeSearchList(): Promise<void> {
        this.pokemonList = [];
        this.disabledPag = true;
        try {
          if (this.pokemonSearch === '') {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`);
            const pokemonUrls: string[] = response.data.results.map((el: { url: string }) => el.url);
  
            const pokemonPromises: Promise<any>[] = pokemonUrls.map((url) => axios.get(url));
            const pokemonResponses = await Promise.all(pokemonPromises);
  
            this.pokemonList = pokemonResponses.map((resp) => ({
              name: resp.data.name,
              id: resp.data.id,
              pokeImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${resp.data.id}.png`,
              type01: resp.data.types[0].type.name,
              type02: resp.data.types[1]?.type.name || null,
              totalinfos: resp.data,
            }));
          } else {
            const validTypes = Object.keys(this.typeColors);
            if (validTypes.includes(this.pokemonSearch.toLowerCase())) {
              const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${this.pokemonSearch.toLowerCase()}`);
              const pokemonUrls: string[] = typeResponse.data.pokemon.map((el: { pokemon: { url: string } }) => el.pokemon.url);
              const pokemonPromises: Promise<any>[] = pokemonUrls.map((url) => axios.get(url));
              const pokemonResponses = await Promise.all(pokemonPromises);
  
              this.pokemonList = pokemonResponses.map((resp) => ({
                name: resp.data.name,
                id: resp.data.id,
                pokeImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${resp.data.id}.png`,
                type01: resp.data.types[0].type.name,
                type02: resp.data.types[1]?.type.name || null,
                totalinfos: resp.data,
              }));
            } else {
              const idOrName = this.pokemonSearch.toLowerCase();
              const responseNameOrId = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
              const listNameOrId: Pokemon = {
                name: responseNameOrId.data.name,
                id: responseNameOrId.data.id,
                pokeImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${responseNameOrId.data.id}.png`,
                type01: responseNameOrId.data.types[0].type.name,
                type02: responseNameOrId.data.types[1]?.type.name || null,
                totalinfos: responseNameOrId.data,
              };
              this.pokemonList.push(listNameOrId);
              this.disabledPag = false;
            }
          }
          this.currentPage  = 1; // Resetando a página para 1 após a busca

        } catch (error) {
          console.error('Erro ao buscar Pokemon', error);
        }
      },
      infosPoke(item: Pokemon): void {
        this.$router.push({ name: 'infoPokemon', params: { pokemon: item.id } });
      },
      nextPokemon(): void {
        this.offset += this.limit;
        this.pokeSearchList();
      },
      previusPokemon(): void {
        if (this.offset > 0) {
          this.offset -= this.limit;
          this.pokeSearchList();
        }
      },
    },
    created() {
      this.pokeSearchList();
    },
  });
  </script>
  
  <style>
  * {
    margin: 0px;
    padding: 0px;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container.single-result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .logo {
    margin-top: 15px;
    width: 200px;
  }
  
  .subTitle {
    margin-top: 15px;
  }
  
  .input {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 300px;
    padding: 10px;
    border-radius: 20px;
  }
  
  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 20px;
  }
  
  .pokemon-grid.single-result {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    .pokemon-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .pokemon-grid > div {
    display: flex;
    justify-content: center;
  }
  
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  
  .btn {
    margin-bottom: 10px;
    width: 80px;
    border-radius: 5px;
  }
  </style>
  
<template>
    <div class="container">
        <div class="pokemon-card">
            <div class="bgImage" :style="{ backgroundColor: typeColors[type01] }">
                <div class="header">
                    <h1>#{{ PokemonId }}</h1>
                    <!-- <button class="favorite-button">❤️</button> -->
                </div>

                <button class="buttonPrev" @click="previusPokemonId">
                    < </button>

                        <img :src="pokeImg" alt="imagem" class="pokemon-image" />
                        <button class="buttonNext" @click="nextPokemonId">></button>
                        <h2>{{ pokeName }}</h2>
                        <span class="type"> Pokémon tipo {{ type01 }} </span>
                        <span class="type" v-if="type02 != null"> e {{ type02 }} </span>
            </div>
            <div class="menu">
                <button class="button-menu" @click="toggleStatus">Status</button>
                <button class="button-menu" @click="toggleHabilidades">Habilidades</button>
                <button class="button-menu" @click="toggleEvolutions">Evoluções</button>
            </div>

            <div class="stats" v-if="showStatus">
                <div class="stat" v-for="(stat, index) in stats" :key="index">
                    <span class="stat-name">{{ stat.label }}</span>
                    <div class="bar-container">
                        <div class="bar">
                            <div class="filler" :style="{ width: stat.value + '%' }"></div>
                        </div>
                    </div>
                    <span class="stat-value">{{ stat.value }}</span>
                </div>
            </div>

            <div v-if="showHabilidades" class="stats">
                <div class="headerHabilidades">
                    <h2>Habilidades</h2>
                </div>
                <div v-for="(habilidade, index) in habilidadeList" :key="index">
                    <h3>Name: {{ habilidade.name }} </h3>
                </div>
            </div>

            <div class="stats" v-if="showEvolutions">
                <div>

                    <!-- Primeira evolução -->
                    <div v-if="disableEvo">
                        <div class="headerEvo">
                            <h3>#{{ fristEvolutionId }}</h3>
                            <h2>{{ fristEvolutionName }}</h2>
                        </div>
                        <div class="imgContainer">
                            <img class="imgEvo" :src="fristEvolutionImg" alt="image">

                        </div>
                    </div>

                    <!-- Segunda evolução -->
                    <div v-if="disableEvo02">
                        <div v-if="secondDisable">
                            <div class="headerEvo">
                                <h3>#{{ secondEvolutionId }}</h3>
                                <h2>{{ secondEvolutionName }}</h2>
                            </div>
                            <div class="imgContainer">
                                <img class="imgEvo" :src="secondEvolutionImg" alt="image">

                            </div>
                            <div class="evolui">
                                <h2 v-if="lvlDisable">Evolui no lvl: {{ secondEvolutionLvl }}</h2>

                            </div>
                        </div>
                    </div>
                    <!-- Terceira evolução -->
                    <div v-if="disableEvo03">
                        <div v-if="thirdDisable">
                            <div class="headerEvo">
                                <h3>#{{ thirdEvolutionId }}</h3>
                                <h2>{{ thirdEvolutionName }}</h2>
                            </div>
                            <div class="imgContainer">
                                <img class="imgEvo" :src="thirdEvolutionImg" alt="image">
                            </div>
                            <div class="evolui">

                                <h2 v-if="lvlDisable">Evolui no lvl: {{ thirdEvolutionLvl }}</h2>
                                <h2 v-if="itemDisable">Evolui usando: {{ thirdEvolutionItem }}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import PokemonCard from '../Card/PokemonCard.vue';

interface Stat {
    label: string;
    value: number;
}

interface Habilidade {
    name: string;
}

interface Evolution {
    species: { name: string; url: string };
    evolves_to: Evolution[];
}

export default defineComponent({
    components: { PokemonCard },
    props: {
        pokemon: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            pokemonDetail: [] as any[],
            pokeName: '' as string,
            pokeImg: '' as string,
            PokemonId: 0 as number,
            stats: [] as Stat[],
            type01: '' as string,
            type02: null as string | null,
            showStatus: true as boolean,
            showHabilidades: false as boolean,
            showEvolutions: false as boolean,
            habilidadeList: [] as Habilidade[],
            especiesUrl: '' as string,
            fristEvolutionName: '' as string,
            fristEvolutionId: '' as string,
            fristEvolutionImg: '' as string,
            secondEvolutionName: '' as string,
            secondEvolutionLvl: null as number | null,
            secondEvolutionId: '' as string,
            secondEvolutionImg: '' as string,
            thirdEvolutionName: '' as string,
            thirdEvolutionId: '' as string,
            thirdEvolutionImg: '' as string,
            thirdEvolutionLvl: null as number | null,
            thirdEvolutionItem: null as string | null,
            disableEvo: true as boolean,
            disableEvo02: true as boolean,
            disableEvo03: true as boolean,
            itemDisable: false as boolean,
            lvlDisable: true as boolean,
            secondDisable: true as boolean,
            thirdDisable: true as boolean,
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
                dark: '#705848'
            } as Record<string, string>
        };
    },
    methods: {
        async detailsPokemon(pokemonId: number) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                this.pokeName = response.data.name;
                this.pokeImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${response.data.id}.png`;
                this.PokemonId = response.data.id;
                this.especiesUrl = response.data.species.url;

                this.type01 = response.data.types[0].type.name;
                this.type02 = response.data.types[1]?.type.name || null;

                this.stats = [
                    { label: 'HP', value: response.data.stats[0].base_stat },
                    { label: 'Ataque', value: response.data.stats[1].base_stat },
                    { label: 'Defesa', value: response.data.stats[2].base_stat },
                    { label: 'Ataque Especial', value: response.data.stats[3].base_stat },
                    { label: 'Defesa Especial', value: response.data.stats[4].base_stat },
                    { label: 'Velocidade', value: response.data.stats[5].base_stat }
                ];

                this.habilidadeList = response.data.abilities.map((el: any) => el.ability);
            } catch (error) {
                console.error("Erro ao buscar detalhes do Pokémon:", error);
            }
        },

        toggleStatus() {
            this.showStatus = true;
            this.showHabilidades = false;
            this.showEvolutions = false;
        },

        toggleHabilidades() {
            this.showStatus = false;
            this.showHabilidades = true;
            this.showEvolutions = false;
        },

        toggleEvolutions() {
            this.showStatus = false;
            this.showHabilidades = false;
            this.showEvolutions = true;
            this.getEvolutions();
        },

        async getEvolutions() {
            try {
                const resp = await axios.get(this.especiesUrl);
                const evolutionUrl = resp.data.evolution_chain.url;
                const response = await axios.get(evolutionUrl);

                const chain = response.data.chain as Evolution;

                this.fristEvolutionName = chain.species.name;
                this.fristEvolutionId = chain.species.url.split('/').filter(Boolean).pop() || '';
                this.fristEvolutionImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.fristEvolutionId}.png`;

                if (!chain.evolves_to.length) {
                    this.secondDisable = false;
                    this.thirdDisable = false;
                    return;
                }

                const secondEvolution = chain.evolves_to[0];
                this.secondEvolutionName = secondEvolution.species.name;
                this.secondEvolutionLvl = secondEvolution.evolution_details[0]?.min_level || null;
                this.secondEvolutionId = secondEvolution.species.url.split('/').filter(Boolean).pop() || '';
                this.secondEvolutionImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.secondEvolutionId}.png`;

                if (!secondEvolution.evolves_to.length) {
                    this.thirdDisable = false;
                    return;
                }

                const thirdEvolution = secondEvolution.evolves_to[0];
                this.thirdEvolutionName = thirdEvolution.species.name;
                this.thirdEvolutionId = thirdEvolution.species.url.split('/').filter(Boolean).pop() || '';
                this.thirdEvolutionImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.thirdEvolutionId}.png`;
                this.thirdEvolutionLvl = thirdEvolution.evolution_details[0]?.min_level || null;
                this.thirdEvolutionItem = thirdEvolution.evolution_details[0]?.item?.name || null;

                if (!this.thirdEvolutionLvl) {
                    this.itemDisable = true;
                }
            } catch (error) {
                console.error("Erro ao exibir as evoluções", error);
            }
        },

        nextPokemonId() {
            this.toggleStatus();
            this.detailsPokemon(this.PokemonId + 1);
        },

        previusPokemonId() {
            if (this.PokemonId > 1) {
                this.toggleStatus();
                this.detailsPokemon(this.PokemonId - 1);
            }
        }
    },
    created() {
        this.detailsPokemon(this.pokemon);
    }
});
</script>


<style scoped>
* {
    margin: 0px;
    padding: 0px;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.pokemon-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
}

.bgImage {
    margin: 0px !important;
    border-radius: 12px;
    padding: 10px;
}

.buttonPrev {
    background-color: rgba(255, 255, 255, 0);
    font-size: 2rem;
    border: none;
}

.buttonNext {
    background-color: rgba(255, 255, 255, 0);
    font-size: 2rem;
    border: none;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.pokemon-image {
    width: 150px;
    height: auto;
}

.menu {
    margin: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

}

.button-menu {
    border: none;
    width: 130px;
    height: 30px;
    border-radius: 5px;
}

.stats {
    margin: 20px;
    text-align: left;
}

.stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
}

.stat-name {
    width: 80px;
    text-align: left;
}



.bar-container {
    flex: 1;
    margin: 0 10px;
}

.bar {
    background-color: #e0e0e0;
    border-radius: 5px;
    width: 100%;
    height: 10px;
    overflow: hidden;
}

.filler {
    background-color: #ffd700;
    height: 100%;
    transition: width 0.5s;
}

.stat-value {
    min-width: 30px;
    text-align: right;
}

.headerHabilidades {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
}

.headerEvo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.imgContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.imgEvo {
    width: 100px;
}

.evolui {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
